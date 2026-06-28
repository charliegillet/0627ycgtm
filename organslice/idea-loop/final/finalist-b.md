# Finalist B — Word-Level Conversational Provenance (C07) · blind score 85/100 · WARM BACKUP

**One-line pitch:** Ask an AI a verification question out loud and it doesn't just answer — it lights up the exact words on the exact page that prove it, with a confidence score, and flags where two documents contradict each other.

## Before / after
- **Before:** 93% of AI-search sessions end with no click because AI answers have no provenance — buyers can't verify "they're SOC 2 Type II certified," so they don't trust it and stall (P4, P6, P10).
- **After:** Buyer asks "Is their data stored in the EU?" → the agent answers and three exact words on page 7 of the DPA light up in yellow at confidence 0.94 — and it adds "note: this contradicts page 4 of their privacy policy."

## Exact closed loop (no user/metric change mid-loop)
Trigger: spoken verification question → **Observe:** Unsiloed word-level bounding boxes + confidence over the pre-parsed doc set → **Decide:** which exact words support the claim (Moss claim→bbox index) → **Act:** answer + live word-level highlight on the PDF + cross-doc contradiction flag → **Measure:** buyer trust-conversion / eval speed → **Learn:** verification graph grows across the indexed set. Same user (buyer/SE), same metric (trust-conversion).

## Track map (each tied to a loop step)
- **Reading Minds** — Observe/Decide: what buyers actually need to trust and why.
- **Algorithm Hacking** — Act/Measure: directly attacks the 93% no-click AI-search trust gap.
- **Zero to One** — word-level conversational provenance doesn't exist as a product.
- **Sales Cyborgs** — the vendor's SE gains a provenance weapon.

## System diagram
```
[5 vendor trust docs, PRE-PARSED in-event] --Unsiloed: word-level bbox + confidence-->
                         |
                 [Moss: claim -> bounding-box index, sub-10ms]
                         |
  voice question ---> [LiveKit/Nova agent] --answer + which words-->
                         |
   [rendered PDF: exact words highlight live + confidence] + [cross-doc contradiction flag]
                         |
                 trust-conversion / eval-speed --> [verification graph]
```

## 24-hour task list (dependency order)
1. **Pre-parse 5 vendor trust docs** with Unsiloed (word-level bbox + confidence) during the event.
2. Build the **Moss claim→bbox index** (preserve bounding-box coordinates through ingestion — the hard part).
3. **PDF renderer with live overlay** highlighting.
4. **LiveKit/Nova voice agent**: spoken question → answer + the bbox spans to highlight.
5. **Cross-document contradiction** check (Moss query + one LLM compare).
6. Small "confidence + source" panel; honest fallback (text cite) if overlay fails.
7. Rehearse with judges picking among the 5 docs.

## Kill list (deliberately NOT building)
- No live parsing of arbitrary judge-supplied documents (pre-parsed set only — kills FAKE-PROOF).
- No claim of a million-doc graph; honest "built on these 5 in-event."
- No write-back / external actions.
- No voice cloning.

## 3-minute demo storyboard
1. (0:00) "AI answers have no proof. Watch one prove itself." Judge picks 1 of 5 vendor docs.
2. (0:40) Voice: "Is their data stored in the EU?"
3. (1:10) Agent answers; **exact words on page 7 light up at confidence 0.94**, live.
4. (2:00) "And it contradicts page 4 of their privacy policy" — second doc highlights.
5. (2:40) One sentence: "This is what closes the AI trust gap — an answer you can see proven, word by word."

## Closest competitors & wedge
- Perplexity / ChatGPT citations — **wedge:** page-level links, not **word-level live highlight with confidence**.
- Doc-QA tools — **wedge:** no bbox+confidence, no cross-doc contradiction, not voice-native.
- **Moat (honest, modest):** word-level claim→bbox live-highlight + contradiction graph over the indexed set (Unsiloed+Moss) — harder to copy than a page-level citation prompt; thins as doc count shrinks, which is why it's the backup, not the lead.

## Highest-risk assumption + 30-minute validation test
- **Assumption:** bounding-box coordinates survive the Unsiloed→Moss ingestion and the renderer can highlight the exact span from a spoken query.
- **30-min test:** parse one doc, store one claim→bbox mapping, fire one spoken question, confirm the right words highlight at the right coordinates.

## Stage 8 feasibility spike (documentation/wireframe — no pre-event code)
```
Assumption tested: Word-level bbox+confidence highlight from a spoken query is buildable and reliable on a pre-parsed doc set.
Method: Unsiloed docs (word-level bounding boxes + per-field confidence, EVIDENCE.md); PDF.js overlay-highlight pattern; LiveKit frontend tool-forwarding for the highlight.
Observed result: All primitives documented; the only real risk (cold arbitrary-doc parse latency) is removed by pre-parsing the demo set during the event. Lowest build risk of the finalists.
Pass/fail: PASS (lowest risk — the warm swap if Finalist A's live pipeline isn't green by hour 16).
Design implication: Lock the doc set; preserve bbox coords end-to-end; ship a text-cite fallback if the overlay misfires.
```
