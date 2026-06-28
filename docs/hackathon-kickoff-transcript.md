# AI Growth Hackathon — Kickoff Transcript (cleaned & organized)

> Source: full transcript recorded by Granola at the kickoff (Jun 27). This is
> the raw material the [speaker notes](hackathon-kickoff-speaker-notes.md) were
> drawn from.
>
> **About this cleanup:** the automated transcript was messy, so it has been
> organized by speaker and lightly edited for readability. Garbled product names
> were corrected (Convex, Codex, Lopus, dltHub, DuckDB, and so on). Wording is
> approximate, not verbatim; check the source file if you need an exact quote.

## Speakers, in order

1. **Host / MC** (hackathon organizer) — opening, rules, logistics
2. **Orange Slice** — go-to-market engineering platform
3. **OpenAI** — Codex
4. **Convex** — database / backend platform
5. **Cursor** — Vincent (founding growth team)
6. **Lopus** — Dan Low / Danilo (operational data platform)
7. **Fiber AI** — introduced by the host; company not present
8. **Host / MC** — closing and next steps

---

## 1. Host / MC — Opening, rules, and logistics

### WhatsApp and housekeeping intro
Please download WhatsApp and join via the QR code on screen. If it will not let
you in (rate limits, etc.), try a few times; another QR code will go up shortly.
If you still cannot get in, ask a neighbor to add you. The slideshow will be sent
into the chat afterward, so there is no need to photograph the slides.

### Agenda
- Kickoff: now (6:30). Hacking starts right after.
- Dinner: 7:30. You are free to work in the office overnight.
- Sunday morning: breakfast and lunch.
- Projects due: Sunday 4:00 p.m.
- Finalists announced: 5:00 p.m.
- Final pitches and overall 1st / 2nd / 3rd place winners: 6:00 p.m., in this room.

### Why you are here: growth engineering
When reviewing applications, we selected for two kinds of people: those who are
good at growth, and those who are very technical. You are one or both. You are
here because of a new role startups are creating, **growth engineering**:
engineers who write code, run growth experiments end to end, automate themselves
with AI, and own the entire growth pipeline. Some ask whether distribution is the
only moat that matters in the age of AI. Nobody here knows the answer yet, but
maybe one of you will find out.

### Project ideas and judging criteria
There are some project ideas on screen, a few of which you may recognize from the
hackathon description. Judging is simple: **Is it useful? Was it hard to build?
Is it cool?** Slides are discouraged; we want a working demo. If you need slides,
keep it to a couple and about a minute.

### Submission and rules
Submit your open-source project via **Vibe Apps** with a 3-minute demo video,
before 4:00 p.m. Sunday. (Thanks to Convex for providing the submission
infrastructure.) Judges will review tomorrow and select the best projects to
present on stage.

Rules:
- Teams of up to 4 people.
- No projects started before the hackathon. A standalone feature or tool that
  would integrate into a pre-existing project is fine, as long as it lives in a
  separate codebase.
- Your project must be open source on GitHub for the duration of the hackathon.
  You can close it afterward; we just need to see the code for judging.

### Building and house rules
You may hack on this floor, the first floor, or the ground floor. You cannot
re-enter the building between midnight and 6:00 a.m., and security will be strict
about it, so if you leave during those hours you cannot come back. Overnight
hacking here is fine; there are couches downstairs if you need a nap. Clean up
after yourselves, and do not be a dick.

### Sponsor credits
Thanks to our sponsors, you get API credits and support (all tied to your signup
email):
- **$50 OpenAI API credits** — a code is in your email now. Redeem under Billing >
  Promotions (search "billing", then Promotions, then enter the code).
- **$50 Cursor credits** — QR code coming up; submit your email via the Google
  form. Sarah is distributing these at the table.
- **$50 Orange Slice credits.**
- **$500 Fiber AI credits.**
- **Free Convex access** for the duration of the hackathon.

### Prizes
- **1st place:** $2,500 cash + $5,000 OpenAI API credits + $500 Cursor API credits
- **2nd place:** $1,500 cash + $2,500 OpenAI credits
- **3rd place:** $500 cash + $1,000 OpenAI API credits

Thanks to OpenAI for all of the API credits. Now over to our hosts and sponsors.

---

## 2. Orange Slice

