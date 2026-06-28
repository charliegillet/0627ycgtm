# Judge Dossier: Vincent (Cursor) - Founding Growth Team, CONFIRMED JUDGE

> Primary source for everything Vincent personally said is our own cleaned kickoff
> transcript (`docs/hackathon-kickoff-transcript.md`, section 5). That is the most
> authoritative record we have of his words and the "Chat GTM" demo. Public web
> sources corroborate every Cursor product fact below. His **surname could not be
> verified** from any public source (many "Vincent"s; none confirmed as Cursor
> founding growth team), so treat the bio as first-name + role only.

---

## TL;DR (what to optimize for)

Vincent is on **Cursor's founding growth team** and is **judging this hackathon**
(plus he ran the Sat 7:30 Q&A with Danilo/Lopus). At the kickoff he did not pitch
PLG theory; he demoed a **real internal tool his team shipped** - "Chat GTM" - and
framed it as "here is what we built internally with our own SDK." That is the tell.
**To impress Vincent: ship a working internal GTM tool that a real growth team
would run on Monday, built on an agent SDK / programmatic harness, wired to live
business data (CRM + warehouse), that takes one account and returns context, an org
chart of decision-makers, enrichment, and prioritization signals.** He explicitly
values: real internal utility, agent-native architecture, data integration, and
making powerful tooling usable by non-engineers.

---

## Who he is (verified vs. unverified)

| Field | Value | Status |
|---|---|---|
| First name | Vincent | Verified (he introduced himself on stage) |
| Surname | - | **Could not verify** |
| Role | "Part of the founding growth team at Cursor" | Verified (his own words) |
| At the hackathon | Sponsor presenter (Cursor), **confirmed judge**, ran the 7:30 Q&A | Verified (transcript + speaker notes) |
| Public talks/posts | None confirmed to be this Vincent | **Could not verify** - do not attribute external content to him |

Be careful: web searches surface unrelated people (Vincent Cotte at Salesforce,
Vincent Weisser at Prime Intellect, etc.). None of these is the Cursor growth
Vincent. Do not cite them as him.

---

## What he said on stage (his framing of Cursor)

He gave a fast tour of **what Cursor has been shipping**, then pivoted to the
internal GTM build. His product list, in his order:

- **Cursor 3** - the new **agent-first interface**; "the best way to build ambitious
  software with agents." His thesis: coding now "looks more like working with agents
  the way you would with colleagues: **agents managing agents, many parallel work
  streams**, all with the context you need." (Cursor 3 launched April 2, 2026, the
  biggest interface overhaul since 2023; adds the Agents Window for running many
  agents in parallel across local, worktrees, cloud sandboxes, and SSH.)
- **Agent window** - easy multi-agent use, inside Cursor 3.
- **Automations** - "repeatable tasks in the cloud." His example: a **security-review
  bot** that runs on every deploy, reads the change, and checks whether it meets
  their bar to ship. (Note: their own dogfooded automation is GTM-adjacent in spirit
 - an autonomous gate on a workflow.)
- **Cloud agents** - "how people ship several things while they sleep."
- **Composer** - Cursor's own model, "a great mix of fast, cheap, and intelligent."
  (Composer launched Oct 29, 2025; ~4x faster than similarly intelligent models,
  most turns under 30s, trained with codebase-wide semantic search.)
- **Cursor CLI / SDK** - "harness the power of Cursor programmatically." (The
  TypeScript SDK `@cursor/sdk` shipped April 29, 2026; exposes the same agent
  runtime/harness/models that power the IDE, with sandboxed cloud VMs, subagents,
  hooks, MCP, print/headless mode.)

His one-line bridge: **"here is what we built internally with our own SDK."** Cursor
practices what it sells - the growth team builds its own tools on the Cursor SDK.

---

## "Chat GTM" - the internal tool he demoed (the most important artifact)

The why-now: **"Cursor had about 15 account executives at the end of 2025, and
go-to-market is now close to 500 people."** Onboarding that many new sellers fast
created the problem: **getting sellers account context quickly.** So the growth team
built **Chat GTM**.

What it is, from his demo:

- A **product made intuitive even for people who never opened an IDE before joining**
  (i.e., built for non-technical sellers, not engineers). This is a recurring Cursor
  growth value: powerful agent tooling, packaged for non-engineers.
- **Many pre-selected actions** (canned, high-value queries rather than a blank
  prompt box).
- **Connects to Databricks and Salesforce** to read user (product) data and sales
  data. (Databricks = warehouse / product-usage data; Salesforce = CRM / sales data.)

The demo flow ("imagine you are a **new AE assigned Delta Airlines**"):
1. **Segment** the account is in.
2. A **one-liner of context** on the account.
3. **Product footprint** - "we are a PLG company" - i.e., who/how much is already
   using Cursor inside that account (the bottom-up signal).
4. **The org** - "who makes decisions and who you should be reaching out to" (an
   **org chart of decision-makers**, the path from product users up to buyers).
