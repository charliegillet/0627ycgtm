import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Audit #2 (surface reduction): only getRecentSignals is client-called
// (app/page.tsx). createSignal / broadcastSignal / cleanupOldSignals had no
// app/ or internal.* / api.* caller in convex/ (the BEACHHEAD pipeline writes
// via internal.mutations.bridge.bridgeSignal, not these) and were reachable
// only by the stale, unused legacy Python (finding #13, left alone). They are
// demoted to internalMutation so they are no longer part of the public API.

/**
 * Create a signal (orb) from agent to center or center to agent
 */
export const createSignal = internalMutation({
  args: {
    fromAgent: v.number(),
    toAgent: v.number(),
    message: v.string(),
    signalType: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("signals", {
      fromAgent: args.fromAgent,
      toAgent: args.toAgent,
      message: args.message,
      signalType: args.signalType,
      timestamp: args.timestamp,
    });
  },
});

/**
 * Create a broadcast signal - from center to all agents
 * Used when a discovery is made and needs to be shared
 */
export const broadcastSignal = internalMutation({
  args: {
    fromAgent: v.number(),
    message: v.string(),
    signalType: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    // Create signals from center (0) to all 9 agents
    const signalIds = [];
    for (let i = 1; i <= 9; i++) {
      const id = await ctx.db.insert("signals", {
        fromAgent: 0, // 0 = center/blackboard
        toAgent: i,
        message: args.message,
        signalType: args.signalType,
        timestamp: args.timestamp,
      });
      signalIds.push(id);
    }
    return signalIds;
  },
});

/**
 * Get recent signals (for orb animation)
 */
export const getRecentSignals = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const signals = await ctx.db
      .query("signals")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
    
    return signals;
  },
});

/**
 * Clear old signals (cleanup - keep only last 5 minutes)
 */
export const cleanupOldSignals = internalMutation({
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const oldSignals = await ctx.db
      .query("signals")
      .withIndex("by_timestamp")
      .filter((q) => q.lt(q.field("timestamp"), fiveMinutesAgo))
      .collect();
    
    for (const signal of oldSignals) {
      await ctx.db.delete(signal._id);
    }
    
    return { deleted: oldSignals.length };
  },
});
