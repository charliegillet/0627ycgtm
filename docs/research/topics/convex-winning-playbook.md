# Topic - Convex Winning Playbook (how to take the $1,000 "best use of Convex")

> Concentrated guide to winning the Convex side prize while *also* helping main-prize
> odds. Pairs with `sponsors/convex.md`. Core principle: judges reward **depth and
> correctness of Convex use**, not the mere presence of Convex.

## The mental model judges use

"Best use of Convex" ≈ *"if you removed Convex, would this app fall apart?"* The
winner makes Convex **load-bearing and visible**. The losing pattern is "I used
Convex as a Postgres I didn't have to host." Past Convex judges literally praised
"one of the more complex uses of Convex I've seen" and rewarded realtime
multiplayer/presence. So the playbook is: make Convex's unique strengths
(reactivity, durable execution, components, vector search) the *star of the demo*.

## Ranked Convex capabilities to showcase (most → least impactful here)

1. **Realtime reactive UI as the centerpiece.** Multiple browser windows updating
   simultaneously as data changes. For a GTM signal app: signals stream onto a
   board live; scores recompute live; an AE in another window sees it instantly.
   This is the highest-ROI "wow," and it's free with Convex queries.
2. **The Agent component** (persistent threads + vector search + tool calls). Use
   it for the enrich/score/draft brain so there's real AI depth inside Convex, not
   bolted on. Vector search over past prospects/notes = easy "technical complexity."
3. **Durable workflows + Workpool.** A signal pipeline that runs DETECT (cron) →
   ENRICH (Workpool-parallel, rate-limited) → SCORE (Agent) → ACT (AutoSend/
   Agentmail), and survives a crash mid-run. Durable execution is a strong,
   honest technical-complexity signal and is genuinely hard to fake.
4. **Persistent Text Streaming.** Stream the generated cold email / account summary
   into the UI token-by-token while persisting it. Looks magical on video; trivial
   with the component.
5. **Scheduled functions / cron + HTTP actions.** Cron drives continuous detection;
   HTTP actions ingest inbound webhooks (a signal source pushing events). Shows
   Convex as the whole backend, not just storage.
6. **Auth + presence/multiplayer.** Even light presence ("Charlie is viewing this
   account") reads as sophisticated and is a known points-winner.
7. **Static-Hosting.** Deploy the React frontend on Convex too → single platform,
   `convex.site` URL → "fully on Convex" story.

## Reference architecture (GTM signal app, Convex-maximal)

```
Sources (web/Exa, Fiber, jobs, social)
   │  cron + HTTP actions (DETECT)
   ▼
Convex DB (reactive tables: signals, accounts, contacts, actions)
   │  Workpool (parallel, rate-limited ENRICH via actions → Fiber/Orange Slice)
   ▼
Agent component (SCORE: rubric + vector search over history; DRAFT via Persistent
   Text Streaming)
   │  Durable workflow keeps state across retries/crashes
   ▼
ACT: AutoSend / Agentmail (email) + Slack + live board
   ▲
React frontend (reactive subscriptions; multiplayer presence; Static-Hosting)
```

If you remove Convex from that picture, nothing works - that's the point.

## Demo-craft for the Convex track (3-minute video)

- **Show two windows side-by-side** so reactivity is undeniable.
- **Cut to the Convex dashboard** mid-demo showing rows mutating live - judges
  explicitly value seeing the data in the dashboard, and they stop watching at 3:00.
- **Trigger a real signal live** (paste a company / fire a webhook) and let the
  pipeline run end-to-end on camera: detect → enrich → score → stream draft → act.
- Mention the **specific Convex components** by name in the video + the submission
  "Tech stack" field (Agent, Workpool, Persistent Text Streaming, AutoSend). Naming
  them signals intentional, deep use.

## Anti-patterns (lose the track)

- Convex as a plain CRUD store with no realtime, no components, no durable logic.
- All the AI in a separate Python service; Convex just logging results.
- A static dashboard (no live subscription visible in the demo).
- Over-scoping so the realtime magic never actually works on camera.

## "Best use of Convex" checklist (aim to tick most)

- [ ] Reactive UI visibly updates live (two-window proof)
- [ ] ≥2 official Components used meaningfully (Agent + Workpool/Streaming/AutoSend)
- [ ] Durable/scheduled execution doing real work (cron or workflow)
- [ ] Vector search or real AI inside the Convex Agent
- [ ] Auth and/or presence
- [ ] Frontend hosted on Convex (Static-Hosting) - optional but nice
- [ ] 3-min video shows the app + the Convex dashboard updating live
- [ ] Submission "Tech stack" names the exact components used

## Idea hooks for the hackathon

- Any of our top ideas should default to **Convex as the backend** unless there's a
  hard conflict - it's 20% of EV for marginal extra effort, and the realtime layer
  doubles as "coolness" for the main prize.
- The strongest Convex-track plays are inherently **realtime + agentic + durable**:
  a live signal war-room, a live competitive-intel monitor, a live PLG activation
  board - each naturally exercises 4-5 Convex superpowers at once.

## Sources
- https://stack.convex.dev/hackathon-winners-fall-2024
- https://stack.convex.dev/hacakthon-winners-winter-2024
- https://stack.convex.dev/jotion-winners
- https://www.convex.dev/components
- https://docs.convex.dev/agents
- https://stack.convex.dev/build-streaming-chat-app-with-persistent-text-streaming-component
- Kickoff deck (docs/AI-Growth-Hackathon-Kickoff-Presentation.pdf)
