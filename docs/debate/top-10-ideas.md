# Top 10 Hackathon Ideas (ranked by expected value)

> Output of the 6-persona team debate (see `team-debate-transcript.md`). Ranked by
> **EV = 0.70 x P(top-3) + 0.20 x P(Convex track) + 0.10 x genuine usefulness**. RocketRide excluded.
> Win condition: a working demo + 3-min video. Central frame the judges share: ONE custom, hard-to-buy
> signal wired DETECT -> ENRICH -> SCORE -> ACT, live on real data.

**TL;DR ranking**

| # | Idea | EV | top-3 | Convex | genuine-use | One-liner |
|---|---|---|---|---|---|---|
| 1 | **Protagonist** | 86.5 | 89 | 80 | 82 | Whoa, that's MY company - the judge types their own name and watches it light up. |
| 2 | **Corgi Radar** | 79.7 | 78 | 83 | 86 | A funding headline lands and a bound-policy outreach drafts itself in 10 seconds. |
| 3 | **Defector** | 76.5 | 76 | 81 | 74 | We see the moment a company rips out a competitor - the signal nobody can buy. |
| 4 | **Tripwire** | 74.1 | 70 | 85 | 86 | The judge fills out the form and gets resolved, re-verified, and scored before they finish reading the email. |
| 5 | **SignalRoom** | 73.5 | 68 | 91 | 80 | Three signals hit the same company in seconds and it rockets to the top with ONE action. |
| 6 | **Keeper** | 67.4 | 62 | 69 | 92 | Your #1 power user just changed jobs and got more budget - here's the warm re-intro, ready to send. |
| 7 | **Cut Line** | 67.5 | 63 | 70 | 84 | Point it at your three contradictory AI scores and it tells you who to work, who to drop, and when it can't say. |
| 8 | **DriftWatch** | 62.1 | 55 | 78 | 80 | Watch ChatGPT change its mind about you live, and stream the fix. |
| 9 | **Two-Face** | 56.6 | 54 | 52 | 78 | Old ICP vs auto-rewritten ICP, scoring the same leads live, every score clickable to the exact quote. |
| 10 | **Fanatic** | 51.2 | 42 | 70 | 88 | One engine: a real-world event fires, the right enthusiast surfaces, timely outreach drafts itself. |

---

## #1. Protagonist
*Whoa, that's MY company - the judge types their own name and watches it light up.*

An open Chat-GTM that, when a judge types their own company, returns the account brief Vincent demoed (segment, one-liner, PLG/product footprint, org chart of decision-makers, why-now) AND stacks 3+ custom high-lift signals nobody sells, then drafts the exact next action and posts it to Slack. Abstention is built in: it refuses to score when joins are weak. It is Vincent's internal tool, made open, deeper on signal stacking, pointed straight at the judge.

- **Signal:** STACKED custom signals on the typed account: adjacent-AI-tool adoption (+46%), headcount-up-20%+ (+38%), recent software purchase (+38%), VP/champion hire (+28%). 3+ stacked = the 2.4x story and the strongest technical-depth narrative in the room.
- **DETECT:** Scrape GitHub deps/changelogs/job posts/news/funding for the typed company to fire 3-4 stacked signals live; pre-cache the three judge companies (Cursor, Lopus, Orange Slice) so the happy path never stalls.
- **ENRICH:** Fiber multiSourceSearch + profileLiveEnrich build the org chart from product users up to economic buyer in 2-4s, visible on screen.
- **SCORE:** OpenAI structured-output rubric returns fit + intent + urgency WITH per-signal reasons and ABSTAINS (loudly) when a join can't be verified. Pair every refusal with a strong positive in the same demo so abstention reads as rigor.
- **ACT:** Drafts the account-specific outreach and posts the next action to Slack for one-click approve.
- **Stack:** Convex (reactive board + Agent + Workpool fan-out + Persistent Text Streaming for the live-filling brief) as the realtime spine; Fiber AI for ENRICH; OpenAI structured outputs for SCORE; optional Cursor SDK subagents per signal-detector as an on-brand flex for Vincent.
- **Convex angle:** Load-bearing and the coolness engine: org chart + signal cards stream into a reactive board in real time (Streaming + Agent + Workpool). The live coverage meter and streaming brief ARE the wow and exactly what wins the $1k track. Fork the SignalBoard template.
- **Demo plan:** Hand Vincent the keyboard. He types 'Cursor.' In under 30s the org chart of Cursor's buying committee draws itself, three stacked signals light up with reasons, one account abstains to prove honesty, and a drafted next-step posts to Slack. Pre-cached responses for the three judge companies; wifi/rate-limit fallbacks.
- **Target judges:** All three at once: Vincent (his exact Chat-GTM demo, org chart, two live sources), Dan (full loop + abstention), Vihaar (stacked custom signals, close-to-ACT, who-you-say-it-to).
- **21h scope:** Build the reactive streaming brief + 3 cached judge companies first (that alone wins). Add live scraping for one detector, then org-chart depth, then abstention pairing. Cut multiplayer, voice, extra detectors if time runs short.
- **Risks:** Scope (org chart + stacking + streaming UI in 21h) and 'same idea different label' vs Vincent's demo. Mitigate: cache 2-3 judge companies, keep org-chart depth shallow (user -> manager -> VP -> buyer), make the signal-stacking the visibly hard live part.
- **Why it wins:** It maximizes the dominant 0.70 term: highest P(top-3) because it lands all three judges simultaneously, leads with rubric-#1 usefulness, makes complexity legible via the live fan-out, and deploys the single highest-EV demo trick in the brief - make the judge the protagonist on their own data.
- **EV:** weighted **86.5** (top-3 89 / Convex 80 / genuine-use 82)

