# BEACHHEAD — 3-minute demo runbook

The discipline: build the spine deeply, demo exactly 3 beats, land ONE hero (the visible
abstention). Everything live is from demo-safe ops; slow/flaky paths are pre-fetched.

## Pre-flight (before judging)
```bash
cd horizon
npm install
npx convex dev            # deployment + codegen (already provisioned: courteous-bison-60)
npm run dev               # http://localhost:3000
```
- Confirm health: the command overlay shows live ROUTED / ABSTAIN / FAILED counts.
- (Optional, live data) set keys, else fixtures drive the demo:
  `npx convex env set ORANGESLICE_API_KEY <key>` (+ FIBER_API_KEY). Provider switch is env-based.
- Pre-warm: fire the seeded accounts once so cards are present; keep a cached fallback.
- Freeze: stop changing code 4h before judging.

## The 3 beats

### 0:00–0:25 — Operator cold-open (recorded)
Play the recorded RevOps operator clip: "I find out a company is spinning up a GTM motion weeks too late."

### 0:25–1:05 — DETECT live
Fire the real HTTP signal endpoint on camera (two windows: the app + this terminal).
Use a BRAND-NEW domain so the legs are fetched live, not served from cache. Pick one
not yet fired today (e.g. hashicorp.com, mongodb.com, cloudflare.com):
```bash
SITE=$(grep NEXT_PUBLIC_CONVEX_SITE_URL .env.local | cut -d= -f2)
curl -XPOST "$SITE/signal" -H 'Content-Type: application/json' \
  -d '{"source":"manual","kind":"manual","companyDomain":"hashicorp.com"}'
```
On screen: a node lights up, the board populates — no refresh (Convex reactivity).

### 1:05–2:05 — HERO: converge + lineage + ABSTAIN
- The fresh live domain converges on **2/3 legs (hiring + tech)** → routes at **66** (conf 0.66);
  click the card → lineage shows each leg's source + value. The traces read
  `(live)` with real values, e.g. `hiring leg for hashicorp.com (live) → {"count":6071}`,
  `tech leg ... (live) → {"present":true}`, `funding leg ... (live) → null`.
  Verify with: `npx convex data traces | grep hashicorp`.
  NOTE (honesty): most live domains route on hiring + tech, because the funding leg
  queries `public.crunchbase_scraper_lean` and finds no funding-date row for them, so
  live convergence is honestly **2/3 = 66**. The funding leg DOES fire live for some
  domains, giving a real **3/3**. Verified live examples: `mercury.com`
  (funding ageDays≈186, hiring 1694, tech yes, score 87) and `clerk.com`
  (funding ageDays≈257, hiring 97, tech yes). If you want the on-camera hero to be a
  live 3/3, fire one of those and confirm its funding leg trace reads `(live)` with an
  `ageDays` value. The 3/3 on the seed fixtures (stripe.com, linear.app in
  `convex/providers/fixtures.ts`, every value tagged `__synthetic: true`) is a
  labeled-synthetic illustration of the same shape, never presented as live.
- Then the trust beat: fire a weak account (the "*" fallback fixture, clearly synthetic):
```bash
curl -XPOST "$SITE/signal" -H 'Content-Type: application/json' \
  -d '{"source":"manual","kind":"manual","companyDomain":"acme.com"}'
```
  Acme shows the **ABSTAIN card** ("1/3 legs — not routing"). *This is the whole pitch.*

### 2:05–2:40 — ACT (non-email) + approval gate
- A routed account proposes a Slack action (status: pending). Click **Approve** — it sends.
  Demonstrate the gate **blocking** a send until a human approves (nothing auto-sends).

### 2:40–3:00 — Close
- Show the Convex dashboard rows mutating live (proves realtime).
- Close line: "We don't sell you a list. We catch the moment — live, with receipts, and we tell you when we're not sure."

## Read the board from the CLI (sanity / backup)
```bash
npx convex run queries/board:liveBoard '{}'
```
Expect (with keys set, fresh domain fired live): the live hero routes at **66 (2/3 legs:
hiring + tech)**, and acme abstains (11, 1/3). The 3/3 = 99 shape only shows for the
labeled-synthetic seeds (stripe.com / linear.app), which are tagged `__synthetic`.

Prove the legs are LIVE (not cached fixtures); both greps must be empty:
```bash
npx convex data traces  | grep '(live)'   | grep __synthetic   # must be EMPTY
npx convex data apiCache | grep __synthetic                     # must be EMPTY
```
A live leg's trace reads `... (live) → {"count":<real>}`; a degraded leg honestly
reads `(fixture(live-failed))` and a replayed cached fixture reads `(fixture(cached))`
at level warn, never `(live)`.

## What's live vs. labeled-synthetic (say this honestly)
- **Live (keys set):** the Convex pipeline, reactive board, scoring/abstention, the HTTP
  trigger, AND the data legs: hiring (PredictLeads) and tech (BuiltWith) return real
  values; funding (Crunchbase lean) returns a real value when a funding-date row exists,
  else a real `null`. Live convergence is typically **2/3 (hiring + tech) = 66**.
- **Fixture (no key, labeled `__synthetic`):** the data legs fall back to seeded fixtures;
  the seeds (stripe/linear) illustrate a 3/3 convergence shape. Never presented as live.
- **Not claimed:** no auto-publish; the approval gate blocks every external send. We never
  cache a fixture, so a fixture can never resurface mislabeled as live.

## Kill list (do NOT do)
- No auto-send. No causal-lift claims. No "watch any account live" claim (the seeded accounts are pre-verified).
- Keep `person.contact.get` / live-LinkedIn / scraping off the live path (pre-fetch only).
