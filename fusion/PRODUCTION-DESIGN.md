# Horizon × Orange Slice — Production Design

> One product, fusing Horizon's realtime swarm UI with the Orange Slice B2B data toolbelt, with Convex as the load-bearing nervous system. Synthesized from a 5-agent research team (OrangeSliceMapper, HorizonArchitect, ConvexDepth, GTMStrategist) + a DevilsAdvocate red-team. Decision: **PIVOT the signal, keep the skeleton.**

> **⚠️ SUPERSEDED IN PLACES — read [`EVALUATION-AND-V2.md`](EVALUATION-AND-V2.md) alongside this.** After Fiber AI entered scope and the goal became "production-level for the hackathon," a second team pass + red-team adjudicated five changes that override this doc: (1) eligibility is live → **rebuild-clean in a fresh repo** (Horizon is reference, not copy); (2) **Fiber AI** added as a *named best-of-breed accent* (reverse-email enrich), Orange Slice stays the visible spine; (3) the hero call is a **real live request + silent cached fallback** — NOT a pre-served cache; (4) **caching moves to Phase 1** (credit guard + fallback), and (5) the **durable Workflow is a stretch goal, not a v1 dependency** (v1 scores with a plain `ai.generateObject` action). The convergence signal remains the hero; the KEEPER job-change pivot was rejected as commodity + non-live.

---

## 0. The one-paragraph answer

Take Horizon's genuinely-good parts — the React Three Fiber swarm, the React Flow board, the live-browser-iframe, and above all the Convex reactive spine — and rebuild them around a **GTM signal engine** powered by Orange Slice. **Do not** build the originally-pitched "competitor rip-out" detector: the red-team proved (and the API map confirms) that signal cannot fire live for a named account with this toolbelt. Instead detect a **convergence of live-obtainable signals** — *a company standing up a new GTM motion*: just raised + just opened category-team roles + just added an adjacent tool. That fires live, abstains honestly when only one leg is present, lands a **non-email** action behind a human-approval gate, and makes Convex load-bearing across detect→enrich→score→act. Working name: **BEACHHEAD** (running on the Horizon viz).

---

## 1. The decision and why

### What we were going to build (SWITCH) and why we're not
SWITCH = "detect the moment a company rips out competitor X, verify from 3 public angles, score with lineage, hand a rep a warm non-email play." It dies on three independent axes the red-team verified against the repo + the Orange Slice API surface:

| Kill-shot | Verdict | Evidence |
|---|---|---|
| **K2 — the rip-out signal can't fire live** | **Fatal, accepted** | `builtWith.lookupDomain` = current-state only (absence ≠ a removal *event*). `searchByTech` first/last-seen is a lagged, noisy *discovery query over a tech*, case-sensitive, 100 credits/page, and **blocks ultra-popular techs** (exactly the competitors people rip out). GitHub migration-PR dorking finds random examples, not a named account on cue, and most B2B competitors leave **zero** GitHub trace. "3 angles AND-ed" ⇒ abstains nearly always on real data ⇒ dead demo, or one hand-picked pre-verified case = staged (and a data-company host-judge will smell it). |
| **K3 — it's the team's own #3, re-inflated** | **Accepted** | `docs/debate/FINAL-recommendation.md` already contains "Defector" (rip-out → win-back, EV 75.8, ranked #3) with the explicit caveat "narrow signal, demo the one case," and already gave the displacement framing a NO-GO once. SWITCH adds a 9-node swarm around what reduces to two API calls = the exact theater a Cursor-tier judge punishes. |
| **K1 — "fuse in Horizon" is a DQ risk** | **Context-dependent** | Hackathon rule (`docs/hackathon-overview.md:65-67`): *"You cannot work on projects started prior to the hackathon… must be built in an entirely separate codebase."* Horizon is committed pre-existing code. **This only bites if you submit to the hackathon.** You asked for a *production* project and the event concludes 2026-06-28 — see §2. |

### What we build instead — accept the pivot, keep everything you like
**BEACHHEAD** keeps SWITCH's entire skeleton — the swarm aesthetic, the Convex spine, the abstention rigor, the non-email ACT, the lineage board — and swaps only the *signal* for one that is real-time-obtainable from demo-safe Orange Slice ops. This sidesteps K2 (signal fires live) and K3 (not the thing the host sells), and keeps the wow.

---

## 2. Eligibility: production vs. hackathon (read this first)

