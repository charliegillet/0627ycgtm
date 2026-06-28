# Judge Dossier: Dan Low / Danilo (Lopus AI)

> CONFIRMED JUDGE. Ran the Saturday 7:30pm dinner Q&A alongside Vincent (Cursor).
> Owns the central conceptual frame of this hackathon: pick ONE custom signal and
> wire it through DETECT -> ENRICH -> SCORE -> ACT.
>
> Naming: he introduced himself on stage as "Dan Low." His real name is
> **Danylo Borodchuk** ("Dan Low" is the spoken/anglicized form of "Danylo").
> The kickoff transcript and ground-truth doc refer to him as "Dan Low / Danilo."
> Treat all three as the same person.

---

## TL;DR for the debate

- The judge to design FOR. He literally stood up and told the room what he would
  build and what would impress him. Our project should look like a clean,
  end-to-end instance of his slide: **one creative, custom (not bought) signal,
  detected -> enriched -> scored -> acted on**, with a fast, good-looking interface.
- His taste is **data-engineering taste**. He believes "the best GTM engineers I
  have met were ex-data engineers or data scientists." He will reward correct,
  trustworthy data plumbing and an honest signal, and he will be unimpressed by a
  thin wrapper over a bought intent feed.
- He named a specific stack on stage. Using pieces of it (dltHub, Postgres+DuckDB,
  Trigger.dev, Mastra/AI SDK, Slack/Gmail/React) is a cheap way to signal "we
  listened" and to read as technically serious to him specifically.
- His company thesis is **governed definitions / semantic layer / trustworthy
  analytics** ("the most dangerous tool is one that always answers"). A project
  that refuses to fabricate, shows its work, and is explainable will resonate with
  him beyond the average judge.

---

## Who he is (verified)

| Field | Detail | Source |
|---|---|---|
| Name | Danylo Borodchuk (on-stage: "Dan Low") | YC, LinkedIn |
| Role | Co-founder of **Lopus AI** (YC W25) | YC |
| Title nuance | YC lists **Aamish Ahmad Beg as Co-founder & CEO**; Danylo as **Co-founder / Founder**. On stage at this event Danylo represented Lopus and is the confirmed judge. | YC company pages |
| Education | Computer Science at **Dartmouth**; **dropped out** to build Lopus | YC, GTM Vault podcast |
| Prior | **2+ years award-winning R&D at DALI Lab (Dartmouth)**; AR/VR dev, product & system design; led technical teams at research labs, tech-consulting groups, and quant teams. DARPA research exposure. | YC bio (verbatim), GTM Vault |
| Origin | International student; reported to be **from Ukraine, on an O-1 visa** | search summary (secondary, treat as likely-but-unconfirmed) |
| Location | San Francisco | YC |

His co-founder **Aamish Ahmad Beg** (Co-founder & CEO): "CS @ Dartmouth.
Full-stack/infra/ML dev building in public. Extensive experience with LLM-centered
ML research. Previously worked on the DIGIHEALS project at DARPA." (YC, verbatim).
So both founders are Dartmouth CS with research/ML backgrounds, not career sellers.

> Data-quality note: several third-party "tool directory" pages (e.g. a Specter
> landscape summary) claim Lopus was "founded 2022 by Arjun Desai (ex-ZoomInfo) and
> Maya Chen (ex-Salesforce)." **This is false / fabricated.** Primary YC and
> Crunchbase sources show founded 2024, batch W25, founders Aamish Ahmad Beg and
> Danylo Borodchuk. Ignore the Desai/Chen claim entirely.

---

## Lopus AI: what the company is

- **One-liner (their own):** an **operational / growth-operations data platform**
  that unifies product, sales, and marketing data in one place, sitting on top of
  your existing databases or data warehouses (e.g. Databricks, Snowflake, BigQuery)
  to "pull the right data and drive growth." (Kickoff transcript; lopus.ai)
- **Core IP:** a **"self-healing semantic layer that captures your business logic."**
  Define metrics once (what "revenue," "MRR," "churn," "qualified" mean) and trust
  them everywhere. "No SQL. No dashboards. No waiting on the data team." (YC)
- **Product surface:** instant natural-language answers over unified GTM data;
  always-on monitoring; anomaly detection; root-cause analysis; real-time alerts.
  Marketed product name(s): **Probe** (GTM analytics). Some third-party reviews
  also reference **Beacon** (intent/lead discovery), but Probe + the semantic layer
  is the consistently-described core.
