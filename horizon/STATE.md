# Loop State — BEACHHEAD (drive-to-production)

Last run: (set by the loop each run)
Loop status: ACTIVE  ·  Phase: L1 (planning/report-only until promoted to L2)
Kill switch: set `loop-pause-all` under High Priority to halt all runs.

> The loop's job: walk the **Production Backlog** below to completion, one item per
> run, maker/checker verified, human-gated where marked. STOP when the
> **Definition of Done** is satisfied. Read this file first every run; update it last.

---

## Invariants (must always hold — verifier checks every run)
- `npx tsc --noEmit` clean · `npx next build` succeeds · `npx vitest run` all pass · `npx eslint convex/ app/ --quiet` → 0 errors.
- Signal contract (fixture mode): `stripe.com` ROUTES (score ≥ 90, 3/3 legs); `acme.com` ABSTAINS (1/3). Any deviation = High Priority, do not proceed.
- No secrets/keys committed; `.env*` ignored.

## Definition of Done (loop hands off to human when ALL true)
- [ ] Every P0–P3 backlog item below is checked.
- [ ] Invariants green on a clean run.
- [ ] CI workflow green on the branch.
- [ ] Live signal path validated against real provider data (requires keys — P0).
- [ ] Prod deployment exists and env set (`--prod`) — P4, human-run.

---

## Production Backlog (the loop picks the top unchecked, unblocked, non-🔒 item)
Legend: 🔒 = HUMAN gate (loop proposes/PRs only, never self-approves) · ⛓ blocked-by

### P0 — foundations / verify-live
- [ ] **CI workflow** — `.github/workflows/ci.yml` running tsc + next build + vitest + eslint on PRs to `beachhead`/`master`.
- [ ] 🔒 **Live keys + signal validation** — set `ORANGESLICE_API_KEY`/`FIBER_API_KEY` (human), then validate the real signal path on a seeded account; record outcome. (Provider switch is env-based; no code change.)

### P1 — Convex depth (prize + robustness)
- [ ] **Durable Workflow** — wrap enrich→score→act in `@convex-dev/workflow`; stages are already discrete internal actions, so this is an upgrade. Unlocks crash-and-resume.
- [ ] **Workpool** — `@convex-dev/workpool` for rate-limit-safe fan-out when a cron detects a burst.
- [ ] **Rate-limiter + error classification** — `@convex-dev/rate-limiter` credit token-bucket; throw `NonRetryableError` on 4xx/empty, retry on 429/5xx.

### P2 — correctness / scale
- [ ] **Idempotency hardening** — fix `upsertCompany` over-marking unprocessed signals; make per-run signal handling exact.
- [ ] **Vector dedup** — embedding + `vectorIndex` fuzzy company dedup (domain-unique already in).
- [ ] 🔒 **Tenancy + auth** — `userId`/`orgId` on tables + Convex auth (auth path = human gate).

### P3 — providers / tests / polish
- [ ] **Provider router** — `lib/providers/` per-leg interface; wire Fiber live legs (hiring/reveal/live-LinkedIn) behind it.
- [ ] **Integration tests** — convex-test coverage per stage (enrich, score, act) + edge cases beyond the current 2.
- [ ] **Observability** — surface `health.checkEnv` + a failed-runs query in the UI.
- [ ] **Lint 0 warnings** — fix `cleanup.ts` unused `ctx`; scope the generated-dir eslint-disable warnings.
- [ ] **Docs** — README final, `fusion/*` updated, 3-min demo runbook.

### P4 — ship (human)
- [ ] 🔒 **Prod deploy** — `npx convex deploy`; `npx convex env set ... --prod`.
- [ ] 🔒 **Merge PR #2.**

---

## High Priority (loop is acting or waiting on human)
<!-- - [ ] ID — desc / Loop action: ... / Human decision: ... -->

## Watch List
- PR #2 — CI + review status.

## Recent Noise (ignored this run)

---
Run log: see `loop-run-log.md`