Thanks for coming. For those who have not heard of us: **Orange Slice** is a
go-to-market engineering platform that helps people build revenue workflows
through code. We saw growth and engineering converging. I used to run a
go-to-market agency and eventually built this in-house for myself, in a folder
called "os" (my internal operating system for the agency). Agency friends asked
for it, we shared it, and that folder name is where "Orange Slice" came from.

Think of it as an **agentic spreadsheet** for whatever you are trying to do (for
example, finding customers from ads): agents write code and do much of the work.
There are two ways to use it during the hackathon:
- **Web UI:** the agentic spreadsheet interface, driven through a prompt box.
- **Coding-agent package:** we bundle every sales-data provider with our own
  harness, so you can hand a coding agent to it and turn it into a sales agent.

Pick whichever you prefer; you can build almost anything with it. Everyone has
**$50 in credits**, auto-deposited to the email you used to sign up, so create an
account with that email. We are hiring and have a Slack to join, so feel free to
email me or come find me anytime. Over to our next sponsor, OpenAI.

---

## 3. OpenAI

I work in engineering at OpenAI and I am pumped to see what you build in the next
24 hours. (Plays a short video message.) The theme of today is simple: you can
just build things. **Codex** has made it easier than ever to go from an idea to a
real product, so ship something today. You should already have credits. Build
something new and ambitious, and reimagine what GTM looks like: how companies find
customers, understand them, reach them, and operate.

A few tips:
- Codex and the tooling our own engineering, sales, product, and design teams use
  are powerful across the whole spectrum of GTM work.
- **OpenAI docs MCP and skills** are the easiest way to get the latest without
  pasting markdown and copying things around.
- For inspiration, look at what people have built in past hackathons with Codex
  and apply it to GTM.
- There is a link to the **cookbooks** if you want to go deeper technically (for
  example, orchestrating agents).

Find me or Neil (also here) and tell us what you are building and how we can help.
Happy hacking, and happy Codex-ing.

---

## 4. Convex

How are you feeling? For those who do not know, **Convex** is a database platform,
and a really good one: solid backend building blocks for your agent. It works
smoothly with Codex and Cursor. You can just tell your agent / harness to "use
Convex," describe the idea, and it will build it. Go for a walk, come back, and it
is up and running, safe, secure, and fast.

We have **components**, and you can fully self-host your app on Convex (a
`convex.site` URL), or use our prebuilt components. Most importantly for a
hackathon: it is **free to build**. Build 5 or 10 apps this weekend, it does not
matter, you will not go over usage.

For prizes, the team that builds the best Convex app aligned with the theme gets a
**$1,000 gift card** (split across the team), and 2nd place gets **$500 cash**.
There is a template you can fork (built with Cursor + Convex + Orange Slice) via
the QR code, so you can see how it works and use it as a starting point. We are
also hiring, so check out our site. Good luck.

> Note: several component and product names in this section were unclear in the
> recording and were left out rather than guessed.

---

## 5. Cursor — Vincent

Sorry for the technical difficulties; hopefully the demo gods are with you. My
name is **Vincent**, I was part of the founding growth team at **Cursor**, and I
am genuinely excited this hackathon is dedicated to growth.

A quick overview of what we have been shipping:
- **Cursor 3** (upper-left in the product): our new interface, and what we believe
  is the best way to build ambitious software with agents. Cursor has changed
  meaningfully since the 2023 version most people first knew; we are now focused on
  the future of autonomous development, where coding looks more like working with
  agents the way you would with colleagues: agents managing agents, many parallel
  work streams, all with the context you would need.
- **Agent window** (in Cursor 3): a very easy way to use agents.
- **Automations:** a fun way to run repeatable tasks in the cloud. For example, we
  run a security-review bot: every time someone deploys code, an automation reads
  the change and checks whether it meets our bar to ship.
- **Cloud agents:** how people ship several things while they sleep. Give them a
  try.
- **Composer:** our own model, trained by Cursor. A great mix of fast, cheap, and
  intelligent.
- **Cursor CLI / SDK:** harness the power of Cursor programmatically.

There is a QR code for free credits. For inspiration, here is what we built
internally with our own SDK. For context, Cursor had about 15 account executives
at the end of 2025, and go-to-market is now close to 500 people, so a lot of new
faces. One internal problem was getting sellers context quickly, so we built a
product called **Chat GTM**, made intuitive even for people who never opened an
IDE before joining. It has many pre-selected actions and connects to Databricks
and Salesforce to read user and sales data.

