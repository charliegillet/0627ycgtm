# BEACHHEAD Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> **Design basis:** `fusion/PRODUCTION-DESIGN.md` + `fusion/EVALUATION-AND-V2.md` (the v2 rulings govern when they conflict).

**Goal:** Build BEACHHEAD — a realtime GTM "war room" that detects a company standing up a new GTM motion (a *convergence* of funding × category-hiring × tech signals), scores it with honest abstention, and routes a non-email action behind an approval gate — all observable live through Convex.

> **Repo decision (overrides v2 eligibility ruling, per user):** Build IN THIS REPO by adapting the existing `horizon/` app in place — it already ships the full stack (Next 16, Convex with a live schema + functions, React Three Fiber, React Flow). We ADAPT, not rebuild-clean. Eligibility caveat: `horizon/` is pre-existing code in this git history, so this is a **production build**, not a clean hackathon submission. All paths below are relative to `horizon/`.

**Architecture:** Convex is the load-bearing spine: external data calls (Orange Slice + Fiber) run in **actions** (cached in a Convex table for credit-safety + demo fallback), a single **detect entrypoint** is shared by a **cron** and an **HTTP action**, scoring is a **pure unit-tested function** invoked from a plain `ai.generateObject` action, and the entire pipeline is observable via **reactive queries** that drive a React Flow lineage board (the hero) and a rebuilt R3F 3D swarm (flourish). Durable Workflow is a stretch upgrade, not a v1 dependency.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Convex 1.32+ · `convex-test` + Vitest · Orange Slice (`orangeslice`) · Fiber AI (`@fiberai/sdk` / REST) · OpenAI (scoring) · React Three Fiber + drei · @xyflow/react (React Flow) · Tailwind v4.

**Hero path (must work live):** real `crunchbase.search` on a pre-verified account (cached fallback) → hiring leg converges → click score → lineage panel → a 2nd account **abstains out loud** → route to Slack, approval gate **blocks** a send.

**Cut-line order when time slips:** (1) Workflow+crash-resume → stretch; (2) provider router → two flat actions; (3) OpenFiber fork → never; (4) KEEPER signal → dropped; (5) hardening (rate-limiter/migrations/tests) → production; (6) 3D scene → opening flourish, lead with the board.

---

## PHASE 0 — Setup & validation (hour 0–1, GATES EVERYTHING)

> Do not build UI until a real provider call returns data for the seeded account. Everything below is doc-derived until this phase proves it.

### Task 0.1: Confirm API keys are present

