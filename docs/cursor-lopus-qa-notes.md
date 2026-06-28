# GTM Q&A with Vincent (Cursor) and Danylo (Lopus) — Notes

> AI-generated (Granola) summary of the fireside Q&A held during dinner, with
> Vincent (founding growth team, Cursor) and Danylo (CEO/co-founder, Lopus),
> moderated by one of the event organizers. The full organized transcript is the
> primary record: see [cursor-lopus-qa-transcript.md](cursor-lopus-qa-transcript.md).

## What growth engineering actually is

- Emerged from RevOps consolidating sales ops, marketing ops, and finance ops into one GTM-focused role.
- The GTM engineer sits between RevOps strategy and technical execution: orchestrating systems and workflows.
- The rise of coding agents (Cursor, etc.) made engineering skills accessible to non-technical business roles.
- Core definition: building a sustainable GTM motion from first principles, shaped to each company's specific go-to-market.

## Signals, data, and the PLG advantage

- Growth engineering is fundamentally about information asymmetry: what do you know about your audience that others don't?
- PLG provides "strategic chips": product usage data reveals who loves the tool and what their role/company is.
- Classic signal example: a person moves from a current customer to a prospect company, triggering personalized outreach at scale (10k-40k touches).
- GTM tool consolidation is coming: the market is moving toward one platform that does many things "well enough" vs. buying point solutions.
- Build vs. buy: Cursor's culture defaults to building internally, fast, without barriers.

## Context engineering and the data mapping problem

- Every AI GTM tool is some combination of: data ingestion, action, and output (update CRM, send email, etc.).
- Data warehouses have largely solved data consolidation; the new challenge is explaining to agents which data matters and how the company works.
- Lopus approach: map data context the way data pipelines were once built, using nested file systems (Obsidian-style) that agents can navigate.
- The data team's role is shifting: from answering ad hoc requests to maintaining systems that do the work.
- "Company brain" concept: metrics linked to each other, agents understanding the underlying data structure.

## GTM tactics, retention, and advice for builders

- Cold outbound (email) is declining; the shift is toward IRL community, events, and in-person moments.
  - Cursor example: a coffee truck outside a prospect's office, no strings attached, closed the deal.
  - A mock protest outside Salesforce Tower targeting a competitor's customers.
- Narrative fatigue is a real challenge: the same messages repeated until attention is lost.
  - Counter: meet customers where they consume content in their personal time (e.g. the CFO demographic targeted via NFL sponsorship).
  - Consumer channels (Instagram, social) are underused for B2B, especially for SMB and legal/professional audiences.
- Retention levers:
  - Lifecycle email: remind users of new features mapped to their specific use case.
  - Feature discovery: proactively communicate what's new and how it applies to the customer's job.
  - Response speed: reply to customer messages within seconds; acknowledgment alone builds trust and shifts ownership back to the customer.
- Advice for hackathon builders:
  - Narrow the problem: pick one of four buckets (discover, acquire, research, enable) and go deep.
  - Embody the person you're solving for; GTM looks different for every business.
  - Talk to someone in an unfamiliar industry in person, understand how they find customers, then build for that.
  - Record yourself doing it and include it in the submission.