Two mutually-exclusive framings; pick one, it changes the build rules:

- **Production project (what you asked for).** The event ends today; you're building something real afterward. Horizon is a legitimate head-start — reuse its code directly. The eligibility rule is moot. **Recommended, and assumed for the rest of this doc** unless you say otherwise.
- **Hackathon submission.** Then K1 is live: start a **brand-new repo**, and *rebuild* the swarm/board from scratch rather than porting Horizon files (a Convex/Cursor judge will `git log` you). Budget that rebuild as **6–10h of new work** — Horizon then becomes a reference, not a free head-start. Also: delete the committed `__pycache__/`, `orchestrator_old.py`, and the "pirate" easter egg regardless.

> If you might demo this at a *future* event, build clean now (new repo, new commits) so you keep the option. The cost is small and the design is identical.

---

## 3. The product — BEACHHEAD

**Pitch.** The moment a company starts standing up a new GTM motion — fresh funding **and** a burst of category-team hiring **and** a newly-adopted adjacent tool — Beachhead lights it up on a live board, scores the fit with per-source lineage, **abstains out loud** when it can only prove one leg, and hands a rep one warm, **non-email** play behind an approval gate.

| Field | Value |
|---|---|
| **Buyer** | GTM engineer / RevOps at a B2B company selling *into* a specific motion (e.g. a dev-tools, data, or sales-tooling vendor whose ICP is "companies building out X"). One persona. |
| **The custom signal** | **Convergence**, not a bought feed: `funding (Crunchbase) × category-hiring (PredictLeads jobs) × tech-add (PredictLeads/BuiltWith)`. Each leg is cheap to buy; the *time-correlated convergence on one account, computed live* is the asymmetry. |
| **DETECT** | `crunchbase.search` (recent funding, FAST SQL) + `predictLeads.companyJobOpenings` + `predictLeads.companyTechnologyDetections` / `companyNewsEvents`. |
| **ENRICH** | `company.linkedin.enrich` (firmographics + `employee_growth_12mo`, ~300–500ms) + `web.search` dorks for corroboration. Contact reveal (`person.contact.get`, ocean) is **off the live path** (slow/expensive). |
| **SCORE** | `ai.generateObject` → `{ score 0–100, perLeg rubric, rationale, confidence }`. **Abstains** when only one leg fires, when corroboration is ambiguous, or when the contact can't be resolved. Abstention is a first-class, visible outcome. |
| **ACT (non-email)** | Route a qualified human + lineage dossier to **Slack** (`integrations.slack.chatPostMessage`) or a CRM record (`hubspot`/`attio`), behind a **human-approval gate**. Email is *not* the climax. |
| **Anti-commodity wedge** | Not Clay/Apollo (those sell static lists / one bought signal); the product is the *live, abstaining convergence engine* with provenance you can click — and the swarm makes the parallel detection visible, which a dashboard can't. |

**Two alt framings** (keep as go/no-go fallbacks):
- **Inbound re-verification** — a form-fill is re-verified + scored before you finish reading it. Near-zero live-failure risk; the hour-16 safety net.
- **Hiring-surge only** — single-leg version of Beachhead if convergence proves too sparse in the demo data; still fires live.

---

## 4. Judge fit (objective function both prior research loops agreed on)

Shared win-criteria: **ONE custom hard-to-buy signal, wired DETECT→ENRICH→SCORE→ACT live, honest abstention, NON-email ACT, Convex-native, + a recorded real-operator demo.** Beachhead hits all six.

| Judge / sponsor | Fit | Exposure |
|---|---|---|
| **Danylo (Lopus)** | Constructed signal + visible abstention + per-source lineage = his trust thesis, bullseye. | — |
| **Vincent (Cursor)** | Information asymmetry + agent-swarm + non-email act + no me-too. | Keep it *not* a Chat-GTM clone and *not* the host's own product. |
| **Wayne (Convex)** | Deep, load-bearing Convex (see §6). | Depth must be real, not 10 shallow features. |
| **Leo (Corgi, design)** | The 3D swarm is genuine coolness. | Must map to real state, not decoration. |
| **Apoorv (OpenAI)** | `ai.generateObject` scoring + structured output. | — |

> ⚠️ **Two-hackathons caveat** (GTMStrategist): `organslice/idea-loop/` was scoped to a *different* event (Moss Conversational AI). Reuse only its **demo discipline** — not its product ideas (fault-attribution, proof-units). The real objective function lives in `docs/research/` + `docs/debate/`.

