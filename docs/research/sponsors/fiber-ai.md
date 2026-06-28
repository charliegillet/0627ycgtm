# Fiber AI - Sponsor Dossier

**Prize relevance:** Fiber AI is offering **$500 in API credits** to hackathon participants, the **largest single sponsor credit pool** at the event. Building on Fiber is the single highest-leverage way to land the "custom signal -> DETECT -> ENRICH -> SCORE -> ACT" thesis the judges keep repeating, because Fiber is literally the ENRICH/DETECT data layer.

---

## What Fiber AI is

"The freshest data APIs for AI sales, recruiting, & growth products." A B2B data platform that exposes company/people/jobs data plus contact enrichment as **agent-native APIs and MCP servers**, deliberately positioned to replace bulk-dataset vendors.

- **Coverage:** 40M+ companies, 850M+ people, 30M+ jobs (32M open listings in one source). [1][2]
- **Pricing claim:** uncapped API searches **10x cheaper** than People Data Labs, Cognism, CoreSignal, Explorium; verified emails/phones **4x cheaper** than Clay, Apollo, ZoomInfo. [2]
- **Quality claim:** 90%+ verified contacts, <1% bounce rates. [3]
- **Customers:** HubSpot, Ramp, DocuSign, Agent AI, Flatfile, Karat, Centralize, Fonzi. [1][2]
- **Company:** YC S23 (partner Harj Taggar), NYC, ~8 people, ~$500K raised (TRAC, YC, Soma Capital). Founders **Adi Agashe** (CEO, ex-Microsoft Azure PM, Cornell CS) and **Neel Mehta** (CTO, ex-Google PM, Harvard CS); both co-authored the bestseller *Swipe to Unlock*. [1][4][5]

### Positioning: "endpoints nobody else has"
Fiber's explicit pitch is novel endpoints not on PDL, Cognism, Crustdata, Apollo, or Explorium: **reverse email -> person**, **partial/incomplete-info search**, **AI prospect-list builder across 100+ sources**, and **real-time LinkedIn** company/profile fetch. [2][6] This is the directly judge-relevant differentiator: a demo that does something the audience knows the big vendors can't is the "Coolness" + "Usefulness" win.

---

## API endpoints (concrete)

Base: `https://api.fiber.ai`. Auth resolves in order: body `apiKey` -> `x-api-key` header -> `Authorization: Bearer`. Keys start with `sk_live_`, generated at `fiber.ai/app/api`. [7][8]

**Agent-native docs are a first-class feature:** every operation has a focused markdown page at `/ai-docs/<operationId>.md`; machine schema at `/openapi.json`; routing index at `/llms.txt` and `/ai-docs/index.md`; interactive try-it at `/docs`. This is why Fiber is unusually easy to wire into a coding agent. [7]

### The "magical" endpoints (only / best on Fiber)

| Operation | Path | What it does | Cost |
|---|---|---|---|
| **reverseEmailLookup** | `POST /v1/email-to-person/single` | Email in -> full LinkedIn-grade person profile out (name, headline, current job, full experience, education, skills, location, slug) | 2 cr |
| **multiSourceSearch** | `POST /v1/multi-source/search` | NL query across LinkedIn + Google Maps + web; great for SMB/local where web/LinkedIn presence is spotty; returns companies OR prospects; cursor-paginated to 1,000 | 2 cr per company/prospect found |
| **profileLiveEnrich** | `POST /v1/linkedin-live-fetch/profile/single` | Real-time LinkedIn profile fetch (2-4s), not a cached snapshot | 2 cr |
| **companyLiveEnrich** | live company fetch | Real-time LinkedIn company data | (per-call) |
| **nlpSearchParse** | `POST /v1/nlp-search/parse` | Parse natural language into structured search params (partial-info search) | free/low |

### Search & discovery

| operationId | Path | Notes |
|---|---|---|
| companySearch | `POST /v1/companies/search` | Typed filters w/ `anyOf`/`noneOf`; location, industry, size, tech stack. 1 cr/result |
| peopleSearch | `POST /v1/people/search` | Filters: jobTitleV2 (term/static/dynamic groups), seniority (Entry..Executive), company LinkedIn IDs, country codes, age, connections, keywords (AND/OR), employment date ranges. 1 cr/profile |
| textToCompanySearch / textToProfileSearch | `/v1/text-to-*-search` | NL -> structured search |
| jdToProfileSearch | `/v1/jd-to-profile-search` | Job description -> candidate matches (recruiting) |
| companyCount / peopleSearchCount | `/v1/*/count` | Count-only (free TAM sizing) |

