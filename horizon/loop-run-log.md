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
```json
{ "run_id": "2026-06-28T19:34:00Z", "loop": "beachhead-production", "phase": "L1",
  "item": "P0-CI", "duration_s": 60, "checks": "tsc:clean build:n/a vitest:pass eslint:0 invariants:green",
  "verdict": "no-op (plan only)", "tokens_estimate": 30000, "escalations": 1 }
```

