# GTM / Growth Engineering - Research Dossier

> For the AI Growth Hackathon (June 27-28, hosted by Orange Slice). Judging order:
> (1) Usefulness in Growth/GTM/RevOps, (2) Technical Complexity, (3) Coolness.
> This dossier exists to help us (a) understand what impresses practitioner judges
> (Vincent from Cursor's founding growth team; Danilo/Dan Low from Lopus) and
> (b) generate and evaluate winning ideas.

## TL;DR for the team

"GTM engineering" is the hottest new revenue role: a hybrid builder who treats
go-to-market like a software system. The canonical loop everyone teaches is
**DETECT a signal -> ENRICH the record -> SCORE fit/intent -> ROUTE/ACT (personalized
multi-channel outreach) -> MEASURE and learn**. The defining 2026 thesis, repeated
by Clay, Common Room, Lopus, and the top practitioners, is that **bought intent data
is commoditized and weak; the leverage is in CUSTOM, first-party / inferred signals
you build yourself.** That maps directly onto the hackathon's stated frame ("pick ONE
custom signal and wire it through detect -> enrich -> score -> act"). The judges live
this discipline. To impress them: build a working end-to-end loop around ONE
non-obvious custom signal, show real enrichment + scoring logic (not just an LLM
wrapper), and prove it would actually help a rep close or a marketer convert.

## What the role actually is (2026)

A GTM engineer designs, builds, and operates the automated revenue systems that turn
GTM strategy into execution. The role sits at the intersection of sales, marketing,
data, and automation. It emerged ~2023 and exploded: Clay says ~100 job listings/month
were appearing; broader trackers report GTM-engineer postings grew ~205% YoY 2024->2025
and from ~1,400 (mid-2025) to ~3,000+ (Jan 2026). [Clay][Apollo]

**The archetype:** "half commercial thinker, half builder." Either marketers who can
engineer or engineers who care more about moving revenue than writing perfect code.
The salary gap ($90K vs $220K) tracks *depth*: a surface-level Clay operator earns
less than someone who writes custom code, builds custom tools, and integrates systems
other engineers usually own. [Clay]

### Day-to-day
- Build data-enrichment workflows that auto-append firmographic/technographic/intent data
- Build scoring models ranking accounts on fit + intent + engagement
- Build routing logic that assigns hot accounts to the right rep in minutes
- Build AI systems that research accounts and draft personalized outreach at scale
- Build signal-based triggers, CRM integrations, suppression logic, reporting/attribution
- At Clay internally: two-week sprints; other teams file tickets (automation requests,
  data-quality fixes, new workflows); deliverables include auto-generated handoff decks
  (pulling credit data from Snowflake, calls from Gong, accounts from Salesforce), QBR
  decks, and post-discovery follow-up emails drafted from call transcripts. [thegtme.com]

### Three-rung maturity model (Clay)
1. **Data Foundation** - clean, deduped CRM via automated enrichment + schema audits
2. **Data Modeling** - propensity scores and ICP attributes from predictive signals
3. **Data Activation** - automated outreach and targeted campaigns

## The canonical workflow (the thing to build)

The repeatable loop, phrased slightly differently by each source but identical in shape:

| Stage | What happens | Example tooling |
|---|---|---|
| **Detect** | Catch a buying/trigger signal (ideally custom) | RB2B, Koala, Common Room, scrapers, webhooks |
| **Enrich** | Waterfall across data providers to fill the record | Clay (100+ providers), Apollo, Clearbit/HubSpot |
| **Score** | Rank ICP fit + intent + engagement; threshold | Clay formulas, AI classifiers, custom code |
| **Route** | Assign to the right rep/segment; suppress dupes | LeanData, n8n, CRM rules |
| **Act** | Personalized multi-channel outreach (email/LI/ad) | Smartlead, Instantly, HeyReach, agents |
| **Measure** | Reply/meeting/pipeline rates; feed back to scoring | CRM, Snowflake, dashboards |

GTM Engineer School teaches the same as a "five-step signal loop": detect, score,
enrich, trigger, learn. Clay's FETE framework (Find, Enrich, Transform, Export) is the
list-building variant. The standard mature architecture pairs **Clay (intelligence
layer: find/clean/enrich/personalize)** with **n8n (orchestration layer: triggers,
routing, retries, moving data between systems)** in a closed loop. [factors.ai][fullfunnel][gtmai.nl]

## Build custom signals, don't buy intent data (the central thesis)

This is the single most important strategic point, and it is exactly the hackathon frame.

- **Purchased intent data is account-level, delayed, and inferred.** Common Room:
  "Intent data doesn't tell you what to do... It doesn't answer 'who should I engage,
  and how, right now?'" The fix is person-level, real-time, first-party signals. [Common Room]
- **Performance gap is large.** Signal-based selling reportedly drives 3-6x positive
  reply rates vs generic cold outbound, and 2-4% meeting conversion vs 0.5-1% from
  intent-data-triggered outreach. (Vendor-sourced; treat as directional.) [devcommx]
- **Cost curve flipped.** The old build-vs-buy math assumed every custom tool needed
  real engineering. With LLMs, a single engineer can build a custom signal agent in
  ~2 weeks for <$100 using open models. Small teams now build tools that fit their DNA. [signals vs intent sources]

### Which signals actually predict purchase (bloomberry, 1M software purchases)
This is gold for choosing a signal - it ranks them by real predictive lift:

| Signal | Purchase lift | Tier |
|---|---|---|
| Bought an enterprise AI tool | +46% | High |
| Headcount up 20%+ | +38% | High |
| Made a recent software purchase (<6mo) | +38% | High |
| Hired a VP | +28% | Medium |
| Raised a funding round | +25% | Medium |
| New office opening | +11% | Low |
| Job-posting increase 20%+ | +7% | Low (too early) |
| Achieved SOC compliance | ~0% | Non-predictive |

Takeaway: the *sexy* signals (job postings, funding) are weaker than people assume;
**"they just bought adjacent software" and "they're actually growing headcount" are the
strongest.** A clever hackathon signal beats an obvious one. [bloomberry]

## High-leverage canonical plays
- **Waterfall enrichment** - cascade a record through 3-5 providers in order; if one
  misses or returns low confidence, fall through to the next. Doubles/triples match
  rates vs single-source. The bread-and-butter GTME skill. [unifygtm][factors.ai]
- **Website visitor de-anonymization** - RB2B/Vector/Koala resolve anonymous visitors
  to person-level, then trigger outreach "while interest is hottest." [Adam Robinson/RB2B]
- **Job-change triggers** - a champion who moved to a new company is a warm pipe;
  "catch a job change within 7 days." (Note: as a raw *purchase* predictor it's weaker
  than expected, but as a *relationship* signal for existing champions it's strong.)
- **Allbound** - fuse inbound demand-gen, paid, and outbound into one coordinated
  system: generate intent -> filter/score/enrich -> personalized outreach.
- **Lookalike / golden-list expansion** - start from best customers, find ICP twins.
- **Activation/PLG plays** - score trial sign-ups (e.g. for $25k+ potential), auto-route,
  draft follow-ups citing similar customers' use cases. [Clay]
- **Transcript-powered CRM backfill** - parse Gong calls to auto-update CRM + draft decks.

## Amateur vs elite GTM engineering
**Elite:** systems thinking (every piece connects into one coherent system), writes
custom code + builds custom tools, fixes the process before automating it, talks to
reps so workflows actually get used, picks cost-effective enrichment, builds maintainable
table/data architecture, and obsesses over "does this help someone close a deal?"

**Amateur red flags:** automating a broken process (wrong ICP / bad scoring just fails
faster), tool sprawl (12 point tools vs 4-5 integrated), neglecting data hygiene,
building in isolation, over-engineering (a complex agent where a webhook would do),
unclean data architecture, surface-level Clay-only operation. [Clay][community.clay.com]

## What "useful in a Growth/GTM/RevOps context" means to a judge
The judges (Cursor growth, Lopus founder) will instinctively ask:
1. **Does it touch real revenue work?** Pipeline creation, conversion, routing,
   retention/expansion, attribution. Not a generic "AI assistant."
2. **Is the signal custom and non-obvious?** Bought-data wrappers will bore them.
3. **Is the full loop closed?** Detect -> enrich -> score -> act -> measure, demoed end
   to end, ideally on real data, with a visible ACT (an actual email/route/CRM write).
4. **Would a real rep/marketer use this Monday morning?** Human-in-the-loop, suppression,
   data hygiene, and "does this help close a deal" thinking signal seriousness.
5. **Technical depth beyond a prompt** - real scoring logic, waterfall fallback,
   identity resolution, orchestration with retries.

## Influential voices / communities to mirror
- **Eric Nowoslawski** - Growth Engine X; "Clay's first marketing contractor," most
  visible GTME; his LinkedIn breakdowns set the standard.
- **Jared Waxman + Matteo Tittarelli** - GTM Engineer School (4,500+ members), the
  closest thing to a curriculum; "GTM Engineer Pulse" Substack + podcast.
- **Kellen Casebeer** - The Deal Lab / GTM Cafe; coined "message-market fit."
- **Adam Robinson** - RB2B founder; visitor ID + signal-based selling (142K LinkedIn).
- **Alex Lindahl** - Claymation.io newsletter (5,000+ ops/week); founded r/gtmengineering.
- **Clay ecosystem leaders** - Manny, Osman Sheikhnureldin, Spencer, Blake (internal);
  forward-deployed + internal GTME split under co-founder Varun.
- **In-house GTMEs at AI/dev-tools cos** - Adam Wall (Anthropic, "GTM Infrastructure
  Pod Lead"), Roman Ugarte (Cursor), Robert Jones (Canva GTM AI), Evan Peters (Notion),
  Noah Adelstein (Rippling), Davide Grieco (Verkada - automated 80% of SDR work, 4x
  meetings/rep).
- **Lopus (judge's company)** - "Growth Intelligence Engine"; scans social media for
  buying signals, suggests personalized outreach, real-time post monitoring; explicitly
  a detect/enrich/score/act platform. Founded 2024 by Danylo Borodchuk + Aamish Ahmad
  Beg; backed by Meta, Team Ignite, Y Combinator. **Implication: a social-signal play
  resonates with this judge, but don't clone their product - extend or differentiate.**

## Modern GTM stack (reference)
- **Intelligence/enrichment:** Clay (the category king), Apollo, Cargo
- **Signal detection:** RB2B, Koala, Vector, Common Room, 6sense, Leadfeeder
- **Orchestration:** n8n ("central nervous system"), Zapier (deterministic), Make
- **CRM:** HubSpot (Series A-B default), Salesforce, Attio
- **Sequencing/outreach:** Smartlead, Instantly, Lemlist, HeyReach (LinkedIn)
- **Build-it tools GTMEs use:** Lovable, Bolt, TypeScript, Python, SQL
A common founder stack: HubSpot + Clay + Smartlead + RB2B + n8n (~$800-1,500/mo). [unifygtm][gtmai.nl][5050growth]

## Idea hooks for the hackathon
1. **A genuinely novel custom signal detector.** Pick a signal with real lift but that
   nobody buys off the shelf (e.g. "company just adopted an adjacent AI tool" = +46%
   lift; detect via job posts, changelog/release notes, public integrations, GitHub
   dependency files, or new SDK usage). Build detect -> enrich -> score -> draft outreach.
   Hits all three judging criteria and the central thesis head-on.
2. **Closed-loop "signal -> action" agent on RocketRide.** Use RocketRide's agent/pipeline
   nodes to wire a literal detect->enrich(waterfall)->score->act DAG. Demos technical
   complexity (orchestration, retries, fallback) AND is dogfood-useful to the team.
3. **Waterfall-enrichment-as-a-service with confidence scoring.** Cascade free/cheap
   sources, show match-rate lift and cost-per-match live. Deeply useful, clearly technical,
   and a recognized core GTME skill the judges will respect immediately.
4. **"Process-before-automation" linter.** A tool that audits a GTM workflow / Clay table
   for the amateur red flags (broken ICP, bad scoring thresholds, no suppression, dirty
   data) before you automate it. Differentiated and very practitioner-credible.
5. **Champion job-change tracker for existing relationships.** Monitor a CRM's contacts
   for job changes, auto-enrich the new company, score the warm-intro opportunity, draft
   the re-engagement. Strong relationship signal, clear ROI story.
6. **Social-buying-signal detector (Lopus-adjacent, differentiated).** Scan a niche
   public surface (e.g. GitHub issues, Discord/Slack communities, support forums,
   review sites) for "deal-blocker" or "switching" language, score intent, route. Plays
   to the judge's worldview without cloning Lopus.
7. **Signal-strength backtester.** Given a list of closed-won/lost accounts, score which
   custom signals actually predicted purchase (mirrors the bloomberry study). Meta,
   technical, and exactly the kind of rigor that separates elite from amateur.

## Sources
- https://www.clay.com/blog/gtm-engineering
- https://thegtme.com/p/how-we-built-clays-gtm-engineering
- https://www.apollo.io/insights/what-does-a-gtm-engineer-do-and-why-is-the-role-emerging-now
- https://gtmepulse.com/top-voices/
- https://bloomberry.com/blog/i-analyzed-1m-software-purchases-to-find-the-strongest-buyer-intent-signals/
- https://www.commonroom.io/blog/intent-data-vs-buyer-intelligence/
- https://www.devcommx.com/blogs/signal-based-selling-vs-intent-data
- https://www.unifygtm.com/explore/waterfall-enrichment-b2b-contact-data
- https://www.factors.ai/blog/signal-based-outbound-workflows
- https://www.fullfunnel.co/blog/building-automated-gtm-engine-clay-n8n
- https://gtmai.nl/en/blog/modern-gtm-stack-explained/
- https://5050growth.com/blog/b2b-gtm-stack-2026-attio-clay-n8n-heyreach/
- https://community.clay.com/x/content-and-events/0fikcoh31tca/how-to-spot-good-vs-bad-gtm-engineers-5-key-red-fl
- https://startupintros.com/orgs/lopus-ai
- https://www.understoryagency.com/blog/what-is-gtm-engineering
- https://thegtme.com/ (The GTM Engineer by Clay, Substack)