## #2. Corgi Radar
*A funding headline lands and a bound-policy outreach drafts itself in 10 seconds.*

The exact tool a sponsor (Corgi) is hiring a Founding Growth Engineer to build: a funding event becomes a fresh-cash startup with brand-new D&O/cyber/EPLI exposure, auto-enriched, scored for fit and urgency, and turned into a personalized outbound email plus an instant-quote link written straight into HubSpot. Demoed on real rounds from this week with recognizable hits.

- **Signal:** A startup just announced a funding round (+25% funding-event lift) that maps 1:1 to a new insurance buyer: new entity, new exposure, fresh cash, a board that now demands D&O. Corgi's own application even asks 'amount raised and date raised.'
- **DETECT:** Poll funding announcements via Orange Slice predictLeads.companyFinancingEvents + web.search into a reactive Convex radar; pre-pull a handful of real recent rounds so the live board has guaranteed hits.
- **ENRICH:** Fiber companyLiveEnrich + peopleSearch for founder/CFO + reverseEmailLookup; infer stage, headcount, vertical, and whether they likely already carry coverage.
- **SCORE:** OpenAI structured-output fit + urgency with reasons; ABSTAINS when it can't confirm they're uninsured/in-ICP ('already insured, skipping') to prove it's not a spray machine.
- **ACT:** Draft a hyper-personalized email referencing the round + a one-click instant-quote link; write the contact + deal into HubSpot via Orange Slice integrations, on screen.
- **Stack:** Orange Slice package (predictLeads financing + web.search + ai.generateObject + integrations.hubspot/gmail) as the spine; Fiber for the people/contact enrich Orange Slice restricts; Convex for the realtime radar + scheduled poll + Workpool fan-out; OpenAI structured outputs for the explainable score.
- **Convex angle:** Load-bearing: Convex is the realtime radar every new round streams onto live (reactive query = the wow), plus the scheduled poll and the Workpool that fans out enrichment. Qualifies for the $1k track without a second backend.
- **Demo plan:** Cold open: a real funding headline from THIS WEEK lands on the live board; in under 10s a drafted Corgi outbound + quote link materializes and posts into a HubSpot record on screen; then one round ABSTAINS. The sponsor's growth lead watches their own Monday job done live.
- **Target judges:** Vihaar (event-to-pipeline, close the loop, tie to a number), Dan (Corgi is a Lopus customer; abstention double-scores), and the sponsor-adoption lens generally.
- **21h scope:** Pre-pull 5-8 real rounds and pre-warm enrich; build the radar board + draft + HubSpot write first; add live polling and abstention last. Single-vertical scope keeps it finishable.
- **Risks:** Funding-feed freshness/coverage on rate limits; funding lift is only +25% and the signal is buyable, so it's one judge's narrow use case more than the whole room. Mitigate: pre-cache real recent rounds, never fake a company, lean on the HubSpot write-back and abstention as the substance.
- **Why it wins:** Highest 'I'd run this Monday' fit in the field and the cleanest sponsor-protagonist effect with zero toy-data smell. Strong on all three EV terms, capped just under Protagonist only because it lands one judge's use case rather than all three.
- **EV:** weighted **79.7** (top-3 78 / Convex 83 / genuine-use 86)

## #3. Defector
*We see the moment a company rips out a competitor - the signal nobody can buy.*

A live radar for the highest-respect open B2B signal: a company's own engineers publicly removing a competitor. Watch public GitHub for dependency removals, migration PRs, and 'goodbye [tool]' commits/issues, resolve repo -> company -> real human, score win-back fit with reasons (abstain when the link is weak), and draft dev-to-dev outreach quoting the exact removed line.

