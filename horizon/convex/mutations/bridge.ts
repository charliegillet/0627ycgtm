import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

/**
 * bridgeSignal — fans a GTM pipeline event into the existing viz tables so the
 * 3D scene lights up. Inserts a `signals` row (orb) from the blackboard center
 * to a pseudo-random agent plus a `logs` row in the activity feed.
 *
 * Matches the existing shapes:
 *   signals: { fromAgent, toAgent, message, signalType, timestamp }
 *   logs:    { agent_id, message, type, timestamp, metadata? }
 */
export const bridgeSignal = internalMutation({
  args: {
    message: v.string(),
    signalType: v.string(),
    // Optional explicit target plane; otherwise we pick one of 9.
    toAgent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const toAgent =
      args.toAgent ?? 1 + Math.floor(Math.random() * 9); // agents 1..9

    await ctx.db.insert("signals", {
      fromAgent: 0, // 0 = blackboard center
      toAgent,
      message: args.message,
      signalType: args.signalType,
      timestamp: now,
    });

    // The logs table uses a constrained `type` union; map GTM signal types onto
    // the closest existing visual category.
    await ctx.db.insert("logs", {
      agent_id: toAgent,
      message: args.message,
      type: mapLogType(args.signalType),
      timestamp: now,
      metadata: JSON.stringify({ signalType: args.signalType, __synthetic: true }),
    });
  },
});

type LogType =
  | "search"
  | "analysis"
  | "likes"
  | "discovery"
  | "energy_gain"
  | "energy_loss"
  | "task_swap"
  | "status"
  | "error";

function mapLogType(signalType: string): LogType {
  switch (signalType) {
    case "detect":
      return "search";
    case "score":
      return "discovery";
    case "abstain":
      return "status";
    case "act":
      return "task_swap";
    default:
      return "analysis";
  }
}
