# GTM Q&A with Vincent (Cursor) and Danylo (Lopus) — Transcript (organized)

> Source: Granola recording of the fireside Q&A held during dinner (Jun 27).
>
> **About this version.** The raw recording was very messy (noisy room, no speaker
> labels) and has been cleaned for readability and organized into turns. Wording is
> approximate, not verbatim; check the source file for exact phrasing. Badly
> garbled passages are marked `[unclear]`. Mis-transcribed names were corrected
> (Lopus, RevOps, ChatGTM, Databricks, Salesforce, Composer, Caseflood, etc.).
>
> **Speaker attribution.** The source had no speaker labels, so speakers were
> inferred from content. There are three recurring voices plus the audience:
> - **Moderator** — one of the event organizers (name unknown).
> - **Vincent** — founding growth team, Cursor.
> - **Danylo** — CEO and co-founder, Lopus.
> - **Audience** — open Q&A in the second half.
>
> Attributions I am less sure about are tagged **_(uncertain)_** with a short
> reason. The hardest cases are flagged in context. Nothing here assigns a speaker
> without at least some textual evidence.

---

## Part 1 — Moderated Q&A

### Opening: what got you into growth engineering?

**Moderator:** Thanks for agreeing to a short Q&A. I thought it would help participants to hear from some of the judges. What is growth engineering to you, and what should builders be thinking about when designing tools that people like you will actually use in your jobs? First, I'll ask each of you to tell us a bit about yourselves and what got you into growth engineering.

**Danylo (Lopus):** For us, this is a space we really landed on after we started working on our product about a year ago. We were working with many people in the RevOps space, which was the original area we saw quietly gaining traction at bigger companies. It was a new role that did not really exist more than five years ago: it consolidated older roles like sales ops, marketing ops, and finance ops into one function. It is still new enough that it is not very clear what the person does, and each company has its own definition, which we found fascinating. As that role emerged around signals and data, it ended up almost perfectly positioned: the RevOps person orchestrates the strategy and aligns everybody, and the GTM engineer is the one who actually builds and owns all those systems and workflows. So we saw more companies start to hire GTM engineers, and we leaned into it as a new thing, driven by the rise of coding agents like Cursor, where more people can write code and apply engineering to non-technical, business work.

> _Boundary note: the handoff from Danylo to Vincent is buried in the raw audio with no break. The split below is my best read of where Vincent's personal story begins._

**Vincent (Cursor):** For myself, the more tedious part of my job was outbound [at a fund, `[unclear]`], so I tried to figure out how to automate it. When Cursor first came out, I started hacking around on different ways to improve my own workflow, then quickly began building those tools for my counterparts too. That led to the opportunity to join Cursor and help build out that entire motion. The way I think about it is that everyone's go-to-market motion is different depending on the company, the product, and who you are trying to reach. I think of it like a shape that has been cut out, squiggly, circular, square. Good growth engineering is not just the water you pour into it; it has to fit the mold and become part of how you work. So to me, growth engineering at Cursor really means: how do you build a real, sustainable motion from first principles for the specific company? A lot of companies have been operating in this in-between, trying to bridge that gap, and even the ones that did pretty well have not fully figured it out. That is what makes the problem so interesting.

### Bridging the gap: signals and "strategic chips"

**Moderator:** From first principles, what do you think the solution is? In your experience, what has worked for bridging that gap?

**Vincent (Cursor):** What is fun in go-to-market engineering is when you have some strategic chips to play with. A lot of good growth engineering comes down to signals. A signal is just a fancier way of saying: what information do I have to my advantage? Information asymmetry, what do I know about my audience that most people do not? That is what you are solving for: can you surface something important and hard to access that is useful when you talk to a customer? A tangible example, pre-Clay: people used to manually notice "this person used to work at a customer of mine, and they just moved to a prospect company; I should reach out, because they probably used my tool at their old job and should use it at the new one." Very easy sell, but you could only map that out through clunky tooling. Now you can automatically generate a subject line congratulating someone on the move from their previous company to their current one, and run that across 20,000, 30,000, 40,000 people. So you are really just trying to find information.

