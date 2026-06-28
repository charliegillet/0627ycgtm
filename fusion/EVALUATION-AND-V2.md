# BEACHHEAD — Evaluation of v1 + Adjudicated v2

> Second team pass (HorizonArchitect, GTMStrategist, OrangeSliceMapper/Fiber, ConvexDepth) + DevilsAdvocate red-team, after Fiber AI entered scope and the goal became "production-level **for the hackathon**." This doc evaluates `PRODUCTION-DESIGN.md`, resolves the teammate disagreements, and states the locked v2 plan. Where teammates conflicted, the synthesizer's ruling is marked **⚖️ RULING**.

---

## 1. Evaluation of the v1 design doc (PRODUCTION-DESIGN.md)

GTMStrategist scored it against the shared objective function. **Verdict: the strongest artifact in the repo; build-ready; would place if executed.**

| Criterion | Grade | Note |
|---|---|---|
| Custom hard-to-buy signal | **B** | Convergence fires live, but each leg is a *bought* feed; asymmetry rests on the live time-correlated join. Softest spot. |
| Loop fires live | **A−** | Demo-safe ops verified; honest about what's cached. |
| Honest abstention | **A** | First-class, visible, wired into the hero. Bullseyes Danylo. |
| Non-email ACT | **A** | Slack + approval gate that blocks on camera. Dodges "email is dead." |
| Convex-native | **A** | Feature ladder + "remove Convex and it falls apart" bar + correct hard-rules. |
| Recorded operator demo | **C** | Named but under-resourced; still no operator locked. Highest-leverage, least-staffed. |

