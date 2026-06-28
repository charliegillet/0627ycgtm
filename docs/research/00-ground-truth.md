# Ground Truth - AI Growth Hackathon (YC GTM Hackathon)

> Single source of truth, extracted from a 100% sweep of `docs/`: the 51-slide
> kickoff deck (`AI-Growth-Hackathon-Kickoff-Presentation.pdf`), the cleaned
> kickoff transcript, and the speaker notes. Everything below is grounded in those
> artifacts. Where the deck and transcript disagree, the deck wins (it is the
> primary source). Inferences are marked **[inferred]**.

---

## 1. The event at a glance

- **Name:** "AI Growth Hackathon" - branded **by Orange Slice**. The Convex
  submission form calls it the **"YC Growth Hackathon."** Both names refer to the
  same event. Y Combinator is a listed supporter.
- **Dates:** June 27 - 28 (Sat - Sun). Kickoff Sat 5:30p, hacking starts 6:30p.
- **Theme:** **Growth engineering** - engineers who (1) write code, (2) run
  experiments end-to-end, (3) automate themselves with AI, (4) own the entire
  growth pipeline. Framing question posed from stage: *"Is distribution the only
  moat?"*
- **Format:** Teams up to 4. Build overnight on-site (no reentry 12AM - 6AM).

### Timeline (hard deadlines)
| When | What |
|---|---|
| Sat 5:30p | Kickoffs |
| Sat 6:30p | Hacking starts |
| Sat 7:30p | Dinner + Q&A (Vincent/Cursor, Danilo/Lopus) |
| Sun 9a | Breakfast |
| Sun 1p | Lunch |
| **Sun 4:00p** | **Projects DUE** |
| Sun 5:00p | Finalists announced + final pitches |
| Sun 6:00p | Winners announced (1st/2nd/3rd) |

---

## 2. Judging criteria (from the deck - authoritative)

In order, as listed on the "Judging Criteria" slide:
1. **Usefulness** - explicitly *"in a Growth/GTM/RevOps context."*
2. **Technical Complexity** - i.e. "hard to build."
3. **Coolness.**

> "other things you might want to consider: slides are discouraged. just demo a
> working project lol"

**How to get judged (slide):**
1. Submit open-source project via Vibe Apps with a 3-minute demo video.
2. Judges review and select the best projects.
3. Selected teams present on stage in front of everyone.
4. "Be cool :)"

**Implication:** the bar is a *working demo* + a *3-min video*. No slides. The
demo and video are the product. Coolness + a crisp narrative matter as much as the
build because finalists must win a live room.

---

## 3. Prizes (authoritative, from deck)

| Place | Cash | OpenAI credits | Other |
|---|---|---|---|
| 🥇 1st | $2,500 | $5,000 | $500 Cursor API credits |
| 🥈 2nd | $1,500 | $2,500 | - |
| 🥉 3rd | $500 | $1,000 | - |
| **Convex - Best use of Convex, 1st** | $1,000 gift card | - | - |
| **Convex - Best use of Convex, 2nd** | $500 gift card | - | - |

Convex track is **separate** from the main 1/2/3 - you can win both. This is the
basis for our 70% main / 20% Convex EV split: building on Convex is nearly free
optionality on a second prize.

---

## 4. The six on-screen "Project Ideas" (the organizers' own prompts)

These are the themes the hosts put on screen. Treat them as the judges' mental
buckets - projects that map cleanly to one of these read as "on-theme."

1. **Sales Cyborgs** - AI-Enhanced Sales (*"Cluely if it worked lol"*).
2. **AI Ad Factories** - Self-Driving Campaigns, AI-Gen Creative, Optimization Tools.
3. **Reading Minds** - Agentic Analytics, Signal Detection, Churn, Lead-Building.
4. **Revenue on Autopilot** - Cold Outbound & Pipeline Automation.
5. **Zero to One** - AI-Enhanced PLG & Onboarding.
6. **Algorithm Hacking** - AI Social Media & Virality Engines.

---

## 5. The DETECT → ENRICH → SCORE → ACT framework (Lopus, "Tonight's Build")

The single most important conceptual artifact in the deck. Lopus put up a slide:
**"Pick one signal. Wire it through all three layers."**

| Step | What | Layer |
|---|---|---|
| 1. **DETECT** | Catch the signal as it happens | DATA |
| 2. **ENRICH** | Add the context that makes it actionable | DATA + ORCH |
| 3. **SCORE** | Decide who acts, and how urgently | ORCH + LLM |
| 4. **ACT** | Alert a human, or trigger an agent | INTERFACE |

Lopus's recommended stack: **dltHub** (ingestion) → **Postgres + DuckDB**
(`pg_duckdb`, read-only analytics) → **Trigger.dev** (orchestration) → **Mastra +
AI SDK** (agents) → **Slack / Gmail / React** (interface). Core thesis, repeated:
**"The higher-leverage signals are custom, not bought."**

