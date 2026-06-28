# BEACHHEAD

_The real-time GTM war room that finds your in-market accounts — and tells you when it's NOT sure._

[![AI Growth Hackathon](https://img.shields.io/badge/Built_at-Y_Combinator-F0652F.svg?logo=ycombinator)](https://events.ycombinator.com/OrangeSliceHackathon)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](‹your live-keyed deployment URL›)
[![Demo Video](https://img.shields.io/badge/Demo-Video-ff69b4.svg)](‹record the live run per horizon/docs/demo-runbook.md›)

**POWERED BY OUR SPONSORS**

[![Orange Slice](https://img.shields.io/badge/Orange_Slice-Signal_Pulse-FF8C00.svg)](#)
[![Convex](https://img.shields.io/badge/Convex-Load--bearing_Spine-EA4E43.svg)](#)
[![Fiber AI](https://img.shields.io/badge/Fiber_AI-Contact_Enrichment-000000.svg)](#)
[![OpenAI](https://img.shields.io/badge/OpenAI-Structured_Evaluation-412991.svg?logo=openai)](#)

---

**BEACHHEAD** finds the companies standing up a new go-to-market motion in real time — pulling live funding, hiring, and tech-adoption signals, converging them on a single account, scoring fit, and routing one qualified human handoff. Its defining feature: when the evidence isn't there, it **abstains out loud** instead of guessing.

> ℹ️ **Codebase note (for eligibility review):** Built during the hackathon on the same repo as our prior Horizon project (a content-discovery app we repurposed to GTM). The GTM pipeline, scoring, abstention, provider layer, and Convex schema are **new work from this event** (branch `beachhead`); we reused our own Horizon 3D/board UI shell. Flagging the shared git history explicitly rather than letting it be discovered.

## The Problem

RevOps and GTM engineers find out a company is standing up a new GTM motion — fresh funding, a burst of category-team hiring, a newly-adopted adjacent tool — weeks after it happens, when the window to win the account is already closing. The "intent data" sold to fix this is noisy and heavily false-positive.

*   **You cannot trust a score without abstention.** Every GTM tool we'd used was confidently wrong — it always returned a row, always had a "92% fit," and never once said "I don't know." That false confidence is what makes operators stop trusting their own pipeline.
*   **The last-mile play is dead.** Cold email yields a ~1% reply rate. If you don't have high-conviction context, you are just adding to the noise.
*   **The hard part is the grading.** Detecting one more signal is easy. Knowing which account is _really_ in-market right now, why, and honestly admitting when the evidence isn't there is the asymmetry.

## The Solution

Beachhead is an **intent engine wrapped around a verifier you can trust**, working in real time across four stages: **DETECT → ENRICH → SCORE → ACT**.

1.  **Point and run.** You point Beachhead at an ICP or a domain. A Convex cron and a public `POST /signal` HTTP action feed one entry point that opens a run.
2.  **Parallel detection.** Three convergence legs run in parallel against live provider APIs:
    *   **Funding:** Orange Slice (Crunchbase) recent-raise signal.
    *   **Hiring:** Orange Slice (PredictLeads) category-team job-opening burst.
    *   **Tech adoption:** Orange Slice (BuiltWith) newly-detected tooling.
3.  **Enrich and dedupe.** It enriches the account with Fiber AI (live contact reveal / LinkedIn enrichment) and dedupes it to ensure we don't spam the same account.
4.  **Honest scoring.** It scores it with a pure, unit-tested `decide()` function. It routes only when ≥2 legs fire with enough confidence. Otherwise, it **abstains out loud** ("only 1 of 3 legs — not routing").
5.  **Auditable action.** Routed accounts arrive with clickable per-source lineage (which leg fired, how strong, when) and a Slack handoff that **waits behind a human-approval gate** (nothing auto-sends).

The whole flow animates live on a reactive lead board and a 3D agent swarm with zero WebSocket code.

## Demo

**Watch the demo:** ‹record the live run per horizon/docs/demo-runbook.md›

**Live app:** ‹your live-keyed deployment URL›

### What the demo shows

*Searched 'devtools companies that just raised' → returned N in-market accounts in ~Xs; <Company> scored 9X (funding + hiring + Stripe adoption, all within the last Y weeks); <Company> abstained (1/3 legs) instead of being force-ranked.*

‹FILL FROM LIVE RUN — accounts found, scores, latency›

## How It Works

```mermaid
flowchart LR
    A["Target ICP / Domain"] --> B["Convex Cron / HTTP Action"]
    
    subgraph DETECT ["Detect (Parallel Convergence)"]
        B --> C["Orange Slice: Funding"]
        B --> D["Orange Slice: Hiring"]
        B --> E["Orange Slice: Tech Adoption"]
    end
    
    subgraph ENRICH ["Enrich & Dedupe"]
        C & D & E --> F["Fiber AI: Contact Reveal"]
        F --> G["Fiber AI: LinkedIn Enrich"]
        G --> H["Convex Deduplication"]
    end
    
    subgraph SCORE ["Score"]
        H --> I["OpenAI: Structured Rationale"]
        I --> J{"Confidence >= 2/3 legs?"}
    end
    
    subgraph ACT ["Act"]
        J -- yes --> K["Route (Human Approval Gate)"]
        J -- no --> L["Abstain Out Loud"]
        K --> M["Slack Notification"]
    end
```

### Integration Flow

```mermaid
sequenceDiagram
    participant User/Cron
    participant Convex
    participant Orange Slice
    participant Fiber AI
    participant OpenAI
    participant Slack
    
    User/Cron->>Convex: POST /signal (Target ICP)
    Convex->>Orange Slice: Fetch Funding, Hiring, Tech (Parallel)
    Orange Slice-->>Convex: Signals Returned
    Convex->>Fiber AI: Contact Reveal & LinkedIn Enrich
    Fiber AI-->>Convex: Enriched Data
    Convex->>OpenAI: generateObject (Score & Rationale)
    OpenAI-->>Convex: JSON Score
    alt >= 2 legs & high confidence
        Convex->>Convex: Route Account
        Convex->>Slack: Send Handoff (Requires Human Approval)
        Slack-->>Convex: Approved
    else < 2 legs or low confidence
        Convex->>Convex: Abstain Out Loud
    end
```

## Key Features

*   **Real-time convergence detection** — Funding × hiring × tech-adoption, time-correlated on one account, pulled live. Each leg is cheap; the live join is the asymmetry.
*   **Honest, first-class abstention (the hero)** — Fewer than 2 legs or low confidence → a distinct "ABSTAIN" card, not a misleading low score.
*   **Per-source lineage on every account** — Which legs fired, each one's contribution, the rationale, and a full per-run trace timeline.
*   **Human-approval gate — no auto-send** — Verified by an integration test.
*   **Realtime reactive board + 3D swarm** — Convex reactive queries drive both surfaces.
*   **Provider-agnostic per-leg router** — Re-route a leg (Orange Slice ↔ Fiber) by editing one map; live contact reveal / live-LinkedIn via Fiber AI.
*   **Cache-first credit protection** — Repeat provider calls never re-charge the API.
*   **Deterministic, unit-tested scoring** — The routing/abstention contract is locked by tests.

## Sponsors & How We Use Them

| Sponsor | Shield | How Beachhead Uses It |
| --- | --- | --- |
| **Convex** | [![Convex](https://img.shields.io/badge/Convex-Load--bearing_Spine-EA4E43.svg)](#) | **The load-bearing spine.** Remove it and there is no detector, orchestration, or live board. The detector is a cron; the live trigger is an HTTP action; every external call is a Convex action writing back through internal mutations; the pipeline is sequenced by the scheduler; a cache-first layer lives in an `apiCache` table; the UI is driven by reactive queries so the board updates the instant a signal lands. |
| **Orange Slice** | [![Orange Slice](https://img.shields.io/badge/Orange_Slice-Signal_Pulse-FF8C00.svg)](#) | **The signal pulse.** We use their APIs for live funding (Crunchbase), hiring (PredictLeads), and tech adoption (BuiltWith) signals to orchestrate convergence. |
| **Fiber AI** | [![Fiber AI](https://img.shields.io/badge/Fiber_AI-Contact_Enrichment-000000.svg)](#) | **The enricher.** Provides live contact reveal and live-LinkedIn enrichment for the final mile. |
| **OpenAI** | [![OpenAI](https://img.shields.io/badge/OpenAI-Structured_Evaluation-412991.svg?logo=openai)](#) | **The evaluator.** We use `generateObject` for structured scoring and to write the rationale for why an account routed or abstained. |

## Verification & Trust

Every GTM tool we'd used was confidently wrong — it always returned a row, always had a "92% fit," and never once said "I don't know." We built the opposite. 

| Condition | Result | Action |
| --- | --- | --- |
| **< 2/3 legs** or weak signal | **"Abstain out loud"** | Displayed as a distinct "ABSTAIN" card; not force-ranked or pushed. |
| **≥ 2/3 legs** + high confidence | **Route account** | Sent to Slack handoff behind a strict human-approval gate. |

### Verified technicals
*   `tsc --noEmit` clean · `eslint` 0 errors / 0 warnings · `next build` green.
*   **14/14 tests** (`vitest`: pure-logic convergence/idempotency + `convex-test` integration of enrich→score→act, dedupe, and the approval gate).
*   Convex deploy: **17 indexes across 15 tables**.
*   **End-to-end signal contract:** a strong account routes; a weak account abstains.

## Full Tech Stack

**Frontend** — Next.js 16 (App Router), React 19, Tailwind v4.
**3D & UI** — React Three Fiber + drei + three (3D swarm), React Flow (`@xyflow/react`, board).
**Backend** — Convex 1.32 (reactive queries, actions, internal mutations, crons, HTTP actions, scheduler).
**Integrations** — Orange Slice, Fiber AI, OpenAI.
**Tooling** — TypeScript, Vitest, `convex-test`.

---

### YC GTM Hackathon — Artifacts

Working repo for the AI Growth Hackathon. Reference material lives in [`docs/`](docs/).

#### docs/
- [`AI-Growth-Hackathon-Kickoff-Presentation.pdf`](docs/AI-Growth-Hackathon-Kickoff-Presentation.pdf) — the kickoff slide deck.
- [`hackathon-kickoff-speaker-notes.md`](docs/hackathon-kickoff-speaker-notes.md) — notes from the kickoff talks (schedule, rules, judging, prizes/credits).

#### Hackathon research and ideation
A full research and ideation package for the AI Growth (YC GTM) Hackathon lives under `docs/research/` and `docs/debate/`. Check out [`docs/research/RESEARCH-BRIEF.md`](docs/research/RESEARCH-BRIEF.md) and [`docs/debate/FINAL-recommendation.md`](docs/debate/FINAL-recommendation.md) for context.