**Moderator:** One of the questions I had prepared was about the balance for Cursor between PLG and the more GTM-engineering-driven demand outside of natural product growth. But it sounds like your answer indicates PLG provides the strategic chips, and then as a growth engineer you play those chips to your advantage.

**Vincent (Cursor):** Yes. You have the information; you can tell who really loves Cursor, and then ask: what is their day job? Maybe they are the CTO of a really lucrative company. That is some of the advantage you get.

### Selling into GTM teams, and consolidation

**Moderator:** Are you also seeing this with your clients? What has your experience been selling into GTM teams?

**Danylo (Lopus):** It is funny, there has been an explosion of GTM tools, everyone building one, especially outbound tools. A lot of the GTM folks I have chatted with are getting buried under all of it and are looking for more consolidation. The real job, as Vincent said, is signals and data: you work from an external source toward figuring out which signals indicate someone is willing to buy. Then you ask what data you have private or privileged access to, which sources and tools to use, and which signals are the best to act on. I will second that consolidation is where GTM tools are going. There are a lot of tools that do one specific thing in a traditional SaaS way, but realistically the market will move away from that toward one big player that does a bunch of these things decently well enough, because there is not much benefit to buying many point solutions that are each a bit more expensive. Think one platform, a Salesforce-equivalent for go-to-market.

**Vincent (Cursor)** _(uncertain — the ChatGTM reference points to Cursor, but the handoff is garbled):_ With ChatGTM, for instance, after we built it and shared it with the sales org, it turned out the [internal audience] is also pretty small. Most salespeople ask how they could build something like it in their own company. So there is a build-vs-buy question: do you buy the interface that the rest of your apps plug into, or do you buy the data sources and tools that empower a GTM apps team internally to spin up the various tools they need?

**Danylo (Lopus)** _(uncertain — reads as one panelist asking the other; the Databricks/Snowflake knowledge fits Danylo):_ Can I actually ask you a question? You mentioned build vs. buy. Was that a process you went through, and how did you decide to build something like this in house instead of buying? I am sure Databricks has something like Genie, one of their internal solutions they push a lot, and Snowflake has Cortex. Did you evaluate those before deciding?

**Vincent (Cursor):** Honestly, no. That is partly culture: Cursor's culture is very "can we build this ourselves, and if so, how quickly, without any barriers?" So it is about building a tool that fits the exact shape of our needs.

### Data messiness and context engineering

**Moderator:** Interesting conversation. Before I turn it over to the audience: a question for both of you on the AI engineering side. How do you tamp down the problems introduced by data messiness and context management when you were building ChatGTM? Were you compelled by any of the current context-engineering or agent solutions on the market? Danylo, the same question for you with what you are building at Lopus.

**Vincent (Cursor):** It actually started with one of our research engineers (name `[unclear]`, "Wilson"/"Gilson") who built a long-running agent that coded a browser end to end in a weekend. When that worked, we thought: that technology is really cool, how do we use it for other parts of the business? He started spinning up little zero-to-one experiments, like building and selling micro-SaaS. Then the rest of the team realized it would be really useful for account research. Most of a Cursor seller's workflow is pulling a lot of content from LinkedIn and company blog posts and synthesizing it into something useful. Earlier that did not quite work because the tech was not good enough yet. So we kind of stumbled into it as we found opportunities, rather than following a methodical plan, and I think that is a great way to build something internal.

**Moderator:** Danylo, at Lopus you connect into your clients' KPIs and go straight into their database to extract the most critical elements. How do you think about what those are, and the context engineering that goes into it?

**Danylo (Lopus):** This is one of the core challenges we are solving at Lopus. The core insight: every AI tool out there is some combination of "I need some data from the company (Salesforce, Clay, etc.), I do some action on it, and I produce some output (update Salesforce, send a Gmail)." To a large extent, data consolidation is already solved by the data warehouses, a company already has all its data in one place. So why doesn't every agent just plug into that? The reason these agent companies still need a forward-deployed engineer is the missing context: sure, the data is there, but which data is relevant, and how do you work with it to drive value? We expect roughly as much time will be spent mapping out the data you have as was previously spent building the data pipelines to get it into a lake house or warehouse. Databricks spread the idea of "just get all your data in one place, figure out what to do with it later." Now we have it, and we want AI agents to use it, so you have to explain to them how the company works and how to pull the data. People are starting to do this by building skills using files, and I think the future looks a lot more like an Obsidian-style nested file system, because agents are very good at navigating file systems, with metrics linked to each other. It is almost the "company brain" idea everyone keeps talking about. For the data team, this means moving away from answering ad hoc requests toward maintaining a system that does the work. That is the space I see really opening up.

