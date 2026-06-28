/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as act from "../act.js";
import type * as agents from "../agents.js";
import type * as cleanup from "../cleanup.js";
import type * as control from "../control.js";
import type * as crons from "../crons.js";
import type * as detect from "../detect.js";
import type * as discoveries from "../discoveries.js";
import type * as http from "../http.js";
import type * as lib_convergence from "../lib/convergence.js";
import type * as lib_idempotency from "../lib/idempotency.js";
import type * as logs from "../logs.js";
import type * as missions from "../missions.js";
import type * as mutations_bridge from "../mutations/bridge.js";
import type * as pipeline from "../pipeline.js";
import type * as providers_cache from "../providers/cache.js";
import type * as providers_fiber from "../providers/fiber.js";
import type * as providers_fixtures from "../providers/fixtures.js";
import type * as providers_orangeSlice from "../providers/orangeSlice.js";
import type * as providers_router from "../providers/router.js";
import type * as queries_board from "../queries/board.js";
import type * as queries_health from "../queries/health.js";
import type * as queries_lineage from "../queries/lineage.js";
import type * as score from "../score.js";
import type * as signals from "../signals.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  act: typeof act;
  agents: typeof agents;
  cleanup: typeof cleanup;
  control: typeof control;
  crons: typeof crons;
  detect: typeof detect;
  discoveries: typeof discoveries;
  http: typeof http;
  "lib/convergence": typeof lib_convergence;
  "lib/idempotency": typeof lib_idempotency;
  logs: typeof logs;
  missions: typeof missions;
  "mutations/bridge": typeof mutations_bridge;
  pipeline: typeof pipeline;
  "providers/cache": typeof providers_cache;
  "providers/fiber": typeof providers_fiber;
  "providers/fixtures": typeof providers_fixtures;
  "providers/orangeSlice": typeof providers_orangeSlice;
  "providers/router": typeof providers_router;
  "queries/board": typeof queries_board;
  "queries/health": typeof queries_health;
  "queries/lineage": typeof queries_lineage;
  score: typeof score;
  signals: typeof signals;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workflow: import("@convex-dev/workflow/_generated/component.js").ComponentApi<"workflow">;
};
