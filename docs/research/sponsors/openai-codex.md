# OpenAI for the AI Growth Hackathon: Codex + the GTM API Menu

**Researcher dossier - for Charlie + Nihal's idea debate.**
OpenAI is a hackathon sponsor providing **Codex** (the coding agent) and **$50 in API credits** per the kickoff. This doc covers: (1) how to use Codex to ship a working demo in 24h with a 2-person team, (2) the OpenAI API primitives most useful for a Growth/GTM build, (3) exact costs and the right model picks for a credit-constrained build, and (4) what makes a GTM demo look magical.

> All prices and model names verified June 2026 against developers.openai.com. The 2026 flagship line is **GPT-5.5 / GPT-5.4 / GPT-5.4 mini / GPT-5.4 nano**; voice is **gpt-realtime / GPT-Realtime-2**.

---

## 1. Codex: shipping fast with 2 people

Codex is a cloud + local autonomous coding agent (GPT-5 family). Surfaces: **CLI (`@openai/codex`), VS Code/Cursor extension, web app, iOS, and cloud tasks**. The same prompt can run locally or be dispatched as a sandboxed cloud task.

### Concrete tips for a time-boxed 2-person build
- **Write `AGENTS.md` at repo root first (by hand).** Each Codex session reads it on startup; it covers repo layout, run/build/test/lint commands, conventions, and "what done means." This is the single biggest quality lever for parallel sessions. *Note: docs explicitly say humans should write it - LLM-generated context files give no measurable benefit.* ([best-practices](https://developers.openai.com/codex/learn/best-practices))
- **Parallelize with git worktrees, not shared checkouts.** Two sessions editing the same checkout will clobber each other. Worktrees give each agent its own directory. Sweet spot is **3-5 concurrent agents**; past that, review becomes the bottleneck. With 2 people you might run Charlie on the frontend worktree, Nihal on the agent/back-end worktree, each with a Codex thread. ([Nimbalyst](https://nimbalyst.com/blog/how-to-run-multiple-codex-agents-in-parallel/))
- **Use cloud tasks for the boring parallel stuff.** `codex cloud exec` submits a task to a sandbox; `codex cloud list` returns recent tasks. Fire off scaffolding/test-writing in the cloud while you keep building locally. ([CLI reference](https://developers.openai.com/codex/cli/reference))
- **Plan mode for fuzzy scope.** `/plan` (Shift+Tab) makes Codex gather context and propose a strategy before editing - worth it for the first 20 minutes when the architecture is undecided.
- **Match reasoning level to task:** Low for well-scoped UI work, Medium/High for debugging, Extra-High for long agentic work. Don't pay High reasoning to wire a button.
- **Add the OpenAI Docs MCP so Codex writes current API code:** `codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp`, verify with `codex mcp list`. It's documentation-only (no API key, no token cost) and stops Codex from hallucinating the old Chat Completions / Assistants shapes - important because the 2026 API surface (Responses API, gpt-realtime) post-dates a lot of training data. ([Docs MCP](https://developers.openai.com/learn/docs-mcp))
- **Skills for repeated workflows.** Agent Skills are folders (`SKILL.md` + optional `/scripts`, `/references`) that Codex discovers via progressive disclosure. Install curated ones with `$skill-installer <name>` inside Codex; they live in `.agents/skills/`. The `openai-docs` curated skill is a fast way to give Codex grounded API knowledge. ([Codex skills](https://developers.openai.com/codex/skills), [openai/skills](https://github.com/openai/skills))

---

## 2. The GTM API menu - best primitive per job

The unifying choice in 2026 is the **Responses API** (`/v1/responses`), which OpenAI recommends for all new projects. It's an *agentic loop in one call*: the model can call multiple **built-in tools** (web search, file search, code interpreter, computer use, remote MCP) inside a single request, chain turns via `previous_response_id`, and gets **40-80% better cache utilization** (= cheaper) than Chat Completions. Reasoning models also score ~3% higher on internal evals via Responses vs Chat Completions. ([migrate guide](https://developers.openai.com/api/docs/guides/migrate-to-responses), [new tools for agents](https://openai.com/index/new-tools-for-building-agents/))

| GTM job | Best OpenAI primitive | Notes |
|---|---|---|
| **Research agent** (company/person intel) | Responses API + **`web_search` built-in tool**, or the **Deep Research API** via Agents SDK | Web search tool = $10 / 1k calls + tokens. Deep Research cookbook orchestrates multi-agent web+MCP research. |
| **Enrichment / classification** (fit, ICP, intent tier) | **Structured Outputs** (`response_format: json_schema, strict: true`) on **GPT-5.4 mini / nano** | Guarantees schema-valid JSON; use Pydantic/zod `parse()` helpers. Cheap, high-volume. |
| **Lead scoring** | Structured Outputs returning a numeric score + rationale, or function calling into your scoring fn | Strict schema means score is always parseable; pair with a reasoning model for judgment. |
| **Drafting outreach** (email/LinkedIn) | Responses API on GPT-5.4 (quality) or 5.4 mini (volume) | Feed enriched signal + persona; one call can web-search the prospect then draft. |
| **Voice / AI calling a lead** | **Realtime API** (`gpt-realtime` / GPT-Realtime-2) speech-to-speech + **SIP** via Twilio | The "magic" demo. Details below. |
| **Semantic dedupe / similar-accounts / RAG** | **Embeddings** (`text-embedding-3-small`) | $0.02 / 1M tokens. Shrink dims via `dimensions` param. |
| **Vision** (screenshot/logo/site → signal) | GPT-5.x multimodal input | E.g., classify a prospect's website or read a screenshot of their pricing page. |
| **Multi-agent orchestration** | **Agents SDK** (Python + TS) | Agents, **handoffs** (delegation as a `transfer_to_*` tool), **guardrails** (cheap model validates input/output in parallel), built-in tracing. |

### Agents SDK specifics
- Repos: [openai-agents-python](https://github.com/openai/openai-agents-python), [openai-agents-js](https://github.com/openai/openai-agents-js). Core objects: `Agent` (instructions + tools + handoffs + guardrails), `Runner`, plus `RealtimeAgent`/`RealtimeSession` (TS) and `VoicePipeline` (Python) for voice.
- **Handoffs** are exposed to the model as tools, so a "Triage" agent can route to "Research", "Scoring", or "Outreach" specialists - a clean DETECT→ENRICH→SCORE→ACT decomposition that matches the Lopus framing.
- **Guardrails** run a fast/cheap model in parallel to gate the expensive one (e.g., block off-ICP leads before drafting).

---

## 3. Costs, credits, and which model to pick

### API token pricing (per 1M tokens, verified June 2026)
| Model | Input | Cached input | Output |
|---|---|---|---|
| GPT-5.5 | $5.00 | $0.50 | $30.00 |
| GPT-5.4 | $2.50 | $0.25 | $15.00 |
| **GPT-5.4 mini** | **$0.75** | $0.075 | **$4.50** |
| **GPT-5.4 nano** | **$0.20** | $0.02 | **$1.25** |
| GPT-Realtime-2 (audio) | $32.00 | $0.40 | $64.00 |
| GPT-Realtime-2 (text) | $4.00 | $0.40 | $24.00 |
| text-embedding-3-small | $0.02 | - | (no output cost) |
| text-embedding-3-large | $0.13 | - | (no output cost) |

**Built-in tool costs:** web search **$10 / 1k calls** (+ ~8k input tokens billed per search); file search **$2.50 / 1k calls**; code interpreter **$0.03-$1.92 per 20-min session**. ([API pricing](https://developers.openai.com/api/docs/pricing))

### $50-credit gotchas and strategy
- **The killer cost is voice audio.** gpt-realtime audio is ~**$0.06/min input + $0.24/min output ≈ $0.30/min** before caching. A handful of 3-minute demo calls is fine ($1-2); do **not** loop voice in testing. Cache the system prompt (80x cheaper cached input) and keep instructions short.
- **Web search at $10/1k calls** adds up if a research agent fans out. Budget calls; cache results locally during dev.
- **Do enrichment/classification/scoring on GPT-5.4 mini or nano**, not GPT-5.5. Nano at $0.20/$1.25 can classify thousands of leads for cents. Reserve GPT-5.5/5.4 for the one or two reasoning-heavy steps (final score rationale, best outreach draft).
- **Batch API = 50% off** for anything non-interactive (e.g., enriching a CSV of leads overnight). Embeddings are also halved on Batch.
- **Codex itself bills separately** (ChatGPT plan rate limits OR API-key pay-as-you-go). Use a ChatGPT plan for Codex if you have one so it doesn't eat the $50 API credits meant for the demo.
- **No free trial on Codex API-key usage** - usage-based billing is immediate. ([Codex pricing](https://developers.openai.com/codex/pricing))

**Recommended model split for a GTM demo:** nano/mini for DETECT+ENRICH+SCORE at volume → GPT-5.4 for ACT (drafting/judgment) → gpt-realtime only for the live voice moment.

---

## 4. Cookbooks & showcase worth copying

- **Deep Research API with the Agents SDK** - multi-agent web+MCP research pipeline, streaming progress. Closest thing to a drop-in "research agent." ([cookbook](https://cookbook.openai.com/examples/deep_research_api/introduction_to_deep_research_api_agents))
- **Multi-Agent Portfolio Collaboration** - specialist agents under a manager, using custom fns + Code Interpreter + WebSearch + MCP together. A template for DETECT→ENRICH→SCORE→ACT. ([cookbook](https://developers.openai.com/cookbook/examples/agents_sdk/multi-agent-portfolio-collaboration/multi_agent_portfolio_collaboration))
- **Structured Outputs intro** + **Structured Outputs for Multi-Agent Systems** - the enrichment/classification/scoring backbone. ([intro](https://developers.openai.com/cookbook/examples/structured_outputs_intro))
- **Building a Voice Assistant with the Agents SDK** - triage → specialist routing with web search; adapt to outbound. ([cookbook](https://cookbook.openai.com/examples/agents_sdk/app_assistant_voice_agents))
- **openai/openai-realtime-agents** - reference agentic voice patterns on the Realtime API. ([repo](https://github.com/openai/openai-realtime-agents))
- **Showcase** (developers.openai.com/showcase): mostly polished landing pages, 3D experiences, games, Sora/ImageGen demos, a Paris real-estate data-viz, and "Codex 101." Judges value usefulness > polish here, so the showcase is more "what good looks like visually" than a GTM blueprint. Submission gallery exists if we want post-hackathon distribution. ([showcase](https://developers.openai.com/showcase))

---

## 5. Making the demo look magical (voice / AI calling)

This is the highest-coolness lever and plays directly to judge Vincent/Dan watching a 3-min video.

**Outbound AI call to a lead, architecture:**
1. **gpt-realtime / GPT-Realtime-2** speech-to-speech for natural, low-latency conversation; supports parallel tool calls and remote MCP mid-call.
2. **Telephony:** OpenAI's Realtime API native SIP support docs are **inbound-focused** (`realtime.call.incoming` webhook; `/v1/realtime/calls/{id}/accept|reject|refer|hangup`; SIP endpoint `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`). For **outbound dialing a lead's number**, the proven path is **Twilio Voice + Media Streams (or Elastic SIP Trunking) bridged to the Realtime API** - Twilio has 2026 Node.js and Python tutorials that dial a number and stream audio both ways. ([realtime-sip](https://developers.openai.com/api/docs/guides/realtime-sip), [Twilio outbound Node](https://www.twilio.com/en-us/blog/outbound-calls-node-openai-realtime-api-voice), [Twilio outbound Python](https://www.twilio.com/en-us/blog/outbound-calls-python-openai-realtime-api-voice))
3. **Mid-call tools:** give the realtime agent function tools (CRM lookup, calendar book, structured-output capture of qualification answers) so the call *does work*, not just talks.
4. **Warm transfer to human** via Twilio Programmable SIP is a documented pattern - a strong "this is real GTM" beat for the video. ([warm transfer](https://www.twilio.com/en-us/blog/developers/tutorials/product/warm-transfer-openai-realtime-programmable-sip))

**Other "magic" cheap wins:** streaming partial outputs (visible thinking), a research agent that web-searches a real company live on stage, and structured-output cards that populate a CRM-style UI in real time.

> Demo risk: live outbound telephony has the most failure points (Twilio creds, audio latency, SIP). Have a **pre-recorded fallback clip** of the call working, and consider an inbound-call demo (you call the agent) as a lower-risk variant since OpenAI's SIP path natively handles inbound.

---

## Idea hooks for the hackathon

1. **"Cold call concierge."** Custom signal (e.g., a prospect just hit your pricing page) → Realtime voice agent **auto-dials the lead** via Twilio+gpt-realtime, qualifies with function-tool capture, books a meeting, warm-transfers to a human if hot. Hits all 3 judging axes; highest coolness. Pre-record a fallback.
2. **DETECT→ENRICH→SCORE→ACT in one Agents-SDK graph.** Triage agent + Research (web_search) + Scoring (structured outputs on nano) + Outreach (GPT-5.4) with guardrails filtering off-ICP. Cleanly matches the Lopus thesis; strong on technical complexity.
3. **Custom-signal research swarm.** Deep Research API pattern pointed at *one* unusual signal (e.g., new exec hire, GitHub activity, job-post language) to produce an enriched, scored, draft-outreach packet per account. Cheap to run at volume on mini/nano + Batch.
4. **Live-on-stage enrichment wall.** Paste a domain → streaming structured-output cards populate (firmographics, intent tier, suggested angle) in real time. Visually magical, technically just Responses + structured outputs + web_search.
5. **Vision-driven signal.** Screenshot/website-image → GPT-5.x vision classifies maturity/ICP fit → scores → drafts. A genuinely "custom, not bought" signal.
6. **Convex-track combo:** run the Agents-SDK orchestration with Convex as the realtime backend/state store so the enrichment wall updates live - pairs the OpenAI demo with the separate $1000/$500 Convex prize.

---

## Sources
- Codex pricing: https://developers.openai.com/codex/pricing
- Codex best practices: https://developers.openai.com/codex/learn/best-practices
- Codex CLI reference: https://developers.openai.com/codex/cli/reference
- Codex skills: https://developers.openai.com/codex/skills · https://github.com/openai/skills
- Docs MCP: https://developers.openai.com/learn/docs-mcp · https://developers.openai.com/codex/mcp
- Parallel Codex agents: https://nimbalyst.com/blog/how-to-run-multiple-codex-agents-in-parallel/
- Responses vs Chat Completions: https://developers.openai.com/api/docs/guides/migrate-to-responses · https://openai.com/index/new-tools-for-building-agents/
- Agents SDK: https://github.com/openai/openai-agents-python · https://github.com/openai/openai-agents-js · https://openai.github.io/openai-agents-python/handoffs/ · https://openai.github.io/openai-agents-python/guardrails/
- Structured outputs: https://developers.openai.com/cookbook/examples/structured_outputs_intro · https://cookbook.openai.com/examples/structured_outputs_multi_agent
- Realtime / voice: https://openai.com/index/introducing-gpt-realtime/ · https://developers.openai.com/api/docs/guides/voice-agents · https://developers.openai.com/api/docs/guides/realtime-sip · https://github.com/openai/openai-realtime-agents
- Twilio + Realtime outbound: https://www.twilio.com/en-us/blog/outbound-calls-node-openai-realtime-api-voice · https://www.twilio.com/en-us/blog/outbound-calls-python-openai-realtime-api-voice · https://www.twilio.com/en-us/blog/developers/tutorials/product/warm-transfer-openai-realtime-programmable-sip
- API pricing: https://developers.openai.com/api/docs/pricing
- Embeddings: https://developers.openai.com/api/docs/guides/embeddings · https://openai.com/index/new-embedding-models-and-api-updates/
- Cookbook (Deep Research, Multi-Agent, Voice): https://cookbook.openai.com/examples/deep_research_api/introduction_to_deep_research_api_agents · https://developers.openai.com/cookbook/examples/agents_sdk/multi-agent-portfolio-collaboration/multi_agent_portfolio_collaboration · https://cookbook.openai.com/examples/agents_sdk/app_assistant_voice_agents
- Showcase: https://developers.openai.com/showcase
