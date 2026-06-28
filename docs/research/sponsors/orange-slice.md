# Orange Slice (HOST) - Product + Developer Dossier

**One-liner:** "The AI Growth Engineer." An agentic spreadsheet for GTM where every
column runs AI-generated TypeScript, plus an npm package (`npx orangeslice@latest`)
that puts "every enrichment provider under one key" into any coding agent (Claude
Code, Cursor) or your own TS/JS app.

> They are the HOST and a judge (Vihaar runs it). Building visibly *on their package*
> is the single highest-signal move available in this hackathon. The package is real,
> well-documented, MIT-licensed, and dependency-free - it is genuinely buildable-on in
> a few hours. Detail below is pulled from the actual published tarball (`orangeslice@2.6.0`).

---

## Company & people (verified)

| Field | Detail | Source |
|---|---|---|
| Founded | 2025, YC **Summer 2025** batch (YC partner: Jared Friedman) | YC profile |
| Founders | **Vihaar Nandigala** (CEO; sold KitchenKonnect at 19; ex-J.P. Morgan; ex-UMich) and **Kishan Sripada** (CTO; built FORMI choreography software, bootstrapped to 100k+ users; ex-Ramp intern, ex-Tour YC S21) | YC profile, LinkedIn |
| Met | Bollywood dance team at University of Michigan | YC / press |
| Team | ~2-7 people, San Francisco | YC / Getlatka |
| Traction | Getlatka reports ~$770K ARR, bootstrapped (no VC) as of 2025; other aggregators are unreliable (one claims "$6M raised / 5,000 customers" - treat as **unverified**, conflicts with YC's "2 people, bootstrapped") | Getlatka (note conflict) |
| npm CTO | Package is published by `kishan@orangeslice.ai` | npm registry |

The conflicting funding/customer numbers from third-party SEO aggregators should not be
repeated as fact. The reliable signal: bootstrapped, tiny, technical, YC S25.

---

## The web product (orangeslice.ai)

An **agentic enrichment spreadsheet**. You describe what you want in chat ("find the
CEO's LinkedIn and get their email"); the AI writes **TypeScript** for that column,
creates the columns, orders dependencies, and runs across thousands of rows. Columns
don't just pull - they **push**: sync to CRM, enroll in sequences, send emails, each
row firing automatically. Marketed as 100+ enrichments, 50+ data sources in a
**waterfall** (Apollo → Hunter → RocketReach style), ~85% match rate. CRM sync with
HubSpot/Salesforce; Slack/Gmail actions; Reddit/HN/forum intent monitoring.

**Conceptual fit with the judging frame (DETECT → ENRICH → SCORE → ACT):** their whole
product *is* this pipeline, expressed as spreadsheet columns. A trigger ingests a signal
(DETECT), code columns enrich + AI-score (ENRICH/SCORE), and push columns/integrations
ACT. Their own docs literally say *"the sheet IS the loop"* and *"triggers push data,
columns do work."*

---

## The developer package (the important part)

`orangeslice` on npm. Latest **2.6.0**, MIT, **zero runtime dependencies**, fully typed,
410 files, ships its own docs tree. Repo: `github.com/kishansripada/npx-orangeslice`
(source not public; the tarball is). Downloads are tiny (~1.5k/month, ~340/week) - i.e.
**few hackathon teams will know it deeply. Going deep here is a differentiator.**

### Install / bootstrap / auth
```bash
npx orangeslice@latest      # also: bunx / pnpm dlx / yarn dlx orangeslice
```
The bootstrap command: copies docs to `./orangeslice-docs/`, writes `AGENTS.md` +
`CLAUDE.md` import lines (so Claude Code/Cursor read the service docs as source of
truth), inits `package.json`, installs `orangeslice` locally, **opens browser device
auth and auto-provisions an API key** (`osk_...`) stored at
`~/.config/orangeslice/config.json`.

Auth commands: `orangeslice login [--force]`, `orangeslice logout`,
`orangeslice auth <API_KEY>`, `orangeslice auth status`.
Credential precedence: `configure({ apiKey })` → `ORANGESLICE_API_KEY` env →
`~/.config/orangeslice/config.json`. There's also `withApiKey(key, fn)` (AsyncLocalStorage)
for multi-tenant server use - a hint they expect people to wrap this in apps.

### Use in code
```ts
import { services, integrations, skills, ctx, configure } from "orangeslice";
```
Transport: all calls POST to `https://enrichly-production.up.railway.app/execute/*`
(and `/ctx/*`), async ops poll a result endpoint, up to **10-minute** timeout for
long workflows. So it's a thin client over their hosted batch service - your key bills
their credits.

### Full `services.*` surface (from `index.d.ts`)
| Namespace | Methods | Under the hood (from `/execute/*` route) |
|---|---|---|
| `services.company.linkedin` | `search` (SQL), `enrich`, `findUrl` | LinkedIn DB (1.15B profiles / 85M companies) |
| `services.company` | `getEmployeesFromLinkedin`, `findCareersPage`, `scrapeCareersPage` | LinkedIn DB + scraping |
| `services.person.linkedin` | `search`, `enrich`, `findUrl` | LinkedIn DB |
| `services.person.contact` | `get` (work/personal email + phone; `required: ["email","work_email","phone"]`, `maxCoverage`) | contact waterfall |
| `services.web` | `search`, `batchSearch` | **SERP** (`/execute/serp`, `/serp-batch`) |
| `services.ai` | `generateObject` (JSON-schema structured extraction/scoring) | **LLM** (`/execute/llm`, accepts `model`, `system`) |
| `services.scrape` | `website` (markdown + links) | **Firecrawl** (`/execute/firecrawl`) |
| `services.browser` | `execute` (cloud **Playwright**, screenshots, network intercept) | **Kernel** browser |
| `services.apify` | `runActor` (any of 10,000+ Apify actors) | **Apify** |
| `services.crunchbase` | `search` (SQL over `public.crunchbase_scraper_lean`) | **Crunchbase** dataset |
| `services.ocean.search` | `companies`, `people` | **Ocean.io** (`/execute/oceanio`) |
| `services.predictLeads` | 27 ops: financing events, tech detections, job openings, news, products, similar companies, GitHub repos, website evolution | **PredictLeads** |
| `services.builtWith` | `lookupDomain`, `relationships`, `searchByTech` | **BuiltWith** (tech-stack) |
| `services.googleMaps` | `scrape` (local businesses) | Google Maps |
| `services.geo` | `parseAddress` | geo parser |

So **"every enrichment provider under one key"** concretely = LinkedIn DB,
Firecrawl, Kernel (browser), Apify, Crunchbase, Ocean.io, PredictLeads, BuiltWith,
SERP, Google Maps, and an LLM endpoint - all behind one `osk_` key and one credit balance.

### `integrations.*` - connect + execute (the ACT layer)
Providers: **hubspot, salesforce, attio, gmail, slack, instantly, heyreach**.
`integrations.connect("hubspot")` (browser OAuth for HubSpot/Salesforce/Attio/Gmail/Slack;
API key for Instantly/HeyReach), or `integrations.create({ provider, apiKey })`. Then call
typed methods directly:
```ts
await integrations.hubspot.createContact({ properties: { email, firstname } });
await integrations.instantly.bulkAddLeads({ campaignId, leads });
await integrations.slack.chatPostMessage({ channel: "#leads", text: "New lead!" });
```
The package **ships per-method docs** (e.g. 68 Attio methods, 47 Slack, 38 HeyReach,
36 HubSpot, 18 Salesforce, 16 Instantly, 9 Gmail). This is a huge, ready-made action
surface - you don't write CRM/Slack/email plumbing, it's done.

### `ctx.*` - the spreadsheet as a programmable DB
```ts
const ss = await ctx.createSpreadsheet({ name: "Leads" });
await ctx.sql(ss.id, "CREATE TABLE contacts (name, email, website)");
const bound = ctx.spreadsheet(ss.id);
await bound.sheet("contacts").addRows({ name: "Corp", email: "corp@example.com" });
await bound.sql("SELECT * FROM contacts");
```
You can drive their actual spreadsheet from code: create sheets, run SQL, add rows.
**Building something that writes results back into an Orange Slice spreadsheet = visibly
"on their product," which the host will love.**

### `skills.*` - reusable knowledge (ICP, templates) with `autoInject`
`skills.create({ title, description, content, autoInject })`. Lets you persist ICP/scoring
rubrics the agent auto-applies.

### Triggers runtime (DETECT layer)
Docs (`triggers-runtime.md`) describe webhook + cron triggers: `ctx.trigger.payload`,
`ctx.trigger.request`, `ctx.triggers.byName(...).webhooks.list(...)`. Philosophy:
**triggers are thin ingesters** that `addRows(..., { run: true })`; all enrichment/scoring
lives in columns. Webhook events persist in `trigger_webhook_events`; runs in
`trigger_runs` (source: `manual | cron | webhook`).

### Restrictions to know (stated in README)
No direct contact data via some paths, no Indeed job-board data, no traffic/analytics
data. Match plans accordingly.

---

## Pricing / credits

| Plan | Price | Credits | Notes |
|---|---|---|---|
| Free | $0 | 2,000 one-time | 10 free messages |
| Starter | $20/mo | 10,000/mo | unlimited messages + custom API requests |
| Growth | $100/mo | 60,000/mo | |
| Scale | $400/mo | 300,000/mo | |
| Enterprise | custom | custom | volume discounts |

Credits roll over; cancel anytime; **all plans get every data platform** (only credit
volume differs). The "50k credits = $50" framing from the brief maps roughly to the
$100/60k = ~$1 per 600 credits tier; treat exact per-enrichment credit cost as
**undocumented** (their pricing page does not publish per-op costs). For a hackathon,
the **free 2,000 credits** + auto-provisioned key is enough to demo; budget calls.

---

## What's genuinely buildable fast

- **DETECT→ENRICH→SCORE→ACT in one file:** `web.search` (dork a signal) → `scrape.website`
  → `ai.generateObject` (score against a `skills` ICP) → `integrations.slack/hubspot/instantly`
  (act). This is ~80 lines and hits *every* judging criterion.
- **Custom-signal detector** (the sponsor thesis "custom signals win"): pick one weird
  signal (job postings via `predictLeads.companyJobOpenings`, tech adds via
  `builtWith.searchByTech` / `predictLeads.companyTechnologyDetections`, financing via
  `predictLeads.companyFinancingEvents`, local-business changes via `googleMaps.scrape`,
  GitHub activity via `predictLeads.companyGithubRepositories`), enrich + score + push.
- **Agent that drives their spreadsheet** via `ctx.*` (create sheet, SQL, addRows) so the
  demo literally shows rows populating in Orange Slice - maximum host appeal.
- **Browser-intercept scraper** (`browser.execute`) that finds a hidden API on a target
  site and paginates it - high "technical complexity" + "coolness."

---

## How to visibly impress the host (they judge)

1. **Use the package, not just the web app.** Almost nobody will go deep on
   `orangeslice@2.6.0`. Show `services.*`, `ctx.*`, `integrations.*`, `skills.*`, and
   `triggers` used together - that signals you actually read their docs.
2. **Write results back into an Orange Slice spreadsheet** (`ctx`) and/or push via their
   integrations, so the demo ends *inside their product*.
3. **Pick ONE custom signal** and wire the full DETECT→ENRICH→SCORE→ACT loop - this is
   the exact frame Lopus/sponsors repeated; mirroring it reads as "they got the brief."
4. **Lean on their AGENTS.md pattern:** run `npx orangeslice@latest` in Claude Code /
   Cursor (their listed keywords: `claude-code`, `cursor`, `mcp`) and let the agent build
   the workflow live - meta-on-brand for an "AI Growth Engineer" host using Codex/Cursor.
5. Keep it a **working demo + 3-min video**, no slides (matches stated win condition).

**Risk / honesty:** the package is a thin hosted client - credits are theirs and rate
limits/poll latency (up to 10 min) are real. De-risk by pre-warming calls before the
demo and caching results so the video isn't waiting on a 202 poll.

## Open-source / templates from Orange Slice
- The **npm package itself** is the artifact (MIT, ships `docs/`, `AGENTS.md`, `CLAUDE.md`
  generators). Repo `kishansripada/npx-orangeslice` is referenced but source isn't public.
- The GitHub repo `richard-flosi/orangeslice` is **unrelated** (a Contentful/Netlify
  personal site) - ignore it.
- `docs.orangeslice.ai` exists as a docs site (the package bundles the same content).

---

## Idea hooks for the hackathon

1. **"One custom signal, fully wired"** CLI/agent built entirely on `orangeslice`:
   detect (e.g. a company just posted a specific job or added a specific tech),
   enrich (LinkedIn DB + contact), score (`ai.generateObject` vs a `skills` ICP),
   act (HubSpot create + Instantly enroll + Slack ping), results written back to a
   `ctx` spreadsheet. Hits all 3 judging axes and ends inside their product.
2. **Browser-intercept "hidden-API" prospector:** `services.browser.execute` to find and
   paginate an undocumented API on a niche source (permits, court records, marketplaces),
   structure with `ai.generateObject`. High technical-complexity + coolness.
3. **Trigger-driven inbound router:** webhook trigger → thin `addRows({run:true})` →
   columns enrich/score/route to the right rep via Slack/HubSpot. Demonstrates their
   "triggers push, columns work" model precisely.
4. **Signal marketplace / composer:** a small UI where you pick a signal + ICP skill and
   it generates the `orangeslice` workflow code (RocketRide-adjacent: nodes → orangeslice
   services). Shows the platform thesis without rebuilding their spreadsheet.
5. **Eval/observability layer for GTM agents:** wrap `orangeslice` calls with
   scoring/cost tracking and a "why this lead" explanation per row - adds the rigor judges
   reward and is genuinely useful.
6. **Convex-track variant:** mirror the spreadsheet-as-DB idea in Convex (reactive rows),
   with Orange Slice services doing enrichment - chases the 70% top-3 *and* the 20% Convex
   prize with one build.

## Sources
- YC profile: https://www.ycombinator.com/companies/orange-slice
- Product: https://www.orangeslice.ai/ , https://www.orangeslice.ai/agents , https://www.orangeslice.ai/pricing
- Docs: https://docs.orangeslice.ai
- npm package (primary): https://www.npmjs.com/package/orangeslice and registry tarball `orangeslice@2.6.0` (README, dist/*.d.ts, docs/*)
- npm registry metadata: https://registry.npmjs.org/orangeslice
- Hackathon: https://events.ycombinator.com/OrangeSliceHackathon , https://luma.com/ufm1y1z1
- Founder: https://www.linkedin.com/in/vihaarnandigala/ , https://x.com/VihaarNandigala
- Traction (treat cautiously): https://getlatka.com/companies/orangeslice.ai
- Press: https://americanbazaaronline.com/2025/07/15/newly-launched-startup-orange-slice-uses-ai-to-help-businesses-find-the-right-customers-465100/
