# Loop Run Log — BEACHHEAD

Append one JSON entry per run. Prune entries older than 30 days.

## Format
```json
{ "run_id": "ISO-8601", "loop": "beachhead-production", "phase": "L1|L2",
  "item": "backlog id", "duration_s": 0, "checks": "tsc/build/vitest/eslint/invariants",
  "verdict": "APPROVE|REJECT|ESCALATE|no-op", "tokens_estimate": 0, "escalations": 0 }
```

## Recent Runs
<!-- newest first -->
