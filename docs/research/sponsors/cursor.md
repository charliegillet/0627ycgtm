# Cursor - Sponsor / Judge Research Dossier

Prepared for the AI Growth Hackathon (Orange Slice, June 27-28). Cursor is a
sponsor and provides a judge from its founding growth team. Prize for the Cursor
track: **$500 to 1st place + $50 in Cursor credits**.

Two things to optimize for: (1) build something that meaningfully *uses* Cursor's
newest programmatic surfaces (SDK / CLI / Cloud Agents API / Automations), and
(2) speak the language of Cursor's growth org, which is itself a model "GTM
engineering" team (custom signals -> data -> AE workflow). A project that is a
working GTM tool *built with* Cursor agents as a runtime hits both.

---

## TL;DR for the team

- Cursor agents are now a **programmatic runtime you can call from your own
  product**: TypeScript SDK (`@cursor/sdk`), a headless CLI (`cursor-agent -p`),
  and a REST **Cloud Agents API** (`POST /v1/agents`) with SSE streaming and
  signed webhooks. You can literally make "a Cursor agent" the worker behind a
  DETECT -> ENRICH -> SCORE -> ACT pipeline.
- **Automations** = repeatable cloud agents triggered by cron, webhook, GitHub,
  Slack, Linear, Sentry, PagerDuty. This is the cleanest "ACT" layer in the whole
  hackathon: a signal fires -> webhook -> Cursor agent runs a prompt with tools
  (Slack message, PR comment, MCP, browser/computer-use) -> done.
- **Composer** (now Composer 2 / 2.5) is Cursor's own MoE model: near-frontier
  coding quality at ~4x speed and ~1/10th the API cost of Opus/GPT-5.5. Good
  default for an agent loop where latency and cost matter in a live demo.
- Cursor's **growth org** is a textbook GTM-engineering shop: a GTM Data
  Scientist owns dbt pipelines and a "semantic layer reps can build from"; GTM
  Engineers wire firmographic/technographic/intent **signals** into scoring and
  routing; the stated goal is "define how GTM interacts with data in an AI-first
  way" and decide "what's self-serve via Cursor vs prebuilt dashboards." Mirror
  this exactly.

---

## Product timeline (get the version names right)

| Release | Date | Headline |
|---|---|---|
| **Cursor 2.0 + Composer** | Oct 29, 2025 | Agent-first UI, run up to 8 agents in parallel, first Composer model | 
| **Cursor 2.4** | early 2026 | Subagents & Skills | 
| **Cursor 3 ("the new Cursor")** | Apr 2, 2026 | **Agents Window**, Design Mode, full Cloud Agents w/ local<->cloud handoff, Composer 2 | 
| **Cursor SDK (TypeScript)** | Apr 28, 2026 | `@cursor/sdk` - run Cursor agents from your own code | 
| **Composer 2.5** | May 18, 2026 | Rivals Opus 4.7 on SWE-Bench / Terminal-Bench; ~1/10th cost | 

Note: judges may say "Cursor 3" and "Composer 2.5" - those are current as of the
hackathon. "Composer" alone usually means the model family.

---

## Cursor as a runtime component (the part that matters for a build)

### 1) TypeScript SDK - `@cursor/sdk`
Install: `npm install @cursor/sdk`. Same harness as the IDE (code indexing,
semantic search, instant grep, MCP, skills, hooks, subagents). Core shape:

```ts
import { Agent } from "@cursor/sdk";

const agent = await Agent.create({
  apiKey: process.env.CURSOR_API_KEY!,
  model: { id: "composer-2" },        // or "gpt-5.5"
  local: { cwd: process.cwd() },      // or cloud / self-hosted worker
});

const run = await agent.send("Find the root cause of the failing test and fix it");
for await (const event of run.stream()) { /* status, assistant, tool_call, result */ }
```

Other capabilities: `Agent.getRun(id, { runtime: "cloud", agentId })` to
reattach to a cloud run, `autoCreatePR: true`, subagent delegation, MCP via
`.cursor/mcp.json` or inline, session reconnect after network drops. Billing =
token-based. There is a native `/sdk` skill inside Cursor to scaffold this.

**Why we care:** you can embed a Cursor agent as the "brain" of a GTM workflow.
Cursor's own blog calls out "custom internal platforms (e.g., GTM teams querying
product data)" as a use case - that is *exactly* the hackathon theme.

### 2) Headless CLI - `cursor-agent`
Install: `curl https://cursor.com/install -fsS | bash`. Auth:
`export CURSOR_API_KEY=...`. Print/non-interactive mode is the automation path:

```bash
cursor-agent -p "Analyze this code"                      # final answer only
cursor-agent -p --force "Refactor to ES6"                # --force/--yolo applies edits
cursor-agent -p --output-format json "..."               # structured result
cursor-agent -p --output-format stream-json --stream-partial-output "..."
```

Modes: `--plan` / `--mode=plan`, `--mode=ask` (read-only), `--worktree [name]`
(isolated git worktree), `--resume [thread-id]`. Reads `.cursor/rules`,
`AGENTS.md`, `CLAUDE.md`. Supports MCP (`mcp.json`) and ACP (`agent acp`) for
custom clients. Can search code, run shell, do file ops, browse the web. Trivial
to fan out: `find src -name '*.js' | while read f; do cursor-agent -p --force "doc $f"; done`.