5. It **prioritizes the top context, enriches the data, and surfaces signals for why
   to prioritize** that account.

Note how cleanly Chat GTM maps to Lopus's **DETECT → ENRICH → SCORE → ACT** frame:
it detects the account/usage signal, enriches with org + firmographic context,
scores/prioritizes, and surfaces the next action for the AE. **Vincent and Danilo
are judging the same event with the same mental model.** A project that visibly does
this loop on a custom signal is aimed straight at both judges.

This is also a near-twin of **Databricks' internal "Ask Mo"** (entry point into
Salesforce: research org changes, next-best-product, exec briefings). Same playbook:
warehouse + CRM behind an agent, packaged for the field. Knowing both reference
points lets us out-demo a generic "AI for sales" idea.

---

## Cursor's growth philosophy (context for his taste)

- **Product-led, brutally lean.** Cursor reached ~$300M ARR with ~60 employees and
  ~$1B ARR (Nov 2025) / ~$2B ARR (early 2026) on almost no traditional marketing.
  Revenue-per-employee is near-unprecedented. The growth org Vincent is on optimized
  for **leverage**, not headcount.
- **Bottom-up usage as the signal; top-down sales formalizes demand.** Enterprise
  conversations start *after* developers already adopted. Chat GTM literally
  operationalizes this: the AE's first question is "who's already using us here?"
- **GTM hires are technical.** Cursor hires **"technical AI advisors"** / field
  engineers who are power users; every GTM hire **demos the product in the interview**
  and, in onboarding, **completes a course on building and shipping something with
  Cursor.** Sellers are expected to build. Chat GTM is the tooling that lets even
  non-IDE people operate at that bar.
- **Dogfooding is doctrine.** Automations (security-review bot), the "Built in Cursor"
  Slack channel, and Chat GTM-on-the-SDK all signal: **build your own tools on your
  own runtime.**
- **The SDK is explicitly pitched for this.** Cursor's own SDK blog lists "**internal
  business tools: custom platforms allowing teams (like GTM departments) to query
  product data without coding**" as a headline use case. A hackathon project that
  does exactly this is squarely in their narrative.

---

## What would impress Vincent as a judge

1. **Real internal-tool energy, not a toy.** Something a Cursor/Lopus/Orange Slice
   growth engineer would actually run Monday. He demoed utility, not slides.
2. **Agent-native + programmatic.** Built on an agent SDK/harness (Cursor SDK is the
   on-brand flex; OpenAI Codex/Convex agents also fine), ideally with **parallel
   agents, subagents, or automations** - mirrors the "agents managing agents" thesis.
3. **Live data integration, two sources minimum.** A product/usage source (warehouse,
   PostHog, product DB) + a sales/CRM/people source (Salesforce/HubSpot, Fiber AI,
   Orange Slice). Chat GTM = Databricks + Salesforce; emulate the shape.
4. **Org-chart / decision-maker mapping + prioritization signals.** This was the
   emotional center of his demo. A tool that turns "an account" into "who to contact,
   why now, what to say" lands directly on his lived problem.
5. **Usable by non-engineers.** Pre-selected actions, clean output, no blank prompt.
   He stressed Chat GTM works for people who never opened an IDE.
6. **The DETECT→ENRICH→SCORE→ACT loop made visible** on **one custom signal** (not a
   bought list). Satisfies both Vincent's and Danilo's frame at once.
7. **Demo craft.** Win condition is a working demo + 3-min video, no slides. He
   apologized for tech difficulties and let the product carry it - match that: a
   tight, live, "type a company name → get the brief" moment.

---

## Idea hooks for the hackathon

- **"Chat GTM, but for the judges."** Build an open-source Chat-GTM clone: type an
  account → returns segment, one-liner, product footprint (PLG usage), an **org chart
  of decision-makers**, enrichment, and "why now" signals. Wire product data (Convex
  DB / PostHog / a warehouse) + CRM/people data (Fiber AI + Orange Slice). This is
  the single most judge-aligned idea: it is literally the tool Vincent demoed, and it
  maps 1:1 to Danilo's DETECT→ENRICH→SCORE→ACT. Demo it on a real company live.
- **New-AE onboarding agent.** Drop a rep into a fresh territory; agent auto-builds
  an account brief + outreach plan + org map for each assigned account overnight via
  **cloud agents / automations** (ship-while-you-sleep). Directly hits the "15 → 500
  sellers, get context fast" pain he named.
- **Build on the Cursor SDK as the on-brand flex.** Use `@cursor/sdk` (subagents +
  cloud VMs + MCP) as the engine for a GTM tool. It is exactly the "internal business
  tools / GTM department queries product data" use case Cursor advertises - and it
  signals you read their playbook.
- **Org-chart-from-signals engine.** Given a company + its product usage, infer the
  buying committee and the warm-intro path from existing users up to economic buyer
  (Fiber AI people-search + LinkedIn-real-time endpoints). The org-chart moment was
  the demo's peak; own it.