---

## 5. Architecture — the fused stack

```
                          ┌─────────────────────────────────────────────┐
                          │                 CONVEX (spine)               │
  Orange Slice (HTTP) ◄───┤  actions: callOrangeSlice / scoreLead / act  │
  OpenAI (HTTP)       ◄───┤  crons: pollSources (continuous detect)      │
                          │  httpAction: /signal  (inbound webhook)      │
                          │  Workpool: rate-limited enrichment fan-out   │
                          │  (Workflow: durable enrich→score→act — prod) │
                          │  tables + reactive queries  ◄────────────────┼──► Next.js UI
                          └─────────────────────────────────────────────┘     │
                                                                               ├─ 3D swarm (R3F): nodes = real source-agents
                                                                               ├─ Lineage board (React Flow): provenance + abstain
                                                                               └─ Command bar + activity feed (reused shell)
```

### Horizon reuse map (HorizonArchitect — ~80% transfers)
**KEEP as-is:** the Convex reactive spine; the 3D viz stack (`HorizonScene`, `AgentPlane` incl. live-iframe, `BlackboardSphere`, `ConnectionLines`, `SignalParticle`); the React Flow board mechanics (FIFO 100-cap, clusters, minimap); the app shell (`CommandOverlay`, `ResizablePane`, `ConvexClientProvider`, dynamic-import-no-SSR); the orchestrator skeleton (asyncio task-per-agent, mission poller, `swarm_manager` reassignment, `control_watcher` stop/pause, energy risk/reward).

**ADAPT (structure stays, domain changes):** `discoveries → leads/companies`; `ContentNode` video-metrics → ICP-fit/intent/contact fields; `useAgentData` platform taxonomy → GTM source taxonomy; OpenAI helpers → ICP→target-account + signal extraction; `analyze_tiktok/youtube/duckduckgo` → enrichment/scoring handlers (real APIs, not screenshot OCR).

**DROP:** `orchestrator_old.py`, committed `__pycache__/`, `livestream_tiktok.py`, most of `mission_livestream_watcher.py`, `main.py` (Dedalus/Laminar scaffold), the "pirate" easter egg, `placeholder.com` thumbnails, stale `test_orchestrator.py`, all TikTok/YT virality scraping + fake-metric estimation (`views=likes*15`).

**Honest pitch-vs-reality** (so we don't repeat Horizon's claims): the README's "Laminar self-healing via LLM-trace monitoring" is **not implemented** (Laminar only in unused `main.py`); real "self-healing" is a coarse energy heuristic (fail → −30 → "weak" → reassign); "hive-mind message bus that pulls agents off dead-ends" is **polled, not pushed**, and only reassigns *energy-depleted* agents. We either build these for real or don't claim them.

---

## 6. Deep Convex integration (the prize lever)

Horizon today uses Convex as **6 plain tables + queries/mutations** — zero actions, crons, components, search, or HTTP. That's the "Postgres I didn't host" anti-pattern. Everything below is net-new depth. **The bar: if you remove Convex, the app falls apart.** Beachhead clears it because detection (crons), orchestration (Workflow), fan-out (Workpool), scoring memory (Agent/vector), and the entire live UI all *are* Convex.

### Load-bearing feature ladder (ship top-down; stop where time runs out)
| # | Feature | Why load-bearing | Tier |
|---|---|---|---|
| 1 | **Reactive queries → live board + 3D viz** | The entire observability story; two windows update with no WS code. | **v1 must-have** |
| 2 | **Crons (scheduled functions)** | The "always-on" detector polling sources. | **v1 must-have** |
| 3 | **Actions + mutation write-back** | Every Orange Slice/OpenAI call is an action (queries/mutations have no network); writes hop through `internalMutation`. | **v1 must-have** |
| 4 | **Workpool** | Rate-limit-safe, retrying fan-out over paid APIs (a signal burst must not hammer Orange Slice). | **v1 should-have** |
| 5 | **HTTP action `/signal`** | Inbound webhook = the live demo trigger (`curl` → pipeline runs on camera). | **v1 should-have** |
| 6 | **Durable Workflow** | enrich→score→act survives mid-run crashes, exactly-once mutations, deterministic replay — the *most* impressive Convex feature, and enables the "crash-and-resume" demo beat. | **prod / if time** |
| 7 | **Agent component + vector RAG** | Scoring as a Convex Agent with persistent threads + similar-lead retrieval = AI brain *inside* Convex. | **prod / if time** |
| 8 | Vector + full-text search | Semantic dedup ("already a lead?") + operator command bar. | **prod** |
| 9 | File storage, optimistic updates, presence | Artifacts; instant-feel AE actions; "Charlie is viewing this account." | **prod polish** |

