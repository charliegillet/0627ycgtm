# AI-for-GTM Company Landscape - Inspiration & Differentiation Map

Research for the AI Growth Hackathon (Orange Slice / YC Growth Hackathon, June 27-28, 2026).
Purpose: mine the AI-GTM space for winning ideas AND avoid building a me-too. Judging order:
(1) Usefulness in Growth/GTM/RevOps, (2) Technical complexity, (3) Coolness.

The sponsor frame to honor: **pick ONE custom signal -> DETECT -> ENRICH -> SCORE -> ACT.**
The repeated thesis: **"the higher-leverage signals are custom, not bought."** Lopus is a judge
(Danylo Borodchuk), so the demo should visibly speak this language.

---

## The market in one paragraph

GTM tooling has collapsed into a **layer cake**: (1) a **data/enrichment** layer (Clay, Apollo,
Persana, Exa), (2) a **signal detection** layer (Common Room, Koala, RB2B, Unify, OpenFunnel),
(3) a **scoring/orchestration** layer (Default, Pocus, Warmly, Unify Plays), and (4) an
**execution / AI-SDR** layer (11x, Artisan, Cardinal, Fiber). The money and the hype have piled
into layers 1 and 4. The **scoring + orchestration + last-mile execution glue** is where teams
report the most pain ("up to 20 hrs/week reconciling data between platforms"). That gap is the
opening for a hackathon project that is *useful* and *technically interesting*, not another AI-SDR.

---

## Player-by-player: what they do + their wedge

| Company | One-liner | Wedge / differentiator |
|---|---|---|
| **Clay** | No-code enrichment + workflow "spreadsheet" joining 150+ data providers with AI web research | The orchestration substrate everyone else compares to; waterfall enrichment + "Claygent" AI research. Weak at *execution* (it enriches, you still act elsewhere). |
| **Apollo** | All-in-one DB (210M+ contacts) + sequencing + analytics | Breadth + price. But data quality is the knock: in one test only ~37% of provided emails were valid. Copilot *recommends*, doesn't *execute*. |
| **Persana** | Clay-like enrichment + autonomous SDR agent "Nia"; 100+ sources, 75+ intent signals | Waterfall enrichment quality + agent execution in one. Positions explicitly vs Apollo on data quality. |
| **Unify** | "Warm outbound" platform: aggregates 10+ intent sources (6sense, Bombora, G2, Clearbit) into automated **Plays** | Signal -> Play -> multichannel sequence in one loop. Growth plan ~$700/mo, $8.4k upfront. Perplexity case: $1.7M pipeline in 3 mo. |
| **Default** | Inbound: forms + qualification + scheduling + routing + enrichment in one | Owns the **inbound last mile** (the "speed-to-lead" moment). Raised $20M; pushing "agentic GTM orchestration." |
| **11x** | "Digital workers" Alice (SDR) + Jordan (voice/phone), full autonomous outbound | Full-replacement narrative. **Cautionary tale**: a16z/Benchmark-backed, but public allegations of inflated ARR + 70-80% churn; reviews say output "reads like generic AI." |
| **Artisan** | AI BDR "Ava" for email + LinkedIn | Aggressive "stop hiring humans" branding. Same AI-SDR category fatigue as 11x. |
| **Octave** | "Agentic GTM brain": turns positioning + ICP into messaging, sequences, battlecards | Upstream **messaging-consistency / context engine** bet: one positioning input, all artifacts in sync. Different wedge than data tools. |
| **Common Room** | Person-level signal capture across product, GitHub, LinkedIn, community + CRM | **Person360** identity resolution; deanonymizes + matches signals to a unified person. Strong on *capture breadth*, frontline-seller view. |
| **Koala** | PQL / product-intent surfacing for PLG, Slack-native triage | Best-in-class at *surfacing* product-qualified accounts; admittedly weak at *powering playbooks* on that data. |
| **Pocus** | Product-led sales (PLS) workflows: free-to-paid, dormant reactivation, cross-sell | Templated recurring **plays** on top of product signals. |
| **Warmly** | Real-time website visitor ID + AI orchestration + live prospecting | Visitor-ID -> instant orchestration (incl. Slack/chat) angle. |
| **RB2B** | Person-level website **de-anonymization** (US visitors, LinkedIn + firmographics) | Free tier, viral founder-led growth. JS pixel + Demandbase reverse-IP + identity network; claims 70-80% ID rate, US-only person-level (GDPR limits). |
| **OpenFunnel** (YC F24) | "Headless primitives for GTM": agent-ready REST + **MCP** to detect accounts/people from custom NL signals | The most *builder-native* and most aligned to the hackathon frame. Monitors your TAM, fires on custom triggers like "companies that moved from OpenAI to self-hosted in last 3-6 mo." Exposes everything via MCP for coding agents. |
| **Exa** | Neural/embeddings web search API + **Websets** (NL ICP -> verified lead list) | Semantic search over tens of billions of pages, minute-level refresh, Rust + custom vector DB. A *primitive* you can build on, not a full app. Generous free tier (1k req/mo). |
| **Cardinal** (YC W26) | "Precision outbound" replacing 10+ GTM tools, runs outbound for 40+ YC W26 cos | Distribution moat (YC-to-YC). Full motion: ICP -> discover -> signals -> personalize -> sequence. |
| **Centralize** | Relationship intelligence: living stakeholder graph for complex deals, agent "Centra" auto-multithreads | **Post-pipeline / deal-execution** wedge: emails + calendar + 10-Ks + news -> relationship graph + warm-intro paths. Founders ex-Facebook Shops / ex-Slack Huddles. |
| **Fiber AI** (YC S23) | Automated SDR/BDR prospecting + **deliverability/domain health** + data APIs | Wedge is the unsexy-but-critical **deliverability** layer (DNS, warmup, send orchestration, spam evasion) claiming 80% open rates. Sells "freshest data APIs." |
| **Lopus** (YC W25, JUDGE) | Agentic **semantic layer** for GTM analytics: joins CRM + marketing + billing + product, explainable answers with lineage; also social buying-intent | Their thesis = the semantic layer is the missing GTM architecture, and *custom* signals beat bought ones. Speak this language in the demo. |
| **Corgi** (sponsor) | AI-native full-stack **insurance carrier** for startups (D&O, cyber, GL, AI liability) | Not a GTM tool. Sponsor flavor only; an AI-underwriting demo could nod to them. |
| **agent.ai** (Dharmesh Shah) | Marketplace/network of 350+ AI agents, low-code builder, 1 credit/task | Distribution surface for agents; "Company Research Agent" is the canonical GTM example. |
| **Cluely** | Real-time, invisible on-screen copilot for calls/interviews ("Cheat on Everything") | Overlay via low-level GPU hooks (invisible to Zoom/Meet screen-share) + OCR + mic -> LLM suggestions. **The deck joked "Cluely if it worked"** - see below. |