This is the template a winning project should visibly satisfy: one creative,
unique signal, detected → enriched → scored → acted on, end to end.

---

## 6. Submission mechanics (authoritative)

1. Create account at **https://vibeapps.dev**
2. Submit **only** at **https://convex.link/growthhack**
3. Record a video, fill the form, hit **Submit App**.

**Submission form fields** (from the deck screenshot - "YC Growth Hackathon
Submission Form"):
- App Title*
- App/Project Tagline* (one-sentence pitch, 140 char)
- Description (Markdown + fenced code blocks), suggested structure:
  - Problem you're solving
  - How the app works
  - Notable features
  - Why you built this
  - Tech stack we used
  - Challenges we ran into
  - Any success stories or metrics
- App Website/URL

Open-source on GitHub required for the duration (can close-source after).

---

## 7. People (named in docs) - the judge/decision-maker pool

> The transcript states Vincent (Cursor) and Danilo (Lopus) "will be judging you."
> Others below are organizers/sponsor reps present and helping; treat all as people
> whose taste shapes outcomes. Deep dossiers live in `docs/research/judges/`.

| Person | Org | Source | Role signal |
|---|---|---|---|
| **Vihaar** | Orange Slice | deck: `vihaar@orangeslice.ai`, "we are hiring for everything!" | Host/organizer **[inferred founder/leader]** |
| **Vincent** | Cursor | transcript | Founding growth team; **confirmed judge**; ran Sat 7:30 Q&A |
| **Dan Low / Danilo** | Lopus | transcript | Lopus founder/lead **[inferred]**; **confirmed judge**; ran Sat 7:30 Q&A |
| **Apoorv Jha** | OpenAI | deck: `apoorv@openai.com` | Presented "Building with OpenAI"; on-site helper |
| **Neil** | OpenAI | transcript ("Find me or Neil") | On-site helper |
| Corgi growth engineer (unnamed) | Corgi | transcript | Possible additional Q&A/judge Sunday |
| Sarah | (organizer) | transcript | Distributing Cursor credits |

---

## 8. Sponsors and what each gives you

> Full dossiers in `docs/research/sponsors/`. Summary + credits below.

### Orange Slice - HOST. "The AI Growth Engineer"
- **What:** an *agentic spreadsheet for GTM*. Describe an outcome; AI agents fill
  rows - researching companies, enriching contacts, triggering outreach. "Agents
  do the work / Continuous, not one-off / One source of truth."
- **Two ways to build:**
  - **Web app** (`orangeslice.ai`): no-code agentic spreadsheet. Point-and-click
    agent columns, 100+ ready-made enrichments, one-click integrations (HubSpot,
    Salesforce, Gmail, Slack).
  - **Package** (`npx orangeslice@latest`): every enrichment provider under one
    key. `ctx · integrations · skills`. B2B research, enrich & scrape. Drops into
    any TS/JS project / agent. *This is the developer path most relevant to us.*
- **Credits:** $50 = 50,000 credits, auto-loaded to signup email.
- **Build buckets they suggest:** sales enhancement, outbound automation, ad
  automation, analytics, PLG, social optimization.
- Contact: `vihaar@orangeslice.ai`. Hiring. Has a Slack.

### OpenAI - powers the prize credits
- **Codex** is the headline. "You can just build things."
- Tip 1: Build with Codex. Tip 2: OpenAI Docs MCP & Skill -   `codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp`;
  skill pre-installed in Codex + `github.com/openai/skills`. Tip 3:
  `developers.openai.com/showcase` for inspiration. OpenAI Cookbooks for depth.
- **Credits:** $50 API (promo code in email). Prizes are OpenAI credits ($5k/$2.5k/$1k).
- Contact: Apoorv Jha (`apoorv@openai.com`), Neil.

### Convex - separate prize track ($1,000 / $500)
- **What:** "backend building blocks for your agents." Reactive DB + backend.
  Works natively with Claude Code, Codex, Cursor (install plugin). "build a Notion
  clone with Convex."
- **Components (106+):** PostHog, Exa, Agentmail, AutoSend, Static-Hosting, AI
  Agent, Workpool, etc. Categories: AI Agents, Auth, Backend, AI Infra, Database,
  Durable Functions, Integrations, Messaging, Storage, Payments.
- **Resources:** `docs.convex.dev/ai`, `convex.dev/hackathon`,
  `convex.dev/components`, `convex.dev/pricing` (free to build).
- **Template - "SignalBoard":** "Drop in a company. Get the signal. Live." A
  lead-scoring demo (add a company → buying-signal score + summary + cold-email
  draft, streamed live to every open client). Built with Cursor + Convex + Orange
  Slice. `https://convex.link/growthdemo`.
- **Start:** `npm create convex@latest`. Hiring 6 roles (`jobs@convex.dev`).

### Cursor - $500 to 1st place + $50 credits
- **What:** Cursor 3 (new agent-first interface), Agent window, **Automations**
  (repeatable cloud tasks; e.g. their security-review-on-deploy bot), **Cloud
  agents** (ship while you sleep), **Composer** (their own fast/cheap/smart model),
  **Cursor CLI / SDK** (programmatic).
- **Internal GTM build they showed - "Chat GTM":** new-AE onboarding tool;
  connects Databricks + Salesforce; for a target account surfaces segment,
  one-liner, product footprint (PLG), org chart / decision-makers, enrichment,
  prioritization signals. *This is a strong tell for what Cursor's growth team
  values.*
- Judge: **Vincent** (founding growth team).

### Lopus - Operational data platform (judge: Dan Low / Danilo)
- **What:** unifies product + sales + marketing data; sits on top of warehouses
  (e.g. Databricks). Owns the DETECT→ENRICH→SCORE→ACT framing (Section 5).
- **Recommended stack:** dltHub, Postgres+DuckDB (`pg_duckdb`), Trigger.dev,
  Mastra + AI SDK, Slack/Gmail/React.
- **Thesis:** "the higher-leverage signals are custom, not bought."

### Fiber AI - "freshest data APIs for AI sales agents" ($500 credits)
- **Scale:** 40M+ active global companies, 850M+ professionals, 30M+ jobs.
- **Positioning:** "API endpoints nobody else has" - replaces Crustdata,
  Explorium, People Data Labs, BrightData.
- **Endpoints:** reverse email→person lookup; search by partial/incomplete info;
  companies with filters unavailable in LinkedIn Sales Navigator; people search
  more granular than LinkedIn Recruiter; verified work emails + personal
  emails/phones (contact waterfall); AI agents build prospect lists from 100+
  sources; real-time LinkedIn company info; real-time LinkedIn profile info;
  bounce detect + verify.
- **Resources:** API docs `api.fiber.ai`; MCP `docs.fiber.ai/article/using-mcp-in-llms`;
  hackathon `fiber.ai/hackathon`; **OpenFiber** open-source UI `open.fiber.ai` /
  `github.com/fiber-ai/open-fiber`; Slack `fiberhackers`.
- **Claude Code plugin** with personas/skills: gtm-sdr, gtm-recruiter,
  signal-scout, find-and-enrich-by-role, enrich-github-handles, find-similar-companies.
- **Who uses them:** GTM eng teams - Cursor, Docusign, Ramp, Rogo; AI sales cos -   agent.ai, Cardinal, HubSpot, Centralize, Exa, OpenFunnel.

### Corgi - coffee sponsor ("Corgi Cafe 24/7") + has a "sales team"
- Sponsored Sunday coffee. A growth engineer from the **Corgi sales team** may do
  a Sunday Q&A. Company identity needs research (see `docs/research/sponsors/corgi.md`).

### Y Combinator - listed supporter; event also called "YC Growth Hackathon."

---

## 9. Tools available to US (our toolbelt for the build)

- **$50 OpenAI** + **$50 Cursor** + **$50 (50k) Orange Slice** + **$500 Fiber AI**
  + **free Convex**. Plus our own stack.
- Orange Slice package (`npx orangeslice@latest`) gives every enrichment provider
  under one key - fastest path to real B2B data without wiring N vendors.
- Fiber AI ($500, biggest credit pool) gives the freshest/most-exclusive data +
  an MCP + an open-source UI (OpenFiber) we could fork as a head start.
- Convex = backend + the bonus track. SignalBoard template is a forkable starting
  point that already embodies DETECT→ENRICH→SCORE→ACT.

---

## 10. What this means for idea selection (carry into the debate)

1. **On-theme = maps to one of the 6 idea buckets + visibly does
   DETECT→ENRICH→SCORE→ACT on a *custom, non-bought* signal.**
2. **Win condition is a 3-min video + working demo**, not a slide deck. Optimize
   for instant "whoa" in a live room (Coolness) backed by real GTM usefulness and
   visible technical depth.
3. **Convex is cheap optionality** on the 20% sub-goal - strong reason to use it as
   the backend unless there's a specific conflict.
4. **The judges are growth engineers** (Vincent/Cursor, Danilo/Lopus) + the host
   (Vihaar/Orange Slice). Build something *they personally wish existed* - a tool a
   real growth engineer at Cursor/Lopus/Orange Slice would actually run on Monday.
5. **Data is a solved input for us** (Fiber + Orange Slice credits) - so the alpha
   is in the *signal choice*, the *orchestration*, and the *demo craft*, not in
   scraping.

---

### Open questions to resolve via research
- Exact, final **judge roster** (deck only names presenters; transcript names
  Vincent + Danilo as judges).
- **Corgi**'s actual product/company.
- Backgrounds + public taste of Vihaar, Vincent, Dan Low, Apoorv Jha (what they've
  built, written, praised) - to reverse-engineer what will impress them.