- **Signal:** Public GitHub stack REMOVAL: a dependency deleted from package.json/requirements/go.mod, a PR titled 'migrate off X', or an issue 'switching from X to Y'. Hard-to-buy, high-lift (+38% displacement), fully public - no PII scrape, no OAuth.
- **DETECT:** GitHub Search API + code-search for competitor package removals and migration PRs/issues across a pre-curated competitor watchlist (curated to repos that DO resolve to companies).
- **ENRICH:** Fiber multiSourceSearch resolves repo -> org -> company and reverseEmailLookup resolves the committer's public commit email -> real person/title.
- **SCORE:** OpenAI structured outputs rate win-back fit with reasons; ABSTAINS aggressively when the repo is a personal fork/toy or the company can't be resolved (non-negotiable, or the board fills with junk).
- **ACT:** Draft and, on one-click approve, send a dev-to-dev email/Slack quoting the exact removed line.
- **Stack:** Convex (reactive signal board + cron poller + Workpool enrichment fan-out + Persistent Text Streaming for the live draft) + GitHub REST/Search API + Fiber AI + OpenAI structured outputs + Agentmail/Slack for ACT. Fork SignalBoard.
- **Convex angle:** Load-bearing: cron polls GitHub, Workpool fans out enrichment, reactive queries recompute scores, the board updates live the instant a defection lands. That reactivity is the demo wow and the track entry.
- **Demo plan:** Pre-seed the watchlist with a competitor of Lopus/Cursor/a known YC co. On stage a real recent public PR removing that dependency appears live, gets a person + reason in ~3s, and a quoting draft streams out. The judge recognizes the company as protagonist. Cache the demo path.
- **Target judges:** Dan (custom signal requiring real detection + abstention is catnip), Vihaar (hard-to-buy custom signal, four-fingered-VP energy, close to ACT), Vincent (dev-tools GTM, two live sources).
- **21h scope:** Pre-capture 2-3 real removal events for company-resolving repos. Build resolve + score + streaming draft on the cached events first; add live GitHub polling as the visible 'hard part' with a cached fallback.
- **Risks:** Entity-resolution noise: a removed dependency often resolves to a personal repo, which reads as a broken demo and Dan will smell faked diffs. Mitigate: pre-curate the watchlist to company-resolving repos, cache the happy path, abstain loudly on noise.
- **Why it wins:** The single most impressive hard-to-buy signal on the table, earning instant respect on rubric-#2 technical complexity, with zero PII/OAuth landmines. If the live diff lands it can leapfrog into the top 3 of the room; the only thing capping it is detection risk.
- **EV:** weighted **76.5** (top-3 76 / Convex 81 / genuine-use 74)

## #4. Tripwire
*The judge fills out the form and gets resolved, re-verified, and scored before they finish reading the email.*

The SCORE+ACT glue everyone skips, built around the part competitors skip: the instant a real inbound event lands (form-fill, waitlist, Stripe signup, sales@ email), reverse-resolve the person, RE-VERIFY them live at the moment of action, score ICP fit with reasons + abstention, and route only the hot ones to a human with a drafted first touch.

