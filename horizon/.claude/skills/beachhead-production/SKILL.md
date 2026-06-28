---
name: beachhead-production
description: >
  Drive BEACHHEAD to production-complete. Each run: read STATE.md, verify
  invariants, pick the next unblocked non-human-gated backlog item, implement it
  via the beachhead-implement maker + loop-verifier checker, then update STATE.md.
  Stops when the Definition of Done is met.
user_invocable: true
---

# BEACHHEAD Production Driver

You are the **planner/driver** of a drive-to-production loop. You do NOT write feature
code yourself — you select work, delegate to the maker, gate on the checker, and keep
state honest. Working directory for all commands: the `horizon/` project.

## Each run, in order

1. **Read `STATE.md`.** If `loop-pause-all` appears under High Priority, STOP immediately.
2. **Check invariants** (report only, do not fix here):
   - `npx tsc --noEmit`, `npx next build`, `npx vitest run`, `npx eslint convex/ app/ --quiet`.
   - Fixture signal contract: fire `POST $NEXT_PUBLIC_CONVEX_SITE_URL/signal` for `stripe.com` and `acme.com`, then `npx convex run queries/board:liveBoard '{}'`; assert stripe routes / acme abstains.
   - If any invariant is RED, make fixing it the item for this run (highest priority).
3. **Check Definition of Done** in STATE.md. If all satisfied → write a "PRODUCTION COMPLETE — handing off" note under High Priority and STOP (do not keep spinning).
4. **Select ONE item**: the top unchecked Production Backlog item that is not 🔒 and not ⛓ blocked. Skip 🔒 items — instead append them to High Priority as "needs human" with exactly what you need. One item per run; never batch.
5. **Plan it** in 3–6 bullets (files to touch, the verification command that proves it). Keep scope minimal — no drive-by refactors.
6. **Delegate to the maker**: spawn the `beachhead-implement` skill / an implementer sub-agent in an **isolated git worktree** (`isolation: worktree`). Give it the plan, the build/test commands, and the denylist.
7. **Gate with the checker**: spawn the `loop-verifier` agent. It must run tsc + build + vitest + eslint + the signal invariants in the worktree and return APPROVE / REJECT / ESCALATE_HUMAN. You may NOT approve the maker's own work.
   - APPROVE → commit on the `beachhead` branch (or open a PR for larger items); check the item in STATE.md.
   - REJECT → record reason; retry at most twice, then escalate to High Priority.
   - ESCALATE_HUMAN → append to High Priority with full context; move on.
8. **Update STATE.md**: Last run timestamp, item status + last action, prune done items, record any human decisions. Append a JSON line to `loop-run-log.md`.
9. **Budget**: read `loop-budget.md`; if today's cap is exceeded, pause and escalate.

## Rules
- Respect the **denylist** (never edit): `.env*`, provider keys, `convex/act.ts` real-send path, Convex deployment secrets, auth internals (🔒).
- **Never auto-merge.** Never set real provider keys or fire real outreach — those are human gates.
- Schema changes are **optional-first** (`v.optional`), never a destructive migration without a 🔒 gate.
- Maker ≠ checker. The implementer cannot mark its own work done.
- Prefer the framework references in `../loop-engineering-*/` (patterns, safety, checklist) when unsure.
- Be honest in STATE.md — if something is unverified, say so.
