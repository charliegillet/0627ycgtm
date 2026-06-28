# STAGE5_SHARPEN.md — research + sharpen the six

Each candidate: closed-loop sentence (must not change user/metric mid-loop), cold-start, single hardest dependency, what can be mocked without invalidating the demo, smallest buyer who'd try it next week, value-proof event.

## C01 — Live deal-desk voice concierge
- **Closed loop:** AE on pricing call → *observe* the ask + competitor quote (Unsiloed) → *decide* approved terms via Moss retrieval → *act* speak grounded quote + route for human approval → *measure* deal-desk cycle time → *learn* which terms win → next pricing call. Same user (AE), same metric (cycle time) throughout. **VALID.**
- **Cold-start:** needs an approved-pricing playbook + discount matrix → seed synthetic, labeled.
- **Hardest dependency:** end-to-end voice latency for a believable on-call quote (Moss <10ms helps; LiveKit/Nova turn-taking is the risk).
- **Mockable:** the CRM/approval routing target; the competitor PDF corpus.
- **Smallest buyer next week:** a 5-rep B2B SaaS sales team selling a usage-priced product.
- **Value-proof event:** an approved quote is issued during the call (timestamp vs. call start).

## C02 — Voice activation concierge
- **Closed loop:** stalled onboarding user → *observe* event stream vs value path (Moss) → *decide* stall detected → *act* voice guide + synchronized UI highlight → *measure* activation event fires → *learn* which interventions convert → next stalled user. Same user (onboarding user), same metric (activation). **VALID.**
- **Cold-start:** needs a value-path definition per persona → seed for one demo product.
- **Hardest dependency:** LiveKit frontend tool-forwarding driving the real app UI in sync with voice.
- **Mockable:** the "product" being onboarded (build a believable seeded demo app).
- **Smallest buyer next week:** a seed-stage PLG tool with <40% activation.
- **Value-proof event:** the user fires the activation/aha event during or right after the call.

## C03 — Honest voice ad-qualifier
- **Closed loop:** ad click → *observe* answers to 3 disqualifying Qs + CRM check → *decide* fit score vs ICP (Moss) → *act* honestly disqualify+refer OR book meeting (human gate) → *measure* cost-per-qualified-meeting → *learn* refine ICP → next click. Same user (demand-gen team), same metric (CPQM). **VALID.**
- **Cold-start:** ICP definition + alt/competitor referral list → seed.
- **Hardest dependency:** sub-second voice at first contact (cold visitor won't wait).
- **Mockable:** the ad platform + CRM lookup; use a seeded ICP.
- **Smallest buyer next week:** a B2B SaaS running paid search with a narrow ICP.
- **Value-proof event:** a qualified meeting booked (or an honest disqualification logged) per click.

## C04 — Evidence-backed CRM write-back
- **Closed loop:** call ends → *observe* transcript→MEDDIC (Moss) → *decide* field values+confidence → *act* write-back w/ diff + 1-click confirm → *measure* manual minutes eliminated → *learn* from corrections → next call. Same user (AE/RevOps), same metric (minutes eliminated). **VALID.**
- **Cold-start:** MEDDIC field definitions + past-deal notes → seed.
- **Hardest dependency:** mapping free-form speech to the right CRM fields with shown source quotes (accuracy, not latency).
- **Mockable:** the CRM (mock writeback target) + Slack ping.
- **Smallest buyer next week:** a 5–20 rep team on Salesforce/HubSpot drowning in CRM hygiene.
- **Value-proof event:** confirmed CRM fields written with source quotes attached.

## C05 — Price-objection reframe co-pilot
- **Closed loop:** price objection on call → *observe* competitor quote (Unsiloed) + similar won deals (Moss) → *decide* best reframe (not discount) → *act* surface reframe to rep <5s → *measure* win rate on price-objection deals → *learn* which reframes win → next objection. Same user (AE), same metric (win rate). **VALID** but NARRATION RISK noted.
- **Cold-start:** corpus of won deals tagged with the reframe that worked → seed, labeled.
- **Hardest dependency:** externalizing the earpiece value on screen (demo) + retrieval relevance.
- **Mockable:** the CRM; the won-deal corpus is seeded.
- **Smallest buyer next week:** a sales team losing deals on price with no battlecard discipline.
- **Value-proof event:** reframe used → deal advances without a discount (tracked).

## C06 — Churn-drift CSM voice alert
- **Closed loop:** support-language drift → *observe* tickets/chat vs churned-pattern (Moss) → *decide* drift severity → *act* voice-call the CSM w/ quotes + book QBR (human confirm) → *measure* churn-prediction lead time → *learn* refine drift → next account. Same user (CSM), same metric (lead time). **VALID** but FAKE-PROOF RISK noted.
- **Cold-start:** labeled corpus of churned vs retained account language → seed; MUST include a holdout retained account that does NOT trigger.
- **Hardest dependency:** a drift signal that generalizes (not hand-tuned to fire on one demo account).
- **Mockable:** the support tooling + calendar; the corpus is seeded but must be structurally realistic.
- **Smallest buyer next week:** a CS team with <90% GRR and lagging health scores.
- **Value-proof event:** alert fires N days before the lagging health score would have.

All six complete the closed-loop sentence without changing user or metric → none eliminated at Stage 5.