---

## Part 2 — Audience Q&A

**Moderator:** Thanks so much. Now I'll turn it over to the audience, who has questions? This is a catch box, it is a microphone, I am going to throw it to someone with their hand up, so try to catch it.

### Q1 — First GTM strategy to test in 30 days

**Audience:** If you were building a B2B AI tool today, what is one GTM strategy you would want to test in the first 30 days?

**Vincent (Cursor):** I would bring it down a level and ask what you are trying to solve, because that is broad. Roughly, you are doing one of four things: discovering your customer's needs, acquiring your customer, doing deep research on your customer, or enabling your customer. Pick one and go for it. ChatGTM, for example, was first a tool for SDRs. We did not really care about account executives, because AEs want higher-level, top-down alignment strategies, whereas SDRs are machines trying to do a lot of outbound and need a lot of context. So we built a tool for that, and then iterated on feedback from customers. So I would break it down.

### Q2 — The fuzziness of "go to market"

**Moderator:** Who else has a question? Toss it over.

**Audience:** A fairly abstract question about the fuzziness of the term "go to market." It seems inflated or conflated with sales, marketing, now engineering. And it seems like a "pull" model, you are trying to send something out and pull something in, rather than pushing the company out to the market. It feels like it went from internal-out-to-external to external-into-internal, if that makes sense. Like the order of operations flipped.

**Danylo (Lopus):** I have a lot of thoughts on this. First, "go to market" is interesting because it is largely salespeople inventing new terms so they do not have to introduce themselves as salespeople. Back in the day there were no BDRs or SDRs; if you said "I'm a salesperson," people recoiled, so it became "business development representative," then "SDR" _(Vincent: "for sure")_, then by the time that term was well known it became "I'm in go to market," and now we are all in "growth" too. That is the newest one. Second, what you said about sales is true: an SDR's job, the best description I have heard, is that you are a harvester. The engineering team builds the product, the marketing team builds brand awareness, and your job is to catch whoever is already interested or already has a relevant need. That is why people say "just do a lot of calls." If you have a terrible product it is very different, because the outside forces are much stronger than your individual go-to-market ability. So the job is to harvest whatever demand is already there and put yourself out there enough to capture as much of it as you physically can.

### Q3 — Your biggest day-to-day challenge

**Moderator:** Who else has a question? Over there, just toss it.

**Audience:** I have a slightly different perspective on the term. Traditionally the GTM team is marketing, sales, and customer success, but the new paradigm puts marketing, sales, and customer success together and calls that go to market, a more holistic way to think about winning new customers. But my question: you worked with RevOps, and you worked at one of the highest-growth companies. In your day-to-day job, what has been your biggest challenge, and what do you wish you could fix?

> _Both panelists answer. These two answers are the hardest in the whole session to
> attribute: the audio gives no labels and the content signals partly conflict. My
> best read is below, with reasons, but treat both as **uncertain**._

**Vincent (Cursor)** _(uncertain — assigned to Vincent because the IRL/in-person growth theme is his clear through-line later, e.g. the cursor cafe truck and Salesforce-Tower protest; a counter-signal is the "Databricks summit / my competitors" detail, which fits a data company better):_ If I had a magic wand? Make more money, that would be great. More concretely, our biggest real problem is that the death of cold outreach has left a void in how we reach customers. Many companies compensate by throwing more events, and that is why there is so much more community-building around startups, the IRL aspect, meeting customers in person or at meetups. Honestly, I went to a Databricks Summit recently and saw everyone I know, all the companies I love, and all my competitors. It was like Infinity War for my industry, and that kind of gathering happens maybe once a year. So much more would get done if these people were in the same room over and over. Bringing people together physically to build customer relationships or community in your industry is extremely valuable.

