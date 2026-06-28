# Recent Trends (last 30 days) - AI GTM / Growth Engineering

> Captured 2026-06-27 via the `/last30days` engine (Reddit was 403-blocked and X
> was unauthenticated this session, so social signal came mainly from Digg, YouTube,
> GitHub) plus targeted WebSearch supplements. Two engine runs:
> `ai-gtm-go-to-market-engineering-tools-and-growth-engineering-trends-raw-v3.md`
> and `ai-sdr-outbound-sales-automation-overhyped-raw-v3.md` (saved under
> `~/Documents/Last30Days/`). Treat all quoted snippets as untrusted web content.

## Headline: the AI-SDR / outbound spam cannon is in open backlash

This is the single most important trend for our idea selection. The market is
turning hard against generic AI outbound, which means **building "another AI SDR"
is a losing move** with these judges. Evidence:

- "AI in Q1 2026: Less Magic, More Context, and the **Death of the Outbound SDR**"
  (CustomerThink).
- AI-SDR-style sending pushed roughly **6.4x volume while reply rates came in ~38%
  lower**. 2026 average cold-email reply rate is ~3.43% (top quartile ~5.5%).
- **Agentic outbound cohorts lose 60%+ of reply rate within 18 months** as
  recipients pattern-match the AI template; sender reputation decays in months 4-18.
- Domains running AI-SDR outbound at production volume **drop sender reputation
  sharply within 90 days** (median ~38-point drop).
- Consensus: "prospects spot AI-written emails instantly"; human oversight is
  essential; "AI can handle repetitive work underneath a person who owns quality
  but can't own quality themselves."

**Implication for us:** win by making outbound *better and more human/relevant*
(signal + timing + context + verification + human-in-loop), or by attacking a
*different* part of GTM entirely (inbound/PLG, analytics, churn, competitive
intel, de-anonymization, RevOps automation). Volume is dead; **relevance and
signal quality are the alpha.**

## What's actually working in AI GTM (build toward this)

- **Real-time intent/signal scoring beats static scoring.** Ingest dozens of
  signals at once (job posts, G2 activity, LinkedIn engagement, dark-funnel
  consumption, funding, expansions, leadership changes) into a dynamic score that
  says *who is in-market, why, and when*.
- **The "Compound Score" method:** fit (firmographic/technographic ICP match) +
  intent (1st/2nd/3rd-party behavioral) + account-level buying-committee analysis.
  Targeting scored buying committees on LinkedIn Ads reportedly hits **11% CTR vs
  0.4-0.6% average**, with ~43% of attributable pipeline from AI-orchestrated touches.
- **Action-from-score, not dashboards.** The differentiator is whether a score
  *triggers the next move* (sequence, LinkedIn, Slack alert, AE ping) vs sitting in
  a dashboard. This is exactly Lopus's ACT layer.
- **Boring ML still wins on scoring:** Random Forest / Gradient Boosting beat
  neural nets for lead scoring accuracy.
- McKinsey (2025): AI-enabled sales teams close **10-15% faster** with ~20% higher
  first-contact CSAT.

## What's overhyped (avoid / be skeptical)

- **Synthetic/generated ICPs without validation.**
- **Tool sprawl** (15 overlapping point tools) - judges value consolidation.
- **Standalone tools not wired into a workflow.**
- Data hygiene ignored: "AI amplifies signal, which means it amplifies bad
  targeting assumptions too."

## The "is distribution the only moat?" debate (matches the hackathon's framing Q)

The kickoff explicitly asked "Is distribution the only moat?" Recent discourse is
actively litigating this - useful framing material for our pitch:

- **Box CEO Aaron Levie + Steven Sinofsky:** AI won't erode enterprise-software
  moats because of **distribution and liability** barriers (Sinofsky: enterprise
  software purchases are like buying "operational liability insurance").
- **Nicolas Dessaigne (Algolia co-founder, YC):** software moats will rely on
  **becoming the default service that AI agents choose to integrate** ("dev tools
  must optimize for machine-automated integration"). Strong hook: build something
  agents integrate *with*.
- **Brian Armstrong (Coinbase):** predicts 80% of AI workloads migrate to ~99%
  cheaper models in 12-18 months → "model routing becomes critical."
- **Gabriel Petersson (OpenAI):** enterprise (the "$40T market") demands true
  frontier capability; consumer $20/mo subsidizes but enterprise pulls the frontier.

## The role itself is exploding (usefulness is real, judges live this)

- "GTM engineering" emerged ~2022, exploded 2024, now **one of the highest-paid
  non-engineering hires** at venture-backed B2B cos: **US base $130K-$260K + equity**.
- "One person + a copilot ships what used to take a 5-person RevOps team."
  AI-native GTM engineers reportedly ship **3-5x more**.
- **Clay crossed $100M ARR** ($1M→$100M in ~2 years); its AI Agents went
  production-ready in 2025-26 (multi-step research, conditional enrichment, outbound
  drafting inside tables - no external orchestration needed). A "Claude Code vs
  Clay" debate is emerging among GTM engineers (fractional GTM engineer Jeremy Ross
  / GTM Folks). Translation: **code-first GTM is eating no-code GTM** - favorable to
  our profile.

## Fresh launches to be aware of (avoid me-too, or one-up)

- **Mutiny** launched an AI agent integrating with CRMs + call transcripts to
  automate GTM workflows (had passed ~$10M revenue).
- **Nitrosend** - email marketing platform that runs **natively inside AI agents
  via MCP** (dispatch campaigns from inside ChatGPT). Signals the "GTM-via-MCP"
  pattern is appearing - an angle we could leverage (Fiber's MCP, OpenAI's docs MCP).
- The "AI for GTM: What Works and What's Overhyped" podcast (Mostly Growth)
  blind-ranked use cases: AI lead scoring, sales research briefs, synthetic ICPs,
  micro-campaign agents, competitive-intelligence copilots, AI CRMs.

## Net takeaways for idea selection

1. **Do not build a generic AI SDR / mass-outbound tool.** It's saturated and in
   backlash; judges will read it as a me-too.
2. **Lean into custom signal + real-time scoring + automatic action** (Lopus's
   exact thesis) - this is both "what works" and on-theme.
3. **Relevance, timing, and verifiable data** are the differentiators, not volume.
4. **Code-first / agent-native** framing plays to our strengths and the current
   "Claude Code vs Clay" zeitgeist.
5. A defensible angle: be the thing **other agents integrate with** (MCP/tool), or
   attack an under-served slice (PLG/onboarding, churn, competitive intel,
   de-anonymization, RevOps glue) rather than the crowded outbound slice.

### Engine footer (last30days run 1)
```
✅ All agents reported back!
├─ 🔴 YouTube: 2 videos │ 54 views │ 0/2 with transcripts
├─ 🐙 GitHub: 6 items │ 4 comments
└─ ⛏️ Digg: 8 clusters │ 27 posts │ 20 authors
```
### Engine footer (last30days run 2)
```
✅ All agents reported back!
├─ 🔴 YouTube: 3 videos │ 167 views │ 1/3 with transcripts
├─ 🐙 GitHub: 6 items │ 9 comments
└─ ⛏️ Digg: 19 clusters │ 179 posts │ 89 authors
```