### 3) Cloud Agents REST API - `POST /v1/agents`
Isolated cloud VMs, clone repo, work on a branch, push for handoff. Public beta
(v1; v0 deprecated). Auth: Bearer/Basic API key (service-account keys for teams).

Key endpoints:
- `POST /v1/agents` - create. Body: `prompt.text` (req), `model.id`,
  `repos[].url` + `startingRef`, `autoCreatePR`, `workOnCurrentBranch`,
  `envVars` (<=50, encrypted), `mcpServers` (http/sse/stdio), `customSubagents`.
- `POST /v1/agents/{id}/runs` - follow-up prompt (409 if a run is active).
- `GET /v1/agents/{id}/runs/{runId}/stream` - **SSE** events: `status`,
  `assistant`, `thinking`, `tool_call`, `result`, `error`; resumable via
  `Last-Event-ID`.
- `GET .../usage` (tokens), `GET .../artifacts` + `download` (15-min presigned
  S3 URLs), `GET /v1/models`, `GET /v1/repositories`, `GET /v1/me`.
- Webhooks: signed with `X-Webhook-Signature` (HMAC-SHA256). Event
  `statusChange` -> `FINISHED` | `ERROR`; payload has `id`, `status`, `source`,
  `target.prUrl`/`branchName`, `summary`. **Verify on raw body before parsing.**

### 4) Automations (the "ACT" primitive)
"Cursor Automations run cloud agents in the background, on a schedule or in
response to events from GitHub, GitLab, Slack, webhooks, Linear, and more."
Create via Agents Window, `cursor.com/automations`, the `/automate` skill, or
Marketplace templates. Triggers: **cron/preset schedule**, **private webhook
endpoint** (save -> get URL + API key, then POST to start), and event triggers
(PR opened/merged/labeled, Slack message/emoji/channel, Linear issue/status,
Sentry, PagerDuty). Tools an automation can use: open/comment on PRs, request
reviewers, **send Slack messages / read channels**, **MCP servers**, persistent
memories, and **computer use (browser automation + screenshots)**. Automations
always run in Max Mode and are billed as cloud-agent usage.

**This is the highest-leverage Cursor surface for a Growth build.** A custom
signal -> webhook -> automation -> Cursor agent that enriches, scores, drafts,
and posts to Slack/CRM is a complete DETECT->ENRICH->SCORE->ACT loop, mostly
on Cursor's rails.

---

## Composer model - strengths to exploit in a demo

- **Architecture:** Mixture-of-Experts, long-context, RL-trained specifically
  for agentic SWE. Trained in "hundreds of thousands of concurrent sandboxed
  coding environments" with real tools (edit files, run terminal, **codebase
  semantic search**); learned behaviors like running unit tests and fixing lint
  on its own.
- **Speed:** ~**4x faster** generation than similar-intelligence models; most
  turns complete in **under 30s** - keeps a live demo snappy.
- **Quality:** Composer 2.5 scores **62 on the Coding Agent Index** (3rd, behind
  Opus 4.7 max in Claude Code at 66 and GPT-5.5 xhigh in Codex at 65);
  Terminal-Bench 2.0 61.7 -> **69.3**, internal CursorBench v3.1 52.2 -> **63.2**.
- **Cost:** roughly **1/10th** the API cost of Opus 4.7 / GPT-5.5. A "Fast"
  variant is ~30% faster (6.7 vs 9.3 min/task) at ~6x cost.
- **Eval philosophy:** "CursorBench" measures usefulness to a developer -   adherence to a codebase's existing abstractions, not just unit-test passing.

Takeaway: default the agent loop to `composer-2`/`composer-2.5` for speed+cost in
the demo; switch to `gpt-5.5` only if a step needs max reasoning.

---

## What Cursor's growth org actually does (mirror this to impress the judge)

Cursor's growth function is small, technical, and data-first - itself a model
"GTM engineering" team. From their own job posts:

- **GTM Data Scientist:** owns "the GTM data models and pipelines that power
  analysis" (dbt), investigates "what's driving (and blocking) revenue: funnel
  conversion, segment performance, customer success, and rep productivity,"
  optimizes "forecasting, quota, and capacity models," and builds "a trustworthy
  semantic layer reps and leadership can build from." Pulls from CRM (Salesforce),
  pipeline, CS, and product data.
- **GTM Engineer / GTM Systems:** "define how GTM interacts with data in an
  AI-first way - what's self-serve via Cursor and what's prebuilt into governed
  dashboards and applications," partnering with RevOps, GTM Apps, product Data,
  and Enterprise Engineering. Configure enrichment (firmographic/technographic),
  build **scoring models** (fit/intent/engagement) and **routing logic** for AEs;
  outputs are curated audiences / routing decisions pushed back via reverse ETL.
- **Their non-standard north star:** not DAU/MAU but "paid power users - are you
  using the AI 4-5 days a week?" tying adoption directly to monetization.