**Step 1:** Verify both keys are set (never print values):
```bash
[ -n "$ORANGESLICE_API_KEY" ] && echo "OS key: set" || echo "OS key: MISSING"
[ -n "$FIBER_API_KEY" ] && echo "Fiber key: set" || echo "Fiber key: MISSING"
```
Expected: both "set". **If either is MISSING, STOP** — get it (`npx orangeslice login` / https://www.fiber.ai/sign-in) before proceeding. This is the hard gate.

### Task 0.2: Free-op coverage check (spend zero credits)

**Files:** Create `scratch/phase0-coverage.ts` (in the scratch harness `osc-test/`, not the new repo).

**Step 1:** Pick the seeded account (a real, recently-funded company you can verify by hand). Record its `domain` and LinkedIn slug in the plan's "Decisions" log below.

**Step 2:** Write a script that calls only FREE/cheap ops to confirm both providers have data for the account:
- Orange Slice: `services.crunchbase.search` with `LIMIT 1` on the domain (1 credit, acceptable) + a `web.search` (1 credit).
- Fiber: `GET /v1/get-org-credits` (free) + a `companyCount`/`previewTrackerSignal`/`fireTrackerDummy` (free) to confirm auth + shape.

**Step 3:** Run it.
```bash
cd <scratch>/osc-test && npx tsx phase0-coverage.ts
```
Expected: both return non-empty for the seeded account; print funding recency + any job-post stats.

**Step 4 (decision gate):** If coverage is thin (no funding OR no hiring data for the account), either pick a better seeded account or fall back to the **inbound-re-verification** framing (see Design §3 alt). Record the outcome.

### Task 0.3: Prepare the existing `horizon/` app (adapt in place)

**Step 1:** Branch off `master` so the adaptation is isolated and reviewable:
```bash
cd ~/Desktop/Github/0627ycgtm && git checkout -b beachhead
```

**Step 2:** Scrub the cruft the design flagged (do this once, up front), then verify deps:
```bash
cd horizon
git rm -r --cached __pycache__ 2>/dev/null; rm -rf __pycache__
git rm orchestrator_old.py livestream_tiktok.py 2>/dev/null
printf '\n__pycache__/\n*.pyc\n' >> .gitignore
npm install   # existing package.json already has: next 16, convex, @react-three/fiber, drei, three, @xyflow/react
```

**Step 3:** Add the missing libs (data providers + scoring + tests):
```bash
npm install @ai-sdk/openai openai orangeslice
npm install -D convex-test vitest @edge-runtime/vm
# Fiber: prefer REST via fetch (Authorization: Bearer); add @fiberai/sdk only if you use the SDK
```

**Step 4:** Wire env + Convex secrets (Convex is already initialized — `convex/` + `convex.json` exist):
```bash
cp ../.env.example .env.local      # fill NEXT_PUBLIC_CONVEX_URL + CONVEX_URL from `npx convex dev`
npx convex env set ORANGESLICE_API_KEY "$ORANGESLICE_API_KEY"
npx convex env set FIBER_API_KEY "$FIBER_API_KEY"
npx convex env set OPENAI_API_KEY "$OPENAI_API_KEY"
```

**Step 5:** Add `vitest.config.ts` (edge-runtime env for convex-test) + a `test` script in `horizon/package.json`. Commit: `git commit -m "chore(beachhead): scrub cruft, add data-provider + test deps"`.

---

## PHASE 1 — Convex spine (the load-bearing core)

### Task 1.1: Schema (extend the existing one)

**Files:** Modify `convex/schema.ts` (already has `missions`/`agents`/`discoveries`/`logs`/`control`/`signals`).

**Step 1:** KEEP the 5 viz tables (`agents`/`signals`/`logs`/`control` + re-purpose `missions`→`runs`); ADD the GTM tables (`companies`, `leads`, `signalEvents`, `scores`, `actions`, `runs`, `traces`, `apiCache`) — all new fields `v.optional` so the existing dev deployment migrates without a validation error. Use §7 of `PRODUCTION-DESIGN.md` as the base, plus:
```ts
apiCache: defineTable({
  provider: v.string(), op: v.string(), key: v.string(),
  response: v.any(), fetchedAt: v.number(),
}).index("by_key", ["provider", "op", "key"]),
```
Add `by_domain` on `companies`, `by_processed` on `signalEvents`, and a dedupe index on `signalEvents` by `["source","companyDomain","kind"]`.

**Step 2:** `npx convex dev --once` → expect codegen success, no schema errors. Commit.

### Task 1.2: Convergence + abstention — the pure decision function (TDD)

**Files:** Create `convex/lib/convergence.ts`, Test `convex/lib/convergence.test.ts`.

**Step 1: Write the failing test.**
```ts
import { describe, it, expect } from "vitest";
import { decide } from "./convergence";

describe("convergence decision", () => {
  it("routes when >=2 legs fire with recent dates", () => {
    const r = decide({ funding: { ageDays: 20 }, hiring: { count: 8 }, tech: null });
    expect(r.abstained).toBe(false);
    expect(r.score).toBeGreaterThan(60);
    expect(r.rubric.legsFired).toBe(2);
  });
  it("abstains when only one weak leg fires", () => {
    const r = decide({ funding: { ageDays: 300 }, hiring: null, tech: null });
    expect(r.abstained).toBe(true);
    expect(r.rationale).toMatch(/1\/3|single|insufficient/i);
  });
  it("abstains when nothing fires", () => {
    expect(decide({ funding: null, hiring: null, tech: null }).abstained).toBe(true);
  });
});
```

**Step 2: Run, verify it fails.** `npm test -- convergence` → FAIL ("decide not exported").

**Step 3: Implement minimally.** A pure function: count fired legs, weight funding-recency + hiring-volume + tech-presence into 0–100, abstain if `<2` legs or confidence below threshold; return `{ score, confidence, abstained, rationale, rubric:{legsFired, perLeg} }`. No network, no Convex imports.

**Step 4: Run, verify pass.** `npm test -- convergence` → PASS.

**Step 5: Commit.** `git commit -m "feat(convex): pure convergence/abstention decision + tests"`

### Task 1.3: Idempotency helpers (TDD)

**Files:** Create `convex/lib/idempotency.ts`, Test `convex/lib/idempotency.test.ts`.

**Steps:** TDD a `signalKey({source,companyDomain,kind,at})` → deterministic string bucketed by day; test that two same-day same-signal inputs produce equal keys and different days differ. Commit.

### Task 1.4: Provider actions + cache (two flat actions, no router)

**Files:** Create `convex/providers/cache.ts`, `convex/providers/orangeSlice.ts`, `convex/providers/fiber.ts`.

**Step 1:** `cache.ts` — `cacheGet(ctx, provider, op, key)` / `cachePut(...)` over the `apiCache` table via `ctx.runQuery`/`ctx.runMutation` (these are called from actions). Cache-first wrapper: hit → return (0 credits); miss → fetch → put.

**Step 2:** `orangeSlice.ts` — an `internalAction` `callOrangeSlice({ op, domain })` that wraps `crunchbase.search` (funding), `predictLeads.companyJobOpenings` (hiring), `builtWith.lookupDomain` (tech), behind the cache. Reads `process.env.ORANGESLICE_API_KEY`. Wrap in try/catch → write a `traces` row either way; classify 429/5xx retryable, 4xx non-retryable.

**Step 3:** `fiber.ts` — an `internalAction` `callFiber({ op, ref })` for the reverse-email enrich / live-LinkedIn accent (REST `https://api.fiber.ai/v1/...`, `Authorization: Bearer`). Same cache + trace discipline. Keep reveal OFF the live path (pre-fetch only).

**Step 4:** Smoke test against the seeded account through Convex:
```bash
npx convex run providers/orangeSlice:callOrangeSlice '{"op":"funding","domain":"<seeded>"}'
```
Expected: real funding row, then a 2nd call logs a cache hit. Commit.

### Task 1.5: Detect entrypoint (shared by cron + HTTP) + pipeline glue

**Files:** Create `convex/detect.ts`, `convex/crons.ts`, `convex/http.ts`, `convex/companies.ts`, `convex/signalEvents.ts`, `convex/score.ts`, `convex/act.ts`, `convex/mutations/bridge.ts`.

**Step 1:** `detect.ts` — `recordSignal` internalMutation (dedupe by `signalKey`, insert `signalEvents`, create a `runs` row, schedule the pipeline via `ctx.scheduler.runAfter(0, internal.detect.runPipeline, {...})`). `runPipeline` internalAction: call the three provider legs (in parallel), persist company/leads (upsert by `by_domain`), then `ctx.runAction(internal.score.scoreCompany)`.

**Step 2:** `score.ts` — `scoreCompany` internalAction: assemble legs → call `decide()` (pure fn) for the deterministic score, optionally enrich rationale via `ai.generateObject` (OpenAI), then `record` internalMutation into `scores`. Writes `traces`.

**Step 3:** `act.ts` — `proposeAction` internalMutation creates an `actions` row `status:"pending"` (idempotency: skip if a non-failed row exists for `leadId+type`). `approve`/`block` mutations flip status; on approve, `sendSlack` action posts (real send only after human approve).

**Step 4:** `bridge.ts` — on signal processed, insert a viz `signals` + `logs` row so Horizon's rebuilt 3D scene lights up with no frontend change.

**Step 5:** `crons.ts` — `crons.interval("poll", {minutes:2}, internal.detect.poll, {})` where `poll` calls the same `recordSignal`. `http.ts` — `POST /signal` httpAction → `recordSignal` (the demo trigger).

**Step 6:** End-to-end smoke:
```bash
npx convex run detect:recordSignal '{"source":"manual","companyDomain":"<seeded>","kind":"funding_round"}'
```
Expected: `runs` row → `companies`/`leads` upserted → `scores` row (or abstain) → `actions` pending. Verify in the Convex dashboard. Commit.

### Task 1.6: Reactive queries

**Files:** Create `convex/queries/board.ts`, `convex/queries/lineage.ts`, `convex/queries/health.ts`.

**Steps:** `liveBoard` (running runs + scored companies), `leadsPage` (paginated), `scoresByLead` + `tracesByRun` (lineage panel), `checkEnv` (asserts all keys present — surfaces the #1 deploy gotcha). Commit.

---

## PHASE 2 — UI (board is the hero; 3D is the flourish)

### Task 2.1: Convex client wiring
Already present (`app/ConvexClientProvider.tsx` + `app/layout.tsx` + `app/page.tsx` bind Convex). Just verify `useQuery(api.queries.health.checkEnv)` renders green after the schema/query changes. Commit.

### Task 2.2: Lineage board (THE HERO) — adapt the existing whiteboard in place
**Files:** Adapt `app/components/ContentWhiteboard.tsx` + `ContentNode.tsx` + `AgentClusterNode.tsx`; add `AbstainCard.tsx`.
**Steps:** Keep the React Flow grid/FIFO/minimap mechanics; re-skin `ContentNode` (video metrics → company card with score + per-leg badges) and rename to a lead/account card; `AgentClusterNode` → cluster by signal source. Clicking a card opens the lineage panel (sources + timestamps from `scoresByLead`/`tracesByRun`). Add `AbstainCard` = first-class "1/3 legs — not routing" card. Rebind from `getDiscoveries` to `liveBoard`. Strip the TikTok/YT/IG platform logic (`ContentNode.tsx:21-38`). Manually trigger `recordSignal` and watch the board populate live. Commit.

### Task 2.3: Command bar + split layout
Rebuild `CommandBar` (from `CommandOverlay`: prompt → "describe your ICP / paste a domain"; activity feed from `traces`) + `SplitPane` (from `ResizablePane`). Commit.

### Task 2.4: 3D swarm (flourish) — re-skin the existing scene in place
**Files:** Adapt `app/components/{HorizonScene,AgentPlane,BlackboardSphere,ConnectionLines,SignalParticle,CosmeticOrbs}.tsx` + `app/hooks/useAgentData.ts`.
**Steps:** Re-label nodes = signal sources/accounts (height = score), beams = active source-agents, orbs from viz `signals`; re-skin `useAgentData`'s roster/colors to the GTM source taxonomy. Keep the live-browser-iframe pattern (`AgentPlane.tsx:76-135`) for "watch it work." It already does dynamic-import-no-SSR via `page.tsx`. **Time-box this; if it slips, demote to a static opening flourish and lead with the board.** Commit.

---

## PHASE 3 — ACT + approval gate
### Task 3.1: Approval-gate UI on action cards
Add Approve/Block buttons to the pending `actions` row; approve calls `act:approve` → `sendSlack`. Demonstrate the gate **blocking** a send on camera. Test the idempotency guard (double-approve → one send). Commit.

---

## PHASE 4 — Demo readiness
- **Task 4.1:** Pre-fetch + cache the seeded account's slow ops (Fiber reveal, any deep dossier) so they're instant on stage; keep the live `crunchbase.search` as a REAL call with the cache as **silent fallback** (never pre-served — see v2 ruling Δ3).
- **Task 4.2:** Record the **operator cold-open** video (first-class workstream — lock a real RevOps person or a strong self-demo). Use EVIDENCE problem-rows as the script.
- **Task 4.3:** README — pitch + 20s hero GIF + architecture diagram + **"what's live vs labeled-synthetic"** + **"what we deliberately did NOT claim"** + setup. Name the stack (Convex components, Orange Slice as spine, Fiber as named accent, OpenAI).
- **Task 4.4:** `npx convex deploy` to a stable **prod** deployment; set all secrets with `--prod`; point deployed Next.js at the prod URL. Rehearse the 3-minute run; integration freeze 4h before judging.

---

## STRETCH (only if spine is green ≈ hour 12–14)
- **S1: Durable Workflow.** `npm i @convex-dev/workflow`; `app.use(workflow)` in `convex/convex.config.ts`; wrap the enrich→score→act chain in `workflow.define(...)` (stages are already discrete internal actions, so this is an upgrade, not a rewrite). Unlocks the **crash-and-resume** demo beat (kill mid-run → resumes from the exact step, no re-charge).
- **S2:** Rate-limiter component (credit token-bucket), vector dedup, `convex-test` on the pipeline decision paths.

## PRODUCTION ROADMAP (post-event — this is where "production-grade" lives)
Provider abstraction router (`lib/providers/` per-leg), Agent component + vector RAG scoring, full-text command bar, migrations component, tenancy (`userId`/`orgId`), idempotency hardening, observability dashboards, CI + tests, error-budget on flaky ops.

---

## Decisions log (fill during Phase 0)
- Seeded account domain: `____`  · LinkedIn slug: `____`
- Coverage outcome (funding/hiring/tech present?): `____`
- One-provider-vs-two confirmed: Orange Slice spine + Fiber reverse-email accent (default)
- Operator for cold-open: `____`

## Verification before claiming done (per task)
Run the exact command listed, confirm the expected output, commit. Never claim a phase complete without the smoke test green. The hero path (Task 1.5 + 2.2 + 3.1) is the non-negotiable demo spine.
