> ⚠️ EXCLUDED FROM THE PROJECT: Per the team's explicit decision, RocketRide will NOT be used in
> the hackathon project in any way. This dossier is retained as background research only and does
> not factor into the expected-value function or any selected idea. The 10% "genuine usefulness"
> bucket is generic (a tool a real GTM operator / Charlie would use and keep), not RocketRide.

# RocketRide (rocketride.ai) - Context (background only; not used in the project)

> Research target: ground the debate persona arguing for ideas that double as
> something **RocketRide could use, demo, or productize**. RocketRide is Charlie's
> company. Everything below is from public sources (site, GitHub, docs, HN, an
> interview) plus the locally bundled `rocketride-*` skills, which confirm the
> exact node taxonomy and SDK surface. Unverified items are marked.

---

## 1. What RocketRide publicly is

RocketRide is **"the open source AIDE: the AI Development Environment."** The one-liner
positioning across surfaces: **"Your IDE is failing you. Meet AIDE."** and **"Build and
run AI pipelines, fast."** It turns the IDE you already use (VS Code, Cursor, Windsurf,
Antigravity, Copilot) into a place to **compose, debug, observe, and deploy AI runtimes
using any model, any tool, any framework, with zero vendor lock-in.**

Two products, one engine:

| Surface | What it is | Status |
|---|---|---|
| **Open-source IDE platform** (`rocketride.org`, GitHub) | VS Code extension + C++ runtime + SDKs. Build/run/debug pipelines locally, Dockerized, or on your own server. MIT licensed. | **Live.** v3.2.2 (Jun 11 2026). ~4.7k stars / ~1.5k forks. |
| **RocketRide Cloud** (`cloud.rocketride.ai`, which `rocketride.ai` redirects to) | "Fully managed platform to design, run, and scale AI workflows without infra setup." | **Coming soon / waitlist** (email capture only). |

Core mechanics (verified via docs + bundled skills):
- A **pipeline is a directed acyclic graph**; **each node does one job**. Nodes exchange
  typed **records** over **lanes**. Pipelines are **portable JSON** (`*.pipe` files),
  version-controlled and shareable, executed by a **multithreaded C++ core** that runs
  "the same way on your laptop, your servers, or RocketRide Cloud."
- Built visually on a canvas inside the IDE; also drivable from CLI/SDK.
- **Observability is the headline differentiator:** "trace a failure down to the exact
  data chunk, call, and duration"; track token spend, CPU, GPU, memory live. Their pitch:
  *"AI writes the code, and the deep observability gets you the answer at 3am when
  something breaks."*

## 2. The node catalog (this is the build surface)

Docs list **~109 nodes across ~20 types** (site says "85+", docs page says 109; both are
fine to cite). All nodes are **Python-extensible - build and publish your own.** The
bundled skills mirror these exactly as archetypes (one skill per archetype):

| Archetype | Examples / providers |
|---|---|
| **LLM** | Anthropic Claude, OpenAI, Gemini, Mistral, DeepSeek, Ollama (local), Bedrock, Perplexity, xAI Grok |
| **Vision/Image LLM** | Gemini/OpenAI/Mistral/Ollama vision, OCR, accessibility-describe |
| **Embedding** | OpenAI embeddings, transformer, image, video |
| **Vector store** | Pinecone, Qdrant, Chroma, Milvus, Weaviate, pgvector, Elasticsearch, Mongo Atlas, Astra, OpenSearch |
| **Database** | Postgres, MySQL, Neo4j, ClickHouse, Aparavi AQL |
| **Tool** (agent-invocable) | HTTP Request, Python, shell, File System, Git, GitHub, **Firecrawl**, **Tavily**, **Exa search**, **Bland AI (phone calls)**, v0 by Vercel |
| **Agent** | CrewAI, LangChain, LlamaIndex, Deep Agent, **RocketRide "Wave"** agents |
| **Processor / text** | summarization, **NER**, **PII anonymization**, extraction, chunking, rerank (Cohere) |
| **Audio/Video** | transcription, TTS, frame grabber, TwelveLabs |
| **Source / Ingress** | **Webhook, Chat UI, Drag-and-drop ("dropper"), Telegram Bot** |
| **Memory** | run-scoped + cross-session persistent |
| **Outputs / Guardrails / Infra** | response, local output, guardrails, remote processing |

