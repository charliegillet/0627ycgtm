# BEACHHEAD — the GTM displacement/expansion war room

> Detect the moment a company is **standing up a new GTM motion** — a *convergence* of fresh funding × a burst of category-team hiring × a new adjacent tool — score it with **honest abstention**, and route a **non-email** action behind a human-approval gate. The whole pipeline is observable live through Convex.

Built on the Horizon realtime-swarm shell (React Three Fiber 3D scene + React Flow board + Convex reactive spine), repurposed from content-discovery to B2B GTM signal detection.

## What's real vs. synthetic (honesty section)

- **Live & real (when keys are set):** the Convex pipeline (detect → enrich → score → act), the reactive lineage board, the convergence/abstention scoring logic (`convex/lib/convergence.ts`, unit-tested), and the data-provider calls (Orange Slice + Fiber) once `ORANGESLICE_API_KEY` / `FIBER_API_KEY` are present.
- **Fixture mode (default, no keys):** the data legs return **labeled synthetic fixtures** (`convex/providers/fixtures.ts`, every object tagged `__synthetic: true`). The provider switch is env-based — set a key and the same code path goes live with **no code change**.
- **Not claimed:** there is no "Laminar self-healing / LLM-trace monitoring" and no auto-publish. The approval gate blocks every external send until a human approves.

## Architecture

Convex is load-bearing — remove it and the app stops working:

- **DETECT:** `convex/crons.ts` (interval poll of seeded domains) + `convex/http.ts` (`POST /signal` webhook) both funnel into one entry point, `detect.recordSignal` (dedup via `lib/idempotency`).
- **ENRICH:** `convex/providers/{orangeSlice,fiber}.ts` actions, cache-first via `convex/providers/cache.ts` (`apiCache` table) for credit-safety + demo determinism.
- **SCORE:** `convex/score.ts` builds the legs → pure `decide()` (convergence + abstention) → optional OpenAI rationale enrich → `scores` table.
- **ACT:** `convex/act.ts` proposes a Slack/CRM action (`pending`); a human `approve`/`block`s it; only `approve` sends.
- **UI:** reactive queries (`convex/queries/*`) drive the React Flow lineage board (the hero, with per-leg provenance + `AbstainCard`) and the 3D source-swarm flourish.

## Data providers

- **Orange Slice** (`orangeslice` npm) — the spine: Crunchbase funding discovery, PredictLeads hiring/tech signals, BuiltWith tech, Slack/CRM connectors for the ACT.
- **Fiber AI** (REST) — a named best-of-breed accent: fast contact reveal + live-LinkedIn enrich (kept off the live demo path).

## Run it

```bash
cd horizon
npm install
npx convex dev            # interactive: provisions a deployment + regenerates convex/_generated
# set provider secrets on the deployment (optional — fixture mode works without them):
npx convex env set ORANGESLICE_API_KEY <key>
npx convex env set FIBER_API_KEY <key>
npx convex env set OPENAI_API_KEY <key>
npm run dev               # Next.js app
npm test                  # pure-logic vitest suite (convex/lib)
```

Trigger a detection live:

```bash
curl -XPOST "$CONVEX_SITE_URL/signal" \
  -H 'Content-Type: application/json' \
  -d '{"source":"manual","kind":"manual","companyDomain":"stripe.com"}'
```

## Status

Pipeline, providers (fixture + live-ready), scoring, queries, and UI are implemented and the pure-logic suite passes (10/10). Full typecheck/deploy requires `npx convex dev` (regenerates `_generated`) and, for live data, the provider API keys. See `../fusion/PRODUCTION-DESIGN.md`, `../fusion/EVALUATION-AND-V2.md`, and `../docs/plans/2026-06-28-beachhead.md`.
