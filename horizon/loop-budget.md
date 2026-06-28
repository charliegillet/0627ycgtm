# Loop Budget — BEACHHEAD (drive-to-production)

## Daily limits
| Loop | Max runs/day | Max tokens/day | Max sub-agent spawns/run | Max auto-PRs/day |
|------|--------------|----------------|--------------------------|------------------|
| beachhead-production (L1 plan) | 4 | 150k | 0 | 0 |
| beachhead-production (L2 build) | 8 | 1.2M | 2 (1 maker + 1 verifier) | 3 |

## Per-item caps
- Max verifier retries per item per run: 2 (then ESCALATE_HUMAN).
- One backlog item per run. Never batch multiple items.

## On budget exceed
1. Pause the schedule (stop the `/loop`, or set `loop-pause-all` in STATE.md).
2. Append an event to `loop-run-log.md`.
3. Add a High Priority note in STATE.md for the human.

## Kill switch
- Put `loop-pause-all` under STATE.md → High Priority. The driver halts on sight.
- Resume only after a human clears it.

## Estimate
- `npx @cobusgreyling/loop-cost --pattern daily-triage --level L2` (closest analog; this loop is L2 with one maker+checker per run).
