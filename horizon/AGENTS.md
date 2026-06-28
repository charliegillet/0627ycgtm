# AGENTS.md — BEACHHEAD conventions (for loop maker/checker)

Project: Next.js 16 (App Router) + Convex 1.32 + React Three Fiber + React Flow.
All commands run from `horizon/`.

## Build / test / verify
```bash
npm install
npx convex dev            # interactive: provisions deployment + regenerates convex/_generated
npx tsc --noEmit          # typecheck (must be clean)
npx next build            # production build (must succeed)
npx vitest run            # tests: pure logic (convex/lib) + convex-test integration
npx eslint convex/ app/ --quiet   # 0 errors required (warnings tolerated)
```
Live pipeline smoke (fixture mode):
```bash
curl -XPOST "$NEXT_PUBLIC_CONVEX_SITE_URL/signal" -H 'Content-Type: application/json' \
  -d '{"source":"manual","kind":"manual","companyDomain":"stripe.com"}'
npx convex run queries/board:liveBoard '{}'
```

## Conventions
- Convex: validators with `v`; public `query/mutation/action`, internal `internal*`.
- **Actions only** may `fetch`/call SDKs; actions have no `ctx.db` (use `ctx.runQuery`/`runMutation`).
- New schema fields are `v.optional` (safe migration); components registered in `convex/convex.config.ts` (then run codegen).
- Providers run in **fixture mode** unless `ORANGESLICE_API_KEY`/`FIBER_API_KEY` are set (env-based switch, no code change).
- Synthetic data is labeled `__synthetic: true`. Don't claim live behavior that's fixtures.
- TypeScript strict; no `any` (use precise types); no emojis in code.

## Signal invariants (must hold)
- `stripe.com` → routes (score ≥ 90, 3/3 legs). `acme.com` → abstains (1/3).

## Denylist (never edit in an unattended run)
`.env*`, provider keys, `convex/act.ts` real-send path, deployment secrets, auth internals.