---

## What's SATURATED (differentiate or avoid)

- **Autonomous "AI SDR" full-replacement** (11x, Artisan, Cardinal, plus dozens). Heavy churn,
  reply-rate decline (6.8% in 2023 -> ~5.8% in 2024), refund stories, "generic AI" complaints.
  Judges from the growth world are *skeptical* of this category. Avoid pitching "we replace SDRs."
- **Generic enrichment / "Clay alternative."** Crowded; Clay is the substrate. Don't rebuild Clay.
- **Website visitor de-anonymization** (RB2B, Warmly, Vector, Koala). Mature, commoditizing,
  privacy-fraught. Only interesting as an *input* to something smarter.
- **Cold-email volume tools.** Deliverability is now a tax, not a moat; inbox saturation is real.
- **Yet another all-in-one outbound suite.** Cardinal/Unify/Apollo already collapsed the stack.

## What's genuinely UNDERBUILT (where agents unlock something new)

1. **The SCORE + ACT glue, not DETECT.** Everyone sells signals; teams drown in them and reconcile
   data by hand (~20 hrs/wk). An agent that *prioritizes* signals and *executes a specific play*
   with a human-in-the-loop approval step is the real pain.
2. **Custom signal authoring in natural language.** OpenFunnel and Lopus point here but it's early.
   "Describe a weird signal in English -> agent builds the detector -> scores -> drafts the action."
   This is *exactly* the sponsor frame and is technically meaty (web search + NLP + entity resolution).
3. **Stale-data at the last mile.** Industry avg refresh is ~6 weeks; signal fires, contact data is
   already wrong. Real-time re-verification at moment-of-action is underserved.