- **Trust posture (important for his taste):** answers are **governed** by the
  semantic layer; the system **shows generated SQL, tables used, and assumptions**;
  it **refuses queries it cannot answer reliably** (checks joinability, won't
  fabricate joins between unrelated tables). His line: *"the most dangerous tool is
  one that always provides an answer, even when the foundations are corrupted."*
- **Self-healing layer:** when underlying schemas/APIs change, the system
  **regenerates its own SQL** from plain-English definitions, so dashboards don't
  silently break. He frames the real cost of analytics as *maintenance*, not
  building.

### Stage / traction / positioning
| Field | Detail | Source / confidence |
|---|---|---|
| Stage | Seed, very early | YC, Crunchbase |
| Funding | **$500K seed**, ~Feb/Mar 2025; YC among backers | Crunchbase/YC/Getlatka (consistent). One stray search summary said "$4.2M led by Moonfire" - **unverified, likely wrong**; treat as $500K. |
| Revenue | reported ~**$550K** (third-party, Getlatka) | secondary, low confidence |
| Team | YC lists **2**; one third-party says 5 | mixed |
| Pricing | reported **~$2K/month, single-tenant**, with a **forward-deployed data engineer** for onboarding | secondary (ColdIQ/review summaries) |
| Customers named on site | **Alphie** (Yura Riphyak), **Wako AI** (Ari Ramsan, "grew to #1 App Store"), **Corgi** (GTM lead Russell: "found lost revenue in places no one anticipated") | lopus.ai |

> Note the **Corgi** testimonial: Corgi is also a sponsor of this hackathon (coffee
> sponsor, may run a Sunday Q&A). Lopus and Corgi are connected. Useful color, and
> a possible point of resonance if our project touches that ecosystem.

**Competitive set:** positioned in AI-x-GTM "GTM intelligence / agentic analytics."
Adjacent/competing names that come up: Gong, HockeyStack, Demandbase, UserGems,
Unify, Persana. Lopus's differentiator vs. dashboard/BI tools is the **governed
semantic layer + explainability + refusal-to-hallucinate**, not more charts.

---

## His framework: DETECT -> ENRICH -> SCORE -> ACT

This is the most important artifact for us. From the kickoff deck (Lopus slide
"Tonight's Build" / "Pick one signal. Wire it through all three layers.") and the
transcript, here is the canonical version and what "good" looks like at each step.

| Step | Goal | Layer | What "good" looks like to him |
|---|---|---|---|
| **1. DETECT** | Catch the signal as it happens | DATA | A **custom, niche, non-bought** signal that maps to a real human persona. Real-time-ish, not a static list. The harder/more creative the signal, the better. |
| **2. ENRICH** | Add the context that makes it actionable | DATA + ORCH | Turn the raw signal into something a human/agent can act on: who is this person, company, role, contactability (email/phone), recent context. |
| **3. SCORE** | Decide who acts and how urgently | ORCH + LLM | Prioritization with judgment, ideally LLM-assisted, that reflects fit + intent + urgency. Explainable: *why* this lead, *why now*. |
| **4. ACT** | Alert a human or trigger an agent | INTERFACE | Close the loop with no button-pushing: comment on a post, send a DM, ping the AE, enrich to find a phone, or have an agent call. Lives where GTM teams live (Slack/email) or a slick web app. |

His exact three-step framing on stage:
1. **Start with the data.** "Simple on the surface, but not easy." -> "the
   higher-leverage signals are **custom, not bought**." The alpha is "finding
   something niche yet highly applicable." His worked example: a company building a
   custom IDE should find **developers frustrated with traditional IDEs** (or people
   with a business use case but no technical background), using Orange Slice to find
   them. **This requires understanding the human persona and building it into the
   customer's data pipelines.**
2. **Orchestration.** Once a signal fires, decide the action automatically: comment,
   DM, ping the AE, enrich for a phone number, or have an agent call - **"all
   without you touching a button."**
3. **Make it cool (and fast).** "Cool usually means useful, nice to look at, and
   fast (nobody wants to wait)."

---

## His recommended stack (he named it on stage)

| Concern | Tool he named |
|---|---|
| Ingestion / integrations | **dltHub** (dlt) |
| Read-only analytics DB | **Postgres + DuckDB** (the ground-truth doc maps this to `pg_duckdb`) |
| Orchestration | **Trigger.dev** |
| Agents | **Mastra** + the **AI SDK** (Vercel) |
| Interface | **Slack app** ("most GTM teams live in Slack"), **email** ("everyone checks it"), or a **custom web app** (React) |

