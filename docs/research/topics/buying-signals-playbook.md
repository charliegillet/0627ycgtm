# Buying-Signals Playbook: Creative CUSTOM Signals (the Alpha)

Research dossier for the AI Growth Hackathon (June 27-28, Orange Slice / YC Growth
Hackathon). Theme: GROWTH ENGINEERING. Central frame (from Lopus): pick ONE custom
signal, wire it through **DETECT -> ENRICH -> SCORE -> ACT**. Sponsor thesis: *the
higher-leverage signals are custom, not bought.*

## TL;DR for the team

- Bought intent data (Bombora/ZoomInfo aggregate topic surges) is commoditized and
  weak (~70/100 strength, decays 50% in 14 days). The judges' thesis is that the
  alpha is in **custom signals you scrape/infer yourself**. Build for that.
- The whole field collapses to one loop: **DETECT -> ENRICH -> SCORE -> ACT**.
  A winning demo shows all four stages firing on a live, custom signal in real time.
- The most under-exploited, demo-able signals: **GitHub activity, Reddit/X
  competitor-complaint mining, tech-stack churn (who *removed* a competitor), new
  docs/pricing pages, and WARN-Act / exec-departure distress.** These are scrapeable
  in <24h, visually striking, and "custom not bought."
- Signal **stacking** is the real magic: accounts with 3+ active signals convert at
  **2.4x** single-signal accounts ([Unify](https://www.unifygtm.com/explore/signal-based-selling)).
  A demo that fuses 2-3 custom signals into one score will read as both useful and technically deep.

## Lopus context (judge's company - note the ambiguity)

Two YC entities surface under "Lopus." The GTM-relevant one
([Lopus AI](https://www.ycombinator.com/companies/lopus-ai),
[launch post](https://fondo.com/blog/lopus-ai-launches)) "scans high-intent social
media channels, surfaces people already looking for what you sell" and delivers
leads daily - i.e. **custom social-signal mining, not bought intent data.** Founders
listed across sources: **Aamish Ahmad Beg** (CEO, Dartmouth CS, DARPA DIGIHEALS) and
**Danylo Borodchuk** (Dartmouth, DALI Lab). The judge listed as "Danilo/Dan Low" is
almost certainly **Danylo Borodchuk** (verify spelling live; "Dan Low" appears to be
a phonetic rendering of "Danylo"). Their public thesis aligns exactly with the
hackathon frame: social posts are a custom, high-intent signal you mine yourself.

## Signal catalog (25+), by detect-difficulty tier

Strength = correlation with near-term buying. Decay = how fast it goes cold.
"<24h" = buildable with our stack (Fiber AI, Orange Slice, Apify/web scraping, OpenAI/Codex).

### Tier 1 - Easy detect (public APIs / scrapers, fire in <24h)

| # | Signal | Source + detection | Strength | Decay | Act |
|---|--------|--------------------|----------|-------|-----|
| 1 | **Job posting w/ keyword match** | Scrape Greenhouse/Lever/Ashby/Workday boards + LinkedIn Jobs ([Apify multi-ATS](https://apify.com/dataset-smith/multi-ats-job-scraper)); regex the *full description* for tools/pains ("migrating off Salesforce", "RevOps") | High (80) | 30-60d | AE play referencing the role/pain. ~18% reply vs 3.4% cold ([firstsales](https://firstsales.io/blog/hiring-signal-outbound/)) |
| 2 | **Funding announcement** | Crunchbase / news RSS within 48h | Med (60) | Peak 48h | Budget-now message, first 48h |
| 3 | **Exec hire (relevant role)** | LinkedIn / news, new role <30d | Med (65) | 30-60d | New-leader "new initiative" play |
| 4 | **GitHub star/fork/issue** | GitHub REST+GraphQL (5k req/hr) or GH Archive on BigQuery; map user -> company | High for forks/issues (very high), Med for stars | 24-48h | Dev-to-dev: reference the exact issue/fork ([leadcognition](https://leadcognition.io/blog/github-activity-buying-signal)) |
| 5 | **Tech-stack ADD** | BuiltWith / Wappalyzer / [Apify tech detector](https://apify.com/automation-lab/tech-stack-detector); new script/header | Med-High | days | "We integrate with X you just added" |
| 6 | **New docs / pricing / changelog page** | Visualping or diff a sitemap; AI classifies if change matters ([Visualping](https://visualping.io/)) | Med-High (custom) | days | Trigger on competitor price hike or new product line |
| 7 | **WARN-Act / layoff filing** | [WARN Firehose](https://warnfirehose.com/) / WARNTracker public records | Med (risk/timing) | weeks | Cost-savings angle; or expansion at the *hiring* competitor |
| 8 | **Hiring freeze / posting pulled** | Diff ATS daily; role disappears | Low-Med | weeks | Distress signal; defensive or value play |

### Tier 2 - Medium detect (scrape + LLM inference, mostly <24h)

| # | Signal | Source + detection | Strength | Decay | Act |
|---|--------|--------------------|----------|-------|-----|
| 9 | **Reddit competitor-complaint / "switching from"** | Reddit API + LLM classify intent; "alternative to X", "switched away from X" convert **~5x** generic asks ([leadsrover](https://leadsrover.io/blog/reddit-buyer-signals-data-analysis)) | Very High | **1-3h** (reply window) | Helpful reply within 1h, not a pitch |
| 10 | **X/LinkedIn public complaint about competitor** | X/LinkedIn search + LLM sentiment; this is Lopus's core motion | High | hours | Personalized DM referencing the post |
| 11 | **Tech-stack REMOVAL (the alpha)** | BuiltWith historical: track *abandonment*, not live use. "Who *used to* run competitor X" is the displacement pipeline ([source](https://technologychecker.io/)) | High | days-weeks | Win-back / displacement outreach |
| 12 | **Competitor GitHub issue cluster** | 2-3 devs at same org open issues on competitor repos same week | High (shortlist) | days | Comparison-focused dev outreach |
| 13 | **Champion job change** | Track known buyers' LinkedIn moves; admin/champion move > normal user ([UserGems](https://www.usergems.com/blog/champion-tracking)) | Very High | 30-60d | Warm intro at new co. 114% higher close rate |
| 14 | **G2 / Capterra comparison view** | Review-site intent (G2 now unifies G2+Capterra+SoftwareAdvice+GetApp, 2026) | High (85) | days | Comparison message, 30-40% shorter cycle |
| 15 | **Podcast / conference mention** | Transcribe (Whisper) podcasts, scrape event attendee/speaker lists; LLM extracts pain | Med (creative) | weeks | Reference what they said publicly |
| 16 | **New SOC2 / security / compliance page** | Diff trust pages; signals enterprise-readiness push | Med | weeks | Enterprise / security-tool play |
| 17 | **Engineering blog post about a problem you solve** | RSS + LLM topic match | Med | weeks | "Saw your post on X" technical outreach |
| 18 | **Open API/integration request in public forum** | Scrape vendor forums/Discord/Discourse | Med-High | days | Offer the integration |

### Tier 3 - First-party / harder (need pixel, partner, or telemetry)

| # | Signal | Source + detection | Strength | Decay | Act |
|---|--------|--------------------|----------|-------|-----|
| 19 | **Pricing-page visit (de-anon)** | Website de-anon (Fiber AI / RB2B class) | **Highest (95)** | 24-48h | Email+phone within 4h |
| 20 | **Demo-page visit** | First-party tracking | Very High (90) | 24-48h | 4h SLA outreach |
| 21 | **Multiple stakeholders from one co.** | Visitor clustering | Very High (90) | days | ABM sequence |
| 22 | **Product-usage telemetry (PLG)** | Your own product events (activation, limit hit) | Very High | hours | Upsell/expansion at the moment of friction |
| 23 | **Repeated docs-section views** | Your docs analytics | Med | days | Nurture w/ that topic |
| 24 | **Email open+click** | ESP tracking | Low-Med (45) | days | Follow-up |
| 25 | **Webinar/content download** | Form fill | Low-Med (50) | days | Nurture |
| 26 | **Third-party intent surge (BOUGHT)** | Bombora/ZoomInfo co-op | Med (70), commodity | 14d | Weakest tier - what the thesis warns against |
| 27 | **M&A / acquisition** | News, SEC filings | Med-High | weeks | Integration / consolidation play |
| 28 | **10-K / earnings-call keyword** | SEC EDGAR + LLM extract initiatives | Med | quarter | Strategic, exec-level outreach |

## The 5 most demo-able "wow" signals

Optimized for: visually striking, fast to fire on stage, obviously "custom not bought."

1. **Reddit/X live complaint -> instant reply draft.** Paste a competitor name; the
   agent surfaces a real "switching from [X]" post from the last hour and drafts a
   helpful (non-salesy) reply. Live, real data, 5x-converting signal, and it visibly
   races the 1-3h reply window. This is essentially a live Lopus demo - flatters the judge.
2. **GitHub buyer radar.** Watch a competitor's repo; when a dev opens an
   integration/migration issue or forks, map GitHub user -> company -> contact and
   draft dev-to-dev outreach quoting the exact issue. Visually: a globe/feed of
   developers "raising their hand." Deeply technical, clearly custom.
3. **Tech-stack churn displacement map.** Show companies that *removed* a competitor
   from their stack this week (the abandonment layer most tools can't see) and fire a
   win-back play. The "who used to run X" framing is a genuine, defensible insight.
4. **Docs/pricing diff -> competitive trigger.** Monitor a competitor's pricing/docs;
   when they raise enterprise pricing or ship a feature, auto-generate outreach to
   *their* customers. The before/after visual diff is striking on video.
5. **Layoff/exec-departure distress radar.** WARN filings + exec departures + pulled
   job posts fused into one "account in motion" score, mapped on a timeline. Strong
   "act" story (defensive save vs. opportunistic land) and uses pure public data.

All five are buildable in <24h with **Apify scrapers (Reddit, ATS, GitHub, Wappalyzer
clones), GitHub API, BigQuery GH Archive, Visualping/sitemap diffs, WARN Firehose API,
OpenAI for classify+draft, Fiber AI for enrichment/contacts.**

## Scoring & prioritization (LLM rubric design)

Two-layer model wins on technical-complexity points:

**Layer 1 - deterministic signal score** (transparent, fast):
`score = Σ (signal_weight × freshness_decay)`. Use a decay function (3-5%/day, or
the per-signal decay column above). Add a **stacking bonus**: 3+ active signals ->
multiply (accounts with 3+ signals convert **2.4x**). Strength weights from the
[Unify matrix](https://www.unifygtm.com/explore/signal-based-selling): pricing visit
95, demo 90, G2 compare 85, job-post 80, intent surge 70, exec hire 65, funding 60.

**Layer 2 - LLM-as-judge for fit + nuance.** Drop-in rubric pattern
([Tim Kilroy](https://timkilroy.com/blog/icp-scoring-prompt-ai-sales-agents/)):
- **Role:** "You are a RevOps leader scoring prospects 0-100 against this ICP."
- **5 weighted criteria (0-20 each):** industry fit, company size, growth trajectory,
  buying readiness (the signal), delivery/use-case fit.
- **Structured JSON output:** `{company, scores{...}, total_score, tier:A-F,
  reasoning, missing_information[], recommended_action}`.
- **Tiers:** A 90-100 founder outreach; B 75-89 senior rep; C 60-74 nurture;
  D 40-59 monitor; F <40 drop.
- **Calibrate against closed-won/lost:** score your last 10-30 deals; if won deals
  average 65, shift thresholds down ~20. LLM rubrics reach **80-90% agreement** with
  human judgment on clear cases.

Design tips: force specificity ("contains an actionable next step" beats "is this
good"); output `missing_information` so the agent knows when to ENRICH more before
scoring; separate **Fit_Score** (firmographic) from **Intent_Score** (signal) so you
can route on intent and gate on fit.

## What's detectable in <24h with OUR tools

- **Fiber AI** ([YC](https://www.ycombinator.com/companies/fiber-ai)): 50+ source
  enrichment (LinkedIn, Crunchbase, filings), contact/email, de-anon - use for the
  **ENRICH** stage (GitHub user/X handle -> company -> verified contact). Note:
  reviews say Fiber does NOT do buying-signal detection itself, so we supply DETECT
  and let Fiber do ENRICH - a clean division of labor for the demo.
- **Apify**: ready actors for Reddit monitoring, multi-ATS jobs, GitHub, Wappalyzer-style
  tech detection; built-in cron + webhooks + dedup-by-id = real-time new-event alerts.
- **GitHub API / GH Archive (BigQuery)**: stars/forks/issues/PRs, historical since 2011.
- **Visualping / sitemap diff**: new docs/pricing/changelog pages.
- **WARN Firehose API**: layoffs, SEC, bankruptcy, visa data.
- **OpenAI / Codex**: classify intent, extract pain from unstructured text (Reddit,
  podcasts, 10-Ks), and draft the signal-aware outreach (the ACT).

## Idea hooks for the hackathon

- **"Signal Fusion Engine":** one custom signal type, full DETECT->ENRICH->SCORE->ACT
  loop, live on stage. Pick GitHub or Reddit (most demo-able + most custom). Score with
  the two-layer model; ACT = drafted, signal-specific outreach. Hits all 3 judging
  criteria and mirrors Lopus's own thesis.
- **"Displacement Radar":** tech-stack *removal* / competitor-churn monitor that finds
  accounts that just dropped a rival and fires win-back plays. Defensible insight,
  novel data layer, clear ROI story.
- **"Dev Buying Radar":** GitHub issue/fork/star -> company resolution (via Fiber) ->
  dev-to-dev outreach quoting the exact issue. Technically deep, perfect for DevTool ICP.
- **"First-Reply Bot":** Reddit/X "switching from [competitor]" detector racing the
  1-3h reply window; drafts a genuinely helpful answer. Visceral live demo; basically
  Lopus-in-a-box (judge-flattering, but differentiate on the scoring/act layer).
- **"Account-in-Motion score":** fuse 3+ custom signals (job posts + exec change +
  docs diff + WARN) into one stacked score with the LLM rubric; the 2.4x stacking stat
  is the headline. Best "technical complexity" story.
- **RocketRide tie-in (10% utility):** model the whole loop as RocketRide agent/tool
  nodes (a "GitHub-signal" tool node, a "Reddit-intent" processor, an "LLM-scorer"
  node) so the demo doubles as a reusable pipeline on their platform.
- **Convex track ($1000/$500):** Convex is a natural fit for the signal store + live
  reactive feed. Store raw signals, run scoring as Convex functions, and let the
  dashboard update in real time as signals fire - the reactivity *is* the wow.

## Sources

- https://www.unifygtm.com/explore/signal-based-selling
- https://leadcognition.io/blog/github-activity-buying-signal
- https://www.fruitfulcode.com/blog/devtool-github-signal-intelligence/
- https://leadsrover.io/blog/reddit-buyer-signals-data-analysis
- https://timkilroy.com/blog/icp-scoring-prompt-ai-sales-agents/
- https://firstsales.io/blog/hiring-signal-outbound/
- https://apify.com/dataset-smith/multi-ats-job-scraper
- https://apify.com/automation-lab/tech-stack-detector
- https://visualping.io/
- https://warnfirehose.com/
- https://www.usergems.com/blog/champion-tracking
- https://syncgtm.com/blog/g2-buyer-intent-review
- https://company.g2.com/news/g2-expands-buyer-intent-capabilities
- https://www.ycombinator.com/companies/lopus-ai
- https://fondo.com/blog/lopus-ai-launches
- https://www.ycombinator.com/companies/fiber-ai
- https://syncgtm.com/blog/fiber-ai-review
- https://technologychecker.io/blog/builtwith-alternatives
