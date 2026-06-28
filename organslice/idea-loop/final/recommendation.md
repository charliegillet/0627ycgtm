# Recommendation (Round 2) — READY_FOR_HUMAN_DECISION

**Recommended: Finalist A — Multi-Agent Fault Attribution (C12, 94/100).** Warm backup: Finalist B — Word-Level Conversational Provenance (C07, 85/100). The human owns the final bet.

Round 2 was run because the human rejected the Round-1 finalists for being (1) too commodity and (2) too small a demo swing. Both new finalists were generated and filtered specifically against those two constraints.

## Why A (C12)
1. **It's the only candidate whose moat does NOT depend on data the team won't have.** The team builds the multi-agent pipeline and the seeded fault live, so "the moat is a future data-flywheel" — the exact failure that killed C09/C10/C11 — doesn't apply. Fault-attribution + counterfactual over real multi-agent traces is a genuinely new category (multi-agent revenue accountability).
2. **Biggest legible jaw-drop:** "which agent broke the deal?" → a fault tree lights the exact agent/decision/low-confidence input + the counterfactual. An AI blaming another AI, with the real trace.
3. **True closed growth loop** (mean-time-to-fault-attribution → fault-pattern library), not a per-doc or efficiency loop.
4. **Timely:** as teams hand revenue to agent pipelines, accountability is an unsolved, expensive pain.

**The one real risk:** feasibility sits exactly at the gate floor (12/15) — building a real 3-agent pipeline + traces + fault tree in 24h is hard. Mitigation: assign the strongest engineer to the pipeline at hour 0; **hour-16 go/no-go** that swaps to Finalist B if the live pipeline isn't green.

## Why B (C07) is the backup
Lowest build risk of the set, the most visually unambiguous demo (words light up on a PDF at 0.94 confidence), and an honest word-level provenance moat. It scores lower (85) because its moat is modest and thins at demo doc-scale — but it's the safe landing if A's ambitious build slips.

## Decision memo (recommended build = A / C12)
- **Name / pitch:** Multi-Agent Fault Attribution — ask "which agent broke the deal?" and get the exact agent, decision, low-confidence input, and counterfactual from real traces.
- **User & problem:** RevOps/AI-ops running autonomous agent pipelines; no accountability when a deal dies across agents; AI ROI unprovable (P10).
- **Core loop:** spoken fault query → real TrueFoundry traces → Moss cross-index → fault tree + counterfactual → MTTF-attribution → fault-pattern library.
- **Track mapping:** Revenue Autopilot, Reading Minds, Sales Cyborgs, Zero-to-One.
- **Research evidence:** EVIDENCE.md P10 (AI ROI gap / accountability), sponsor table (TrueFoundry gateway, Moss sub-10ms, Nova/LiveKit voice).
- **Competitive wedge:** revenue fault attribution + counterfactual over multi-agent traces; LLM-observability tools show traces, not accountability.
- **MVP & kill list:** see finalist-a.md.
- **System architecture:** finalist-a.md diagram.
- **3-minute demo:** finalist-a.md storyboard.
- **Success metric:** mean-time-to-fault-attribution.
- **Risk register:** (1) 24h pipeline build — strongest engineer first, hour-16 go/no-go to C07; (2) counterfactual hallucination — pre-validate offline; (3) fault must live in REAL traces — kills FAKE-PROOF; (4) keep pipeline trivially small but genuinely running.
- **First six build tasks:** finalist-a.md task list (pipeline → gateway logging → 10 scenarios + seeded fault → Moss index → voice query + fault tree → pre-validated counterfactual).

## Implementation handoff
On SELECT, start the **separate build loop** (spec §10): fresh open-source repo at kickoff; strongest engineer on the pipeline first; integration freeze 4h before judging; human-approval gate on any external action; label all synthetic scenarios; hour-16 go/no-go to the backup.

## Quality checklist (Stage 13) — Round 2
- [x] Both primary product sources + practitioner pain (28 sources).
- [x] Each finalist: one user, one metric.
- [x] ≥3 tracks tied to loop steps.
- [x] Consequential AI action (fault attribution + counterfactual / live provenance).
- [x] Loop measures its own action's result.
- [x] Visible artifact/state change (fault tree lights up / words highlight).
- [x] Obtainable data (A generates its own traces; B pre-parses its doc set) — both avoid the day-one data-fantasy trap.
- [x] Synthetic scenarios labeled.
- [x] Claims cited / confidence-scored.
- [x] Human-approval gate on external actions.
- [x] Wedge is structural, not model choice (the Round-2 mandate).
- [x] Build fits before integration freeze (A at the floor, with a go/no-go to B).
- [x] "Do not build" list explicit.
- [ ] Final human decision + rationale recorded — **PENDING (Stage 9 human gate).**
