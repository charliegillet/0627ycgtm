# Proofloop (C13) — 3-minute demo: the 3 features to build & show

Principle: build the SPINE deeply (capture → proof unit → provenance → attribution); demo exactly 3 beats; land ONE hero (the provenance click). Two surfaces actually publish (ad + social); everything else is generated preview.

## Feature 1 — Live Proof Capture  (0:00–1:00)
**What it does:** the agent listens to a real (seeded, labeled) customer call and extracts a *proof unit* in real time — the quote, the source, a timestamp, a confidence score, and a consent flag.
**On screen:** a call is playing; a "Proof Unit" card materializes: > "We cut onboarding from 3 weeks to 2 days." — Source: Acme call, 02:14 · Confidence 0.93 · Consent ✓
**Proves tracks:** Reading Minds (signal detection from conversation).
**Build vs mock:** BUILD — LiveKit/Nova capture + extraction + Moss index of the unit. This is the core; do not mock it.
**FAKE-PROOF guard:** the clip is a genuinely captured moment from the seeded call, not authored to fit.

## Feature 2 — Deploy with Receipts  (1:00–2:15)  ← HERO
**What it does:** one click turns the SAME proof unit into a provenance-backed ad + a social post, each carrying a "see the source" badge.
**On screen:** ad creative + LinkedIn post render side by side, both stamped to the same source. Then the hero beat:
**THE HERO (≈1:45):** click the ad's provenance badge → it **plays the exact 4-second customer clip** and shows confidence 0.93. "Every asset has receipts. The slop your competitors ship has none."
**Proves tracks:** Ad Factories (provenance-backed ad = the trust wedge) + Algorithm Hacking (social formatted for ranking/AI-citation).
**Build vs mock:** BUILD the ad + social generation from the unit + the click-to-source playback (the hero). The other 3 surfaces (outbound, onboarding nudge, rep battlecard) render as fast generated previews — shown for 5 seconds, not interacted with.
**Human gate:** show the "Approve before publish" control (nothing auto-publishes).

## Feature 3 — Proof-to-Revenue Attribution  (2:15–3:00)
**What it does:** shows the same proof unit attributed across channels, against the anti-vanity metric.
**On screen:** "This proof unit → $X pipeline across 3 channels; converts best in [segment]." Retire/double-down toggle visible (the learn step).
**Proves tracks:** Revenue Autopilot + Reading Minds analytics (closes observe→act→**measure**→learn).
**Build vs mock:** BUILD the attribution view over the demo's tracked events; LABEL the numbers as demo/synthetic; make NO causal-lift claim.
**Close line:** "Stop shipping AI slop nobody trusts. Run your GTM on receipts — and see which truth makes money."

## 3-minute runsheet
| Time | Beat | Visible state change |
|---|---|---|
| 0:00–0:20 | Frame the problem (AI slop, no trust) | — |
| 0:20–1:00 | F1 capture | Proof Unit card appears w/ confidence + consent |
| 1:00–1:45 | F2 deploy | Ad + social render from one unit |
| 1:45–2:00 | **HERO** | Click badge → exact source clip plays @0.93 |
| 2:00–2:15 | F2 breadth | 3 more surfaces flash as previews + approval gate |
| 2:15–2:55 | F3 attribution | "$X across 3 channels", segment, double-down toggle |
| 2:55–3:00 | Close line | — |

## What is deliberately NOT in the demo (kill list)
- Live outbound sending, real onboarding instrumentation, real rep call (previews only).
- Arbitrary/judge-supplied calls (use the seeded labeled set — kills FAKE-PROOF).
- The compounding cross-customer attribution graph (mention as roadmap; don't claim it live).
- Any auto-publish without the approval gate.

## Track coverage from just 3 features
Reading Minds (F1+F3) · Ad Factories (F2) · Algorithm Hacking (F2) · Revenue Autopilot (F3) · + Zero-to-One/Sales-Cyborgs shown as F2 previews. Spine = one artifact, one buyer, one metric.
