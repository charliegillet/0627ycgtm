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
{ "run_id": "2026-06-28T20:02:00Z", "loop": "beachhead-production", "phase": "L2",
  "items": ["P0-CI","P3-lint","P2-idempotency","P3-tests","P3-observability","P1-workflow(deferred)"],
  "checks": "tsc:clean build:ok vitest:14/14 eslint:0 invariants:green",
  "verdict": "5 APPROVE + 1 deferred-revert", "commits": 6, "escalations": 1 }
```

```json
{ "run_id": "2026-06-28T19:34:00Z", "loop": "beachhead-production", "phase": "L1",
  "item": "P0-CI", "duration_s": 60, "checks": "tsc:clean build:n/a vitest:pass eslint:0 invariants:green",
  "verdict": "no-op (plan only)", "tokens_estimate": 30000, "escalations": 1 }
```

