// DB-layer trace writer for provider actions. Lives outside the "use node"
// orangeSlice module so that module may export only actions (a "use node" file
// may not export query/mutation). Called via ctx.runMutation(internal...).

import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// Write a single `traces` row. Called from provider actions via runMutation.
export const writeTrace = internalMutation({
  args: {
    runId: v.id("runs"),
    stage: v.string(),
    level: v.union(v.literal("info"), v.literal("warn"), v.literal("error")),
    message: v.string(),
    durationMs: v.optional(v.number()),
  },
  handler: async (ctx, { runId, stage, level, message, durationMs }) => {
    await ctx.db.insert("traces", {
      runId,
      stage,
      level,
      message,
      durationMs,
      at: Date.now(),
    });
  },
});
