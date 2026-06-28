# BEACHHEAD — Hackathon Submission (paste-ready, real-time)

> Real-time framing (live provider mode). IMPORTANT: this copy assumes the deployment you
> demo to judges has provider keys set (`ORANGESLICE_API_KEY`, `FIBER_API_KEY`,
> `OPENAI_API_KEY`) so it runs against LIVE data — your teammate's working setup. Make sure
> the demo URL/video is the live-keyed deployment, not a keyless one (a keyless instance
> falls back to seed data, which would contradict the "real-time" claims below).
>
> Two things I did NOT invent: (1) specific live results are marked `‹FILL FROM LIVE RUN›` —
> paste your teammate's actual output; (2) the git-ancestry note stays (verifiable repo fact).

---

## App Title
```
BEACHHEAD
```

## App / Project Tagline
```
The real-time GTM war room that finds your in-market accounts — and tells you when it's NOT sure.
```

## Description  (Markdown — paste whole)
```markdown
**BEACHHEAD** finds the companies standing up a new go-to-market motion in real time —
pulling live funding, hiring, and tech-adoption signals, converging them on a single
account, scoring fit, and routing one qualified human handoff. Its defining feature: when
the evidence isn't there, it **abstains out loud** instead of guessing.

> ℹ️ **Codebase note (for eligibility review):** built during the hackathon on the same
> repo as our prior Horizon project (a content-discovery app we repurposed to GTM). The
> GTM pipeline, scoring, abstention, provider layer, and Convex schema are **new work from
> this event** (branch `beachhead`); we reused our own Horizon 3D/board UI shell. Flagging
> the shared git history explicitly rather than letting it be discovered.

## The problem
RevOps and GTM engineers find out a company is standing up a new GTM motion — fresh
funding, a burst of category-team hiring, a newly-adopted adjacent tool — weeks after it
happens, when the window to win the account is already closing. The "intent data" sold to
fix this is noisy and heavily false-positive, so teams either drown in junk leads or stop
trusting the score entirely. And the old last-mile play — cold email — is dead (~1% reply).
The hard part was never detecting one more signal; it's knowing which account is *really*
in-market right now, why, and honestly admitting when the evidence isn't there.

## How it works  (DETECT → ENRICH → SCORE → ACT, in real time)
You point Beachhead at an ICP or a domain. A Convex **cron** and a public **`POST /signal`
HTTP action** feed one entry point that opens a run and fans out three **convergence legs in
parallel** against live provider APIs:
- **Funding** — Orange Slice (Crunchbase) recent-raise signal
- **Hiring** — Orange Slice (PredictLeads) category-team job-opening burst
- **Tech adoption** — Orange Slice (BuiltWith) newly-detected tooling
It enriches and dedupes the account, then scores it with a **pure, unit-tested `decide()`**
function: route only when ≥2 legs fire with enough confidence; otherwise **abstain out loud**
("only 1 of 3 legs — not routing"). Routed accounts arrive with clickable per-source lineage
(which leg fired, how strong, when), and a Slack handoff that **waits behind a human-approval
gate — nothing auto-sends**. Optional Fiber AI reverse-email / live-LinkedIn enrichment fills
in the contact. The whole flow animates live on a reactive lead board and a 3D agent swarm
with zero WebSocket code.

## See it run  (real example)
‹FILL FROM LIVE RUN› — e.g. *"Searched 'devtools companies that just raised' → returned N
in-market accounts in ~Xs; <Company> scored 9X (funding + hiring + Stripe adoption, all
within the last Y weeks); <Company> abstained (1/3 legs) instead of being force-ranked."*
(Paste the actual companies + scores from your teammate's live run, plus a screenshot/GIF.)

## Notable features
- **Real-time convergence detection** — funding × hiring × tech-adoption, time-correlated on
  one account, pulled live. Each leg is cheap; the live join is the asymmetry.
- **Honest, first-class abstention (the hero)** — fewer than 2 legs or low confidence → a
  distinct "ABSTAIN" card, not a misleading low score.
- **Per-source lineage on every account** — which legs fired, each one's contribution, the
  rationale, a full per-run trace timeline.
- **Human-approval gate — no auto-send** (verified by an integration test).
- **Realtime reactive board + 3D swarm** — Convex reactive queries drive both surfaces.
- **Provider-agnostic per-leg router** — re-route a leg (Orange Slice ↔ Fiber) by editing one
  map; live contact reveal / live-LinkedIn via Fiber AI.
- **Cache-first credit protection** — repeat provider calls never re-charge the API.
- **Deterministic, unit-tested scoring** — the routing/abstention contract is locked by tests.

## Why we built it
Every GTM tool we'd used was confidently wrong — it always returned a row, always had a
"92% fit," and never once said "I don't know." That false confidence is what makes operators
stop trusting their own pipeline. We built the opposite: a real-time engine whose most
important feature is that it **abstains out loud**, with a visible agent swarm so detection
isn't a black box and per-source receipts so every routed account is auditable.

## Tech stack
- **Next.js 16** (App Router) + **React 19**
- **Convex 1.32** — reactive queries, actions, internal mutations, **crons**, **HTTP actions**,
  scheduler (the load-bearing realtime spine)
- **Orange Slice** — live funding (Crunchbase), hiring (PredictLeads), tech (BuiltWith) signals
  + Slack/CRM action connectors
- **Fiber AI** — live contact reveal / live-LinkedIn enrichment
- **OpenAI** — `generateObject` structured scoring/rationale
- **React Three Fiber + drei + three** (3D swarm) · **React Flow** (`@xyflow/react`, board)
- **Vitest + convex-test**, **TypeScript**, **Tailwind v4**; deployed on **Convex**

## Architecture
**Convex is the load-bearing spine — remove it and there is no detector, orchestration, or
live board.** The detector is a cron; the live trigger is an HTTP action; every external
Orange Slice / Fiber / OpenAI call is a Convex action (queries/mutations have no network)
writing back through internal mutations; the pipeline is sequenced by the scheduler; a
cache-first layer lives in an `apiCache` table; and the entire UI is driven by reactive
queries, so the board and 3D scene update the instant a signal lands.

## What's verified
- `tsc --noEmit` clean · `eslint` 0 errors / 0 warnings · `next build` green
- **14/14 tests** (`vitest`: pure-logic convergence/idempotency + convex-test integration of
  enrich→score→act, dedupe, and the approval gate)
- Convex deploy: **17 indexes across 15 tables**
- **End-to-end signal contract:** a strong account **routes** (≥2/3 legs, high confidence);
  a weak account **abstains** (1/3 legs) instead of being force-ranked
- Live run results: ‹FILL FROM LIVE RUN — accounts found, scores, latency›
```

