# Lopus + the DETECT/ENRICH/SCORE/ACT stack

Research dossier for the AI Growth Hackathon (Orange Slice, June 27-28, 2026).
Target: Lopus (sponsor + judge) and the recommended build stack for a custom-signal pipeline.

---

## 1. Lopus the company (verified)

| Field | Value | Source |
|---|---|---|
| What it is | "The Operations Data Platform for RevOps, BizOps teams." A governed semantic layer that unifies CRM + billing + product + support + warehouse and answers business questions without SQL. | lopus.ai, YC |
| Tagline | "Data is messy. Answers shouldn't be." | lopus.ai |
| YC batch | Winter 2025 (W25) | YC company page |
| Founded | 2024, San Francisco | startupintros / Crunchbase |
| Founders | Aamish Ahmad Beg (Co-founder, CEO) and Danylo Borodchuk (Co-founder) | YC page |
| Team size | 2 | YC page |
| Funding | ~$500K, pre-seed/seed (Feb-Mar 2025). Investors: Y Combinator, Costanoa Ventures, Preston-Werner Ventures. | Crunchbase / startupintros |
| YC partner | Harj Taggar | YC page |

**The judge ("Dan Low").** The official hackathon page describes the Lopus judge as "CEO and Co-founder of Lopus (YC W25), a Dartmouth dropout who previously did award-winning R&D for YC startups and medical research teams at DALI Lab." That biography (Dartmouth, DALI Lab) maps to **Danylo Borodchuk**, who goes by "Dan" (the brief's "Dan Low" / "Danilo"). Note a discrepancy worth knowing in the room: the YC company page lists **Aamish Ahmad Beg as CEO** and Danylo as Founder, while the hackathon page calls the judge "CEO." Either way, the judging brain you are optimizing for is Danylo's. Treat him as the technical, opinionated data-architecture voice.

### Lopus's actual product thesis (this is the lens to win)
From Danylo's GTM Vault podcast appearance ("The Semantic Layer Is the Missing GTM Architecture"):
- Core pain: **"12 tools, 12 definitions of customer, zero agreement on what revenue means."** Dashboards are full, the data team is underwater.
- Solution: **a governed semantic layer between raw data and every query** the business runs. Definitions are stored in **dual format: SQL plus plain-English intent**, and the layer is **"self-healing"** (regenerates correct SQL when schemas drift).
- **Trust over confidence:** the agent **refuses to answer when data can't support it** ("tells you instead of hallucinating a result"). When you join two unrelated sources, it says so.
- Signal/attribution example he uses: a blog post with **1,000 views can produce higher-ACV customers than one with 10,000 views**, once you connect content -> CRM -> billing. This is the "custom signal beats vanity metric" worldview.

**Implication for judging:** Danylo will reward projects that (a) define a signal precisely and defensibly, (b) wire it end-to-end with **lineage you can point at**, and (c) **degrade gracefully / admit uncertainty** rather than confidently hallucinate. A demo that says "we can't confidently score this account because we lack X" will land better with him than one that fakes a number.

---

## 2. The DETECT -> ENRICH -> SCORE -> ACT frame

This is the central conceptual spine of the hackathon (pushed by Lopus). It is also a real, widely-used GTM pattern (Unify, Clay, Aviso all describe variants). Map every project component to one of the four stages:

1. **DETECT** - capture a custom signal event (web visit, job change, funding, GitHub activity, product usage milestone, a specific kind of post). "Infrastructure was never built to detect the signals invisible to most revenue teams."
2. **ENRICH** - when the signal fires, attach context: company, person, firmographics, tech stack, recent news, related records in CRM/billing.
3. **SCORE** - qualify and prioritize: fit + intent + timing -> a ranked, explainable score.
4. **ACT** - trigger the right response: draft outreach, notify a rep in Slack, create a CRM task, enroll in a sequence.

Sponsor thesis to echo in your pitch: **"the higher-leverage signals are custom, not bought."** Pick ONE signal nobody is buying off the shelf and own it end-to-end.

---

## 3. The recommended build stack (practical guide)

The brief specifies a Python-ingestion + Postgres/DuckDB-analytics + TypeScript-agents stack. Here is what each piece is, why it's chosen, and how to wire it.

### dltHub (`dlt`) - INGESTION (the DETECT/ENRICH plumbing)
- **What:** open-source Python library (`pip install dlt`, Apache 2.0) that loads messy sources into structured, live datasets. Handles schema inference + evolution, normalization, incremental loading, merge/dedupe, retries, state, lineage.
- **Why chosen:** you declare ingestion in Python; a self-contained engine does the hard parts. Perfect for "I scraped/pulled a weird custom source, now make it a clean table" in <1 hour.
- **Wire it:** `@dlt.resource` (table config + incremental cursor) -> `@dlt.source` (group resources) -> `dlt.pipeline(destination="postgres" | "duckdb")` -> `pipeline.run(...)`. Incremental via `dlt.sources.incremental("updated_at")` so re-runs only pull new rows (idempotent). REST sources get `dlt.sources.helpers.rest_client.paginate`.

```python
import dlt
from dlt.sources.helpers.rest_client import paginate

@dlt.resource(table_name="issues", write_disposition="merge", primary_key="id")
def get_issues(updated_at=dlt.sources.incremental("updated_at", initial_value="1970-01-01T00:00:00Z")):
    for page in paginate("https://api.github.com/repos/dlt-hub/dlt/issues",
                         params={"since": updated_at.last_value, "per_page": 100, "sort": "updated"}):
        yield page

pipeline = dlt.pipeline(pipeline_name="signals", destination="postgres", dataset_name="raw")
print(pipeline.run(get_issues))
```

### Postgres + DuckDB via `pg_duckdb` - READ/ANALYTICS (the SCORE substrate)
- **What:** `pg_duckdb` embeds DuckDB's columnar/vectorized engine inside Postgres (built with Hydra + MotherDuck). Run analytical SQL in Postgres but execute it on DuckDB. Reads Parquet/CSV/JSON/Iceberg/Delta from S3/GCS/Azure/R2; optional MotherDuck compute.
- **Why chosen:** one database for both your app's transactional rows AND fast OLAP scoring queries (aggregations, window functions, big joins) without a separate warehouse. Claimed up to ~1500x on some queries, ~10x typical.
- **Wire it:** Docker `pgduckdb/pgduckdb:17-v1.x` (PG 14-18). `SET duckdb.force_execution = true;` routes analytics to DuckDB. Query a data lake file directly with `read_parquet('s3://...')` and **join it to local Postgres tables** in one query, which is the "unify everything" move Lopus sells.

```sql
SET duckdb.force_execution = true;
SELECT account_id, count(*) AS signal_events, max(ts) AS last_seen
FROM read_parquet('s3://bucket/web_signals.parquet')
GROUP BY account_id;          -- join to local crm.accounts for fit scoring
```

### Trigger.dev - ORCHESTRATION (the heartbeat of DETECT and the ACT trigger)
- **What:** open-source TypeScript background-jobs / workflow platform. Package `@trigger.dev/sdk`. No timeouts, durable retries, queues, idempotency, cron schedules, webhooks, real-time + human-in-the-loop pauses, full tracing per run. Can run browsers/Python/FFmpeg in a task.
- **Why chosen:** code-native (not a separate DSL/n8n canvas), durable long-running agent runs, and dead-simple cron + webhook triggers, which are exactly DETECT (poll) and ACT (fire on event).
- **Wire it:** cron task polls a source on a schedule; a regular task is triggered from a webhook handler or from another task.

```ts
import { schedules, tasks } from "@trigger.dev/sdk";

export const pollSignals = schedules.task({
  id: "poll-signals",
  cron: "*/15 * * * *",                 // every 15 min = DETECT
  run: async () => { /* call dlt/scrape, then */ await tasks.trigger(scoreAccount.id, {accountId}); },
});

export const scoreAccount = tasks.task({  // ENRICH+SCORE+ACT
  id: "score-account",
  run: async (p) => { /* enrich -> SQL score -> Slack/CRM */ },
});
```

### Mastra + Vercel AI SDK - AGENTS (the ENRICH/SCORE reasoning + ACT drafting)
- **What:** Mastra is a TypeScript-native agent framework built **on top of** the Vercel AI SDK (AI SDK = low-level model calls + streaming + 40+ providers; Mastra = agents, tools, memory, workflows, human-in-the-loop, eval, observability). Packages: `@mastra/core/agent`, `@mastra/core/tools`, providers like `@ai-sdk/openai` / `@ai-sdk/anthropic`.
- **Why chosen:** lets your agent decide which enrichment tools to call, score with reasoning + explanation, and draft the outreach, all in the same TS codebase as Trigger.dev. Mastra workflows give deterministic branching when you don't want a free-roaming agent.
- **Wire it:** define enrichment/scoring as `createTool()` (zod in/out), give them to an `Agent` with a model and instructions, call `agent.generate()` inside a Trigger.dev task.

```ts
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const scoreTool = createTool({
  id: "score-account", description: "Score fit+intent with explanation",
  inputSchema: z.object({ accountId: z.string() }),
  outputSchema: z.object({ score: z.number(), reasons: z.array(z.string()), abstain: z.boolean() }),
  execute: async ({ accountId }) => { /* run pg_duckdb SQL, return score + lineage */ },
});

const agent = new Agent({ name: "gtm", model: openai("gpt-4.1"),
  instructions: "Score accounts. If data is insufficient, set abstain=true rather than guessing.",
  tools: { scoreTool } });
```
(For Anthropic, swap to `@ai-sdk/anthropic` + `anthropic("claude-...")`; check claude-api skill for current model IDs/pricing before hardcoding.)

### Slack / Gmail / React - INTERFACE (the ACT surface + the demo)
- Slack incoming webhook / Bot token for "rep gets a rich alert with score + reasons + one-click action." This is the most demo-friendly ACT.
- Gmail API (or a draft) for "auto-drafted, signal-specific outreach." Drafts > auto-send for a safe live demo.
- React (or Next.js) dashboard showing the signal feed, scores, and **lineage back to source** (mirrors Lopus's own value prop, will resonate with the judge).

---

## 4. How to build DETECT/ENRICH/SCORE/ACT in <24h (concrete)

1. **Pick ONE custom signal** (see section 6). Define it precisely in one sentence.
2. **DETECT (Trigger.dev cron + dlt):** a 15-min `schedules.task` pulls the source via `dlt` into Postgres `raw.*`. Incremental so it's idempotent.
3. **ENRICH (Mastra tools):** agent tools hit one or two enrichment APIs (or a scrape) and write to `enriched.*`.
4. **SCORE (pg_duckdb SQL + Mastra):** a single `force_execution` SQL produces fit/intent/timing features; the agent turns them into a score **plus a list of reasons**, and can **abstain** when data is thin (this is your Lopus-aligned differentiator).
5. **ACT (Slack/Gmail):** Trigger.dev task posts a Slack alert with score + reasons + a drafted email link. Human-in-the-loop approve before send.
6. **Demo surface:** React feed with click-through lineage. Record the 3-min video showing one real signal flowing all four stages live.

**Time budget:** ingestion+DB up in ~2h, scoring SQL ~2h, agent+tools ~3h, Slack/Gmail act ~2h, React feed ~3h, polish+video ~3h. Leaves buffer.

---

## 5. Trade-offs: this stack vs. just using Convex

The 20% Convex-track goal pulls toward Convex; the 70% top-3 goal is stack-agnostic. Honest assessment:

| Dimension | Recommended stack (dlt/PG+DuckDB/Trigger/Mastra) | Convex |
|---|---|---|
| Analytics / scoring SQL | **Strong.** pg_duckdb does heavy aggregations, window fns, Parquet/S3 joins natively. | Weak. No SQL; document-relational; complex joins/aggregations are manual and slow. |
| Real-time UI | Good (Trigger.dev real-time + React), but you wire it. | **Strong.** Reactive queries auto-sync to clients out of the box; great for a live dashboard demo. |
| Background jobs / cron / webhooks | **Strong, purpose-built** (Trigger.dev). | Has scheduled functions/actions, decent but less observability than Trigger. |
| Ingestion of messy sources | **Strong** (dlt schema evolution, incremental). | You hand-roll ingestion in TS actions. |
| Agent loop | Mastra + AI SDK, mature. | Convex Agent component exists; fine, less batteries-included than Mastra. |
| Speed to a polished full-stack app | Slower (more moving parts). | **Faster** end-to-end TS, one deploy. |
| Prize fit | Best for the **main top-3** (technical complexity + real GTM analytics). | Best for the **$1000/$500 Convex track** specifically. |

**Recommendation:** if you target top-3 on technical complexity and genuine GTM analytics, the recommended stack wins because **scoring is a SQL/analytics problem and pg_duckdb is built for it**. If you split-bet for the Convex track, the cleanest hybrid is **Convex for the reactive UI + scheduled functions and ingest/score in the data layer**, but maintaining two backends in 24h is risky. A pragmatic compromise: build the full pipeline on the recommended stack, and if time allows, put the **front-end feed on Convex** to qualify for that track without rebuilding the engine. Note: the brief's Convex prize figures ($1000/$500) appear event-specific; Convex's public hackathons have used larger figures ($3-4K), so confirm exact amounts on-site.

---

## 6. Creative custom-signal sources (DETECT ideas)

The whole game is a signal nobody buys off the shelf. Strong candidates and how to detect them:

- **GitHub activity as buying intent:** a target account's org stars/forks a relevant repo, opens issues mentioning a competitor, or its eng team's commit velocity spikes. Detect via GitHub REST/GraphQL + dlt incremental on `updated_at`. Very technical, very "custom signal," and aligns with RocketRide's developer audience.
- **Job-posting signals:** company posts a role implying budget/tooling intent (e.g., "Hiring RevOps engineer" -> they'll buy GTM tools). Detect via a jobs-board scrape (Trigger.dev browser task) + LLM classification.
- **Product telemetry milestones:** a free user crosses a usage threshold (Nth API call, invited 3 teammates) = PQL. Detect from your own event stream into Postgres; score with pg_duckdb window functions.
- **Web/content attribution (Lopus's own example):** which specific pages drive high-ACV signups, not high traffic. Join web events -> CRM -> billing in one pg_duckdb query. This directly mirrors the judge's worldview.
- **Social signals:** a champion changes jobs (LinkedIn), or a target posts about a pain you solve (X/LinkedIn). Detect via scrape + embedding similarity to "pain" exemplars.
- **Tech-stack change signals:** target adds/removes a tool (BuiltWith-style fingerprint, or a public status/changelog). Detect via periodic fetch + diff.
- **Funding / news events:** funding round, exec hire, expansion. Classic but easy to enrich and act on; pair with a rarer signal for novelty.

**Differentiator move (Lopus-aligned):** make the SCORE step **explainable and abstaining**. Show lineage from raw signal -> features -> score -> action, and have the agent say "low confidence, missing X" when appropriate. That single behavior is the cheapest way to win Danylo specifically.

---

## Idea hooks for the hackathon

- **"Custom Signal Engine" demo:** one screen, one signal (GitHub-intent or job-posting), flowing DETECT->ENRICH->SCORE->ACT live, ending in a Slack alert + drafted Gmail. Lead the pitch with "the higher-leverage signals are custom, not bought."
- **Explainable, abstaining scorer:** a Mastra agent that produces score + reasons + lineage and **refuses to score when data is insufficient**, mirroring Lopus's "tells you instead of hallucinating." Pure judge-bait for Danylo.
- **pg_duckdb "warehouse-in-Postgres" flex:** show a single SQL joining an S3 Parquet signal lake to live CRM rows for scoring, to score high on technical complexity.
- **RocketRide tie-in (the 10%):** model the whole pipeline as RocketRide agent-nodes (DETECT/ENRICH/SCORE/ACT as nodes), demoing that RocketRide can express a real GTM signal pipeline. Doubles as dogfooding.
- **Convex hybrid:** keep the engine on the recommended stack, ship the reactive signal-feed UI on Convex to also enter the Convex track. Only if time allows; do not split the backend.
- **Lineage UI:** React feed where every score is click-through to the raw source rows. Visually echoes Lopus's "answers with lineage back to source."

## Sources
- https://lopus.ai/
- https://www.ycombinator.com/companies/lopus
- https://www.ycombinator.com/companies/lopus-ai
- https://www.gtmvault.co/p/gtm-43-the-semantic-layer-is-the
- https://podscan.fm/podcasts/gtm-vault/episodes/the-semantic-layer-is-the-missing-gtm-architecture-with-danylo-borodchuk-lopus-ai
- https://startupintros.com/orgs/lopus-ai
- https://www.crunchbase.com/organization/lopus-ai
- https://events.ycombinator.com/OrangeSliceHackathon
- https://www.orangeslice.ai/
- https://dlthub.com/docs/tutorial/load-data-from-an-api
- https://dlthub.com/product/dlt
- https://github.com/duckdb/pg_duckdb
- https://motherduck.com/blog/pgduckdb-beta-release-duckdb-postgres/
- https://trigger.dev/docs/introduction
- https://trigger.dev/docs/tasks/scheduled
- https://mastra.ai/
- https://mastra.ai/reference/tools/create-tool
- https://github.com/mastra-ai/mastra
- https://mastra.ai/blog/using-ai-sdk-with-mastra
- https://www.convex.dev/
- https://docs.convex.dev/understanding/
- https://www.unifygtm.com/explore/signal-based-selling