### Contact enrichment (waterfall)

| operationId | Path | Notes |
|---|---|---|
| syncQuickContactReveal | `POST /v1/contact-details/single` | LinkedIn URL/slug/URN/ID -> work+personal emails, phones. `enrichmentType` toggles (getWorkEmails/getPersonalEmails/getPhoneNumbers); `validateEmails` bounce-checks before returning. 200 rpm |
| syncTurboContactEnrichment | turbo | premium fastest tier |
| triggerExhaustiveContactEnrichment / poll | async | waterfall for max coverage |
| startBatchContactDetails / poll | batch | 10-2,000 identifiers |

Reveal credit costs: work email 2, personal email 2, phone 3, all emails 3, everything 5. [8]

### Resolvers, audience, tracker

- **KitchenSinkProfile / kitchenSinkCompany** - resolve a person/company from *any* identifier; 44+ top-level fields. Great "throw whatever you have at it" demo.
- **Audience workflow** (server-side bulk lists): `createAudience` -> `updateAudienceSearchParams` -> `buildAudience` (charges) -> `estimateEnrichmentCost` (free preview) -> `triggerEnrichment` -> `getEnrichmentStatus` -> `exportCompanies`/`exportProspects`. Create/configure/estimate/export are free; build/enrich charge. [7]
- **Tracker / signals (DETECT layer):** `listAvailableTrackerRules` returns **52 tracker rule types** (company + person) each with config schema + example signal payload; `previewTrackerSignal` and `fireTrackerDummy` let you test webhook wiring for free. [7]
- **Job change tracking:** `POST /v1/job-changes/create-list` -> `add-profiles` -> `update-list` (activate). Classifies movements: `promoted`, `lateral-move`, `new-role` (billable), `changed`/`no-change` (free). Fires `job.changed` webhook. **Weekly** scan cadence, ~1 credit (~$0.02)/profile/month. [9]
- Utility: `getOrgCredits`, `getRateLimits`, `/v1/regions`, `/v1/industries`. [7]

### Example: reverse email -> person
```bash
curl -X POST https://api.fiber.ai/v1/email-to-person/single \
  -H "x-api-key: sk_live_xxx" -H "Content-Type: application/json" \
  -d '{"email":"person@example.com"}'
```
Returns `output.data[]` with name, headline, current_job, experiences, education, skills, url, primary_slug + `chargeInfo`. [6]

---

## MCP (how it plugs into an agent)

Three remote MCP servers: [10]

| Server | URL | Auth | Use |
|---|---|---|---|
| **V2** | `https://mcp.fiber.ai/mcp/v2` | API key | ~10 curated tools (recommended) |
| **V3** | `https://mcp.fiber.ai/mcp/v3` | OAuth/SSO | every public op as a tool |
| **Core** | `https://mcp.fiber.ai/mcp` | API key | 5 meta-tools for runtime discovery |

V2 tools: `api_companySearch`, `api_peopleSearch`, `api_individualRevealSync`, `api_companyLiveFetch`, `api_personLiveFetch`, `api_getOrgCredits`. Core meta-tools: `search_endpoints`, `list_tag_packs`, `list_all_endpoints`, `get_endpoint_details_full`, `call_operation` (lets an agent discover + call *any* endpoint at runtime - powerful for an autonomous agent demo).

Claude Desktop config:
```json
{ "mcpServers": { "fiber-ai-v2": {
  "url": "https://mcp.fiber.ai/mcp/v2",
  "transport": { "type": "http" },
  "headers": { "x-api-key": "sk_live_..." } } } }
```

---

## Claude Code plugin (skills, not personas)

The docs frame these as **skills** that teach the agent correct Fiber usage. Install: [11]
```
claude plugin marketplace add fiber-ai/fiber-ai-plugin --scope project
claude plugin install fiber --scope project
```
Bundles the MCP servers + skills + agent config. Skills: **search**, **enrich**, **audience**, **sdk-ts**, **sdk-py**, **setup**, **help**. (The persona names in our brief - gtm-sdr, signal-scout, find-and-enrich-by-role - are *not confirmed* in current docs; treat as unverified / possibly older naming. The live skill set is the seven above.)

---

## OpenFiber - fork this for a head start

