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

// Read a cached response by (provider, op, key). Returns null on a miss.
export const getCached = internalQuery({
  args: { provider: v.string(), op: v.string(), key: v.string() },
  handler: async (ctx, { provider, op, key }) => {
    const row = await ctx.db
      .query("apiCache")
      .withIndex("by_key", (q) =>
        q.eq("provider", provider).eq("op", op).eq("key", key),
      )
      .unique();
    return row?.response ?? null;
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

// Action-side cache read. Returns the cached response or null.
export async function cacheGet(
  ctx: ActionCtx,
  provider: string,
  op: string,
  key: string,
): Promise<unknown> {
  return await ctx.runQuery(internal.providers.cache.getCached, {
    provider,
    op,
    key,
  });
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
export async function withCache<T>(
  ctx: ActionCtx,
  ref: CacheRef,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await cacheGet(ctx, ref.provider, ref.op, ref.key);
  if (cached !== null && cached !== undefined) {
    return cached as T;
  }
  const fresh = await fetcher();
  await cachePut(ctx, ref.provider, ref.op, ref.key, fresh);
  return fresh;
}
