# Research Brief - Decisive Synthesis for Idea Selection

> The single most important doc. Distills all 18 dossiers + the trends scan + ground
> truth into the insights that should drive idea selection, plus the evaluation
> rubric and a seed bank of candidate ideas for the debate team. Read this first;
> drill into `docs/research/{judges,sponsors,topics}/*.md` for depth.

---

## 1. The objective function (how we score every idea)

**Expected value = 0.70 × P(top-3 prize) + 0.20 × P(Convex track) + 0.10 × (genuine usefulness - a tool Charlie / a real GTM operator would actually use and keep).**

> **Team decision: RocketRide is NOT used in this project in any way.** The
> `topics/rocketride-context.md` dossier is retained only as background research and does
> NOT factor into the objective or any idea. The 10% bucket is generic genuine-usefulness
> (would a real GTM operator - or you - run this Monday and keep it), not RocketRide.

These overlap: the best ideas are realtime + agentic + signal-driven, which *simultaneously*
score the main rubric, naturally exercise Convex, and are a tool a real GTM operator would want.

**Main-prize rubric (authoritative, in order):** (1) **Usefulness** in a Growth/GTM/RevOps
context, (2) **Technical Complexity**, (3) **Coolness**. Win condition = a **working demo +
3-min video**, slides discouraged. **Bonus stakes:** the overall winner is eligible for a
**YC Fall 2026 interview** - this is a real reason to optimize hard for #1 overall, not just
top-3.

---

## 2. The five decisive findings (these should shape everything)

1. **Do NOT build a generic AI SDR / mass-outbound tool.** The category is saturated AND in
   open backlash: "death of the outbound SDR," reply rates ~38% lower at 6.4x volume, 60%+
   decay in 18 months, deliverability collapse. 11x has churn/ARR scandals; "reads like
   generic AI" is the common complaint. Growth-world judges are *skeptical* here. A "we
   replace SDRs" pitch reads as a me-too and will lose.

2. **The whole event is one frame: pick ONE custom signal and wire DETECT → ENRICH → SCORE
   → ACT.** This is Lopus's slide, Vincent's Chat GTM, Vihaar's GTM Claw, OpenAI's Clay case
   study - all the same loop. The repeated thesis: **"the higher-leverage signals are custom,
   not bought."** A winning demo visibly runs all four stages on a live, non-bought signal.

3. **The white space is SCORE + ACT glue, not DETECT.** Everyone sells signals; teams drown
   in them (~20 hrs/wk reconciling). Underbuilt: prioritization + last-mile execution with a
   human-in-loop, post-sale/expansion/churn, real-time re-verification at moment-of-action,
   relationship/multithread graphs, win/loss→ICP loops, and AEO ("what does ChatGPT say about
   us"). Saturated/avoid: AI-SDR replacement, generic "Clay clone," visitor de-anon, cold-email
   volume, all-in-one outbound suites.

4. **Signal choice has hard data behind it (bloomberry, 1M purchases).** Strongest predictive
   lift: **bought an adjacent enterprise AI tool (+46%)**, **headcount up 20%+ (+38%)**,
   **recent software purchase <6mo (+38%)**, VP hire (+28%), funding (+25%). The "sexy"
   signals everyone uses (job postings +7%, SOC ~0%) are *weak*. **A clever, high-lift,
   hard-to-buy signal is a differentiator the judges will immediately respect.** Signal
   *stacking* (3+ signals → 2.4x conversion) is the strongest technical-depth story.

5. **Demo craft decides finalists.** Judges are time-starved pattern-matchers. Rules that
   recur: write the 90-sec script before code; cold-open on the wow in the first minute; **use
   REAL data the judge recognizes** (ideally make the judge/their company the protagonist);
   show old-way-vs-new-way; make the hard part *visible and live*; speed is a feature;
   hardcode the happy path + prepare fallbacks; submit early; name it memorably. "Same project
   different label" is death.

---

## 3. The judges - design directly for these three

**Vihaar Nandigala (Orange Slice, HOST, YC S25).** Sold a company at 19, ex-JPM. Loud,
contrarian. Beliefs: *"GTM = signal + timing + thinking,"* *"the biggest lever isn't what
you say, it's who you say it to,"* **custom > bought signals** (his "four-fingered VP of
sales" line), **outbound/cold email is dead → attention is the bottleneck → friction creates
value** (the $0.02 Venmo pitch), and the future is **"code-based subagent orchestration"** (not
no-code, not one big autonomous agent). He ships GTM tools on Claude Code himself ("GTM Claw").
**Loves:** one weird custom signal wired end-to-end on real data, closing the loop to ACT,
deterministic code orchestrating scoped LLM subagents, leverage tied to a number, edgy/scrappy
virality. **Hates:** Clay clones, no-code builders, cold-email generators, dashboards with no
action, faked demos.

**Vincent (Cursor, founding growth team, CONFIRMED JUDGE).** Demoed **Chat GTM**: type an
account → segment, one-liner, **product footprint (PLG usage)**, **org chart of
decision-makers**, enrichment, "why now" signals - built on the Cursor SDK, wired to
Databricks + Salesforce, **usable by non-engineers**. **Loves:** real internal-tool energy a
growth team runs Monday; agent-native/programmatic (parallel agents, subagents, automations);
**two live data sources** (a product/usage source + a CRM/people source); org/decision-maker
mapping + prioritization; non-engineer-friendly UX. Cursor is brutally PLG/lean.

**Danylo Borodchuk ("Dan Low," Lopus, CONFIRMED JUDGE, also a co-host).** Dartmouth CS dropout,
ex-DALI/DARPA-adjacent - **data-engineering taste**. Lopus = self-healing **semantic layer**,
governed definitions, **"the most dangerous tool is one that always answers"** → refuse rather
than hallucinate, show your work (lineage). Owns DETECT→ENRICH→SCORE→ACT. Named a stack on
stage: **dltHub → Postgres+DuckDB → Trigger.dev → Mastra/AI SDK → Slack/Gmail/React.**
**Loves:** a genuinely custom signal requiring real detection work, trustworthy joins,
explainable LLM scoring (with reasons + abstention), fully-automated action, fast+polished.
**Hates:** thin wrappers over bought intent, dashboards with no ACT, confident-but-wrong demos.
(Note: **Corgi is a Lopus customer** - ecosystem resonance.)

**Apoorv Jha (OpenAI) - mentor, not a scoring judge.** Use Codex + OpenAI-native primitives
(Agents SDK handoffs/guardrails, Responses API, **structured outputs** for SCORE, Realtime
voice for a flashy ACT) for goodwill and depth. OpenAI's own GTM uses Clay (40%→80%
enrichment) - a public blueprint. Pull him aside early.

