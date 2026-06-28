// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import type { ActionCtx } from "./_generated/server";
import { withCacheStatus } from "./providers/cache";

// NOTE: located at the convex root (not convex/providers/) on purpose. A
// convex-test glob rooted in a subdirectory cannot re-include its own parent
// tree through a `../` round-trip (vite normalizes the path and drops the
// providers/ entries), so convex-test then fails to resolve "providers/cache".
// Globbing "./**/*.*s" from the convex root is the proven pattern used by
// pipeline.integration.test.ts. We import withCacheStatus from ./providers/cache.
const modules = import.meta.glob([
  "./**/*.*s",
  "!./**/*.test.ts",
  "!./**/*.integration.test.ts",
]);

// Fails-if-reverted (B3, audit #8): the old code returned `row?.response ?? null`
// and treated null as a miss, so a cached real null was re-fetched every call.
// The "cached null = hit" case below would then see n===2 (refetched) and
// r2.cacheHit===false, failing. The synthetic case guards that we did not
// weaken the shouldCache gate.

// Mock action ctx that delegates run* to the test db.
function actionCtx(t: ReturnType<typeof convexTest>): ActionCtx {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runQuery: (ref: any, a: any) => t.query(ref, a),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    runMutation: (ref: any, a: any) => t.mutation(ref, a),
  } as unknown as ActionCtx;
}

describe("withCacheStatus null handling (B3)", () => {
  it("treats a cached real null as a HIT (does not re-fetch)", async () => {
    const t = convexTest(schema, modules);
    const ctx = actionCtx(t);
    let n = 0;
    const f = async () => {
      n++;
      return null;
    };
    const ref = { provider: "p", op: "o", key: "k" };

    const r1 = await withCacheStatus(ctx, ref, f);
    expect(r1.cacheHit).toBe(false);
    expect(r1.value).toBe(null);

    const r2 = await withCacheStatus(ctx, ref, f);
    expect(r2.cacheHit).toBe(true);
    expect(r2.value).toBe(null);

    // The fetcher ran exactly once: the second call was served from cache.
    expect(n).toBe(1);
  });

  it("never caches a synthetic fixture (shouldCache gate preserved)", async () => {
    const t = convexTest(schema, modules);
    const ctx = actionCtx(t);
    let m = 0;
    const sf = async () => {
      m++;
      return { __synthetic: true };
    };
    const shouldCache = (v: unknown) =>
      !(v && typeof v === "object" && (v as Record<string, unknown>).__synthetic);
    const ref = { provider: "p", op: "o", key: "syn" };

    const r1 = await withCacheStatus(ctx, ref, sf, shouldCache);
    const r2 = await withCacheStatus(ctx, ref, sf, shouldCache);
    expect(r1.cacheHit).toBe(false);
    expect(r2.cacheHit).toBe(false);
    // Synthetic was never written, so it is re-fetched both times.
    expect(m).toBe(2);

    // No apiCache row holds a synthetic payload.
    const rows = await t.run((c) => c.db.query("apiCache").collect());
    const poisoned = rows.filter(
      (r) =>
        r.response &&
        typeof r.response === "object" &&
        (r.response as Record<string, unknown>).__synthetic,
    );
    expect(poisoned).toHaveLength(0);
  });

  it("caches and re-serves a real non-null value", async () => {
    const t = convexTest(schema, modules);
    const ctx = actionCtx(t);
    let n = 0;
    const f = async () => {
      n++;
      return { present: true, count: 3 };
    };
    const ref = { provider: "p", op: "o", key: "real" };

    const r1 = await withCacheStatus(ctx, ref, f);
    const r2 = await withCacheStatus(ctx, ref, f);
    expect(r1.cacheHit).toBe(false);
    expect(r2.cacheHit).toBe(true);
    expect(r2.value).toEqual({ present: true, count: 3 });
    expect(n).toBe(1);
  });
});
