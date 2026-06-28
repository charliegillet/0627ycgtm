# BEACHHEAD — the GTM displacement/expansion war room

> Detect the moment a company is **standing up a new GTM motion** (a *convergence* of buying signals across three legs: fresh funding, a burst of category-team hiring, a new adjacent tool), score it with **honest abstention**, and route a **non-email** action behind a human-approval gate. The whole pipeline is observable live through Convex.
>
> Honesty note on convergence: with live provider keys, the **hiring** (PredictLeads) and **tech** (BuiltWith) legs reliably return real values, so a routed live account is typically a **2/3 convergence (score 66)**. The **funding** leg queries Crunchbase's lean table and only fires when a funding-date row exists for the domain (uncommon), so it usually returns a real `null`. A real live **3/3** does happen for domains that have a funding-date row (verified live: `mercury.com` scores 87, `clerk.com` scores 79). The 3/3 = 99 on the labeled-synthetic seed fixtures (`stripe.com`, `linear.app`, tagged `__synthetic: true`) is an illustration of the convergence shape, never presented as live.

Built on the Horizon realtime-swarm shell (React Three Fiber 3D scene + React Flow board + Convex reactive spine), repurposed from content-discovery to B2B GTM signal detection.

## What's real vs. synthetic (honesty section)

- **Live & real (when keys are set):** the Convex pipeline (detect → enrich → score → act), the reactive lineage board, the convergence/abstention scoring logic (`convex/lib/convergence.ts`, unit-tested), and the Orange Slice convergence legs (funding/hiring/tech) once `ORANGESLICE_API_KEY` is present. Fiber (`convex/providers/fiber.ts`) is wired and live-ready but kept **off** the convergence/live demo path (cost/compliance), so it never feeds the board or a `(live)` trace.
- **Fixture mode (default, no keys; also the per-leg degrade on a live error):** the data legs return **labeled synthetic fixtures** (`convex/providers/fixtures.ts`, every object tagged `__synthetic: true`). The provider switch is env-based: set a key and the same code path goes live with **no code change**.
- **Cache honesty:** the per-`{provider,op,domain}` cache (`apiCache`) **never stores a synthetic fixture** (enforced by a `shouldCache` guard in `convex/providers/cache.ts`); only true live successes are cached. A fixture written on a live failure is returned for that one call (traced `(fixture(live-failed))` at warn) but is not persisted, so a re-fired domain re-attempts the live call. A fixture can never resurface mislabeled as `(live)`. Verify: `npx convex data traces | grep '(live)' | grep __synthetic` and `npx convex data apiCache | grep __synthetic` are both empty.
- **Not claimed:** there is no "Laminar self-healing / LLM-trace monitoring" and no auto-publish. The approval gate blocks every external send until a human approves.

## Architecture

Convex is load-bearing — remove it and the app stops working:

- **DETECT:** `convex/crons.ts` (interval poll of seeded domains) + `convex/http.ts` (`POST /signal` webhook) both funnel into one entry point, `detect.recordSignal` (dedup via `lib/idempotency`).
- **ENRICH:** `convex/providers/{orangeSlice,fiber}.ts` actions, cache-first via `convex/providers/cache.ts` (`apiCache` table) for credit-safety + demo determinism.
- **SCORE:** `convex/score.ts` builds the legs → pure `decide()` (convergence + abstention) → optional OpenAI rationale enrich → `scores` table.
- **ACT:** `convex/act.ts` proposes a Slack/CRM action (`pending`); a human `approve`/`block`s it; only `approve` sends.
- **UI:** reactive queries (`convex/queries/*`) drive the React Flow lineage board (the hero, with per-leg provenance + `AbstainCard`) and the 3D source-swarm flourish.

## Data providers

- **Orange Slice** (`orangeslice` npm) — the spine: Crunchbase funding discovery, PredictLeads hiring/tech signals, BuiltWith tech, Slack/CRM connectors for the ACT.
- **Fiber AI** (REST) — a named best-of-breed accent: fast contact reveal + live-LinkedIn enrich (kept off the live demo path).

## Run it

```bash
cd horizon
npm install
npx convex dev            # interactive: provisions a deployment + regenerates convex/_generated
# set provider secrets on the deployment (optional — fixture mode works without them):
npx convex env set ORANGESLICE_API_KEY <key>
npx convex env set FIBER_API_KEY <key>
npx convex env set OPENAI_API_KEY <key>
npm run dev               # Next.js app
npm test                  # pure-logic vitest suite (convex/lib)
```

Trigger a detection live:

```bash
curl -XPOST "$CONVEX_SITE_URL/signal" \
  -H 'Content-Type: application/json' \
  -d '{"source":"manual","kind":"manual","companyDomain":"stripe.com"}'
```

## Status

Pipeline, providers (fixture + live), scoring, queries, and UI are implemented and the pure-logic suite passes (14/14). Full typecheck/deploy requires `npx convex dev` (regenerates `_generated`) and, for live data, the provider API keys (already set on the `courteous-bison-60` deployment). See `../fusion/PRODUCTION-DESIGN.md`, `../fusion/EVALUATION-AND-V2.md`, and `../docs/plans/2026-06-28-beachhead.md`.
