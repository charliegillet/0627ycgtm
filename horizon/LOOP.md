# LOOP.md — BEACHHEAD drive-to-production loop

Goal: take BEACHHEAD from "verified-compiling fixture-mode MVP" to **production-complete**
by walking the Production Backlog in `STATE.md` to its Definition of Done — one item per
run, maker/checker verified, human-gated where marked 🔒.

Built using the loop-engineering references in `../loop-engineering-*/`
(patterns: daily-triage + roadmap driver; checklist: `docs/loop-design-checklist.md`).

## Anatomy (5 primitives + memory)
- **Schedule:** Claude Code `/loop` (below). Cloud/cron option: `/schedule`.
- **Skill (driver):** `.claude/skills/beachhead-production` — selects work, delegates, gates, updates state.
- **Skill (maker):** `.claude/skills/beachhead-implement` — smallest correct change for one item.
- **Sub-agent (checker):** `.claude/agents/loop-verifier` — runs tsc/build/vitest/eslint + signal invariants; default REJECT.
- **Worktrees:** implementer runs with `isolation: worktree`; one per item; discard on REJECT.
- **Memory/State:** `STATE.md` (backlog + invariants + DoD), `loop-run-log.md`, `loop-budget.md`.

## Active loop
| Loop | Cadence | Status | Command |
|------|---------|--------|---------|
| beachhead-production | manual / 1d | L1 (planning) → promote to L2 | see below |

## How to run (phased — do NOT skip to L2)

**L1 — plan/report only (run this first, 2–3 runs):**
```
/loop Run $beachhead-production in PLAN MODE: read STATE.md, check invariants, pick the next item, and write the plan + updated backlog to STATE.md. Do NOT modify any code or spawn a maker this phase.
```

**L2 — assisted build (after L1 plans look right):**
```
/loop 1d Run $beachhead-production. For the selected item: open an isolated worktree, run $beachhead-implement (maker), then the loop-verifier agent (checker). On APPROVE commit on `beachhead` (PR for large items); never auto-merge. Skip 🔒 items to High Priority. Update STATE.md and append loop-run-log.md.
```

(Omit the interval — `/loop Run $beachhead-production ...` — to let the model self-pace one item at a time.)

## Human gates (🔒 — loop proposes, never executes)
- Setting real provider keys; firing any real outreach (the ACT send path); prod deploy (`convex deploy --prod`); auth/tenancy internals; merging PR #2; any non-optional schema migration.

## Denylist (never edit)
`.env*`, provider keys, `convex/act.ts` real-send path, Convex deployment secrets, auth internals.

## Definition of Done
See `STATE.md` → Definition of Done. When met, the loop writes "PRODUCTION COMPLETE — handing off" to High Priority and stops.

## Safety & budget
- No auto-merge. Maker ≠ checker. Verifier runs tests in a worktree before APPROVE.
- Caps + kill switch: `loop-budget.md` (`loop-pause-all` in STATE.md halts everything).
- References: `../loop-engineering-*/docs/safety.md`, `failure-modes.md`, `anti-patterns.md`.
