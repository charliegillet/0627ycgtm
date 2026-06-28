// Provider router — per-leg routing so the convergence legs are swappable
// without touching the pipeline. OrangeSlice is the spine (funding/hiring/tech);
// Fiber is the enrich accent (reveal/live-LinkedIn), not a convergence leg.
// To re-route a leg to another provider, edit LEG_ROUTING only.

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Leg } from "../lib/convergence";

export type ConvergenceLeg = "funding" | "hiring" | "tech";

export const LEG_ROUTING: Record<ConvergenceLeg, "orangeSlice" | "fiber"> = {
  funding: "orangeSlice",
  hiring: "orangeSlice",
  tech: "orangeSlice",
};

export const callLeg = internalAction({
  args: {
    leg: v.union(v.literal("funding"), v.literal("hiring"), v.literal("tech")),
    domain: v.string(),
    runId: v.id("runs"),
  },
  handler: async (ctx, args): Promise<Leg> => {
    // Fiber does not implement the convergence legs today, so every leg resolves
    // to OrangeSlice. The indirection keeps the routing decision in one place.
    return await ctx.runAction(
      internal.providers.orangeSlice.callOrangeSlice,
      { op: args.leg, domain: args.domain, runId: args.runId }
    );
  },
});