> **Right-sizing (red-team, accepted for the sprint):** for a 24h build ship **1–5** deeply; scoring can be a plain action calling `ai.generateObject` — you do **not** need the Agent component to score. Add 6–9 in the production phase. Ten half-working features read *worse* to a Convex judge than four that genuinely carry the app.

### The hard rules that shape the code
- `fetch`/external APIs live **only** in `action`/`httpAction`. Queries & mutations have no network.
- Actions have **no `ctx.db`** — read via `ctx.runQuery`, write via `ctx.runMutation` (use `internal*` so they're private).
- Mutation-schedules-action for client-triggered work (`ctx.scheduler.runAfter(0, internal.x.action, …)`).
- HTTP actions only in `convex/http.ts`, served from `*.convex.site` (use that URL in the demo `curl`).
- Vector search runs in actions, returns `{_id,_score}`; `dimensions` must match the embedding model (1536 for `text-embedding-3-small`).
- Every component must be `app.use(...)`'d in `convex/convex.config.ts` **and** you must run `npx convex dev` to regenerate `components.*` (the #1 "why is it undefined" gotcha).

---

## 7. Target Convex schema (build on Horizon's; add the GTM domain)

Keep Horizon's `agents` / `signals` / `logs` / `missions` / `control` (they already drive the 3D scene). Add:

```ts
companies: defineTable({
  domain: v.string(), name: v.string(), industry: v.optional(v.string()),
  employeeCount: v.optional(v.number()), enrichment: v.optional(v.any()),
  icpFit: v.optional(v.number()), embedding: v.optional(v.array(v.float64())),
}).index("by_domain", ["domain"])
  .searchIndex("search_name", { searchField: "name", filterFields: ["industry"] })
  .vectorIndex("by_embedding", { vectorField: "embedding", dimensions: 1536, filterFields: ["industry"] }),

leads: defineTable({
  companyId: v.id("companies"), fullName: v.string(), title: v.optional(v.string()),
  email: v.optional(v.string()), linkedin: v.optional(v.string()),
  score: v.optional(v.number()),
  stage: v.union(v.literal("detected"), v.literal("enriching"), v.literal("scored"),
                 v.literal("acting"), v.literal("done"), v.literal("dead")),
}).index("by_company", ["companyId"]).index("by_stage", ["stage"]),

signalEvents: defineTable({                 // NOTE: distinct from viz `signals` (orbs)
  source: v.string(), kind: v.string(), companyDomain: v.optional(v.string()),
  companyId: v.optional(v.id("companies")), payload: v.any(),
  strength: v.optional(v.number()), processed: v.boolean(), detectedAt: v.number(),
}).index("by_processed", ["processed", "detectedAt"]).index("by_company", ["companyId"]),

scores: defineTable({                        // append-only; powers the lineage panel
  leadId: v.id("leads"), companyId: v.id("companies"), score: v.number(),
  rubric: v.any(), rationale: v.string(), confidence: v.number(),
  abstained: v.boolean(), legs: v.any(), createdAt: v.number(),
}).index("by_lead", ["leadId"]),

actions: defineTable({
  leadId: v.id("leads"),
  type: v.union(v.literal("slack"), v.literal("crm"), v.literal("email_draft")),
  status: v.union(v.literal("pending"), v.literal("approved"), v.literal("blocked"),
                  v.literal("sent"), v.literal("failed")),
  body: v.optional(v.string()), createdAt: v.number(),
}).index("by_status", ["status"]),

runs: defineTable({ companyId: v.optional(v.id("companies")), stage: v.string(),
  status: v.union(v.literal("running"), v.literal("succeeded"), v.literal("failed")),
  startedAt: v.number(), finishedAt: v.optional(v.number()) }).index("by_status", ["status"]),

traces: defineTable({ runId: v.id("runs"), stage: v.string(), agentId: v.optional(v.number()),
  message: v.string(), at: v.number() }).index("by_run", ["runId"]),
```

**Key decisions:** new ingestion table is `signalEvents` to avoid colliding with Horizon's viz `signals`; bridge them by also inserting a `signals` row when an event is processed → the existing 3D scene lights up with **zero frontend changes**. `runs` + `traces` are the live-observability spine (each trace, tagged with `agentId`, animates a node). Add `userId`/`orgId` for tenancy (Horizon has none). Array-ify `missions.liveUrl1..9`. Reconcile the ms/s timestamp bug across writers.

---

## 8. The swarm — load-bearing, not decoration

The red-team's challenge is fair: *don't wrap 3 API calls in a 9-node hive.* Beachhead earns the swarm because the convergence signal is genuinely **heterogeneous, parallel work**:

- **One agent per signal source** — Crunchbase (SQL, ~300ms), PredictLeads-jobs (REST, variable coverage), PredictLeads/BuiltWith tech (REST), LinkedIn-enrich, web-search corroboration. Different latencies + rate limits + failure modes ⇒ real fan-out + real self-healing (an agent whose source is rate-limited gets reassigned).
- **One agent per account** during a detected burst (Workpool-bounded).
- **One agent per verification angle** — multi-source corroboration *is* the abstention logic; the nodes converging on an account literally compute confidence.

**Viz mapping:** 3D nodes = accounts (height = score; re-rank visibly on signal arrival); beams = live source-agents with clickable provenance; the live-browser-iframe shows an agent reading a *real* source on camera (anti-staging proof). **The 2D React Flow lineage board is the load-bearing proof surface** (per-source provenance + the visible abstain). If time is short, demote the 3D scene to an opening flourish and lead with the board — but keep both if they map to real state.

---

## 9. Three-minute demo storyboard

Discipline borrowed from `organslice/idea-loop/final/proofloop-3min-demo.md`: 3 beats, ONE hero, build the spine deeply, everything else is labeled preview.

| Time | Beat | Visible state change | Build vs mock |
|---|---|---|---|
| 0:00–0:25 | **Real-operator cold-open** (recorded): a RevOps operator says "I'd kill for this." | — | Recorded video (the single biggest differentiator almost no team ships). |
| 0:25–1:10 | **DETECT live:** `curl` the `/signal` HTTP action (or cron tick) → source-agents fire; ≥1 source (Crunchbase funding) genuinely live. | Board populates; 3D nodes light per source. | **BUILD** (demo-safe ops only). |
| 1:10–2:05 | **HERO — converge + lineage + abstain:** nodes converge on one account; click the score → lineage panel shows each leg's source + timestamp; then a second account **abstains out loud** ("only 1/3 legs — funding, no hiring/tech; not routing"). | Lineage panel; visible ABSTAIN card. | **BUILD.** This is the trust moment — the whole pitch. |
| 2:05–2:40 | **ACT (non-email) + approval gate:** a qualified account routes to Slack with a dossier; the approval gate **blocks** one send on camera. | Slack card renders; "Blocked, awaiting approval." | **BUILD** the Slack post + gate; CRM/email as 5-sec previews. |
| 2:40–3:00 | **(optional) crash-and-resume** or close line. | Convex dashboard rows mutate live; workflow resumes from the exact step without re-charging Orange Slice. | **prod/if-time**; otherwise close. |

**Close line:** "We don't sell you a list. We catch the moment a company starts building — live, with receipts, and we tell you when we're not sure."

---

## 10. The cut-line (what MUST work on camera)

**Must be live (demo-safe ops only):** ONE convergence signal firing on ONE real, pre-verified company via `crunchbase.search` + `predictLeads.*` + `company.linkedin.enrich`; the reactive lineage board updating (Convex query → React Flow); one genuine **abstention**; the approval gate **blocking** a non-email action.

**Pre-fetched / mock / replayed (say so):** `person.contact.get`, `browser.execute`, `scrape.website`, `apify` (all slow/flaky); the 3D scene if it fights you; any "watch *any* account live" claim (it's scripted — label it).

**The single thing that sinks the demo if it slips:** the live signal call. Pre-verify the account, cache the response, keep the cached replay as a silent fallback. Freeze all demo calls at the 4h integration cutoff.

---

## 11. Build plan

### Production roadmap (your stated goal)
1. **Foundation (clean repo):** Next.js 16 + Convex; port the schema (§7); stand up reactive queries → a minimal board. Strip Horizon's virality code as you port.
2. **Signal engine:** crons + actions for `crunchbase.search` + `predictLeads.*` + `linkedin.enrich`; `signalEvents` ingestion; convergence computation; `ai.generateObject` scoring with abstention.
3. **Fan-out + reliability:** Workpool; HTTP `/signal`; caching layer (cache every Orange Slice hit on first fetch — protects credits and demos).
4. **Viz:** re-skin the 3D swarm to source-agents; build the React Flow lineage board with provenance + abstain cards.
5. **ACT:** Slack/CRM integration + human-approval gate (load-bearing, not a speed bump).
6. **Deep Convex:** durable Workflow for enrich→score→act; Agent component + vector RAG; vector dedup; full-text command bar.
7. **Hardening:** tenancy (`userId`/`orgId`), tests, observability, credit budgeting, error handling on every flaky op.

### 24h-sprint variant (if you do treat this as a competition entry)
- **H0–2:** new repo, schema, reactive board skeleton (Phase 0 — must work first).
- **H2–8:** signal engine on demo-safe ops; convergence + abstention; one real account verified end-to-end.
- **H8–14:** Workpool + HTTP trigger; re-skinned swarm + lineage board.
- **H14–16:** Slack ACT + approval gate. **Hour-16 go/no-go:** if the live pipeline isn't green, fall back to the inbound-re-verification framing (§3).
- **H16–20:** record the operator video; polish the hero beat; cache/freeze demo calls.
- **H20–24:** rehearse; integration freeze 4h pre-judging; silent-fallback replay ready.

---

## 12. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Live signal call fails on camera | **High** | Demo-safe ops only; pre-verify + cache + silent replay fallback. |
| Convex over-scope ⇒ nothing works live | High | Ship features 1–5 first; Phase 0 must be green before anything else. |
| Credit burn at hour 20 (`searchByTech` 100/pg, `contact.get` 275, ocean 5/result) | Med | Cache-first; build on fixtures; keep slow ops off the live path; freeze at integration cutoff. |
| Convergence too sparse in demo data ⇒ always abstains | Med | Seed a known-good account; fall back to single-leg hiring-surge framing. |
| "Synthetic-but-labeled" undercuts "we detect the *real* moment" | Med | The ONE hero artifact must be genuinely real + live; everything else clearly labeled (Danylo's trust axis). |
| Eligibility (if submitting) | Med | New repo; rebuild don't port; budget 6–10h; scrub committed cruft. |
| Retiring Python orchestrator mid-sprint | Med | Keep Python for anything needing a real browser binary; expose it via HTTP and call it *from* a Convex action so Convex still owns orchestration. Don't migrate under time pressure. |
| Agent component fights you | Low | Score with a plain action + `ai.generateObject`; skip the Agent component for v1. |

---

## 13. Open questions for you (decide before build)

1. **Production or hackathon-submission framing?** (Sets the repo/eligibility rules — §2.) Assuming **production** unless told otherwise.
2. **Team size / skills?** Drives how much of the deep-Convex ladder (§6) is reachable.
3. **Do you have an Orange Slice API key + credit budget?** (Still not set locally — needed before any real call. The scratch harness + `first-call.ts` are ready.)
4. **One real operator to film** for the cold-open? (Highest-leverage, lowest-cost differentiator.)
5. **Pick the ICP/named motion** Beachhead targets (sets the convergence legs and the seeded demo account).

---

## Appendix — source reports
Five-agent research team, all grounded in the repo + live API surface:
- **OrangeSliceMapper** — full `orangeslice` v2.6.0 capability map, demo-safety tags, DETECT→ENRICH→SCORE→ACT mapping, credit/limit notes.
- **HorizonArchitect** — verbatim Convex data model, KEEP/ADAPT/DROP reuse verdict, pitch-vs-reality gaps (file:line).
- **ConvexDepth** — target schema, function inventory, deep-Convex scorecard, orchestrator-migration decision, demo moments, pitfalls.
- **GTMStrategist** — objective-function reconciliation, the fused thesis, judge fit, swarm justification, the two-hackathons caveat.
- **DevilsAdvocate** — kill-shots (K1 eligibility, K2 signal-can't-fire-live, K3 worse-Defector, K4 Convex-over-scope), signal-feasibility verdict, the BEACHHEAD counter-proposal, the cut-line, PIVOT.