- **PLG -> enterprise motion:** developers expense Cursor; IT sees spend;
  enterprise sales *formalizes* demand that already exists. Pilots (3-6 mo)
  convert to org-wide 500-5,000+ seat deals at ~$40/seat/mo. **~36% free->paid**
  (~10x freemium norm). Product signals they watch: agent usage, token
  consumption, accepted AI diffs, merged-PR activity, tool-calls/session.
- **Internal chat-over-data tool:** the framing "self-serve via Cursor" implies
  reps/analysts query GTM data in natural language through a Cursor-built layer
  (the brief calls this "Chat GTM"). *Note: I could not find a public source
  naming an internal tool literally "Chat GTM" - treat the exact name as
  unverified; the capability (NL querying over a governed GTM semantic layer) is
  well-supported.*

**Judge:** "Vincent" (Cursor founding growth team) is named in the brief. He is
**not** on Cursor's public early-team blog (that lists founding *engineers*, no
Vincent), and I could not verify his surname/bio from a primary source - leave
biographical claims out and instead signal that you understand the growth org's
data-first, signal->scoring->routing playbook above.

---

## Idea hooks for the hackathon

1. **"Custom signal -> Cursor Automation -> action" loop.** Pick one custom
   signal (e.g., a target account's GitHub org starts pushing commits that import
   a competitor's SDK, or opens an issue mentioning your category). Detect it,
   POST to a Cursor Automation webhook; the cloud agent enriches the account,
   scores fit/intent, drafts a tailored AE message, and posts to Slack + comments
   on the CRM record via MCP. Hits DETECT->ENRICH->SCORE->ACT almost entirely on
   Cursor rails. Strong "uses the newest Cursor capability" story.
2. **GTM agent runtime via `@cursor/sdk`.** Build a small product where the
   *worker* behind each GTM task is a Cursor agent (SDK), streaming `tool_call`
   events into a live UI. Reframes Cursor agents as a general automation runtime,
   not just for code - judges from Cursor will recognize their own "GTM teams
   querying product data" use case.
3. **"Chat GTM," externalized.** A natural-language interface over a small
   warehouse (signals + firmographics + product usage) where the query planner is
   a Cursor CLI/SDK agent that writes + runs SQL and returns a ranked, routed
   account list. Mirrors Cursor's own "semantic layer reps can build from."
4. **Signal-triggered enrichment+scoring service** that emits a webhook on each
   new lead; a Cursor agent (Composer for speed) enriches via MCP tools, computes
   a propensity score, and writes routing back. Lean into Composer's sub-30s
   turns for a snappy live demo.
5. **Cron Automation "morning pipeline brief."** Scheduled cloud agent that each
   morning queries the data layer, finds the top accounts by a custom signal,
   drafts per-account next actions, and Slacks each AE. Cheap to build, very
   "growth/RevOps," and demos in 3 minutes.
6. **Code-signal ICP scorer (RocketRide tie-in).** For dev-tool GTM: scan a
   prospect's public repos with a Cursor agent to infer stack/tech-fit and
   generate a personalized technical pitch - a "custom signal" no vendor sells.

---

## Sources

- Cursor 2.0 + Composer announcement - https://cursor.com/blog/2-0
- Cursor 2.0 changelog - https://cursor.com/changelog/2-0
- Cursor 3 ("Meet the new Cursor") - https://cursor.com/blog/cursor-3
- Cursor 3.0 changelog - https://cursor.com/changelog/3-0
- Agents Window docs - https://cursor.com/docs/agent/agents-window
- TypeScript SDK announcement - https://cursor.com/blog/typescript-sdk
- Headless CLI docs - https://cursor.com/docs/cli/headless
- CLI usage docs - https://cursor.com/docs/cli/using
- Cloud Agents (product) - https://cursor.com/cloud
- Cloud Agents docs - https://cursor.com/docs/cloud-agent
- Cloud Agents API endpoints - https://cursor.com/docs/cloud-agent/api/endpoints
- Cloud Agents webhooks - https://cursor.com/docs/cloud-agent/api/webhooks
- Automations docs - https://cursor.com/docs/cloud-agent/automations
- Subagents docs - https://cursor.com/docs/subagents
- Composer (RL frontier model) - https://cursor.com/blog/composer
- Composer 1.5 - https://cursor.com/blog/composer-1-5
- Composer 2.5 on the Coding Agent Index - https://artificialanalysis.ai/articles/cursor-composer-2-5-coding-agent-index
- The New Stack on Composer 2.5 - https://thenewstack.io/cursor-composer-benchmarks/
- Cursor GTM Data Scientist role - https://cursor.com/careers/data-scientist-gtm
- Cursor GTM Engineer / Growth Programs role - https://cursor.com/careers/gtm-engineer-growth-programs
- Cursor GTM Systems role - https://cursor.com/careers/gtm-systems
- Cursor growth playbook ($4M->$2B) - https://thegtmnewsletter.substack.com/p/deconstructing-cursor-growth-playbook-4m-to-2b-arr
- Cursor early team - https://cursor.com/blog/team
- Pragmatic Engineer: building Cursor - https://newsletter.pragmaticengineer.com/p/cursor