- **Signal:** A first-party inbound touch (not bought intent). The custom move is real-time RE-VERIFICATION at moment-of-action: is this person still at this company, is the title current, is the email valid, RIGHT NOW - attacking the documented 6-week-stale-data-at-the-last-mile failure.
- **DETECT:** Convex HTTP action ingests the inbound event (webhook from form/Stripe/Agentmail) into a reactive table the instant it fires.
- **ENRICH:** Fiber reverseEmailLookup -> full person + company + PLG/firmographic context, re-verified live via profileLiveEnrich in 2-4s.
- **SCORE:** OpenAI structured-output ICP-fit score WITH reasons that ABSTAINS on ambiguous/personal-email leads instead of guessing.
- **ACT:** Hot -> route to a human with a drafted first-touch in their voice; cold -> nurture; abstain -> flagged for review. Persistent Text Streaming writes the reply live.
- **Stack:** Convex (HTTP ingest + reactive triage board + Workpool + AutoSend + Persistent Text Streaming) + Fiber AI (reverseEmailLookup + profileLiveEnrich, the 'nobody else has this' move) + OpenAI structured outputs + Agentmail for ACT.
- **Convex angle:** Load-bearing and the natural shape: HTTP actions are the ingest, reactive queries are the live triage inbox, Workpool runs enrichment, the board re-sorts the instant a hot lead lands. SignalBoard home turf; the webhook-to-board latency is the most bulletproof realtime proof in the deck.
- **Demo plan:** A judge fills out the demo form (or paste a real inbound email); within ~4s the person is fully resolved, scored with a reason, re-verified as current, and a drafted reply streams. The judge is the protagonist and watches stale-data-at-the-last-mile get solved live. A second window (the AE) gets the routed hot lead instantly.
- **Target judges:** Vincent (internal tool a growth team runs Monday, two sources), Dan (re-verification + abstention), Vihaar (inbound where reply rates still live, close to ACT).
- **21h scope:** Difficulty 2, the highest-floor finishable idea: HTTP ingest + reverse-email + reactive board ships in the first third. Spend remaining time making re-verification visibly the hero and adding the Workpool burst.
- **Risks:** Me-too proximity to Default/Warmly/RB2B. Dies if it leads with 'inbound routing' - the hero MUST be live re-verification + abstention. Lowest technical depth, so add Workpool burst (multiple inbounds) and make the SCORE rubric the visible substance.
- **Why it wins:** The lowest-risk-to-FINISH idea in the portfolio (overscoping is the #1 killer), the most undeniable on-camera realtime moment, and a genuinely kept tool. The de-risked high-floor pick if a bigger swing runs out of time.
- **EV:** weighted **74.1** (top-3 70 / Convex 85 / genuine-use 86)

## #5. SignalRoom
*Three signals hit the same company in seconds and it rockets to the top with ONE action.*

The consolidated signal war room (SignalFloor + Triage merged into their strongest finishable form): custom signals stream onto a reactive board, an in-Convex Agent enriches/scores/STACKS them per account (3+ stacked = the real heat), it proposes exactly ONE next action per account, and durable memory means it never re-surfaces a dead lead. The SCORE+ACT glue the brief names as white space, built as a tool you live in.

- **Signal:** Signal STACKING itself is the custom signal: an account showing 3+ independent triggers (adjacent-AI-tool adoption +46% + headcount-up + recent software purchase) ranked far above any single signal - the 2.4x stacking story and the strongest technical-depth narrative.
- **DETECT:** Convex cron + HTTP actions pull 2-3 live sources (Fiber tracker rules + an Exa/web signal + a product/usage or CRM feed) into a reactive table; keep one source mockable for the happy path.
- **ENRICH:** Workpool fans out parallel, rate-limited Fiber calls (reverseEmailLookup, profileLiveEnrich) to waterfall-resolve each to a company/contact.
- **SCORE:** Convex Agent runs a weighted stacking model with transparent per-signal reasons and vector search over past won/lost accounts; ABSTAINS when only weak signals are present.
- **ACT:** One proposed next action per account; Persistent Text Streaming writes the email live; AutoSend/Slack fires on one-click approve; logged so it never reappears.
- **Stack:** Convex (reactive board + Agent + Workpool + Persistent Text Streaming + AutoSend + cron + HTTP actions + durable 'already actioned' memory) + Fiber + Exa/Orange Slice + OpenAI structured outputs. The canonical 'one of the more complex uses of Convex' story.
- **Convex angle:** Maximally load-bearing and the strongest pure Convex-track entry: 5+ components used meaningfully, reactive queries recompute the ranked board the instant any signal arrives, Workpool absorbs a burst, durable state is the memory that makes it a kept inbox. Strip multiplayer (the SignalFloor failure mode) and keep the streaming board.
- **Demo plan:** Two windows. Paste 5 companies; a burst of signals floods the board; Workpool processes them in parallel as scores tick up live in BOTH windows; three signals fire on one recognizable company and it rockets to the top with 'STACKED: 3 signals, here's the one action'; one card's email streams itself; cut to the Convex dashboard showing rows mutating live.
- **Target judges:** Convex track first (Reactive Ray's 90-93), Vihaar (stacking depth, SCORE+ACT glue, close to ACT), Dan (abstention + reasons).
- **21h scope:** Build reactive board + Agent + streaming first (alone wins the track), add Workpool burst and durable memory as upgrades, hardcode a 5-company happy path with cached enrichment fallbacks. Explicitly cut multiplayer.
- **Risks:** Closest to a known category (Unify/Default/the SignalBoard template) = 'same idea different label.' Stacking + durable memory + abstention must visibly differentiate. Three live sources is real scope. Mitigate: hardcode the happy path, keep one source mockable, lead with the stacking moment.
- **Why it wins:** The single best $1k Convex-track expression (maxes every component meaningfully) that also hits the main rubric, so the 20% and 70% terms point the same way. The reference architecture from the winning playbook made concrete on the highest-lift signal.
- **EV:** weighted **73.5** (top-3 68 / Convex 91 / genuine-use 80)

## #6. Keeper
*Your #1 power user just changed jobs and got more budget - here's the warm re-intro, ready to send.*

Your warmest pipeline is your old champions who just changed jobs: someone who already loved your product now has new budget at a new company. Keeper watches your CRM contacts, catches the move within days, enriches the new company, scores the re-engagement, and drafts the 'congrats on the new role, want to bring us with you?' note for one-click send. It runs forever on a list you already own.

- **Signal:** A past champion / closed-won contact / power user changes jobs (Fiber job.changed webhook + the 52 tracker rules over your existing CRM list) - a relationship signal with genuine lift (114% higher close rate) that you cannot buy as a generic intent feed. Stack a second signal (new co. just bought adjacent AI) so it isn't a one-trick webhook.
- **DETECT:** Poll/subscribe Fiber tracker rules over imported CRM contacts for job.changed; pre-stage a seeded real move for the demo since live webhook timing is unpredictable in a 3-min video.
- **ENRICH:** Fiber profileLiveEnrich + multiSourceSearch resolve new company, title, size, existing-account overlap.
- **SCORE:** OpenAI structured outputs rate warm-intro strength (prior usage x seniority x new-company fit) with reasons; ABSTAIN if it can't confirm identity (non-negotiable on common names).
- **ACT:** Draft a personal re-engagement email referencing the actual prior relationship, queued in a Convex approval inbox for one-click send.
- **Stack:** Fiber AI (job.changed webhook + 52 tracker rules + profileLiveEnrich) for DETECT/ENRICH; Convex (realtime approval inbox + durable contact state + cron poll + persisted 'already reached' memory) as system of record; OpenAI structured outputs for SCORE; AutoSend/Gmail for ACT.
- **Convex angle:** Load-bearing as durable memory: Convex stores every contact, every detected change, who you already reached (never double-touch), and the reactive approval inbox updates live as new changes fire. The afterlife literally lives in Convex.
- **Demo plan:** Import the judge's own (or a real recognizable) past-customer contact list; a job-change card pops into the live inbox: 'Sarah moved from Acme to Globex, your #1 power user, new company is 3x bigger, draft ready.' Charlie approves one send live. Old-way (you'd never have known) vs new-way (warm pipe in 4s).
- **Target judges:** Vincent (two sources: CRM + people, internal tool run Monday), Vihaar (closed-loop to ACT, who-you-say-it-to), Dan (abstention).
- **21h scope:** Difficulty 3 but mostly Fiber + a Convex inbox; finishable. Build the approval inbox + durable memory + one seeded job-change first; add the second stacked signal and live polling if time allows.
- **Risks:** Job-change is a weak raw PURCHASE predictor (+modest lift) and technically the lightest, so it reads thin to complexity-weighting judges; the win is the RELATIONSHIP framing. Mitigate: sell warm-intro value not 'they'll buy,' stack a second signal, pre-stage the webhook.
- **Why it wins:** The single most KEPT tool in the field (highest 10% term): runs on data you already own, needs zero new pipeline, closes the loop to an approved human action, and compounds with memory every week. The clearest ROI story and near-zero spam optics.
- **EV:** weighted **67.4** (top-3 62 / Convex 69 / genuine-use 92)

## #7. Cut Line
*Point it at your three contradictory AI scores and it tells you who to work, who to drop, and when it can't say.*

Don't replace anyone's scoring - referee it. Point Cut Line at your existing conflicting AI scores and it tells you, with reasons, which accounts are genuinely worth a rep's time, which to nurture, and which to DROP - and it abstains when the data can't support a call. The 'stop wasting reps on Fortune 500 logos that never convert' tool, adoptable with zero migration.

- **Signal:** Disagreement + staleness across existing signal/score sources: when marketing, sales, and usage signals conflict or the underlying data is decayed, that conflict IS the custom signal to detect and resolve. The only abstention idea that isn't just-another-scorer.
- **DETECT:** Ingest multiple existing scores/signals per account and flag conflict + data-age in a reactive Convex store.
- **ENRICH:** Re-verify the load-bearing facts live (Fiber) so scoring runs on fresh data, not 14-month-stale records.
- **SCORE:** OpenAI structured-output reconciliation rubric outputs one tier + a confidence band + an explicit ABSTAIN flag with full lineage to the source rows.
- **ACT:** Route A-tier to the rep with a drafted opener, push C/D to nurture, suppress F, and write the verdict + reasons back to CRM.
- **Stack:** Convex (conflict store + reactive reconciliation functions) + Fiber (real-time re-verification) + OpenAI structured outputs (reconciliation + abstention + lineage) + Slack/CRM write for ACT.
- **Convex angle:** Load-bearing: reconciliation runs as Convex functions and the unified verdict updates reactively as fresh data lands; realtime re-ranking is the wow. Lighter than SignalRoom but a clean track entry.
- **Demo plan:** Show the same account scored 'hot / medium / at-risk' by three tools; Cut Line resolves it live to one tier WITH the reasoning and the re-verified fact that broke the tie. On a second account it abstains: 'data is 14 months stale, re-verify before acting.' Use a judge's company with seeded realistic conflicting signals.
- **Target judges:** Dan (abstention-first, lineage, the 'most dangerous tool always answers' line performed live), Vihaar (trust + prioritization, tie to a number), the operator-adoption lens.
- **21h scope:** Difficulty 3, smaller honest scope than a full scorer. Build the reconciliation function + lineage UI on two seeded accounts first; add live re-verification as the depth.
- **Risks:** Abstract without a recognizable account; conflict-as-signal is a stretch Dan may probe; lower coolness/cold-open punch. Mitigate: use a judge's company with seeded conflicts so the resolution is visceral, pair the abstain with a strong positive.
- **Why it wins:** The rare idea that's MORE useful than flashy and the most differentiated abstention play (referee, don't replace = no migration friction). Pure Dan Low bullseye with real operator ROI and a low-friction adoption path.
- **EV:** weighted **67.5** (top-3 63 / Convex 70 / genuine-use 84)

## #8. DriftWatch
*Watch ChatGPT change its mind about you live, and stream the fix.*

A live AEO monitor: track in realtime what ChatGPT and other LLMs say about you vs competitors, detect drift the instant it happens, and stream the corrective action. A continuously-running durable monitor whose cron + reactivity + streaming ARE the product - the best durable-execution story in the deck and squarely on the 2026 trend list.

- **Signal:** LLM answer drift: a measurable change in how models describe your product/category over time (a new competitor mention appears, a feature claim goes stale, sentiment shifts). Custom, novel, genuinely hard to buy.
- **DETECT:** Convex cron periodically queries multiple models/prompts and diffs answers against the last snapshot stored in a reactive table; pre-stage a before/after snapshot so drift is guaranteed to show on camera.
- **ENRICH:** Workpool pulls supporting sources (Exa) to explain WHY the answer changed.
- **SCORE:** Convex Agent classifies drift severity + impact with reasons; ABSTAINS when it's noise, not real drift.
- **ACT:** Persistent Text Streaming drafts the fix (content/PR/docs update); AutoSend/Slack alerts the marketer - the visible ACT that keeps it from being a dashboard.
- **Stack:** Convex (cron + reactive tables + Agent + Workpool + Persistent Text Streaming + AutoSend) + Exa for source-of-truth + OpenAI/multi-model querying for the answers being monitored.
- **Convex angle:** Load-bearing via durable/scheduled execution + reactivity: the product IS a continuously running cron pipeline whose results stream live to a reactive dashboard. The Agent does drift classification inside Convex; streaming animates the fix. The best hard-to-fake technical-complexity signal of the bunch.
- **Demo plan:** On camera, trigger a monitor run; the dashboard shows an answer changing vs last snapshot; a red 'DRIFT DETECTED' row appears live; the corrective draft streams in; a second window (the marketer) updates simultaneously. Cut to the Convex dashboard showing cron-written snapshot rows.
- **Target judges:** Vihaar (novel custom signal, close to ACT, tie to a number), Convex track (durable-cron home turf), OpenAI-adjacent relevance.
- **21h scope:** Difficulty 3: build the cron + snapshot diff + reactive dashboard first; pre-stage the before/after; add the streamed fix + alert as the ACT. Finishable.
- **Risks:** Drift happens slowly, so 'live' is simulated via re-run on demand (be honest about the trigger). Risks reading as a dashboard with weak ACT. Mitigate: make the streamed corrective draft + one-click Slack/PR the visible ACT; pre-stage a before/after so drift shows on camera.
- **Why it wins:** Best durable-execution Convex story (cron doing real continuous work is hard to fake), rides the freshly-felt 2026 AEO pain, and is genuinely keepable as a weekly monitor. Capped only because the realtime moment is more staged than a true burst.
- **EV:** weighted **62.1** (top-3 55 / Convex 78 / genuine-use 80)

## #9. Two-Face
*Old ICP vs auto-rewritten ICP, scoring the same leads live, every score clickable to the exact quote.*

A win/loss-to-ICP feedback loop that closes the loop nobody closes, with a spectacle mechanic. Feed it closed-won/lost transcripts; it clusters WHY deals actually won or lost, auto-rewrites your ICP and messaging from the evidence, then runs the old ICP vs the new ICP head-to-head on a fresh lead set so you watch fit-scores diverge live. A backtester and rewriter in one - Lopus's explainability thesis as a self-improving artifact.

- **Signal:** The outcome-grounded reason a deal closed or died, extracted from your own call data - a fully custom, first-party signal that cannot be bought and that most teams never operationalize.
- **DETECT:** Ingest closed-won/lost transcripts + outcomes (uploaded or via a Gong-style export, sourced from real anonymized samples secured BEFORE the event).
- **ENRICH:** LLM extracts structured win/loss reasons + firmographic correlates per deal.
- **SCORE:** Cluster reasons via embeddings, compute which attributes actually predicted won vs lost (bloomberry-style lift), output a rewritten ICP + messaging WITH lineage to the exact quotes; ABSTAIN where evidence is thin.
- **ACT:** Auto-publish the new ICP, re-score a live lead list old-vs-new, and draft messaging that reflects what actually won.
- **Stack:** Convex (store deals/clusters + reactive old-vs-new score board + durable workflow for the clustering pass) + OpenAI structured outputs + embeddings for clustering + Fiber/Exa for the lead source to re-score against.
- **Convex angle:** Moderately load-bearing (be honest): Convex stores the deal corpus and powers the live old-ICP-vs-new-ICP comparison board (the arena/spectacle). A legitimate track entry but the realtime angle is less central than the inbound/displacement boards.
- **Demo plan:** The side-by-side arena: old ICP vs auto-rewritten ICP scoring the same fresh leads, scores visibly diverging, each new score clickable down to the exact customer quote that justifies it. Old-way-vs-new-way + explainable lineage in one frame - a direct hit on Dan.
- **Target judges:** Dan (best explainability/abstention/lineage story after Cut Line, his stack-adjacent), Vihaar (closes a loop nobody closes), the genuine-usefulness lens.
- **21h scope:** Difficulty 4: the clustering + ICP rewrite is the hard part. Secure transcripts first, pre-compute the clustering, build the live old-vs-new scoring arena as the demoable surface.
- **Risks:** Batch-analytics, not realtime - hardest to make feel ALIVE in 3 min, weakest Convex story of the top 10, and demo-data smell kills it without real (anonymized) transcripts secured pre-event. Mitigate: lock down real transcripts first; lean on the old-vs-new arena as the live moment.
- **Why it wins:** Closes the win/loss->ICP loop almost nobody closes, the old-vs-new arena with quote-level lineage is exactly the visible, playful live action that reads as coolness, and it's the single best self-improving explainability artifact. Higher ceiling than its rank if transcripts are locked down.
- **EV:** weighted **56.6** (top-3 54 / Convex 52 / genuine-use 78)

## #10. Fanatic
*One engine: a real-world event fires, the right enthusiast surfaces, timely outreach drafts itself.*

The strongest reframe of Charlie's three passions (running / music / NBA) into ONE generalized engine, not three verticals: a real-world EVENT fires (race finish, tour date in a city, playoff clinch/trade), it matches the right enthusiast, and it drafts perfectly-timed personalized outreach at the emotional peak - sold to the brands/teams/promoters as their signal-based outreach engine. Build the general engine, demo the NBA vertical because it's the most visceral live.

- **Signal:** Real-world event x affinity match ('this team just clinched' x 'this fan is in-market for merch'; 'artist tour date in city X' x 'their local heavy listeners'; 'race finish' x 'shoe replacement due'). Custom, time-decaying, emotionally peaked - not a bought B2B intent feed. Demo on the brand's first-party list, NOT cold strangers, to defuse PII/consent optics.
- **DETECT:** Live event feed (scores/trades/news, tour dates, race results) via Exa/public sources into a reactive Convex event board.
- **ENRICH:** Resolve enthusiast affinity + contactability + location, matching against the brand's first-party opted-in list (Fiber reverseEmailLookup on the brand's existing list, not cold scraping).
- **SCORE:** OpenAI structured outputs rate purchase-propensity-at-peak (affinity x recency x event magnitude) with reasons; ABSTAIN on weak matches.
- **ACT:** Timely drafted call/email/DM anchored to the exact event; OpenAI Realtime voice optional for a flashy on-stage AI call.
- **Stack:** Convex (live event feed + reactive match queue + time-window scheduling for the peak window) + OpenAI Realtime voice for the flashy ACT + Fiber/public sources for enrichment + OpenAI structured outputs for SCORE.
- **Convex angle:** Genuinely cool burst-to-board fit: an event drops and fans out to a reactive match queue with time-window scheduling - the most visually alive of Charlie's ideas. Moderately load-bearing; the burst fan-out exercises reactivity + Workpool naturally.
- **Demo plan:** An event drops live (replay a real recent NBA clinch or tour-date announce); the matched superfan surfaces on the board; an AI voice call or hyper-specific message generates referencing the exact moment; then flip ONE slide showing the IDENTICAL engine firing on a concert date and a marathon finish. One engine, three verticals, live - the most 'cool' demo on the board.
- **Target judges:** Coolness criterion (rubric #3) and Charlie's passion (10% term); Convex track on the burst fan-out. Weakest on the B2B-GTM judges.
- **21h scope:** Difficulty 3: build the event board + match queue + one drafted outreach on a pre-cached first-party list and one real event; add the voice call as the spectacle with a pre-recorded fallback.
- **Risks:** Theme-fit: it reads adtech/DTC in a RevOps room and underperforms rubric-#1 usefulness; the voice ACT can smell like the AI spam judges are sick of unless human-grade and consent-framed on a first-party list. Frame the buyer (brand/team/promoter) in the first 15s or it reads B2C and loses the 70% term.
- **Why it wins:** It earns its slot on the 10% (Charlie's genuine passion) and rubric-#3 coolness ceiling: the AI voice call is the most memorable live spectacle and unifying Q/R/S into one engine is the right move. Included honestly as the coolness-forward side bet, NOT the lead horse - the B2C gravity caps its 70% term below every B2B play above it.
- **EV:** weighted **51.2** (top-3 42 / Convex 70 / genuine-use 88)

---

## Verdicts on Charlie's three user ideas (running / music / NBA)

**Q - Marathoner Outreach (RUNNING): AI calling/emailing runners about shoes/gear, signal = race finish or shoe mileage due** (EV 47, Did NOT earn a standalone top-10 slot; it is absorbed into Fanatic (#10) as one of three demo verticals. Honest read shared by all six personas: it scores ~2 on rubric-#1 (B2C in a RevOps room), no sponsor sells running gear, and AI-calling-a-consumer reads as the cold-outbound backlash category. Its one genuine strength is that the race-finish signal is the only publicly-detectable, defensibly hard-to-buy signal of the three verticals. High on Charlie's 10% passion term, low on the dominant 70%. Build the engine, demo it on a B2B buyer instead - or keep running as one Fanatic vertical, never as the lead.)  
Event-to-enthusiast outreach engine SOLD TO running-shoe brands & DTC retailers, acting ONLY on the brand's first-party opted-in list (not cold strangers), with the race-finish event as the trigger. Generalized into the single Fanatic engine rather than a standalone running vertical.

**R - Concert/Music (MUSIC): (R1) AI outreach to Spotify listeners about concerts + inverse artist/venue reach; (R2) sheet-music finder** (EV 51, Did NOT earn a standalone slot; the supply-side R1 form is the music vertical inside Fanatic (#10) and was every persona's preferred articulation of Charlie's passion. It is the strongest of Q/R/S on the Convex axis (tour-date burst fan-out is inherently realtime) and the highest on genuine passion, but as submitted it's a B2C OAuth/PII minefield (Spotify gated data) and even the promoter reframe is a GTM target judges may not pattern-match as RevOps. R2 is killed - cute utility, wrong event. Best vertical to demo for emotional resonance, but the 70% theme-fit caps it.)  
R1 supply-side: an AI-native Bandsintown sold to artists/venues/promoters (the budget-holding business), triggered by 'tour date in city X' crossed with PUBLIC local-demand proxies (avoid gated Spotify/PII entirely). R2 (sheet-music finder) is a pure consumer utility with weak GTM fit - reframe at best as lead-gen for sheet-music sellers, but it does not compete. R1 supply-side generalizes into Fanatic.

**S - NBA / Sports merch (SPORTS): auto outreach selling fans jerseys/shoes/merch on event signals (clinch, win, trade, breakout, jersey drop)** (EV 44, Did NOT earn a standalone slot; it is the headline demo vertical inside Fanatic (#10) precisely because the clinch/trade emotional-peak signal is the most visceral live moment of the three. But it is the most clearly B2C of Charlie's ideas: fan PII/contactability is a real wall, and voice-call-at-emotional-peak reads as exactly the AI spam these judges are in backlash against. Strong rubric-#3 coolness, weak rubric-#1 usefulness, no sponsor adopter. Use it as Fanatic's live spectacle, not as a product on its own. VERDICT ON THE GENERALIZED ENGINE: yes, one 'event-to-enthusiast' engine beats three separate verticals (every persona agreed), and that engine is Fanatic at #10 - included on coolness + passion, ranked honestly below all B2B plays because the 0.70 term dominates.)  
Event-triggered outreach engine for sports-merch retailers/teams/Fanatics-class sellers, acting on the seller's first-party fan list at the emotional peak. This is the MOST VISCERAL live vertical, so it becomes the on-stage demo vertical of the single Fanatic engine (#10).

## Honorable mentions

- Tollgate (Vihaar's $0.02-Venmo friction thesis shipped as a gated inbox): the highest host-resonance ceiling and most memorable contrarian framing, but it's a two-sided marketplace, not a RevOps internal tool (rubric #1), and one demo account can't make a two-sided market feel real. Cut for theme-fit, not for cleverness.
- InboundLive / Inbox Zero (standalone reverse-email 'who just hit me' router): the fastest, most bulletproof realtime moment, but subsumed by Tripwire (#4), whose re-verification-at-moment-of-action is the differentiated hero that keeps it from being a Default/RB2B clone.
- Footing (Cluely-if-it-worked honest live-call copilot with grounded battlecards + auto-CRM): the highest coolness ceiling in the entire deck, but the highest live-failure profile - sub-second moment-detection with audio on a 3-min stage is a coin-flip and the Cluely category is radioactive. Too fragile to bet the win on; a mandatory pre-recorded fallback guts the 'live' wow.
- Orange Slice Live (full DETECT->ENRICH->SCORE->ACT loop ending inside the host's own spreadsheet): shrewd host-appeal and the lowest build difficulty, but the hosted /execute polling can stall a live demo and it risks reading as 'just used the host's API.' Strong insurance/fallback pick, not a lead.
- Chat GTM (Open Edition standalone): killed and folded into Protagonist (#1) - on its own it's the textbook 'same idea different label' vs Vincent's exact demo. It only survives when signal-stacking makes it deeper than the original, which IS Protagonist.
- WinbackWire and Maxine's BuiltWith-delta Defector: both subsumed by the GitHub-only Defector (#3), which is cleaner to detect, fully public, and carries no PII/OAuth landmine.
- Warm Again: subsumed by Keeper (#6); same warmest-pipe thesis, but Keeper's durable 'already-reached' memory is what gives it an afterlife beyond the demo.

## The recommendation

Build Protagonist. It is the single highest-EV idea because it maximizes the dominant 0.70 term in a way nothing else does: it is the ONE idea that lands all three judges simultaneously - Vincent watches his own Chat-GTM demo, externalized and deeper, run live on his own company (the highest-leverage demo trick in the brief, make the judge the protagonist); Dan gets the full DETECT->ENRICH->SCORE->ACT loop with first-class abstention; and Vihaar gets stacked custom high-lift signals nobody sells (the 2.4x story) closing all the way to a drafted action in Slack. It leads with rubric-#1 usefulness, makes technical complexity legible through a live streaming Convex fan-out (which also wins the $1k track), and a real growth team would keep it Monday. The build is the real risk, so scope it ruthlessly: pre-cache the three judge companies (Cursor, Lopus, Orange Slice) so the happy path never stalls, keep the org chart shallow (user -> manager -> VP -> economic buyer), make signal-stacking the visibly hard live part, and ship the streaming brief + cached companies FIRST as the demo-complete core before adding live scraping. Submit early. If 21h gets tight, Tripwire (#4) is the de-risked high-floor fallback that still wins the Convex track and lands the judge-as-protagonist moment with near-zero live-failure risk.