// Table-based fixed-window rate limiter over the `rateLimits` table.
//
// Deliberately NOT using `@convex-dev/rate-limiter`: that component needs
// deployment-side registration we cannot verify locally (codegen / convex dev
// connect to the live shared deployment, which is forbidden here). A plain
// table counter is fully deterministic under `vi.useFakeTimers()` and needs no
// component wiring.
//
// `http.ts` keys this on the normalized companyDomain so a single noisy domain
// cannot flood the intake.

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

/**
 * Fixed-window counter. For a given `key`, allows up to `limit` calls per
 * `windowMs`. When the window has elapsed (or no row exists) the window resets
 * to a fresh count of 1.
 *
 * Defaults: limit = 30, windowMs = 60_000 (30 requests / minute).
 * Returns `{ allowed, remaining }`.
 */
export const take = internalMutation({
  args: {
    key: v.string(),
    limit: v.optional(v.number()),
    windowMs: v.optional(v.number()),
  },
  handler: async (ctx, { key, limit = 30, windowMs = 60_000 }) => {
    const now = Date.now();
    const row = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();

    // Fresh window: no row yet, or the existing window has fully elapsed.
    if (row === null || now - row.windowStart >= windowMs) {
      if (row === null) {
        await ctx.db.insert("rateLimits", { key, count: 1, windowStart: now });
      } else {
        await ctx.db.patch(row._id, { count: 1, windowStart: now });
      }
      return { allowed: true, remaining: limit - 1 };
    }

    // Within the window and under the limit: increment.
    if (row.count < limit) {
      const count = row.count + 1;
      await ctx.db.patch(row._id, { count });
      return { allowed: true, remaining: limit - count };
    }

    // Within the window and at/over the limit: reject.
    return { allowed: false, remaining: 0 };
  },
});
