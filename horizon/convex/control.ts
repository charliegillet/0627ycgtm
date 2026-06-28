import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";

// Audit #2 (surface reduction): only sendCommand is client-called (the app's
// "stop_all" button in app/page.tsx). getPendingCommands and the four status
// mutations had no app/ or internal.* / api.* caller in convex/ and were
// reachable only by the stale, unused legacy Python (finding #13, left alone),
// so they are demoted to internal. sendCommand stays public because the app
// genuinely calls it.

/**
 * Send a control command (like stop_all)
 *
 * AUTH-TODO: this is genuinely client-called (app/page.tsx "stop_all" button)
 * so it must remain a public mutation, but it currently has no auth: any
 * unauthenticated client can issue stop_all/restart/pause. Adding auth is
 * deferred to the later security PR (same deferral as act.ts / cleanup.ts) to
 * avoid conflicting with the parallel PR #1.
 */
export const sendCommand = mutation({
  args: {
    command: v.union(
      v.literal("stop_all"),
      v.literal("restart"),
      v.literal("pause")
    ),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const commandId = await ctx.db.insert("control", {
      command: args.command,
      status: "pending",
      timestamp: Date.now(),
      metadata: args.metadata,
    });
    
    return commandId;
  },
});

/**
 * Get pending commands (for orchestrator to process)
 */
export const getPendingCommands = internalQuery({
  args: {},
  handler: async (ctx) => {
    const commands = await ctx.db
      .query("control")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("asc")
      .collect();
    
    return commands;
  },
});

/**
 * Mark a command as processing
 */
export const markCommandProcessing = internalMutation({
  args: {
    commandId: v.id("control"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commandId, {
      status: "processing",
    });
  },
});

/**
 * Update command status (generic)
 */
export const updateCommandStatus = internalMutation({
  args: {
    commandId: v.id("control"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commandId, {
      status: args.status,
    });
  },
});

/**
 * Mark a command as completed
 */
export const markCommandCompleted = internalMutation({
  args: {
    commandId: v.id("control"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commandId, {
      status: "completed",
    });
  },
});

/**
 * Clear all completed commands (cleanup)
 */
export const clearCompletedCommands = internalMutation({
  args: {},
  handler: async (ctx) => {
    const completed = await ctx.db
      .query("control")
      .withIndex("by_status", (q) => q.eq("status", "completed"))
      .collect();
    
    for (const cmd of completed) {
      await ctx.db.delete(cmd._id);
    }
    
    return completed.length;
  },
});
