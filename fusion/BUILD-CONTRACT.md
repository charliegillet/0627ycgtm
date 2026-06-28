# BEACHHEAD BUILD CONTRACT (authoritative interface — all builders MUST conform)

Working dir for ALL paths below: `/Users/nihalnihalani/Desktop/Github/0627ycgtm/horizon`
Repo branch: `beachhead`. Build by ADAPTING the existing Next 16 + Convex app in place.
No real API keys exist yet → data legs run in **FIXTURE MODE** behind the real interface. Do NOT run `npx convex dev`/codegen or `git commit` (the lead does integration). Use `v.optional` for all NEW schema fields so the deployment migrates cleanly.

## Convex tables (extend existing `convex/schema.ts`; KEEP agents/signals/logs/control)
- `companies`: domain(string), name(string), industry?(string), employeeCount?(number), enrichment?(any), icpFit?(number) — index `by_domain` ["domain"]
- `leads`: companyId(id"companies"), fullName(string), title?(string), email?(string), linkedin?(string), score?(number), stage(union: "detected"|"enriching"|"scored"|"acting"|"done"|"dead") — index `by_company` ["companyId"], `by_stage` ["stage"]
- `signalEvents`: source(string), kind(string), companyDomain?(string), companyId?(id"companies"), payload(any), strength?(number), processed(boolean), detectedAt(number) — index `by_processed` ["processed","detectedAt"], `by_dedupe` ["source","companyDomain","kind"]
- `scores`: leadId?(id"leads"), companyId(id"companies"), score(number), rubric(any), rationale(string), confidence(number), abstained(boolean), legs(any), createdAt(number) — index `by_company` ["companyId"]
- `actions`: leadId?(id"leads"), companyId(id"companies"), type(union: "slack"|"crm"|"email_draft"), status(union: "pending"|"approved"|"blocked"|"sent"|"failed"), body?(string), createdAt(number) — index `by_status` ["status"], `by_company` ["companyId"]
- `runs`: companyId?(id"companies"), stage(string), status(union: "running"|"succeeded"|"failed"), startedAt(number), finishedAt?(number) — index `by_status` ["status"]
- `traces`: runId(id"runs"), stage(string), agentId?(number), level(union:"info"|"warn"|"error"), message(string), durationMs?(number), at(number) — index `by_run` ["runId"]
- `apiCache`: provider(string), op(string), key(string), response(any), fetchedAt(number) — index `by_key` ["provider","op","key"]

## Pure logic (no Convex imports — unit-tested with vitest)
`convex/lib/convergence.ts`:
```ts
export type Leg = { ageDays?: number; count?: number; present?: boolean } | null;
export type Legs = { funding: Leg; hiring: Leg; tech: Leg };
export type Decision = { score: number; confidence: number; abstained: boolean;
  rationale: string; rubric: { legsFired: number; perLeg: Record<string, number> } };
export function decide(legs: Legs): Decision;
// Rule: legsFired = count of non-null legs. Weight funding(recency<=90d), hiring(count>=3), tech(present).
// score 0-100. ABSTAIN (abstained:true, score<=40) when legsFired < 2 OR confidence < 0.5.
// rationale must mention "1/3" / "insufficient" when abstaining on a single leg.
```
`convex/lib/idempotency.ts`:
```ts
export function signalKey(a: { source: string; companyDomain?: string; kind: string; at: number }): string;
// deterministic; bucket `at` by UTC day so same-day same-signal => equal key.
```

## Provider interface (fixture mode now; real calls when keys land)
`convex/providers/cache.ts`: `cacheGet(ctx, provider, op, key)` / `cachePut(ctx, provider, op, key, response)` over `apiCache` via ctx.runQuery/runMutation. Cache-first wrapper `withCache(ctx, {provider,op,key}, fetcher)`.
`convex/providers/fixtures.ts`: exported seeded fixtures keyed by domain — funding/hiring/tech leg shapes matching `Legs`, clearly labeled `__synthetic: true`.
`convex/providers/orangeSlice.ts`: `internalAction callOrangeSlice({ op: "funding"|"hiring"|"tech", domain })` → if `process.env.ORANGESLICE_API_KEY` set, real call; else return fixture. Always cache + write a `traces` row.
`convex/providers/fiber.ts`: `internalAction callFiber({ op: "reveal"|"liveLinkedin", ref })` → fixture unless `FIBER_API_KEY` set. Reveal is OFF the live path.

