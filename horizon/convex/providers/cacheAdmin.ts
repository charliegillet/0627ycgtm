// One-shot cache maintenance for the provider cache.
//
// Pre-fix, `withCache` cached the synthetic fixture produced inside the
// live-failure catch branch. Those poisoned rows would be served on later reads
// as a cache HIT (skipping the try/catch), resurfacing the fixture. Post-fix we
// never cache synthetics, but the already-poisoned rows must be purged so a
// re-fired domain re-attempts the live call. This mutation deletes every
// apiCache row whose stored response carries `__synthetic`.

import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

function isSynthetic(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as Record<string, unknown>).__synthetic,
  );
}

// Delete poisoned (synthetic) apiCache rows. Optionally scope to one provider.
// Returns the number of rows removed plus the keys removed (for verification).
export const purgeSyntheticCache = internalMutation({
  args: { provider: v.optional(v.string()) },
  handler: async (ctx, { provider }) => {
    const rows = await ctx.db.query("apiCache").collect();
    const removed: Array<{ provider: string; op: string; key: string }> = [];
    for (const row of rows) {
      if (provider && row.provider !== provider) continue;
      if (isSynthetic(row.response)) {
        await ctx.db.delete(row._id);
        removed.push({ provider: row.provider, op: row.op, key: row.key });
      }
    }
    return { removed: removed.length, keys: removed };
  },
});
