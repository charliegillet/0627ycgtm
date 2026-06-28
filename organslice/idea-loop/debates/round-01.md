# debates/round-01.md — Stage 6 cycle 1

Opening cases = candidate files C01–C06. Attacks = red-team report. Below: proponent response (exactly one of CONCEDE/REBUT/DEFER/KILL per objection) → revised spec.

## C01 — Live deal-desk voice concierge
- Obj1 approval latency invalidates live "approved & spoken" → **DEFER**: MVP speaks a grounded **draft** quote ("pending approval") in ~45s; human approval is async. Removes the SLA claim, keeps the wow.
- Obj2 Unsiloed live PDF = fake-proof → **DEFER**: prospect "shares" competitor quote at call start (realistic); demo uploads a fresh labeled file live (not pre-staged) to dodge fake-proof.
- Obj3 SCOPE (CPQ integration) → **CONCEDE**: seed Moss with a static **labeled** pricing matrix; no CPQ integration; "stays current via connector" = future work.
- **Revised:** AE call → Moss retrieves approved terms + Unsiloed parses shared competitor quote → Nova speaks a grounded **draft** quote with line-item comparison → async human approval. 2 integrations (Moss + Unsiloed), both seedable. **SURVIVES.**

## C02 — Voice activation concierge
- Obj1 frontend sync into a product you don't own = fake-proof → **REBUT**: Pendo/Appcues/Intercom install via a single script tag; our overlay uses the same snippet + a LiveKit data channel. Demo on our own clearly-**labeled** reference app; integration path is real. Keep synchronized highlight (the wedge).
- Obj2 event stream = data-fantasy + 14-day metric = time-scale → **DEFER**: demo metric = **stalled→activated within the session** (observable now); 14-day activation is post-event; event stream is a seeded Segment-shaped, labeled stream.
- Obj3 COMMODITY/voice-worse-UX → **REBUT**: wedge is **behavior-triggered, detects the exact stuck action and co-navigates in the moment**, not a timed/static tour; voice fits the conversational-AI hackathon.
- **Revised:** stall detected → voice agent co-navigates + UI highlight in sync on a labeled reference app → activation event fires live. **SURVIVES** (fake-proof mitigated by "script-tag install is real," demo app disclosed).

## C03 — Honest voice ad-qualifier
- Obj1 latency/commodity (Retell/Vapi) → **DEFER**: build on LiveKit infra; don't rebuild plumbing.
- Obj2 TRUST (recommend competitor blocked) → **CONCEDE**: drop competitor recommendation; instead honestly tell bad-fit prospects "not yet" + offer a resource (no booking). Removes legal risk **and the most memorable beat.**
- Obj3 WRAPPER (Moss not load-bearing for 3-Q scoring) → **CONCEDE**: ground qualification + resource in a corpus of 100+ past qualified/disqualified transcripts.
- **Revised:** ad click → voice qualifies vs ICP grounded in transcript corpus → books OR honestly defers bad fit + resource. **SURVIVES but de-fanged** (lost the competitor beat; COMMODITY vs Qualified.com lingers).

## C04 — Evidence-backed CRM write-back
- Obj1 COMMODITY (Gong AI Data Extractor) → **REBUT**: wedge = **review-before-overwrite** with per-field confidence + source-quote diff; Gong overwrites without a review step. Make the diff the centerpiece.
- Obj2 TRACK-SALAD (TrueFoundry) → **CONCEDE**: cut TrueFoundry; Slack ping optional. Tracks remain Sales/RevAutopilot/ReadingMinds (≥3).
- Obj3 NARRATION (diff inert) → **CONCEDE**: build a dramatic color-coded old-vs-new diff with source quote on hover as the hero UI.
- **Revised:** call ends → Moss matches transcript→MEDDIC defs → confidence-scored, source-grounded **diff** the AE approves → write-back. 1 integration (mock CRM). **SURVIVES — strongest feasibility; differentiation narrow-but-real.**

## C05 — Price-objection reframe co-pilot
- Obj1 DATA-FANTASY (no outcome-labeled corpus) → **CONCEDE**: use a large **labeled synthetic** corpus (~200 transcripts), transparently labeled in the demo; real-data partnership is post-event.
- Obj2 SCOPE (4 integrations) + fake-proof PDF → **CONCEDE**: cut Unsiloed; Moss-only; rep clicks/types the objection → top-3 outcome-matched reframes with deal context. One integration.
- Obj3 COMMODITY (Gong/Highspot/Klue) + NARRATION → **REBUT/CONCEDE**: wedge = retrieve from **outcome-matched won deals**, not static battlecards; externalize the earpiece as an on-screen rep overlay.
- **Revised:** objection → Moss retrieves top-3 winning reframes + the deal context that made them work, on-screen. 1 integration. **SURVIVES as a focused Moss showcase; ceilings = synthetic data + COMMODITY.**

## C06 — Churn-drift CSM voice alert
- Obj1 DATA-FANTASY → **DEFER**: labeled synthetic corpus with a holdout retained account that does NOT fire (mitigates fake-proof); real export is post-event.
- Obj2 TRUST (customer PII via Nova call) → **CONCEDE**: replace voice call with Slack DM — **but this removes the voice-native angle on a conversational-AI hackathon.**
- Obj3 TIME-SCALE (lead-time vs Gainsight unprovable in 24h) + NARRATION → **CONCEDE**: demo is a labeled historical replay; lead-time is narrated, not proven.
- **Revised:** drift detected on labeled replay → Slack DM with ticket quotes → CSM books QBR. **WEAKENED**: three concessions, loses voice (its sponsor fit) and can't demonstrate its own metric. **Candidate for elimination at scoring.**

## Net
All six are technically still alive after one debate cycle, but the concessions cost C03 its memorable beat and gutted C06 (lost voice + unprovable metric). Strongest post-debate: **C04 (feasibility), C01/C02 (demo), C05 (focused Moss wedge).** Sending revised specs to independent blind scoring.