## Pipeline (convex actions/mutations)
`convex/detect.ts`:
- `recordSignal` internalMutation({source,companyDomain,kind,payload?}) → dedupe by `signalKey` against `by_dedupe`; insert `signalEvents`; insert a `runs` row (status "running"); `ctx.scheduler.runAfter(0, internal.detect.runPipeline, {companyDomain, runId})`; bridge a viz `signals` + `logs` row (call internal.mutations.bridge.bridgeSignal).
- `poll` internalAction (cron target) → re-detect seeded domains via recordSignal.
- `runPipeline` internalAction({companyDomain, runId}) → call the 3 OS legs in parallel (Promise.all of callOrangeSlice), upsert `companies`+`leads` (by_domain), then ctx.runAction(internal.score.scoreCompany,{companyId,runId}); write traces per stage.
`convex/score.ts`: `scoreCompany` internalAction({companyId,runId}) → build Legs from cached/persisted legs → `decide()` → (if OPENAI_API_KEY) enrich rationale via ai.generateObject, else use decide().rationale → `recordScore` internalMutation into `scores`; set lead.stage="scored"; if !abstained, ctx.runMutation(internal.act.proposeAction,...).
`convex/act.ts`: `proposeAction` internalMutation({companyId,type:"slack"}) → idempotency: skip if non-failed action exists for companyId+type; insert `actions` status "pending". `approve`/`block` public mutations({actionId}) → flip status; on approve schedule `sendSlack` internalAction (real send only if SLACK creds, else mark "sent" with synthetic note).
`convex/crons.ts`: `crons.interval("poll",{minutes:2}, internal.detect.poll, {})`.
`convex/http.ts`: `httpRouter`; `POST /signal` httpAction → internal.detect.recordSignal.
`convex/mutations/bridge.ts`: `bridgeSignal` internalMutation → insert viz `signals` (fromAgent/toAgent/message/signalType/timestamp) + `logs` row so the 3D scene lights up.

## Reactive queries (public)
`convex/queries/board.ts`: `liveBoard` query() → running runs + scored companies (join companies+latest score). `leadsPage` query({paginationOpts}) paginated leads.
`convex/queries/lineage.ts`: `scoresByCompany` query({companyId}) ; `tracesByRun` query({runId}).
`convex/queries/health.ts`: `checkEnv` query() → {orangeSlice:boolean, fiber:boolean, openai:boolean} from process.env presence (NOTE: env presence must be read in an action, not a query — expose `checkEnv` as an internalAction + a small public wrapper, OR store a health row; pick the working pattern).

## UI (adapt existing components in `app/`)
- `app/page.tsx`: rebind from missions/discoveries to `api.queries.board.liveBoard`; keep ResizablePane split (board left, 3D right) + CommandOverlay.
- Board (hero): adapt `app/components/ContentWhiteboard.tsx` + `ContentNode.tsx` → LeadNode (company, score, per-leg badges, click→lineage). Add `app/components/AbstainCard.tsx` (first-class "1/3 legs — not routing"). Strip platform logic in ContentNode.tsx:21-38.
- 3D (flourish): re-skin `HorizonScene`/`AgentPlane`/`useAgentData` labels to signal sources/accounts; keep live-iframe pattern. Time-boxed.
- CommandOverlay: copy "mission"→"ICP / paste a domain"; activity feed from traces/logs.

## Conventions
TypeScript strict. Convex validators with `v`. Public fns `query/mutation`, internal `internalQuery/internalMutation/internalAction`. Actions never touch ctx.db (use ctx.runQuery/runMutation). External calls only in actions. Label all synthetic data. No emojis in code.
