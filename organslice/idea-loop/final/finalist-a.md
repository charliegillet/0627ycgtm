# Finalist A — Multi-Agent Fault Attribution (C12) · blind score 94/100

**One-line pitch:** When a deal dies inside a pipeline of autonomous AI agents, you ask out loud "which agent broke this deal?" — and a fault tree lights up the exact agent, the exact decision, the exact low-confidence value it trusted, with the counterfactual that would have saved it.

## Before / after
- **Before:** Three AI agents (SDR, pricing, proposal) run the pipeline. A deal stalls. The CFO asks "why did we lose this?" — and nobody can answer, because the decision was distributed across agents with no accountability layer. AI ROI is unprovable; the project is at risk (P10).
- **After:** "Which agent broke the Globex deal?" → the system replays the real agent traces and answers: "The SDR agent, 2:14pm, used the pricing agent's $92k output that carried 0.41 confidence, with no fallback. If it had requested re-pricing, the deal stays alive." A red node lights up.

## Exact closed loop (no user/metric change mid-loop)
Trigger: spoken fault query → **Observe:** real TrueFoundry traces of every agent action/cost/confidence → **Decide:** Moss cross-indexes the 3 agent timelines, finds the error-propagation fork → **Act:** render the fault tree + a pre-validated counterfactual → **Measure:** mean-time-to-fault-attribution → **Learn:** fault-pattern library flags "this pipeline matches a known failure topology" → next stalled deal. Same user (RevOps), same metric (MTTF-attribution).

## Track map (each tied to a loop step)
- **Revenue Autopilot** — the failing multi-agent pipeline IS the revenue automation layer (Observe/Act).
- **Reading Minds** — Decide: reconstructing what each agent "decided" and on what confidence.
- **Sales Cyborgs** — Act: humans regain oversight of the cyborg pipeline.
- **Zero to One** — multi-agent revenue accountability is a net-new category.

## System diagram
```
[SDR agent] [Pricing agent] [Proposal agent]  --all calls/cost/confidence-->
                         |
                 [TrueFoundry Gateway: REAL structured traces]
                         |
                 [Moss: cross-agent timeline index, sub-10ms]
                         |
  voice query ---> [LiveKit/Nova agent] --finds error-propagation fork-->
                         |
        [live fault tree: red node] + [pre-validated counterfactual]
                         |
                 mean-time-to-fault-attribution --> [fault pattern library]
```

## 24-hour task list (dependency order) — HIGH RISK, sequence matters
1. **Build a real minimal 3-agent pipeline** (SDR → pricing → proposal) — strongest engineer starts here at hour 0.
2. Wire **TrueFoundry Gateway** so every agent call logs action + cost + a confidence score.
3. Run **~10 deal scenarios**; **seed one genuine fault** (pricing agent emits 0.41-confidence price; SDR uses it with no fallback) — the fault must live in REAL traces.
4. **Moss** cross-index the traces (entity-link by deal/agent/timestamp).
5. **Voice query → fault-fork detection**; render the **fault tree** (failing branch lights up).
6. **Pre-validate the counterfactual** offline; live Moss only for the lookup (no live causal hallucination).
7. Harden the demo; rehearse twice from clean traces.
8. **Hour-16 go/no-go:** if the live pipeline isn't green, swap to Finalist B (C07).

## Kill list (deliberately NOT building)
- No live counterfactual generation on stage (pre-validated only).
- No more than 3 agents / ~10 scenarios.
- No real CRM/email/Slack — the traces are the data, generated live.
- No general-purpose observability UI; one fault tree, one query.

## 3-minute demo storyboard
1. (0:00) "We run 3 AI agents in our pipeline. One deal just died. Watch." Show the 3 agents + a stalled deal.
2. (0:40) Voice: "Which agent broke the Globex deal?"
3. (1:10) Fault tree renders; **red node lights up** on the SDR agent's 2:14pm step; the 0.41-confidence input is shown.
4. (2:00) The counterfactual: "If it had re-priced, the deal survives." 
5. (2:40) One sentence: "As you hand revenue to agents, this is the accountability layer — an AI that can tell you, with the real trace, which AI broke the deal."

## Closest competitors & wedge
- LLM observability (Langfuse / LangSmith / Arize Phoenix) — **wedge:** those show traces; this does **revenue fault attribution + counterfactual** over multi-agent pipelines, conversationally, in an emerging category they don't address.
- **Moat (honest, not a flywheel):** the fault-attribution + counterfactual layer over REAL multi-agent traces — the team manufactures the traces and the seeded fault live, so the moat does NOT depend on data they won't have. The fault-pattern library then compounds.

## Highest-risk assumption + 30-minute validation test
- **Assumption:** a real 3-agent pipeline emitting TrueFoundry traces with confidence scores can be stood up and cross-indexed in Moss within the build window.
- **30-min test:** stand up 2 trivial agents that call each other through the gateway; confirm a structured trace with a confidence field lands and is queryable in Moss. If not, fall back to C07 immediately.

## Stage 8 feasibility spike (documentation/wireframe — no pre-event code)
```
Assumption tested: Real multi-agent traces (with confidence) can be logged via TrueFoundry and cross-indexed for fault attribution in 24h.
Method: TrueFoundry Agent Gateway docs (structured request/response + tool traces, EVIDENCE.md); wireframe of agent->gateway->Moss schema; scope to 3 agents / 10 scenarios / 1 seeded fault.
Observed result: Gateway logging is documented; the hard, custom part is the attribution+counterfactual layer (build, not integration) — scoped to a pre-validated counterfactual it clears 24h but sits at the feasibility floor.
Pass/fail: PASS-AT-FLOOR (assign the strongest engineer to the pipeline first; hour-16 go/no-go to C07).
Design implication: The fault must live in REAL traces (kills FAKE-PROOF). Pre-validate the one demo counterfactual. Keep the agent pipeline trivially small but genuinely running.
```
