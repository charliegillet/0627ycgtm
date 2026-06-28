// API response cache over the `apiCache` table.
//
// Actions cannot touch ctx.db directly, so the cache is split in two layers:
//   - internalQuery `getCached` / internalMutation `putCached` do the db work.
//   - cacheGet / cachePut / withCache are action-side helpers that call those
//     via ctx.runQuery / ctx.runMutation.
//
// `withCache` is cache-first: it returns a cached response when present,
// otherwise runs the fetcher and writes the result back.

import { v } from "convex/values";
import { internalQuery, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import type { ActionCtx } from "../_generated/server";

// ----- db layer (runs inside Convex, may touch ctx.db) -----------------------

// Read a cached response by (provider, op, key).
//
// Presence-based (audit #8): we report `hit` from whether a ROW exists, not
// from whether the stored value is non-null. A real live `null` (e.g.
// orangeSlice returning null for a funding leg with no Crunchbase row) is a
// legitimate cached value; the old `row?.response ?? null` collapsed "no row"
// and "row holding null" into the same null, so a cached null was treated as a
// miss and re-fetched every call. `response` is `null` on a miss (no row) and
// the stored value (possibly null) on a hit.
export const getCached = internalQuery({
  args: { provider: v.string(), op: v.string(), key: v.string() },
  handler: async (ctx, { provider, op, key }) => {
    const row = await ctx.db
      .query("apiCache")
      .withIndex("by_key", (q) =>
        q.eq("provider", provider).eq("op", op).eq("key", key),
      )
      .unique();
    return { hit: row !== null, response: row?.response ?? null };
  },
});

// Upsert a cached response, refreshing fetchedAt. Idempotent per key.
export const putCached = internalMutation({
  args: {
    provider: v.string(),
    op: v.string(),
    key: v.string(),
    response: v.any(),
  },
  handler: async (ctx, { provider, op, key, response }) => {
    const existing = await ctx.db
      .query("apiCache")
      .withIndex("by_key", (q) =>
        q.eq("provider", provider).eq("op", op).eq("key", key),
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { response, fetchedAt: Date.now() });
      return existing._id;
    }
    return await ctx.db.insert("apiCache", {
      provider,
      op,
      key,
      response,
      fetchedAt: Date.now(),
    });
  },
});

// ----- action layer (no ctx.db; goes through runQuery / runMutation) ---------

export type CacheRef = { provider: string; op: string; key: string };

// Action-side cache read. Returns `{ hit, value }`: `hit` is true when a row
// exists for the key (even if the stored value is null); `value` is the stored
// value (possibly null) on a hit, or null on a miss.
export async function cacheGet(
  ctx: ActionCtx,
  provider: string,
  op: string,
  key: string,
): Promise<{ hit: boolean; value: unknown }> {
  const { hit, response } = await ctx.runQuery(
    internal.providers.cache.getCached,
    { provider, op, key },
  );
  return { hit, value: response };
}

// Action-side cache write.
export async function cachePut(
  ctx: ActionCtx,
  provider: string,
  op: string,
  key: string,
  response: unknown,
): Promise<void> {
  await ctx.runMutation(internal.providers.cache.putCached, {
    provider,
    op,
    key,
    response,
  });
}

// Cache-first wrapper: returns the cached response when present, otherwise runs
// `fetcher`, caches its result, and returns it.
//
// `shouldCache` gates the write so callers can refuse to persist results that
// must never be replayed (e.g. a synthetic fixture written on a live failure:
// caching it would let a later cache HIT short-circuit the try/catch and
// resurface the fixture mislabeled as a clean "live" success). Default: cache
// everything (back-compat for callers that only ever return live data).
export async function withCache<T>(
  ctx: ActionCtx,
  ref: CacheRef,
  fetcher: () => Promise<T>,
  shouldCache: (value: T) => boolean = () => true,
): Promise<T> {
  return (await withCacheStatus(ctx, ref, fetcher, shouldCache)).value;
}

// Like `withCache` but also reports whether the value came from the cache. The
// caller needs this so it can label a trace honestly: a value SERVED from cache
// never ran the fetcher's try/catch, so its mode/level must be derived from the
// value itself (and the hit flag), not from optimistic defaults.
export async function withCacheStatus<T>(
  ctx: ActionCtx,
  ref: CacheRef,
  fetcher: () => Promise<T>,
  shouldCache: (value: T) => boolean = () => true,
): Promise<{ value: T; cacheHit: boolean }> {
  const { hit, value } = await cacheGet(ctx, ref.provider, ref.op, ref.key);
  if (hit) {
    return { value: value as T, cacheHit: true };
  }
  const fresh = await fetcher();
  if (shouldCache(fresh)) {
    await cachePut(ctx, ref.provider, ref.op, ref.key, fresh);
  }
  return { value: fresh, cacheHit: false };
}
