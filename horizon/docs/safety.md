# Loop Safety Policy — BEACHHEAD

Applies to the `beachhead-production` loop (and any future BEACHHEAD loops).

## Denylist — paths the loop must NEVER edit unattended
- `.env`, `.env.local`, any `.env*`
- Provider keys / secrets anywhere
- `convex/act.ts` real-send path (Slack/CRM outbound)
- Convex deployment secrets / `convex env`
- Auth / tenancy internals (🔒 human gate)

## Human gates (🔒 — loop may propose/PR, never execute)
- Setting real provider keys (`ORANGESLICE_API_KEY`, `FIBER_API_KEY`, `OPENAI_API_KEY`)
- Firing any **real** outreach (the ACT send) — respect the in-product approval gate
- `npx convex deploy` to prod; `npx convex env set ... --prod`
- Non-optional / destructive schema migrations
- Merging any PR (incl. PR #2)

## Auto-merge
- **Disabled.** No branch is auto-merged. Verifier APPROVE → commit/PR only.

## Maker / checker
- Implementer (`beachhead-implement`) and verifier (`loop-verifier`) are separate agents.
- The implementer may not mark its own work done.
- Verifier runs tsc + next build + vitest + eslint + signal invariants in an isolated worktree before APPROVE.

## MCP / connectors
- Not required for this loop. If added later (e.g. GitHub MCP for PR #2), scope to **read + comment** until trusted.

## Kill switch
- Put `loop-pause-all` under STATE.md → High Priority. The driver halts on sight.
- Resume only after a human clears the flag.

## Stop / escalate conditions
- Same item REJECTed >2× in a run → ESCALATE_HUMAN.
- Verifier cannot run checks (stale `_generated`, env) → ESCALATE_HUMAN, never guess.
- Daily budget exceeded (`loop-budget.md`) → pause + High Priority note.

See also the references: `../loop-engineering-*/docs/{safety,failure-modes,anti-patterns}.md`.