**Critical for the hackathon:** the **webhook ingress node spins up a FastAPI/uvicorn
listener and, when the pipeline runs, the runtime publishes a public interface URL + auth
key.** That means a RocketRide pipeline can be a **live, externally-callable endpoint** - exactly what a "detect a signal" demo needs (a webhook fires → pipeline runs end to end).

## 3. SDKs / embed surface

- **Python SDK** (`rocketride` on PyPI), **TS/JS SDK** (`rocketride` on npm), **MCP server**
  (`rocketride-mcp`). Client pattern: `RocketRideClient` → `use()` (load a pipeline) →
  `send()` / `chat()` → `get_task_status()` / `terminate()`. Connects to a runtime URI.
- So any app can **embed a pipeline as a backend**: the pipeline is the product, the app
  is a thin client. This is the cleanest "useful to RocketRide" angle - anything we build
  becomes a **showcase pipeline + a thin demo UI**.

## 4. People (verified-only)

- **Rod Christensen** - listed as **Chief Architect** at RocketRide. Co-presented an
  interview/talk on AI pipelines + RocketRide (David Giard's developer interview series;
  YouTube "Build and Deploy AI Pipelines Inside Your IDE").
- **Roan Weigert** - **DevRel / AI engineer**, open-source contributor; represents
  RocketRide at developer events and hackathons (GDG Newport Beach, etc.). HN handle
  `roan-we` posting as a maker.
- **Joe Maionchi** - listed as **Co-Founder & COO** (HN handle `jmaionchi`). On HN he said
  RocketRide targets **developers building production-scale AI applications** and mentioned
  **planned nonprofit/open governance by mid-2026**.
- HN "Show HN"-style post submitted by `shashidhar-babu`; makers noted it was **"two weeks
  post-launch, still rough around the edges, but the core engine is solid."**