4. **Post-sale / expansion / churn signals.** Almost all tooling is top-of-funnel. Health scoring,
   renewal-risk, and expansion-whitespace agents are comparatively empty and high-value.
5. **Relationship / multithreading intelligence** (Centralize is early and alone). Deal-execution
   graphs, warm-intro pathing, champion-tracking.
6. **Win/loss + message-market-fit feedback loops.** Closing the loop from outcomes back into
   ICP + messaging is mostly manual.
7. **"What does ChatGPT/LLMs say about your product"** as a GTM KPI (Kyle Poyar prediction). AEO/
   "answer engine optimization" monitoring is nascent and *very* on-theme/cool.

---

## "Cluely if it worked" - what would actually make a real-time sales copilot good

Cluely's real product gaps (independently reported): **latency** (claims ~300ms, tested 5-10s under
pressure), shallow context (OCR + transcript only, no CRM/account memory), and a creepy/"cheating"
positioning. To make it *good* and *defensible*:

- **Sub-second, signal-triggered surfacing.** Don't stream constant suggestions; detect the *moment*
  (objection, competitor mention, pricing question) and push ONE precise card in <1s. Guidance at
  3s after an objection is worthless.
- **Grounded in the account, not just the words.** Pre-load CRM + Common-Room-style signals + the
  prospect's recent activity so the copilot answers "what does THIS buyer care about," not generic.
- **Battlecards from real win/loss**, not the marketing site. Tie suggestions to what actually closed.
- **Post-call -> pipeline action, automatically.** Update CRM, draft the follow-up referencing the
  exact objection, set the next play. The "ACT" half is where Cluely stops and value begins.
- **Honest framing**: "real-time coach + auto-CRM," not "cheat." Judges and buyers reward this.

A hackathon version: live transcript -> objection/competitor *detector* -> RAG over a battlecard +
account dossier -> one timed suggestion card + auto-drafted follow-up. That's DETECT->ENRICH->
SCORE->ACT applied to a *live call signal* - squarely on-theme and demo-friendly in 3 minutes.

## Convex-track note

Convex (real-time reactive DB + functions) is a natural fit for **live signal pipelines**: signals
stream in, reactive queries recompute scores, the UI updates instantly, and scheduled/cron functions
poll sources. A "live signal -> score -> act" board built on Convex hits both the main theme and the
$1000 Convex prize with one build.

---

## Idea hooks for the hackathon

1. **Custom-Signal Compiler.** Type a weird signal in English ("companies that just deprecated a
   competitor in their changelog"); an agent writes the detector (Exa/OpenFunnel search + LLM
   extraction), enriches the entity, scores fit, and drafts the outreach. The literal sponsor frame,
   end to end, with real technical depth (entity resolution + agent codegen).
2. **Signal Triage Inbox.** Not more signals - a reactive board (Convex) that ingests N signal
   sources, dedupes, *scores/prioritizes*, and proposes ONE next action per account with one-click
   approve. Solves the "20 hrs/wk reconciling" pain. Hits Convex + usefulness.
3. **"Cluely if it worked" honest edition.** Live-call copilot: moment-detection -> account-grounded
   card in <1s -> auto-CRM + follow-up draft. Demos beautifully in a 3-min video.
4. **Churn/Expansion Radar.** Post-sale agent: watch product usage + tickets + sentiment, score
   account health, fire renewal-risk and upsell-whitespace plays before the cancel email. Underbuilt,
   high-value, RevOps-credible.
5. **AEO Monitor ("what does ChatGPT say about us").** Track how LLMs describe your product vs
   competitors over time, detect drift, and auto-draft the content/PR to fix it. On Kyle Poyar's 2026
   prediction list; cool + novel + technically real (multi-model probing + diffing).
6. **Relationship-Graph Multithreader.** Build a living stakeholder graph from emails/calendar/news
   for one deal, find the warm-intro path, and auto-draft the intro asks. Centralize is the only real
   player; very technical (graph + identity resolution).
7. **Win/Loss -> ICP feedback loop.** Ingest call recordings + outcomes, cluster why deals are won/
   lost, and *automatically rewrite* the ICP and messaging (Octave-style) - closing the loop nobody
   closes.
8. **Real-time data re-verifier.** At moment-of-send, re-verify the contact (still there? title
   changed? email valid?) via live search before any action fires. Attacks the 6-week-stale-data
   failure mode; pairs with any of the above.