A quick query: imagine you are a new AE assigned Delta Airlines and you want to
know everything about them. You can see the segment they are in, a one-liner of
context, their product footprint (we are a PLG company), and their org: who makes
decisions and who you should be reaching out to. It prioritizes the top context,
enriches the data, and surfaces signals for why to prioritize them. Excited to see
what you build.

---

## 6. Lopus — Dan Low (Danilo)

Hi everyone, my name is **Dan Low** and I am here with **Lopus**. Many of you have
not heard of us. We work with people in RevOps and growth, and with executives who
want to drive data-driven growth. Lopus is an **operational data platform** that
unifies your product, sales, and marketing data in one place, sitting on top of
your databases or data warehouses (like Databricks) to help you pull the right
data and drive growth.

I asked myself: if I were in this hackathon, what would I build, and what have I
seen work in the real world? Here are some core principles of a good growth /
go-to-market engineer:

- **It all comes down to working well with data.** Many of the best GTM engineers
  I have met were ex-data engineers or data scientists. But with coding agents,
  you no longer need that background to make the most of it.

A simple three-step way to get started:

1. **Start with the data.** Simple on the surface, but not easy. A friend told me:
   "the higher-leverage signals are custom, not bought." It is tempting to pay for
   a service that tells you where someone worked or whether they are in-market, but
   the real alpha is finding something niche yet highly applicable. Example: if you
   work at a coding company building a custom IDE, you want to find developers who
   are frustrated with traditional IDEs. You could use Orange Slice to find people
   having trouble with traditional IDEs, or people with a business use case but no
   technical background. This requires understanding the human persona and building
   it into the customer's data pipelines.
2. **Orchestration.** Once a signal fires, decide what to do: leave a comment on
   their post, send a DM, ping your AE to reach out, enrich their data to find a
   phone number, or even have an agent call them, all without you touching a button.
3. **Make it cool (and fast).** Projects here are judged partly on coolness, and
   cool usually means useful, nice to look at, and fast (nobody wants to wait).

A suggested stack:
- **dltHub** for data ingestion and integrations.
- **Postgres + DuckDB** as a read-only analytics database to read signals from.
- **trigger.dev** for orchestration.
- **Mastra** and the **AI SDK** for the agents.
- Interface: a **Slack app** (most GTM teams live in Slack), **email** (everyone
  checks it), or a **web app** (something custom and creative you can log into).

The core goal: pick a good, creative, unique signal, then detect it, enrich it,
score it, and have an agent act on it in a way that is useful for the company.
That is it. Hope that helps.

---

## 7. Fiber AI (introduced by the host; company not present)

Our next sponsor is **Fiber AI**. I do not work for them, and they are based in
New York and could not be here, so I wanted to give them a quick shoutout. They
set us up with free credits. Fiber is one of the sales-data providers we use
inside Orange Slice, and they provide AI sales agents.

You get **$500 in free credits** if you create an account with the same email you
signed up with. You integrate through their API and app docs. Fiber is used for
real-time scraping and AI agent search across more than 40 million companies and
850 million person profiles, so it is a great staple data provider. A lot of top
teams use them (including Cursor). They have a hackathon site (fiber.ai/hackathon)
where you can learn more, plus an open-source UI you can build on top of, which is
a great place to start an internal GTM tool. They also have a Slack to join, and
we will share the slides afterward. Big thanks to the Fiber team in New York.
There is no cash track from them, just the free credits.

---

## 8. Host / MC — Closing and next steps

A final thank you to the **Corgi Cafe**, who sponsored tomorrow's coffee. The
WhatsApp QR may not work anymore, but make sure you are in the group or you will
not be able to do the hackathon.

A couple of quick logistics before you go:
- **6:45 (it is 6:30 now):** teammate matching in the east room. If you need a
  teammate, or you have an idea and are looking for teammates, go there. If you
  show up without an idea, that is fine too; people with ideas will be looking.
- **7:30:** Vincent (Cursor) and Danilo (Lopus) have agreed to do a quick **Q&A**
  in the main room, at the same time as dinner. Grab some pizza and ask actual
  growth engineers what they would find useful, since that is part of the judging
  criteria and they will be judging you.
- There may be an **additional Q&A** with a growth engineer from the Corgi sales
  team tomorrow. Keep an eye on the WhatsApp for details.

That is all. Get hacking.