- **Automation-as-a-gate for GTM.** Cursor dogfoods a security-review bot on deploy.
  Build the GTM analog: an automation that fires on a CRM event (new opp, usage
  spike, champion job-change), enriches, scores, and posts the next action to Slack -   autonomous, repeatable, "runs while you sleep."
- **"Demos sell" tool.** Cursor makes every GTM hire demo the product. Build a tool
  that auto-generates a tailored, account-specific live demo / ROI calc from a
  company's own data - leaning into Cursor's "sellers must build/demo" culture.

---

## Q&A insights (dinner fireside, PRIMARY SOURCE - read this for judging)

From the Jun 27 Vincent + Danylo fireside Q&A (`docs/cursor-lopus-qa-transcript.md` /
`docs/cursor-lopus-qa-notes.md`). Vincent's own words; the strongest signal we have for
what he will reward as a judge.

- **Narrow to ONE of four buckets and go deep:** discover / acquire / research / enable.
  He said it directly: "pick one and go for it." ChatGTM was built for SDRs, NOT AEs (SDRs
  need lots of context for high-volume outbound; AEs want top-down strategy). Scope our
  project to one bucket + one persona, not a do-everything platform.
- **Signals = information asymmetry:** "what do I know about my audience that others don't?"
  His canonical example: a person who used to work at a customer just moved to a prospect
  company, auto-congratulate the move and reach out, run across 20-40k people. PLG gives the
  "strategic chips" (who loves the product + their role/company).
- **Cold email is dying; the live edges are IRL + consumer channels.** His personal wins: a
  Cursor COFFEE TRUCK outside a prospect's office closed the deal; a mock PROTEST outside
  Salesforce Tower; and "surround-sounding" past-"no" customers by mining CALL TRANSCRIPTS
  for the reason they didn't buy, finding which reasons are now solved by shipped features,
  then hitting them with targeted email + bespoke LinkedIn creative. He pushes back hard on
  "everything is online", in person people tell you things they will not post.
- **Retention/lifecycle is underrated:** segment (end-user vs large account); find WHY they
  churn (sometimes trivial, e.g. a confusing credits panel); lifecycle email reminding users
  which features exist, "not yet very personalized, though I think you can get there" (an
  explicit gap he named = an opportunity).
- **Build-vs-buy:** Cursor culture defaults to BUILD internally, fast, no barriers. ChatGTM
  started when a research engineer built a long-running agent that coded a browser end-to-end
  in a weekend; they then pointed long-running agents at account research (synthesize LinkedIn
  + company blogs). They "stumbled into it" opportunistically.
- **Closing advice:** "keep the emotion in mind, embody the person you're solving for, start
  specific, solve it for specific customers." It is "art and heart", winning hearts and minds,
  not just engineering.

**What this means for us:** highest-Vincent-fit ideas are (a) a narrowly-scoped tool for ONE
persona/bucket, (b) something surfacing real information asymmetry, (c) retention /
feature-discovery / PERSONALIZED lifecycle (he named the personalization gap himself), or
(d) the "surround-sound past-no's from call transcripts x shipped-feature deltas" play (he
personally did this and it worked). De-prioritize anything that is email-outbound volume.

## Sources

- Primary: `docs/hackathon-kickoff-transcript.md` (our cleaned transcript, section 5
 - Vincent's exact words and the Chat GTM demo), `docs/cursor-lopus-qa-transcript.md`
  (the dinner Q&A), and `docs/research/00-ground-truth.md`.
- Cursor's GTM playbook (15 AEs → ~500 GTM, technical AI advisors, demo-in-interview):
  https://thegtmnewsletter.substack.com/p/deconstructing-cursor-growth-playbook-4m-to-2b-arr
- Cursor enterprise GTM, "technical AI advisors," "Built in Cursor" Slack, field
  engineers: https://www.upstartsmedia.com/p/redpoint-ai64-apps-cursor
- Databricks "Ask Mo" (the Chat GTM analog) + Monday.com / Benchling GTM playbooks:
  https://cloud.substack.com/p/ai-in-gtm-efficiency-the-playbooks
  and https://www.saastr.com/ai-in-gtm-efficiency-the-playbooks-from-databricks-monday-com-and-benchling/
- Cursor 3 agent-first interface + Composer: https://cursor.com/blog/2-0 ,
  https://cursor.com/changelog/2-0 , https://www.infoq.com/news/2026/04/cursor-3-agent-first-interface/
- Cursor TypeScript SDK ("internal business tools… GTM departments query product
  data"): https://cursor.com/blog/typescript-sdk
- Cursor CLI / headless: https://cursor.com/cli , https://cursor.com/docs/cli/headless
- Cursor for sales engineers (build ROI calcs, account-research dashboards, outreach):
  https://cursor.com/for/sales-engineers
- Cursor GTM/growth roles (philosophy, stack): https://cursor.com/careers/gtm-systems ,
  https://cursor.com/careers/gtm-engineer-growth-programs
- Salesforce x Cursor adoption (20k engineers): https://cursor.com/blog/salesforce
