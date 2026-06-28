// One-shot maintenance for the `traces` table.
//
// Pre-fix, a cache HIT on a poisoned synthetic row short-circuited the
// orangeSlice try/catch, so the leg got labeled `(live)` while its value still
// carried `__synthetic` (a self-contradicting trace: "live" plus synthetic). The
// code fix stops producing these, but the append-only traces table still holds
// the historical mislabeled rows. This mutation removes any trace whose message
// claims `(live)` yet contains `__synthetic`, so the timeline no longer
// misrepresents fixture data as live.

import { internalMutation } from "../_generated/server";

export const purgeMislabeledLiveTraces = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("traces").collect();
    const removed: string[] = [];
    for (const row of rows) {
      const msg = row.message ?? "";
      if (msg.includes("(live)") && msg.includes("__synthetic")) {
        await ctx.db.delete(row._id);
        removed.push(msg);
      }
    }
    return { removed: removed.length, messages: removed };
  },
});
