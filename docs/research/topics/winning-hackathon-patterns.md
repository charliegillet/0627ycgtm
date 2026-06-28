# What Wins AI/GTM Hackathons: Judge Psychology, Demo Craft, Winning Patterns

Research dossier for the AI Growth Hackathon (Orange Slice / YC, June 27-28). Judging criteria, in order: (1) Usefulness in a Growth/GTM/RevOps context, (2) Technical Complexity, (3) Coolness. Win = working demo + 3-min video. This file maps how judges actually decide, how to engineer the demo, and how to scope a winnable 21-hour build for two elite builders.

## TL;DR for our debate

- **Win is decided in the first 2 hours, not the last.** Teams that read the rubric before the problem statement, scope to a finishable idea, and ship a working skeleton early consistently beat stronger raw technical teams. (HackerEarth, Nick Singh)
- **One signal, one wow moment, real data.** Pick ONE custom signal and wire it end to end (Lopus's DETECT → ENRICH → SCORE → ACT). Three features that tell one story beat ten half-built ones.
- **The demo must hit its punchline in the first minute,** ideally on real, live data the judge recognizes. Judges scoring 30-100 teams in a day penalize any demo that never reaches its payoff.
- **Technical complexity has to be *legible* in seconds,** not just present. Show the hard part happening live (live browser agent, real enrichment waterfall, sub-second scoring on a real CRM), and narrate the *why* of two architecture decisions.
- **Match the rubric explicitly.** Judges repeatedly say the biggest differentiator is a project that visibly considered the judging criteria. For us that means: lead with GTM usefulness, then prove technical depth, then land coolness.

## How judges actually score (psychology)

Judges are time-starved pattern-matchers reviewing many projects back to back. Five seasoned Devpost judges (Square, Google, NEAR, Atlassian, Databricks) converge on a few points:

| Judge / org | What they reward | What kills it |
|---|---|---|
| Richard (Square) | "Clearly considering the judging criteria"; demo video shows investment level | Back-end heavy with "no UI" |
| Kelvin (Google) | Departing from the template; sound + storytelling; actually using provided sponsor tools | Unchanged template submissions |
| Maria (NEAR) | "Unusual and fresh approach" + excellent pitch + visible passion | "The same project with a different label" |
| Warren (Atlassian) | "Is the finished product something I would want to use?" | Rehashed ideas; not nailing the prompt |
| Karen (Databricks) | "The storytelling component is huge"; voiceover over components | Ambiguity; "projects that lack detail and code" |

Key psychological levers:
- **Mere-exposure / familiarity.** Talking to sponsors and judges *before* you demo measurably helps. Vincent (Cursor) and Dan Low (Lopus) will judge - engaging them during build hours both validates the idea and builds recognition.
- **"Wow" = the gestalt impression at first sight.** Judges describe measuring wow by the impression when they first *see* it. Surprise reads as creativity.
- **Bonus points for pushing past templates** - "APIs, AI models, or hardware integrations instead of reusing templates." A visible-stable-efficient build "speaks volumes about a team's skill."
- **Delight test.** "Is it something a human would feel delighted, excited, empowered, or relieved to use?"

## Demo craft (the highest-leverage thing)

Rules that recur across every credible source:

1. **Write the 90-second demo script before any code.** If you cannot state the problem, the trigger, the "aha," and the close on one page, you do not yet know what you are building. The script is the spec.
2. **Cold open.** Open with the wow or a hard-hitting one-line problem, not "Hi we're team X." People remember the start and the end (primacy/recency) - earn attention in the first few seconds.
3. **Single wow moment, early.** The aha should land inside the first minute. Make ONE core feature work flawlessly rather than five half-broken ones.
4. **Real data, real target.** Demo on data the judge recognizes (a real company's signals, a real CRM record, a live website). Generic seed data reads as a toy. Proof of Passport won by having judges scan *their own* passports - make the judge the protagonist if you can.
5. **Show the old way vs. your way side by side.** Comparison demos make the value obvious without explanation.
6. **Speed is a feature.** Sub-second/visible-latency actions on real data telegraph that the hard plumbing actually works.
7. **Hardcode the happy path; fail gracefully.** Mock flaky external services, cache API responses, prepare screenshot/video fallbacks. "A demo on localhost with a flaky API call will fail in front of judges" - Wi-Fi drops, services rate-limit, batteries die. Lock the path, prepare clean inputs.
8. **Submit early.** Teams who submit at the buzzer are usually the ones whose demo doesn't quite work. Submitting early buys time to fix what testing reveals.

## Telegraphing technical complexity (honestly)

Complexity only counts if a judge perceives it in seconds.

- **Make the hard part visible and live.** A browser agent actually clicking through a real site; an enrichment waterfall hitting multiple providers in sequence and filling a record live; a scoring model returning on real data. Don't bury the hard work behind a clean UI with nothing legible happening.
- **Narrate two architecture decisions and *why*.** Colosseum's framing: the pitch explains the *why*, the technical portion explains the *how* - "the reasoning behind these decisions." Name the genuinely hard choice (real-time pipeline, multi-agent orchestration, custom eval/trace generation) and why it was non-obvious.
- **Use sponsor tools as complexity signals.** Judges *expect* you to use offered resources and reward it. Here: Codex/OpenAI, Convex (real-time backend, separate $1000/$500 prize), Cursor, Fiber AI, Corgi. A non-trivial Convex reactive backend doubles as the Convex track entry.
- **Avoid the two complexity anti-signals:** boring data CRUD (a form that writes to a DB), and back-end-heavy with no UI. Both score poorly even when technically real.
- **Generate artifacts that imply depth.** Browser Brawl (Browser-Use YC hackathon winner, built in <1 day) won by generating rich adversarial *traces* for agent post-training - the output itself signaled hard infra.

## Scoping a winnable 21-hour build (2 elite builders)

- **Limit to one idea, at most three features.** Three features that tell one clear story beat ten half-built ones. Overscoping is the #1 killer.
- **Ship a working skeleton in the first few hours.** Then layer: functional-but-ugly MVP first, polish/UI at the end in parallel.
- **Pick "useful + unexpected."** Strong idea = useful AND unexpected solution. Source from real pain (RocketRide's own GTM, or a real signal a growth team would kill for).
- **Cut ruthlessly:** auth, settings, multi-user, edge cases, anything off the demo path. Polish only: the cold-open moment, the live data, the one wow, the UI on the demo screen, the 3-min video.
- **Reserve 2-3 hours at the end** purely to polish, record, and upload the video. This is non-negotiable per Devpost.
- **Two-person split:** one drives the hard technical core / live demo path; one owns narrative, UI polish, sponsor conversations, and the video. Someone must "drop the keyboard and keep the big picture."

## The "be cool" factor

- **Name it memorably.** Judges meet dozens of teams; a name that sparks a smile or curiosity buys a microsecond of memorability generic names don't. Past winners lean punchy and evocative: *Browser Brawl*, *Explainstein*, *Suparova*, *Soshi*, *Overeasy*.
- **Aesthetics + one delightful detail.** Sound, motion, a tactile "live" feel. Kelvin (Google) specifically rewards "elements of sound and storytelling."
- **A spectacle mechanic.** *Browser Brawl* = two agents fighting on a live site (arena). *Suparova* = a rover that dances. Coolness often comes from a visible, slightly playful live competition or autonomous action, not from a slicker form.

## The 3-minute video structure that wins

Most hackathons cap at 3 minutes; judges watch many in a row. Winning three-act shape:

- **0:00-0:10 - Cold open / hook.** The wow or a one-line painful problem. Lead with the elevator pitch: what it does, in the first few seconds.
- **0:10-0:50 - Problem + character.** "Meet [a real growth/SDR persona] who…" Make the pain concrete and relatable (or a startling stat).
- **0:50-2:10 - Live demo (the core).** Voiceover while showing components on real data; old-way-vs-new-way; the wow lands here and is unmistakable. Pre-record and edit the demo rather than gambling on live; keep narration slow with pauses.
- **2:10-3:00 - How it works + impact + close.** Two architecture "why" beats (technical depth), then who benefits and how much (e.g., enrichment waterfall lifting coverage 20% → 80% ≈ ~2,400 selling hours/yr for 5 SDRs), then a strong CTA. Slides discouraged here - keep it product and demo.

"A clear, well-structured narrative is more valuable than professional video editing." Familiar tools only (OBS, Premiere/CapCut) - don't learn new software under time pressure.

## Common failure modes (avoid)

- Overscoping; building features instead of a demoable product.
- Starting code before the demo script / before sponsor validation.
- Boring CRUD or a back-end with no UI.
- Demo that only reaches its point at minute 3, or relies on live flaky APIs.
- Ignoring the stated theme/rubric (building what *you* want, not GTM growth).
- Submitting at the buzzer with an untested demo.
- "Same project, different label" - derivative ideas judges have seen before.

## Idea hooks for the hackathon

Each maps to the rubric (useful → hard → cool) and where possible to the Convex prize and DETECT → ENRICH → SCORE → ACT frame:

1. **Pick ONE non-obvious custom signal and wire it live end-to-end.** E.g., detect a target account's eng team shipping a competitor integration (GitHub/changelog/job-post signal) → enrich the buyer → score fit → auto-draft the outreach. The whole loop runs on a real company on stage. Hits all three criteria and the "custom > bought signals" thesis directly.
2. **An "arena/competition" mechanic** for a GTM problem (cf. Browser Brawl): e.g., two outreach-agent strategies compete on the same lead set and you watch reply-rate diverge live - spectacle + technical traces signal depth.
3. **Live enrichment waterfall with a visible coverage meter** (20% → 80% climbing in real time across providers) - concrete, quantifiable usefulness in one glance; the Convex reactive backend makes the live meter trivial and wins the Convex track.
4. **Make the judge the protagonist:** ingest *their own* company/domain at demo time and surface a custom buying/expansion signal nobody else would have, in <30 seconds. Maximal wow, zero "toy data" smell.
5. **Browser/computer-use agent that performs a real GTM action live** (qualifies an inbound, runs a competitor teardown, fills a CRM) - visible hard work = high perceived technical complexity.
6. **Trace/eval artifact as the deliverable:** generate a reusable dataset/eval from the run (like Browser Brawl) so the output itself implies infra depth and post-event usefulness for RocketRide.

## Sources

- https://info.devpost.com/blog/hackathon-judging-tips (5 seasoned judges)
- https://info.devpost.com/blog/6-tips-for-making-a-hackathon-demo-video
- https://help.devpost.com/article/84-video-making-best-practices
- https://gist.github.com/dabit3/caef5eee4753dd7d23767bc31e70da28 (Nader Dabit pitch/demo guide)
- https://blog.colosseum.com/perfecting-your-hackathon-submission/
- https://www.hackerearth.com/blog/10-tips-win-hackathon
- https://www.nicksingh.com/posts/win-hackathons-a-how-to-guide
- https://szeyusim.medium.com/how-i-win-most-hackathons-stories-pro-tips-from-a-serial-hacker-1969c6470f92
- https://maven.com/p/41380d/how-i-won-first-places-in-the-yc-and-open-ai-hackathons (Riley Shu; Overeasy.dev)
- https://medium.com/@eyal.shechtman/hack-the-hackathon-a-proven-formula-for-winning-231663ff00cc
- https://supabase.com/blog/ai-hackathon-at-y-combinator (Soshi, Explainstein, Suparova, Dropout)
- https://browser-use.com/hackathon and https://events.ycombinator.com/browser-use-hackathon (Browser Brawl)
- https://medium.com/@BizthonOfficial/10-winning-hacks-what-makes-a-hackathon-project-stand-out-818d72425c78
- https://taikai.network/en/blog/how-to-create-a-hackathon-pitch
- https://events.ycombinator.com/OrangeSliceHackathon and https://luma.com/ufm1y1z1 (this event)
- https://www.clay.com/blog/gtm-engineering and https://www.factors.ai/blog/what-is-gtm-engineering (GTM enrichment/scoring context)