- **Funding / YC batch: could not confirm.** No public funding round or YC affiliation
  found. (Note: `cbinsights.com/company/rocketride` refers to a different "RocketRide
  Games" - do not conflate.) The LinkedIn company page is `linkedin.com/company/rocketride-ai`.

## 5. Likely ICP and use cases

Public positioning is **developer-first / GTM-agnostic** - it is horizontal AI pipeline
infrastructure, not a vertical GTM tool. Stated/implied ICP:
- **AI engineers and platform teams** building production RAG, agent, and data pipelines
  who want to stay in their IDE and own their infra (local/Docker/on-prem, no lock-in,
  data residency).
- Tagline that nails the buyer: **"Anyone can build AI. AIDE is how businesses run it."**

Documented example shapes are generic (chatbot-over-docs, summarize-uploaded-PDFs, RAG).
**There is no public GTM/sales example pipeline** - which is precisely the gap a hackathon
project can fill.

## 6. Where a GTM project maps onto the node platform

The hackathon's **DETECT → ENRICH → SCORE → ACT** frame maps almost 1:1 onto RocketRide
archetypes - meaning a winning GTM pipeline *is natively a RocketRide pipeline*:

| Hackathon layer | RocketRide node(s) |
|---|---|
| **DETECT** (signal in) | **Webhook / Telegram / Chat ingress** (publishes a public URL) |
| **ENRICH** | **Tool nodes** (Firecrawl, Tavily, Exa, HTTP → Fiber/Orange Slice APIs), processor nodes (NER, extraction) |
| **SCORE** | **LLM nodes** (Claude/OpenAI) + **agent nodes** (Wave/CrewAI) + guardrails |
| **ACT** | **Tool nodes** (HTTP → Slack/Gmail/HubSpot, **Bland AI** for phone), **output/response** nodes, memory for follow-up |
| Retrieval / dedup | **Embedding + vector store** (Pinecone/pgvector) for "have we seen this account?" |

## Idea hooks for the hackathon

These are angles where the build is **both judge-friendly (GTM + technically deep) and
genuinely useful to RocketRide** as a flagship pipeline/demo. Order roughly by EV.

1. **"The missing GTM example pipeline."** RocketRide ships only generic examples. Build
   the **canonical GTM signal pipeline as a `.pipe`** - webhook DETECT → Fiber/Orange Slice
   ENRICH → Claude/agent SCORE → Slack/Gmail ACT - and submit it as both the hackathon
   project *and* a PR/example to `rocketride-server`. Doubles as marketing collateral
   ("look what AIDE does for growth teams"). High "useful to us," strong DETECT→ACT story.
2. **GTM signal demo where the wow IS the observability.** The judges value technical
   complexity; RocketRide's edge is **live node-by-node tracing + token/cost telemetry.**
   Demo a signal firing and *watch records flow through every node in real time* with cost
   per lead. Few hackathon teams can show that depth - it reads as "hard to build" and is
   on-brand for RocketRide. (Risk: judges score *GTM usefulness* first; keep the signal
   compelling, not just the plumbing.)
3. **"Score a YC startup the instant it's funded" - webhook-native.** New-funding signal
   hits the webhook ingress (public URL the runtime publishes) → enrich (Fiber 40M
   companies / Orange Slice) → Claude scores fit for *your* product → drafts outreach →
   Slack. Live, externally-triggerable demo; trivially re-pointable to RocketRide's own ICP
   (devs adopting AI infra).
4. **Agent-built prospect lists as a pipeline.** Use **agent nodes (Wave/CrewAI) + tool
   nodes (Exa/Tavily/Firecrawl)** to autonomously assemble + score a prospect list from a
   one-line ICP. Shows off the agent-orchestration surface RocketRide is proud of.
5. **GitHub-signal lead engine (dogfood RocketRide's own ICP).** Detect repos/devs adopting
   competing AI-pipeline tools (Langflow/Flowise/n8n/Dify stars, issues, `import`s) via the
   GitHub tool node → enrich → score → outreach. This is *literally how RocketRide could
   find its own users*, so the "useful to us" lens is maxed; still a clean GTM story for
   judges.
6. **"Cold-call agent" finale.** Pipe SCORE output into the **Bland AI tool node** to place
   a real outbound call live on stage. Maximum coolness, and it exercises a node RocketRide
   has but no one demos.
7. **Convex-track bridge:** keep RocketRide as the *pipeline engine* and use **Convex as the
   reactive store/UI** (the SignalBoard pattern) so the signal/score streams live to every
   open client. Lets us chase both the main prize and the Convex $1k with one build.

**Honest caveats for the debate:**
- RocketRide is **horizontal infra**, not a GTM product, so "useful to us" mostly means
  "great showcase/example/marketing," not "a feature we'd ship verbatim." That is still
  real value (RocketRide visibly lacks a GTM example), but don't overclaim productization.
- Cloud isn't live, so anything depending on a hosted RocketRide is a future bet; demo on
  the **local/Docker engine**.
- The strongest dual-use plays (#1, #3, #5) are the ones where the *artifact is a `.pipe`
  file* RocketRide can literally keep.

## Sources

- https://rocketride.ai/ (redirects to cloud)
- https://cloud.rocketride.ai/
- https://rocketride.org/
- https://docs.rocketride.org/
- https://docs.rocketride.org/nodes
- https://github.com/rocketride-org/rocketride-server
- https://github.com/rocketride-org
- https://news.ycombinator.com/item?id=47415771
- https://www.youtube.com/watch?v=FU9tOzoTLOw
- https://davidgiard.com/rod-christensen-and-roan-weigert-on-ai-pipelines-and-rocket-ride
- https://www.linkedin.com/company/rocketride-ai
- Local: bundled `rocketride-*` Claude skills (node archetypes, webhook ingress URL/auth, SDK client pattern)
