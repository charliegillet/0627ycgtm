import { internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

// Audit #2 (surface reduction): only getRecentLogs is client-called
// (app/page.tsx). addLog / clearLogs / getLogsByAgent had no app/ or
// internal.* / api.* caller in convex/ (the BEACHHEAD pipeline writes via
// internal.mutations.bridge, not addLog) and were reachable only by the stale,
// unused legacy Python (finding #13, left alone). They are demoted to internal
// so they are no longer part of the public API.

/**
 * Add a log entry for an agent
 */
export const addLog = internalMutation({
  args: {
    agent_id: v.number(),
    message: v.string(),
    type: v.union(
      v.literal("search"),
      v.literal("analysis"),
      v.literal("likes"),
      v.literal("discovery"),
      v.literal("energy_gain"),
      v.literal("energy_loss"),
      v.literal("task_swap"),
      v.literal("status"),
      v.literal("error")
    ),
    timestamp: v.number(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("logs", {
      agent_id: args.agent_id,
      message: args.message,
      type: args.type,
      timestamp: args.timestamp,
      metadata: args.metadata,
    });
  },
});

/**
 * Get recent logs (latest 100, sorted by timestamp descending)
 */
export const getRecentLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    
    const logs = await ctx.db
      .query("logs")
      .order("desc")
      .take(limit);
    
    return logs;
  },
});

/**
 * Get logs for a specific agent
 */
export const getLogsByAgent = internalQuery({
  args: {
    agent_id: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const logs = await ctx.db
      .query("logs")
      .withIndex("by_agent_id", (q) => q.eq("agent_id", args.agent_id))
      .order("desc")
      .take(limit);
    
    return logs;
  },
});

/**
 * Clear all logs (for testing/cleanup)
 */
export const clearLogs = internalMutation({
  handler: async (ctx) => {
    const logs = await ctx.db.query("logs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
    return { deleted: logs.length };
  },
});