9. **MCP-native GTM toolbelt.** Expose detect/enrich/score/act as MCP tools (à la OpenFunnel) so a
   coding agent (Cursor/Codex) can *build a custom play in chat*. Maximally aligned to OpenAI/Cursor
   sponsors and the "GTM engineering" theme.
10. **Founder-led-sales copilot.** Cardinal's market (early-stage, no RevOps) but as a single agent
    that picks one custom signal, finds 20 warm accounts, and writes the founder's outreach in their
    voice - small enough to actually finish and demo.
11. **Deliverability-aware send agent.** Most demos ignore that the email won't land; an agent that
    routes/spaces sends across the actual inbox health (Fiber's wedge) is technically real and few
    hackathon teams will do it.
12. **Signal-to-revenue attribution.** Close the loop the other way: which custom signals actually
    produced pipeline/closed-won, auto-pruning the noisy ones. RevOps gold, and a clean scoring story.

**Strategic read for our team:** the winning lane is layers 2-3 (SCORE + ACT glue) expressed as ONE
custom signal wired end-to-end, ideally on Convex for the double prize. Avoid AI-SDR-replacement and
generic enrichment. Idea #1 or #2 maximize alignment to the explicit judging frame; #3 and #5 maximize
"coolness"; #4 and #12 maximize RevOps credibility. The sweet spot is a build that *visibly* runs
DETECT -> ENRICH -> SCORE -> ACT on a signal nobody can buy off the shelf.

---

## Sources

- Clay: https://www.clay.com/ , https://www.clay.com/clay-for-gtm-ops , https://pipeline.zoominfo.com/sales/what-is-clay
- Unify: https://www.unifygtm.com/ , https://www.unifygtm.com/products/signals , https://syncgtm.com/blog/unify-gtm-review
- 11x / Artisan: https://www.11x.ai/ , https://salesmotion.io/blog/turns-out-ai-sdrs-are-too-good-to-be-true-11x-might-face-legal-action , https://www.11x.ai/guides/artisan-vs-11x
- Octave: https://www.octavehq.com/
- RB2B: https://www.rb2b.com/ , https://support.rb2b.com/en/articles/8891294-what-is-rb2b-and-how-does-it-work
- Common Room: https://www.commonroom.io/ , https://www.commonroom.io/product/signals/
- Koala / Pocus / Warmly: https://syncgtm.com/blog/koala-review , https://www.pocus.com/ , https://www.warmly.ai/p/blog/koala-alternatives
- Default: https://www.default.com/ , https://www.contentgrip.com/default-agentic-gtm-platform/
- Persana / Apollo: https://persana.ai/comparisons/persana-vs-apollo , https://www.apollo.io/insights/signal-based-selling
- OpenFunnel: https://openfunnel.dev/ , https://docs.openfunnel.dev/ , https://www.ycombinator.com/companies/openfunnel
- Exa: https://exa.ai/ , https://exa.ai/websets , https://sacra.com/c/exa/
- Cardinal: https://trycardinal.ai/ , https://www.ycombinator.com/companies/trycardinal-ai
- Centralize: https://www.usecentralize.com/ , https://salesforceventures.com/perspectives/welcome-centralize/
- Fiber AI: https://www.fiber.ai/ , https://www.ycombinator.com/companies/fiber-ai
- Lopus: https://lopus.ai/ , https://www.gtmvault.co/p/gtm-43-the-semantic-layer-is-the , https://www.ycombinator.com/companies/lopus-ai
- Corgi: https://www.corgi.insure/ , https://www.ycombinator.com/companies/corgi-insurance
- agent.ai: https://agent.ai/ , https://www.latent.space/p/dharmesh
- Cluely: https://cluely.com/ , https://tldv.io/blog/cluely-review/ , https://www.interviewcoder.co/blog/cluely-ai-review
- GTM engineering / trends: https://www.growthunhinged.com/p/who-s-actually-hiring-in-gtm-right-now , https://www.chilipiper.com/post/ai-sdr-myth-what-gtm-leaders-say , https://www.factors.ai/blog/gtm-engineering-trends , https://prospeo.io/s/signal-based-sales-strategy , https://substack.com/@kylepoyar/note/c-187030572