Why this matters for us: he will recognize these. Using even a subset reads as "this
team listened and knows the modern GTM-eng stack." Note that **Convex** (our 20% EV
sub-goal) is not on his list - but his stack is opinionated, not mandatory. We can
satisfy his framework conceptually while using Convex as the reactive backend/ACT
layer; the framework is tool-agnostic. If we want maximum Danilo points we could use
Trigger.dev for orchestration and Mastra/AI SDK for agents and still keep Convex.

---

## What he explicitly said he'd find useful / build

- A pipeline around **one creative, unique signal** detected -> enriched -> scored ->
  acted on, "in a way that is useful for the company. That is it."
- Signals that come from **understanding a human persona** and encoding it into a
  data pipeline (the "frustrated-with-their-IDE developer" example).
- **Fully automated action** ("all without you touching a button") - he repeatedly
  emphasized closing the loop, not just surfacing a dashboard.
- **Speed and polish** as part of "cool."

## What will make him score HIGH

**Usefulness (his #1 lens, and the event's #1 criterion):**
- A growth engineer at Lopus / Cursor / Orange Slice would actually run it Monday.
- Solves a real RevOps/growth pain end-to-end, not a toy.

**Technical complexity (he's an ex-data-eng/researcher; he can see through it):**
- A genuinely **custom signal** requiring real detection work (scraping, parsing,
  classification, persona modeling) - not a call to a bought intent API.
- Correct, **trustworthy data joins**; explainable scoring; an LLM used with
  judgment (not a single prompt). Show the plumbing.
- Bonus: anything echoing his **"refuse rather than hallucinate" / show-your-work**
  philosophy (lineage, the SQL/logic behind a score, confidence/abstention).

**Coolness:**
- Fast, live, good-looking. A real-time "watch the signal fire -> agent acts" demo
  in the 3-min video. Streaming/live updates land well.

## What will make him score LOW

- A thin wrapper over a **bought** intent/list provider with no custom signal.
- A dashboard with no ACT step (he hates "tools that just answer").
- A confident-but-wrong demo. Given his "most dangerous tool always answers" line,
  visible hallucination or a fabricated join would cost real credibility with him.
- Slow / janky interface (he explicitly tied "cool" to "fast").

---

## Creative custom signals he'd likely respect

Anchored on his own "niche yet highly applicable, persona-driven" criterion:
- Devs publicly venting about a competitor tool (GitHub issues, HN/Reddit threads,
  X) -> map to "frustrated IDE user" persona -> enrich -> route. (his own example)
- Job-post deltas that imply a *specific* operational pain your product fixes
  (not just "hiring," but "hiring for the exact role your product replaces/supports").
- Product-usage edge events (e.g. a user hits a limit, churns a feature, invites a
  teammate) as a custom PLG signal joined to CRM/billing.
- Public commitments/timing: a company shipping a feature, migrating a stack,
  failing a status page, sunsetting a vendor - inferred from primary web sources.
- Persona-level intent inferred from *unstructured* sources (call transcripts,
  Slack, support tickets) - very on-brand for Lopus's "unstructured data" pitch.

---

## Idea hooks for the hackathon

1. **Signal-to-action loop, his slide made real.** Pick one genuinely custom signal
   (e.g. "developer publicly frustrated with tool X"), DETECT via scraping +
   LLM classification, ENRICH (Fiber/Orange Slice for contact + company), SCORE with
   an explainable LLM rubric (fit/intent/urgency with reasons shown), ACT
   automatically into Slack + a drafted DM/email. Demo it live, end to end. This is
   the literal thing he told the room to build - execute it cleanly and fast.
2. **"Show your work" scoring engine.** Lean into his trust thesis: a lead/account
   scorer that **refuses to score** when data is insufficient and **shows the
   lineage** (which signals, which records, the exact logic) behind every score.
   Differentiates on technical honesty - a Danilo-specific edge.
3. **Custom-signal compiler.** Let a user describe a persona in plain English
   ("devs frustrated with their IDE") and auto-generate the detection pipeline
   (sources to scrape + classifier prompt + enrichment plan + scoring rubric).
   This mirrors Lopus's "plain-English definitions -> regenerated SQL" semantic-layer
   idea, applied to signals. High technical complexity, very on-thesis.
4. **Unstructured-signal miner.** Detect buying/expansion/churn signals from
   transcripts/Slack/support tickets (the unstructured sources Lopus emphasizes),
   join to CRM/billing, score, and route. Plays directly to Lopus's positioning.
5. **Stack-aligned build.** Whatever we pick, wire it on dltHub -> Postgres+DuckDB ->
   Trigger.dev -> Mastra/AI SDK -> Slack/web (optionally keep Convex as the reactive
   ACT/notification layer for the 20% sub-goal). Name-checking his stack in the
   3-min video is free credibility with this specific judge.

---

## Q&A insights (dinner fireside, PRIMARY SOURCE - read this for judging)

From the Jun 27 fireside Q&A (`docs/cursor-lopus-qa-transcript.md` / `docs/cursor-lopus-qa-notes.md`).
Danylo's own words; the strongest signal for what he will reward as a judge.

- **Context engineering / "company brain" is HIS core problem (and the meatiest idea space
  for him):** data consolidation is already solved by warehouses; the NEW challenge is
  explaining to AGENTS which data matters and how the company works. He expects roughly as
  much time mapping data context as was once spent building data pipelines. His bet: an
  Obsidian-style NESTED FILE SYSTEM of linked metrics/definitions that agents navigate
  ("agents are very good at file systems"), the "company brain." The data team shifts from
  ad-hoc answers to maintaining a system that does the work. A project that builds an
  agent-navigable company-brain / semantic-context layer is his bullseye.
- **Consolidation:** GTM folks are buried under tool sprawl and want ONE platform (a
  "Salesforce-for-GTM"), not point solutions.
- **Retention = FEATURE DISCOVERY + 2-SECOND RESPONSE:** the key retention lever is showing
  users "here are features + how you'd use them in YOUR job" (people remember ~none of last
  month's features). PLUS his killer hack: respond to customer messages within ~2 seconds, he
  wired Slack to an agent he calls "Hermes" that pings him on Telegram repeatedly until he
  replies to any customer-channel message; even "saw it, on it" builds trust and shifts the
  next step back to the customer.
- **Distribution-as-moat, decoded:** "the moat shifted from 'build it and they show up' to
  'build it and communicate it to the right person'", especially for a data solution,
  understand the intricacies of the company/role.
- **Cold email ~1% reply (dying); texting/consumer channels get read.** Consumer marketing
  for B2B is "genuinely untapped" (his friend's Caseflood targeted lawyers on Instagram; CFOs
  via NFL). Narrative fatigue is the core problem, everyone says the same thing.
- **Closing advice (and a direct demo-craft instruction):** go talk to a REAL person in an
  industry you don't know (e.g. whoever runs an ice cream truck tomorrow), ask "how do you
  find customers? We can build a pipeline for you," understand their business IN PERSON, then
  build for that. The moderator added: RECORD yourself doing it and put it in the submission.

**What this means for us:** highest-Danilo-fit ideas are (a) a company-brain / agent-navigable
data-context layer (his literal thesis), (b) a feature-discovery retention agent, (c) the
2-second customer-response agent (he built this for himself and loves it), or (d) ANY project
where we go talk to a real operator on camera and build them a pipeline. Explainable +
abstaining scoring still applies.

## Sources

- Kickoff transcript (primary, in-repo): `docs/hackathon-kickoff-transcript.md` (Section 6, "Lopus - Dan Low (Danilo)"), `docs/cursor-lopus-qa-transcript.md` (the dinner Q&A), and `docs/research/00-ground-truth.md` (Section 5).
- Lopus on YC (Analytics built for Growth): https://www.ycombinator.com/companies/lopus-ai
- Lopus on YC (Growth Operations Data Platform): https://www.ycombinator.com/companies/lopus
- Lopus homepage: https://lopus.ai/
- GTM Vault podcast (Danylo Borodchuk, "The Semantic Layer Is the Missing GTM Architecture"): https://www.gtmvault.co/p/gtm-43-the-semantic-layer-is-the
- Podscan episode page: https://podscan.fm/podcasts/gtm-vault/episodes/the-semantic-layer-is-the-missing-gtm-architecture-with-danylo-borodchuk-lopus-ai
- Danylo Borodchuk LinkedIn: https://www.linkedin.com/in/danylo-borodchuk/
- Aamish Ahmad Beg LinkedIn: https://www.linkedin.com/in/aamish-ahmad-beg/
- Crunchbase (Lopus AI): https://www.crunchbase.com/organization/lopus-ai
- ColdIQ review: https://coldiq.com/tools/lopus-ai
- AI Growth Hackathon (YC events page): https://events.ycombinator.com/OrangeSliceHackathon
- (Flagged as unreliable: Specter "AI x GTM Landscape 2025" - contains a fabricated founder/year for Lopus) https://insights.tryspecter.com/ai-x-gtm-landscape-2025/