`open.fiber.ai` / `github.com/fiber-ai/open-fiber`. **MIT-licensed**, open-source reference prospecting app on Fiber's APIs. [12]

- **Stack:** Next.js + React + TypeScript (strict), tRPC + Zod, `@fiberai/sdk`, shadcn/ui + Lucide, TanStack Query/Table, Tailwind. ~99.7% TS.
- **Run:**
```bash
git clone https://github.com/fiber-ai/open-fiber.git
cd open-fiber/nextjs && npm install
cp .env.example .env   # set FIBER_API_KEY
npm run dev            # http://localhost:3000
```
- **Features already built:** company/prospect search w/ 40+ filters, audience creation, LinkedIn-URL enrichment, email validation, CSV import/export, single + batch lookups, domain/email/phone/GitHub lookups, job-posting search, job-change tracking. No DB or OAuth required.
- **Verdict:** This is a real head start. Fork it, then add the *one novel signal + ACT* layer (scoring, agent, CRM push) the judges want. Don't rebuild the data UI; spend your time on the magic.

---

## How to get the $500 credits working
1. Sign up at `fiber.ai`, generate `sk_live_` key at `fiber.ai/app/api`. [8]
2. Claim the hackathon credit grant from the Fiber sponsor table/contact at the event (the $500 is an event grant, not a public self-serve promo - confirm balance via `getOrgCredits` or `fiber.ai/app/subscription`).
3. Wire it: set `FIBER_API_KEY`, or install the Claude Code plugin, or add the V2 MCP server. Use free ops first (counts, estimates, tracker preview) to validate before spending credits.

---

## Idea hooks for the hackathon

- **Reverse-email "who just hit my site" engine.** Ingest inbound emails / form fills / Stripe customers / waitlist -> `reverseEmailLookup` -> live LinkedIn enrich -> score by ICP fit -> route hot leads to Slack/CRM. The reverse-email move is genuinely "nobody else has it" and demos instantly.
- **Custom signal -> Fiber tracker -> agent ACT.** Pick ONE signal (e.g. job change into a buyer role, or a competitor's new hire), wire `listAvailableTrackerRules` + `job.changed` webhook -> enrich -> draft personalized outreach with an LLM -> push. Hits the exact DETECT->ENRICH->SCORE->ACT frame the Lopus judge wants.
- **SMB/local goldmine via multiSourceSearch.** Build prospect lists for businesses with no LinkedIn/web presence (Google Maps-backed). Differentiator the audience hasn't seen; strong "Usefulness" story.
- **TAM/territory builder agent.** NL -> `textToCompanySearch`/`peopleSearch` + free `count` endpoints -> instant TAM sizing + buying-committee map via KitchenSink. Cheap to demo (counts are free).
- **Fork OpenFiber + add an autonomous research agent** using the Core MCP `call_operation` meta-tool so the agent discovers and chains Fiber endpoints at runtime - strong "Technical Complexity" signal.
- **RocketRide angle:** wrap Fiber endpoints as RocketRide agent/tool nodes (reverse-email, live-enrich, tracker webhook ingress) to ship a reusable GTM-signal pipeline node pack - real product value beyond the hackathon.
- **Convex cross-prize stack:** Convex as the realtime store/queue for incoming signals + enriched records, Fiber as the data layer. One build, two prize pools.

---

## Sources
1. https://www.ycombinator.com/companies/fiber-ai
2. https://www.ycombinator.com/launches/PDN-fiber-ai-freshest-data-apis-for-ai-sales-recruiting-growth-products
3. WebSearch result citing fiber.ai (90%+ verified, <1% bounce)
4. https://tracxn.com/d/companies/fiber-ai/__ApXbv7hje8c2RTNj5DH93amv35X2RivVvz7v1JwD6ig
5. https://www.linkedin.com/in/neel-a-mehta/
6. https://api.fiber.ai/ai-docs/reverseEmailLookup.md (`/v1/email-to-person/single`)
7. https://api.fiber.ai/llms.txt and https://api.fiber.ai/ai-docs/index.md
8. https://api.fiber.ai/ai-docs/syncQuickContactReveal.md
9. https://docs.fiber.ai/article/job-change-tracking
10. https://docs.fiber.ai/article/using-mcp-in-llms
11. https://docs.fiber.ai/article/developing-with-ai-agents
12. https://github.com/fiber-ai/open-fiber
