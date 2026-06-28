# BEACHHEAD — 3-minute demo runbook

The discipline: build the spine deeply, demo exactly 3 beats, land ONE hero (the visible
abstention). Everything live is from demo-safe ops; slow/flaky paths are pre-fetched.

## Pre-flight (before judging)
```bash
cd horizon
npm install
npx convex dev            # deployment + codegen (already provisioned: flippant-reindeer-699)
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
Fire the real HTTP signal endpoint on camera (two windows: the app + this terminal):
```bash
SITE=$(grep NEXT_PUBLIC_CONVEX_SITE_URL .env.local | cut -d= -f2)
curl -XPOST "$SITE/signal" -H 'Content-Type: application/json' \
  -d '{"source":"manual","kind":"manual","companyDomain":"stripe.com"}'
```
On screen: a node lights up, the board populates — no refresh (Convex reactivity).

### 1:05–2:05 — HERO: converge + lineage + ABSTAIN
- Stripe converges (3/3 legs) → routes; click the card → lineage (per-leg source + score).
- Then the trust beat — fire a weak account:
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
Expect: stripe routes (99, 3/3), acme abstains (11, 1/3).

## What's live vs. labeled-synthetic (say this honestly)
- **Live:** the Convex pipeline, reactive board, scoring/abstention, the HTTP trigger.
- **Fixture (default, labeled `__synthetic`):** the data legs, until provider keys are set.
- **Not claimed:** no auto-publish; the approval gate blocks every external send.

## Kill list (do NOT do)
- No auto-send. No causal-lift claims. No "watch any account live" claim (the seeded accounts are pre-verified).
- Keep `person.contact.get` / live-LinkedIn / scraping off the live path (pre-fetch only).