**Danylo (Lopus)** _(uncertain — assigned to Danylo because the "harness what people consume in their free time" idea is the same consumer-marketing-for-B2B thesis he states clearly later in Q5):_ For me, the main day-to-day problem is narrative fatigue. Everybody is saying the same thing, and you can only say the same thing so many ways before you lose people's attention. So what is always on my mind is how to harness what people like to consume in their free time and make it relevant to capturing their attention for work. Most people take a "severance" approach, what I do at work is separate from my personal life, which is why you see heavy investment in creative marketing. For example, a CFO brand might figure out that a CFO, the archetype being roughly middle-America, middle-aged, often white, who likes football, consumes information a certain way outside work, so they get an NFL spokesperson. That kind of go-to-market-as-marketing insight is interesting, and hard to drive. The question is how to help people consistently find that for their problems.

**Moderator (or panelist) _(uncertain)_:** Do you think cold outbound is dead?

**Danylo (Lopus)** _(uncertain — continues the channel/consumer theme above):_ Via email, it is hard; benchmarks where a 1% reply rate is considered good. But I get a ton of cold texts now, and even though it is annoying, I read them, so texting is a channel people have been able to exploit. It comes back to the same idea: how do I reach people where they spend their free time, because ad markets are so efficient now.

### Q4 — Retention

**Moderator:** Anybody else? I see a few hands.

**Audience:** So far we have talked about top of funnel, getting people in. How do you think about retention? My theory is part of it is product. But what do you and your teams actually do to deal with retention, to prevent churn, and where is the bottleneck?

**Vincent (Cursor):** For Cursor, the retention problem looks different depending on who you are talking to: retention for an end user is very different from retention for a large account. So segmentation is key, and then really figuring out why they churn. If it is because there is a better product elsewhere, that is a much bigger decision. But if it is something like a confusing credits panel, that is pretty easy to fix once you notice it (it can be hard to figure out why someone left). Customer success, in my mind, sits squarely within go-to-market. For us, we use a lot of lifecycle right now, which is something we only really started doubling down on a couple of months ago. Lifecycle is a key, under-discussed part of growth.

**Moderator** _(uncertain — short follow-up):_ What do you actually do with lifecycle, when you say lifecycle email?

**Vincent (Cursor):** Mostly making sure people remember certain features exist. Product velocity has gone up so fast that it is genuinely hard for users, especially ones not obsessed with the product, to keep up with what is new. So: newsletters, release notes, not yet very personalized, though I think you can get there.

**Danylo (Lopus):** We sell to more mature companies, so people do not usually churn spontaneously. The key to retention is feature discovery: showing people "these are features in my product, and here is how you'd use them in your current job." Think about how many of the features any tool shipped last month you actually remember, basically none. So much of customer success is just proper communication: first understand where the user is and what their biggest problems are, then point them to the features that solve those problems. There is so much more you can do in most apps now, and nobody really talks about it. When people say distribution is the new moat, I think it means the moat shifted away from "build a solution and people show up" toward "build the solution and communicate it to the right person." That is the key insight, especially when you are building a data solution: understand the intricacies of how the company and the role work, so it is a win for everyone. The second part is a hack: respond quickly, and I mean within two seconds. I hooked my Slack up to my agent (I call it Hermes), so any time I get a message in a customer channel it also pings me on Telegram and keeps pinging until I respond, so I never miss a customer message. There is so much value when someone who pays you just hears "yeah, I'm on it." Some friends just send a quick voice memo: "saw your message, here's what I'm thinking, working on it." That gives the customer peace of mind, shifts the next step back onto your side in their mind, and makes you look proactive, versus letting the message sit for a few minutes.

### Q5 — Consumer marketing for B2B

**Moderator:** In the interest of time, let's have just one of you respond to each from here. To repeat the question: can you use consumer marketing to break through for B2B sales?

**Danylo (Lopus):** I definitely think it is a bit untapped. A friend of mine started a company, Caseflood, working with law firms, qualifying candidates for them with a voice agent, and one of his best channels at the time was just going on Instagram, because lawyers use Instagram and scroll like the rest of us. There did not used to be many startup ads in Instagram reels; there are a lot more now, which I appreciate because they are more relevant to me. I think B2B will go this way, and it is genuinely untapped: most people are on social apps, and when they go home they watch clips of Breaking Bad, they do not care about [your product pitch]. So if you show them something more useful in that context, the audience appreciates it.