---

## 3.5 Judge Q&A (dinner fireside) - decisive fresh signal

Both confirmed judges did a dinner Q&A (`docs/cursor-lopus-qa-transcript.md`). This is the
sharpest read we have on their taste and it shifts idea selection:

1. **Narrow to ONE of Vincent's four buckets - discover / acquire / research / enable - and ONE
   persona.** "Pick one and go deep." ChatGTM was for SDRs, not AEs.
2. **Cold email is dead to them (literally ~1% reply).** The live edges they are excited about:
   IRL / events / in-person, consumer channels for B2B (Instagram, texting, NFL-style creative),
   and "surround-sounding past-no customers" from call-transcript reasons x shipped-feature
   deltas. Build away from email volume, toward these.
3. **Retention is underbuilt and judge-endorsed:** FEATURE DISCOVERY (show a user the features
   that solve THEIR job) + PERSONALIZED LIFECYCLE (Vincent: "not yet personalized, you can get
   there") + the 2-SECOND RESPONSE agent (Danylo's own "Hermes" hack). Any of these is a fresh,
   "I'd use this Monday" idea that the original top-10 underweighted.
4. **Danylo's company-brain / context-engineering thesis:** the real problem is teaching agents
   which company data matters (Obsidian-style nested, linked metrics). A build here is his
   bullseye and very technical.
5. **Signals = information asymmetry; PLG = strategic chips.** Custom > bought, restated.
6. **DEMO-CRAFT INSTRUCTION (explicit, from the judges):** go talk to a REAL operator in an
   unfamiliar industry in person, ask "how do you find customers, can I build you a pipeline,"
   build for them, and RECORD it in the submission. This is the single most judge-endorsed demo
   move available - and it is exactly how Charlie's passion domains (running / music / NBA)
   become top-tier: talk to a real run-club organizer / indie musician / merch seller on camera
   and build them a real GTM pipeline.

Net: the Q&A boosts (a) retention / feature-discovery / 2s-response, (b) a company-brain context
layer, (c) surround-sound-past-no's, and (d) a passion-domain build IF framed as "I talked to a
real operator and built them a pipeline, on camera." It further sinks anything email-outbound.

## 4. The toolbelt (what we actually build with)

- **Convex** (free + $1k/$500 track): reactive realtime DB, **Components** (Agent, Workpool,
  Persistent Text Streaming, AutoSend, Agentmail, Exa), durable workflows, cron, HTTP actions.
  The realtime layer doubles as "coolness." Fork the **SignalBoard** template (convex.link/growthdemo).
- **Fiber AI** ($500, biggest pool): the ENRICH/DETECT data layer. Magical endpoints nobody
  else has - **reverseEmailLookup** (email→full person), **multiSourceSearch** (LinkedIn+Google
  Maps+web; SMB goldmine), **profileLiveEnrich** (real-time LinkedIn, 2-4s), **52 tracker rules
  + job.changed webhook** (a ready DETECT layer), KitchenSink resolver. **MCP** (V2/V3/Core;
  `call_operation` lets an agent discover+call any endpoint at runtime). **OpenFiber** = MIT
  Next.js app to fork as a head start.
- **Orange Slice** ($50/50k credits): `npx orangeslice@latest` - every enrichment provider
  under one key, code-first. Using the host's own tool well earns points.
- **OpenAI/Codex** ($50 + prize credits): Codex to ship fast; Agents SDK, structured outputs,
  Realtime voice, computer use.
- **Cursor** ($50 + $500 to 1st): Cursor 3, **`@cursor/sdk`** (subagents/cloud VMs/MCP),
  cloud agents, automations, Composer. Using the SDK as a runtime component is an on-brand flex.
- *(RocketRide is intentionally excluded from this project per the team's decision - do not build on it.)*
- **Lopus stack** (if chasing max Danilo points): dltHub / pg_duckdb / Trigger.dev / Mastra+AI SDK.

---

## 5. Strategic constraints distilled (the box the winning idea lives in)

- ONE custom, high-lift, hard-to-buy signal - wired DETECT→ENRICH→SCORE→ACT, **end to end,
  live on real data**, with a **visible ACT** (real email/Slack/CRM write/phone call).
- **Explainable scoring** (reasons + abstention) - flatters Danilo, signals technical honesty.
- **Realtime on Convex** (the wow + the $1k) unless a hard conflict.
- **Two live data sources** minimum (product/usage + people/CRM) - flatters Vincent.
- **Non-engineer-usable UX** + a memorable name + a single early wow moment.
- **Make a judge/sponsor the protagonist** of the demo if possible (huge wow, zero toy-data smell).
- Avoid: AI-SDR replacement, Clay clone, dashboard-with-no-action, faked demo, overscope.

---

## 6. Candidate idea seed bank (raw material for the debate)

Distilled and deduped from every dossier's "idea hooks." The debate refines/ranks these and
may invent better ones.

A. **Custom-Signal Compiler** - describe a weird signal in English → agent writes the detector
   (Exa/OpenFunnel/Fiber + LLM extraction) → enriches → scores → drafts the act. The literal
   sponsor frame, generalized; deep (entity resolution + agent codegen). (Vihaar/Danilo bullseye.)
B. **Signal Triage Inbox / War Room** - reactive Convex board ingesting N signal sources,
   dedupes, **scores/prioritizes**, proposes ONE next action per account w/ one-click approve.
   Solves the "20 hrs/wk reconciling" pain; Convex realtime = the wow.
C. **"Chat GTM" open clone** - type an account → segment, one-liner, **PLG product footprint**,
   **org chart of decision-makers**, enrichment, "why now." Literally Vincent's demo; 2 live
   sources (PostHog/usage + Fiber/CRM).
D. **Dev Buying Radar (GitHub)** - detect devs/orgs opening migration/integration issues, forks,
   or adopting a competitor → resolve to company/contact (Fiber) → dev-to-dev outreach quoting
   the exact issue. Custom, technical, demo-able as a live globe/feed.
E. **Displacement Radar** - tech-stack *removal* (who just dropped a competitor) → win-back
   play. Novel data layer (the abandonment signal most tools can't see).
F. **"Cluely if it worked" (honest edition)** - live-call copilot: moment-detection (objection/
   competitor/pricing) → account-grounded card in <1s → auto-CRM + follow-up draft. High coolness.
G. **Churn/Expansion Radar** - post-sale agent over usage + tickets + sentiment → health/renewal-
   risk + upsell-whitespace plays before the cancel email. Underbuilt, RevOps-credible.
H. **AEO Monitor** - track how ChatGPT/LLMs describe your product vs competitors over time,
   detect drift, auto-draft the fix. Novel, cool, on a 2026 trend list.
I. **"Just-raised" radar (Corgi's own motion)** - funding event → enrich (stage/headcount/vertical/
   existing coverage) → score fit+urgency → personalized outbound + instant-quote link. Direct hit
   on Corgi; generalizes to any "risk/timing event → pipeline."
J. **Adjacent-AI-tool-adoption detector** - the **+46% lift** signal: detect a company adopting an
   adjacent enterprise AI tool (job posts/changelogs/integrations/GitHub deps) → enrich → score →
   act. Data-backed signal choice = instant respect.
K. **Reverse-email "who just hit my site/waitlist" engine** - inbound emails/form-fills/Stripe →
   Fiber reverseEmailLookup → live enrich → ICP score → route hot leads. The reverse-email move is
   "nobody else has it" and demos instantly.
L. **Signal-strength backtester** - given closed-won/lost accounts, score which custom signals
   actually predicted purchase (mirrors bloomberry). Meta, rigorous, very Danilo.
M. **Relationship-graph multithreader** - living stakeholder graph from emails/calendar/news →
   warm-intro path → drafted intro asks. Centralize is the only player; very technical.
N. **MCP-native GTM toolbelt** - expose detect/enrich/score/act as MCP tools so a coding agent
   builds a custom play in chat. Maximally aligned to OpenAI/Cursor + "GTM engineering" theme.
O. **First-Reply Bot** - Reddit/X "switching from [competitor]" detector racing the 1-3h reply
   window → drafts a genuinely helpful (non-salesy) reply. Visceral live demo; basically Lopus-in-a-box.
P. **Win/Loss → ICP feedback loop** - ingest call recordings + outcomes, cluster *why* deals are
   won/lost, and auto-rewrite the ICP + messaging (Octave-style). Closes the loop nobody closes; a
   tool a real GTM team keeps using (high genuine-usefulness).

**Cross-cutting wins:** B/C/I/J on **Convex** (realtime board) chase the $1k too; "make the judge
the protagonist" upgrades C/I/K/J; the genuine-usefulness bucket favors tools a real GTM team keeps
(B, G, L, P). Signal *stacking* (L's rigor + B's fusion) is the strongest technical-complexity story.

### User-submitted ideas (Charlie's own - the team MUST evaluate both seriously, with honest pushback)

Q. **Marathoner Outreach (running)** - AI calling/emailing runners about running shoes/gear. Custom
   signal candidates: race registration/finish (marathon results, Strava activity), or **"shoe mileage
   ~300-500 mi → due for replacement."** DETECT (race results / Strava / registration) → ENRICH
   (contact, pace/PR, current shoe, goal race) → SCORE (replacement-due + product fit) → ACT (AI voice
   call / personalized email). Mostly **B2C/DTC**; strongest B2B-GTM reframe = a signal-based outreach
   engine **sold to running-shoe brands & DTC sports retailers.** Charlie's passion → high genuine-use.
R. **Concert / Music outreach (music)** - Charlie plays piano + viola. (R1) AI calling/emailing
   **Spotify listeners about concerts by artists they stream**, and the inverse (help an artist/venue
   reach their **local listeners** about a show). Signal = artist tour-date in a city × that artist's
   local listeners → SCORE superfan/proximity → ACT (notify fan / notify artist of reachable fans).
   An **AI-native Bandsintown** for artists/promoters/venues. (R2) **Sheet-music finder** - help people
   find sheet music for songs they like; B2C utility, weaker GTM-theme fit, strongest reframe =
   lead-gen for sheet-music sellers / music-lesson marketplaces. Charlie's passion (high genuine-use).
S. **NBA / sports-fan merch outreach (sports)** - auto outreach selling NBA team fans jerseys, shoes,
   and merch. Event signals: a team clinches a playoff berth or wins a big game, a star is traded to or
   from a team, a breakout performance, or a new jersey drop. DETECT (game outcomes, trades, player
   news, social/ticket engagement) -> ENRICH (fan's team/player, location, size/preferences) -> SCORE
   (purchase propensity at the emotional peak) -> ACT (timely AI call/email/DM, e.g. "your team just
   clinched, grab the conference-finals tee"). B2C/DTC; strongest B2B-GTM reframe is an event-triggered
   outreach engine sold to sports-merch retailers, teams, and Fanatics-class sellers. High coolness
   (event-timed). Charlie's interest (high genuine-use).

> Honest framing for the debate: Q, R, and S all lean **B2C**, while the event/judges lean
> **B2B-GTM/RevOps**. Weigh theme-fit honestly in the 70% term, but find the framing where each is most
> competitive (often a B2B reframe: sell the outreach engine to the brands/teams/labels). Note they
> share one shape: a real-world EVENT signal (race, tour date, game/trade) -> match to the right
> enthusiast -> timely, personalized AI outreach for a product. The team should consider whether a
> single generalized "event-to-enthusiast outreach engine" beats three separate verticals. Credit their
> high score on the 10% genuine-usefulness term (they are Charlie's actual passions).

---

## 7. What the debate must decide

Rank the **top 10** by EV (70/20/10), each with: the custom signal, the full
DETECT→ENRICH→SCORE→ACT, the stack (incl. Convex angle), the single demo wow moment, which
judges it targets, the honest 21-hour scope for 2 elite builders, the risks, and why it wins.
Kill anything that is a me-too, can't demo live, or can't be finished and polished in time.