**Real weaknesses to fix in v2:** (1) convergence sparsity is an unpriced demo-killer — funding ∧ hiring ∧ tech on ONE account, in a small seeded set, is rare ⇒ the engine abstains on almost everything; (2) the operator video is a checkbox, not a workstream; (3) no "what we will NOT claim" section in the README (self-inflicted wound given Horizon's pitch-vs-reality gaps); (4) two self-contradictions ConvexDepth flagged (Workflow tiered "if time" yet called "most impressive"; caching in Phase 3 yet load-bearing for the cut-line).

---

## 2. The four deltas, adjudicated

The second pass proposed four changes. The red-team showed three of them make the plan **worse**. My rulings:

### Δ1 — Signal pivot to KEEPER (champion job-change). **⚖️ RULING: REJECTED.**
GTMStrategist proposed leading with a single Fiber job-change signal instead of 3-way convergence. The red-team verified two disqualifying facts against `docs/research/sponsors/fiber-ai.md`:
- **It's the most commoditized signal in GTM.** UserGems is a whole company built on job-change; Clay/Apollo/Sales Nav/Common Room all ship it as a checkbox. It is the *opposite* of Danylo's "constructed, hard-to-buy" bar — and you'd show it to a judge who sells data.
- **It isn't live.** Fiber job-change is a **weekly batch scan** (`fiber-ai.md:64`), billed on `new-role`. You can't make a champion change jobs during a 3-minute demo, so you'd replay a canned payload — the exact staging problem the original SWITCH pivot fled.
- **Convergence was sparse-but-defensible; KEEPER is reliable-feeling-but-commodity AND still staged. Worst of both.**

> **Keep convergence as the hero.** GTMStrategist's *instinct* (lead with one reliable Fiber moment) was right; the *signal* was wrong. Capture the instinct via Δ2 instead.

### Δ2 — Fiber AI as a second provider. **⚖️ RULING: ADOPTED, but reshaped.**
Fiber genuinely wins three legs (OrangeSliceMapper verified): **hiring** (`jobPostingSearch`, live, named-account), **live-LinkedIn** (`profileLiveEnrich` ~2–4s), **contact reveal** (`syncTurboContactEnrichment` ~90s/7cr vs Orange Slice's 10-min/275cr). But the red-team's host-politics point is decisive: **Orange Slice is the host *and* a judge (Vihaar).** Making the app visibly Fiber's (forking OpenFiber, routing all the magic to Fiber) alienates the host.

Reconciliation:
- **Orange Slice is the visible spine** — funding discovery (`crunchbase.search`), the convergence legs (`predictLeads.*`), per-domain tech (`builtWith`), and the CRM/Slack ACT connectors.
- **Fiber is a named, best-of-breed accent** for the ONE thing OS can't do well: **reverse-email enrich** ("nobody else has this," `fiber-ai.md:18`) as the magical ENRICH wow, and/or fast contact reveal. Name it on a slide as a deliberate best-of-breed call.
- **No OpenFiber fork** (it ships its own UI — your app must be *yours*). Call Fiber's REST directly.
- **No `lib/providers/` abstraction router for the sprint** — YAGNI under a 24h clock; two flat actions (`callOrangeSlice`, `callFiber`). The per-leg router (OrangeSliceMapper's design) moves to the **production roadmap**, where it's genuinely good.

> This keeps OrangeSliceMapper's technical truth (Fiber wins those legs) and the red-team's politics (host is the spine), and recovers Δ1's lost "nobody-has-it" wow via reverse-email instead of job-change.

### Δ3 — Pre-warm the cache so the live call "looks live but cannot fail." **⚖️ RULING: REJECTED (as framed).**
There's a bright line the red-team drew correctly:
- **Legitimate:** make the **real** call live on camera against a pre-verified account; keep a cached copy as a **silent fallback** if the network dies. (This is what v1 §10 already says.)
- **Staging:** decide in advance the call is served from cache so there's no live request — playing a recording and calling it live.
The delta as phrased was the second. A judge who builds enrichment pipelines spots a flat, never-varying response instantly; the moment the hero beat smells pre-recorded, the **entire abstention/trust story dies** — and trust is what you're selling Danylo.

> **The hero call is REAL and live; cache is silent fallback only.** Kill the "looks live but can't fail" framing before it infects the pitch. ConvexDepth's caching is still adopted — for **credit protection + fallback**, not as the demo mechanism.

### Δ4 — Promote durable Workflow into v1. **⚖️ RULING: SPLIT THE DIFFERENCE.**
Genuine expert disagreement. ConvexDepth (Convex specialist): Workflow is *the* differentiator to Wayne and is Workpool-backed (free retries), so promote it. Red-team: it's the riskiest unfamiliar surface (determinism rules, journal replay, `NonRetryableError`), both prior loops agreed to defer it, and crash-resume is an optional 20-second closer — never put an unfamiliar component on the critical path for an optional beat.

Both are partly right, so:
- **The v1 critical path does NOT depend on Workflow.** The pipeline ships as plain actions + `ctx.scheduler` + `ai.generateObject` scoring. The hero beat works with zero Workflow code. (Red-team wins on the critical path.)
- **Workflow is the #1 stretch goal, not a v1 dependency.** The moment the spine is green (≈hour 12–14), wrap the enrich→score→act chain in the Workflow component as an *upgrade* that unlocks the crash-and-resume beat — the single most "best use of Convex" moment for the prize. (ConvexDepth wins on its value.)

> Net: build it so Workflow can be added *without* rework (keep stages as discrete internal actions from the start), but never block the demo on it. Best of both.

### Δ5 (red-team add) — "Production-level for a hackathon." **⚖️ RULING: define two tracks.**
"Production-grade" hardening (rate-limiter component, migrations, `convex-test`, dev↔prod env split, idempotency guards) is **invisible in a 3-minute demo** — judges score what's on camera. So:
- **24h-sprint bar of "production":** the **hero path is reliable**, the signal is **real**, the repo is **clean and matches the claims**, abstention is **honest**, and the operator **video exists**. The one piece of hardening worth doing in the sprint is **caching** (credit guard + fallback).
- **Production roadmap (post-event):** everything else ConvexDepth specced — idempotency, rate-limiter, migrations, tests, tenancy, the provider router, the durable Workflow + Agent + vector tiers. This is where "production-level" actually lives, and it's substantial and correct.

---

## 3. Is Horizon a good project? (the honest answer the user asked for)

**Yes — as validated patterns and de-risked UX, not as code you can submit.** HorizonArchitect's verdict, which I endorse:

*Horizon is a working, polished realtime-agent observability shell whose hard parts are already solved — the Convex reactive spine, a genuine R3F 3D swarm with live browser embeds, and a React Flow board. Its value as a foundation is that you already know these patterns work and what they should look like.*

**Genuinely strong + reusable:** (1) the Convex reactive spine actually works (two windows update live, zero WebSocket code); (2) the 3D swarm maps to real state and is finished, performant coolness (Leo/Corgi axis); (3) the live-browser-iframe is an anti-staging weapon ("watch an agent read a real source on camera"); (4) the React Flow board is a ready-made lineage/provenance surface — it becomes the trust hero; (5) the orchestrator encodes a real concurrency + self-healing pattern that genuinely justifies a swarm.

**But be honest (or inherit Horizon's credibility problem):** the README's "Laminar self-healing via LLM-trace monitoring" is **not implemented** (only in unused `main.py`); the "hive-mind message bus" is **polled, not pushed**, and only reassigns energy-depleted agents; "GPT-5.2" is actually gpt-4o. **Rule for BEACHHEAD: build it for real or don't claim it.** The credible pitch is "working Convex spine + swarm/board that map to real GTM state" — never "we already do self-healing AI."

**Eligibility (now live, since we're submitting):** the rule forbids pre-existing code (`docs/hackathon-overview.md:65-67`). Horizon is committed pre-existing code, so it's **reference, not copy**: new repo, fresh `git init`, fresh commits, rebuild each asset by hand. HorizonArchitect's honest rebuild estimate for the v1 cut-line: **~13–18h** — which *is* the §11 24h sprint. Do not copy Horizon's `.git`, `__pycache__/`, `orchestrator_old.py`, `livestream_tiktok.py`, `main.py`, the pirate easter egg, or placeholder thumbnails.

---

## 4. The clean integration map

### Provider routing (sprint = two flat actions, not a router)
| Leg | Provider | Call | Demo role |
|---|---|---|---|
| Funding (discovery) | **Orange Slice** | `crunchbase.search` (FAST SQL) | Opening live beat |
| Hiring (convergence clincher) | **Orange Slice** primary; Fiber `jobPostingSearch` if coverage thin | `predictLeads.companyJobOpenings` / Fiber job-search | The "standing up a GTM motion" proof |
| Tech (corroboration) | **Orange Slice** | `builtWith.lookupDomain` | Corroboration column, not a primary leg |
| Enrich wow | **Fiber** (named accent) | reverse-email / `profileLiveEnrich` | "Nobody else has this" flourish |
| Reveal (off live path) | **Fiber** | `syncTurboContactEnrichment` (~90s) | Pre-fetched/cached |
| SCORE | OpenAI | `ai.generateObject` → {score, perLeg rubric, confidence, abstained} | Pure, unit-tested decision |
| ACT (non-email) | Orange Slice integrations | `slack.chatPostMessage` + approval gate | Blocks on camera |

### Repo layout (new repo `beachhead/`, rebuilt clean)
`app/` (Next.js): `page.tsx`, `ConvexClientProvider.tsx`, `components/scene/*` (SwarmScene/SourceAgentNode/HubSphere/ConnectionBeams/SignalOrb — rebuilt from Horizon), `components/board/*` (LineageBoard/LeadNode/SourceClusterNode/**AbstainCard**), `components/shell/*` (CommandBar/SplitPane).
`convex/`: `schema.ts` (§7 GTM tables + `apiCache` + idempotency indexes, all new fields `v.optional`), `crons.ts` + `http.ts` (share one detect entrypoint), `detect.ts`, `enrich.ts`, `score.ts` (plain `ai.generateObject`), `act.ts`, `queries/{board,lineage,viz,health}.ts`, `mutations/{bridge,actionsGate}.ts`, `lib/convergence.ts` (PURE, unit-tested), `lib/idempotency.ts`, `providers/{orangeSlice,fiber,cache}.ts`. Add `pipeline.ts` (WorkflowManager) only when you reach the Workflow stretch goal. `convex.config.ts` adds `workflow`/`rateLimiter` when those tiers land.
`lib/providers/` (production phase): the per-leg `SignalProvider` interface + router (deferred from the sprint).

### Convex schema migration (Horizon 6 tables → GTM)
`missions→runs` (array-ify liveUrls), `discoveries→companies+leads`, `agents→keep` (re-skin roster to signal sources), `signals→keep` as viz orbs + new `signalEvents` for ingestion (bridge: insert a `signals` row on processing → 3D lights up free), `logs→traces`, `control→keep`. Add `scores`, `actions`, `apiCache`; add `userId`/`orgId`; fix the ms/s timestamp bug.

---

## 5. v2 demo + cut-line

**Hero unchanged = convergence + visible abstain.** Storyboard: (0:00) recorded operator cold-open → (0:25) DETECT live: real `crunchbase.search` on a pre-verified account, real request on camera (cached fallback silent) → (1:05) **HERO**: hiring leg converges + Fiber reverse-email resolves the contact on screen ("nobody has this"); click the score → lineage panel (each source + timestamp); a second account **abstains out loud** → (2:05) ACT: route to Slack with dossier, approval gate **blocks** a send → (2:40) Convex dashboard rows mutating live; optional crash-resume IF Workflow shipped.

**Cut-line, in order, when time slips:** (1) Workflow + crash-resume → prod. (2) provider router → two flat actions. (3) OpenFiber fork → never. (4) KEEPER → already dropped. (5) hardening (rate-limiter/migrations/tests) → prod. (6) 3D scene → opening flourish, lead with the board.

**Phase 0 (hour 0–1, gates everything):** get **both API keys**, make **one real call** against the seeded account, confirm coverage on **free ops** (Fiber `companyCount`/`fireTrackerDummy`; OS counts) before spending a credit. If coverage is thin, fall back to inbound-re-verification while there's still time. *This is the single most important next action and it's currently blocked on the keys.*

---

## 6. The single highest-risk decision, and the bottom line

**Highest-risk decision:** hero signal = convergence (sparse, defensible, genuinely live) vs anything that trades the moat for reliability. Ruling: **convergence stays the hero; Fiber reverse-email is the enrich wow, not a job-change signal.**

**Red-team verdict: GO-WITH-CHANGES** — the five rulings above are the changes. The skeleton (BEACHHEAD/convergence + Horizon spine + deep-but-right-sized Convex + non-email ACT + abstention) is right. Ship the four deltas as originally proposed and you talk yourself out of your moat (KEEPER), stage your trust beat (pre-warm cache), and put your least-familiar component on the critical path (Workflow). Apply the rulings and it's a GO.

**The meta-lesson:** the polished second-pass plan was quietly going backwards on the two axes judges actually score — trust and focus. That's exactly what the devil's-advocate is for.