**Vincent (Cursor):** Think about our enterprise customers, 2500-plus employees. They have different concerns: which tool should I use, what is cheaper, what is the ROI, how do I justify this to my CFO, how do I actually use your product, how do I enable more of my team? They are usually trying to justify a real investment in a tool that costs a lot of money. So the challenge for you as a GTM person is figuring out what the actual thing is, the question behind the question, when they are troubleshooting or evaluating.

**Moderator (or audience)** _(uncertain — follow-up):_ Have you seen anything specifically around drift, alignment, or coordination?

**Vincent (Cursor)** _(uncertain — generic "our best customer success" reference):_ Some of it is just human. Some of our best customer success comes from people who keep asking the right questions. But sometimes there are political things going on inside the company that are out of their hands, which we hope to help change.

### Q6 — What did you do "out of the box"?

**Audience:** To position both of you as GTM engineers: what is something out of the box that you did in your job to hit the goal?

**Moderator:** And this will be the last question before we wrap up.

**Audience:** By out of the box I mean: GTM engineering is a new role, mostly around sales and outbound marketing. Is there something you did differently from the usual strategies? That is what I am trying to understand.

**Vincent (Cursor):** One thing: because GTM engineers are fairly technical, people focus too much on the engineering part. What it really comes down to in growth and GTM engineering is that you are still trying to win hearts and minds. You usually buy a product because it captured your attention; it is an art-and-heart thing. So, one time, we went to a prospective customer's office and set up a Cursor coffee truck on wheels, serving coffee to employees walking in, no strings attached, "Cursor coffee on us this morning." It really worked, and that customer ended up closing. A second example: there is call-recording software now, so you can build a database of why customers previously said no to you. Sometimes the reason was literally "I just need this product to do X; once it ships, call me back and I'll buy." So we drew on call transcripts to find reasons people did not buy in the last six months, figured out which of those reasons we had since solved, and surround-sounded those customers, outbound email plus bespoke creative, like LinkedIn paid ads targeting people at those companies with a specific message ("Cursor now has [the thing you wanted]"). Those are great ways to get attention, and it is fundamentally rooted in data, without the data you cannot really do it. This matters especially for a new company making something. Whether it is holding up a Cursor cafe, friends going to a prospect's office with donuts, or the mock protest we staged outside Salesforce Tower (which was really fun, it was about the dashboards `[unclear]`), there is so much value in doing these things in person. I push back on the idea that there is too much information on the internet and it is all out there, growing up online makes you think everything is online, but it is not. There is so much opportunity with people in real life: in person, people tell you things they would be ashamed to post or unwilling to say publicly. If you want to do some crazy growth stuff, in person is really where the growth happens.

### Closing — one piece of advice

**Moderator:** Amazing. One final question before we wrap up: what is one piece of advice for people building GTM growth tools at this hackathon?

**Vincent (Cursor):** Don't lose focus, keep the emotion in mind. Embody the person you are solving for and how you would capture their attention. If I am selling ice cream from a truck, the go-to-market is very different from Cursor's. Really think about what the problem is and how you acquire customers, it is different for each business. Start specific. It does not have to work for every company; solve it for specific customers.

**Danylo (Lopus):** Something we have been discussing: many people here want to do growth for a company or industry they are not familiar with, where they do not know how it markets or know anyone in it. The value of go-to-market engineers is that they have the technical skills; the real value comes from understanding the industry and how to apply those skills. So my main advice: I would give a lot of credit to anyone who can get hold of someone in any industry, say, whoever runs an ice cream truck tomorrow, and ask "how do you find customers? We can build a pipeline for you." Talking to someone and understanding how their business works, in person, gives you a far clearer perspective and lets you build something truly useful, instead of building to spec and guessing how the industry works.

**Moderator:** And if you do go do something crazy like that, be sure to record yourself doing it and include it in your hackathon submission. All right, Vincent, Danylo, thank you so much.
