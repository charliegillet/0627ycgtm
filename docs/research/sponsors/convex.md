# Sponsor Dossier - Convex

> Authored from the kickoff deck ground truth + targeted web research (the two
> background research agents for Convex stalled on Convex's large docs, so this was
> written directly). Convex runs a **separate prize track**: $1,000 (1st) / $500
> (2nd) gift cards for "best use of Convex." That is the entire basis of our 20% EV
> sub-goal, and building on Convex is near-free optionality on a second prize.

## What Convex is

Convex is a **reactive, TypeScript-native backend platform**: a hosted database +
server functions where queries automatically cache and **subscribe to data**, so
any client re-renders the instant underlying data changes. You write schema and
server logic in TypeScript; Convex handles realtime sync, durability, and scaling.
Tagline for the hackathon: **"backend building blocks for your agents."**

Key primitives that matter for a GTM build:
- **Reactive queries / live subscriptions** - the headline feature. A dashboard
  that updates live across all clients with zero websocket plumbing. This is the
  single most demo-able Convex superpower.
- **Mutations + actions** - actions can call external APIs (Fiber, Orange Slice,
  OpenAI), mutations write to the DB transactionally.
- **Scheduled functions + cron** - run detection/enrichment on a schedule (great
  for a signal pipeline that polls sources).
- **HTTP actions** - receive inbound webhooks (signal sources pushing events).
- **File storage**, **vector search** (built into the Agent component), **auth**.
- **Durable execution** - long-running workflows that survive crashes/restarts.

## Works natively with our agents

Convex ships plugins for **Claude Code, Codex, and Cursor** - "just tell your
agent: build a Notion clone with Convex." `npm create convex@latest` to start.
Docs are AI-optimized at **docs.convex.dev/ai**. This means we can hand Convex to
Codex/Cursor and move very fast.

## Components (106+) - the secret weapon for "best use of Convex"

Convex Components are installable, sandboxed backend modules. Using several,
correctly, is the clearest way to read as **"best USE of Convex"** rather than
"used Convex as a dumb DB." The most relevant for a GTM signal app:

| Component | What it does | GTM demo use |
|---|---|---|
| **Agent** (`get-convex/agent`) | Build AI agents with **persistent chat history, message threads, vector search**, reactive to DB | The enrich/score/draft agent; chat-to-your-pipeline |
| **Durable Agents** | Persistent state + **automatic recovery**, async execution, tool calls via actions, auto-retries, survives crashes, Workpool-backed parallelism | The long-running signal→action workflow |
| **Workpool** | Priority queues for async ops; control parallelism, give critical tasks priority | Process a burst of detected signals without rate-limit blowups |
| **Persistent Text Streaming** | Stream AI text to users in realtime **while persisting to DB** | Cold-email draft / summary streaming live into the UI (very flashy) |
| **AutoSend** | Send transactional email from Convex | The ACT step (email the AE/prospect) |
| **Agentmail** | Queryable email inbox for AI agents (threads, labels) | Two-way email handling for an agent |
| **Exa** | Web search/intelligence (search the web, extract clean content) | DETECT/ENRICH from the live web |
| **PostHog** | Product analytics + feature flags | PLG signal detection from product telemetry |
| **Static-Hosting** | Host the React/Vite frontend on Convex | One-platform deploy, `convex.site` URL |

Browse: **convex.dev/components**. Categories: AI Agents, Auth, Backend, AI
Infrastructure, Database, Durable Functions, Integrations, Messaging, Storage,
Payments.

## The hackathon template - "SignalBoard"

Convex showed a forkable template: **"Drop in a company. Get the signal. Live."**
You add a company → it computes a **buying-signal score + summary + a cold-email
draft**, streamed live to every open client. Built with **Cursor + Convex + Orange
Slice**. Link: `https://convex.link/growthdemo`. It already embodies
DETECT→ENRICH→SCORE→ACT and is a legitimate head start (fork, then go far beyond it
so we're not "just the template").

## How "best use of Convex" is judged (from past Convex hackathons)

Judges score: **Convex Use** (does your backend/client code follow Convex best
practices and meaningfully use Convex features - auth, realtime, vector search,
server functions, multiplayer), works-without-glaring-bugs, growth/impact
potential, technical excellence (tested/documented), UI/UX polish, and creativity.
Past winning tells:
- "One of the more complex uses of Convex I've seen" (Fireview) - **depth of
  platform use** is explicitly praised.
- **Realtime multiplayer / presence** (live cursors, collaborators updating shared
  state) consistently wins points.
- **3-minute video that shows the app AND the data live in the Convex dashboard**
 - judges don't review past 3 min. Showing the Convex dashboard updating in
  realtime during the demo is a known way to prove "real use of Convex."

## Logistics / resources

- Start: `npm create convex@latest` · Docs: `docs.convex.dev` · AI docs:
  `docs.convex.dev/ai` · Components: `convex.dev/components` · Hackathon resources:
  `convex.dev/hackathon` · Pricing (free to build this weekend): `convex.dev/pricing`.
- Hiring 6 roles (`jobs@convex.dev`).

## Idea hooks for the hackathon

- **Realtime "signal war room"**: a live multiplayer board where detected signals
  stream in, get enriched + scored by the Agent component, and an AE can claim/act
 - showcases reactive queries + presence + Agent + Workpool + streaming in one
  demo (hits both the main rubric and "best use of Convex").
- **Stream the draft**: use Persistent Text Streaming so the cold-email/summary
  generates visibly in the UI during the demo - cheap, high "coolness."
- **Durable signal pipeline**: cron-scheduled DETECT → Workpool-parallel ENRICH →
  Agent SCORE → AutoSend/Agentmail ACT, all surviving restarts (durable execution
  is a strong technical-complexity signal).
- **Show the dashboard**: design the demo to flip to the Convex dashboard showing
  rows mutating live - a known "best use of Convex" winner move.

## Sources
- https://docs.convex.dev/agents
- https://www.convex.dev/components
- https://www.convex.dev/components/persistent-text-streaming
- https://www.convex.dev/components/durable-agents
- https://www.convex.dev/components/agent
- https://stack.convex.dev/ai-agents
- https://github.com/get-convex/agent
- https://stack.convex.dev/hackathon-winners-fall-2024
- https://stack.convex.dev/jotion-winners
- Kickoff deck (docs/AI-Growth-Hackathon-Kickoff-Presentation.pdf)
