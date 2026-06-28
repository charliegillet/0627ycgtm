import { v } from "convex/values";
import { action, query } from "../_generated/server";

/**
 * checkEnv — reports which provider integrations are live (real keys present)
 * vs. running in fixture mode.
 *
 * Convex constraint: process.env is reliably available inside the action
 * runtime. We expose this as a PUBLIC ACTION (not a query) so the client can
 * call it directly for a health badge. It is non-reactive — call it on mount /
 * on demand rather than subscribing. (A reactive variant would require an
 * internalAction writing a stored health row that a query reads; the direct
 * public action is simpler and sufficient for the demo.)
 */
export const checkEnv = action({
  args: {},
  handler: async () => {
    return {
      orangeSlice: Boolean(process.env.ORANGESLICE_API_KEY),
      fiber: Boolean(process.env.FIBER_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      slack: Boolean(
        process.env.SLACK_WEBHOOK_URL || process.env.SLACK_BOT_TOKEN
      ),
    };
  },
});

/**
 * pipelineStats — reactive pipeline health for the command overlay:
 * runs in flight / failed, and routed vs abstained accounts (latest score each).
 */
export const pipelineStats = query({
  args: {},
  handler: async (ctx) => {
    const runs = await ctx.db.query("runs").collect();
    const recentScores = await ctx.db.query("scores").order("desc").take(500);
    const seen = new Set<string>();
    let routed = 0;
    let abstained = 0;
    for (const s of recentScores) {
      const key = s.companyId as unknown as string;
      if (seen.has(key)) continue;
      seen.add(key);
      if (s.abstained) abstained++;
      else routed++;
    }
    return {
      running: runs.filter((r) => r.status === "running").length,
      failed: runs.filter((r) => r.status === "failed").length,
      succeeded: runs.filter((r) => r.status === "succeeded").length,
      routed,
      abstained,
    };
  },
});

/**
 * failedRuns — reactive list of recent runs that ended in "failed", newest
 * first, for an at-a-glance health view. Bounded so the subscription stays
 * cheap; `limit` caps the number returned (default 50).
 */
export const failedRuns = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("runs")
      .withIndex("by_status", (q) => q.eq("status", "failed"))
      .order("desc")
      .take(limit ?? 50);
  },
});

/**
 * stuckRuns — reactive list of runs still "running" whose `startedAt` is older
 * than `thresholdMs` (default 5 minutes), i.e. likely wedged. Returned
 * newest-first. No schema change: we read the by_status index for "running"
 * and filter on startedAt.
 */
export const stuckRuns = query({
  args: { thresholdMs: v.optional(v.number()) },
  handler: async (ctx, { thresholdMs }) => {
    const cutoff = Date.now() - (thresholdMs ?? 5 * 60 * 1000);
    return await ctx.db
      .query("runs")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .order("desc")
      .filter((q) => q.lt(q.field("startedAt"), cutoff))
      .collect();
  },
});
