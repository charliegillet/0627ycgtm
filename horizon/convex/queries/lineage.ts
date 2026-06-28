import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * scoresByCompany — full score history for a company (newest first), for the
 * lineage / drill-down view.
 */
export const scoresByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query("scores")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
    return scores;
  },
});

/**
 * tracesByRun — ordered trace timeline for a single pipeline run.
 */
export const tracesByRun = query({
  args: { runId: v.id("runs") },
  handler: async (ctx, args) => {
    const traces = await ctx.db
      .query("traces")
      .withIndex("by_run", (q) => q.eq("runId", args.runId))
      .order("asc")
      .collect();
    return traces;
  },
});