## App Website Link
```
‹your live-keyed deployment URL› (deploy the Next.js frontend, e.g. Vercel; backend is on Convex)
```

## Video Demo
```
‹record the live run per horizon/docs/demo-runbook.md — search an ICP → accounts appear with
live scores → one routes, one abstains → approve the Slack handoff›
```

## GitHub Repo URL
```
https://github.com/charliegillet/0627ycgtm/tree/beachhead/horizon
```

## Tags to select (ONLY these — verified genuinely used)
```
convex · OpenAI · OrangeSlice · YCGrowthHackathon
```
Do NOT select Cursor (only CSS `cursor-pointer` in code, no SDK), Lopus, or Corgi — none are integrated. Tagging an un-integrated sponsor is an easy way to lose a repo-reading judge.

---

## Pre-submit checklist
1. **Provider keys on the demo deployment** — confirm `ORANGESLICE_API_KEY`, `FIBER_API_KEY`,
   `OPENAI_API_KEY` are set on the deployment you show judges (so it's genuinely live, matching this copy).
2. **Public app URL** — deploy the Next.js frontend for a live link.
3. **Video demo** — capture the live run (real ICP search → real accounts + scores → abstain → approve).
4. **App screenshot** — the real board + 3D scene mid-run.
5. **Fill the `‹FILL FROM LIVE RUN›` slots** — real companies, scores, latency from the live run (or send me the keys and I'll capture them).
6. **Front-page README** — point the repo link at `horizon/` (done above) or update the root README to describe BEACHHEAD.
7. **Name / Email** — fill in.
```
