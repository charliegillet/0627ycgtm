import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { decide, type Legs } from "./lib/convergence";

/**
 * scoreCompany — pulls the persisted legs off the company, runs the pure
 * convergence rule (decide), optionally enriches the rationale with OpenAI when
 * a key is present (else uses decide().rationale), records the score, advances
 * the lead, and proposes a Slack action when we did not abstain.
 */
export const scoreCompany = internalAction({
  args: {
    companyId: v.id("companies"),
    runId: v.id("runs"),
  },
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(internal.score.companyLegs, {
      companyId: args.companyId,
    });
    if (!data) {
      await ctx.runMutation(internal.detect.trace, {
        runId: args.runId,
        stage: "score",
        level: "warn",
        message: "scoreCompany: company not found",
      });
      return { scored: false };
    }

    const legs: Legs = normalizeLegs(data.legs);
    const decision = decide(legs);

    // Deterministic rationale from the convergence rule. (Was `let` to allow an
    // OpenAI override; the live override is removed, so it is `const` now.)
    const rationale = decision.rationale;
    // Live LLM rationale is a future enhancement. Wiring it requires: `npm i ai`,
    // OPENAI_API_KEY on the Convex deployment, and moving this enrich into a `"use node"`
    // action (a "use node" file may export ONLY actions, so a colocated query/mutation must
    // move out, the same rule that governed the orangeSlice fix). Until then we trace the gap
    // rather than silently swallow it (the old code dynamically imported a missing `ai`
    // package inside a catch that returned null, hiding any real failure).
    if (process.env.OPENAI_API_KEY) {
      await ctx.runMutation(internal.detect.trace, {
        runId: args.runId,
        stage: "score",
        level: "warn",
        message:
          "score: OPENAI_API_KEY is set but live LLM rationale is not wired; using deterministic rationale.",
      });
    }

    await ctx.runMutation(internal.score.recordScore, {
      companyId: args.companyId,
      leadId: data.leadId,
      score: decision.score,
      rubric: decision.rubric,
      rationale,
      confidence: decision.confidence,
      abstained: decision.abstained,
      legs,
    });

    await ctx.runMutation(internal.detect.trace, {
      runId: args.runId,
      stage: "score",
      level: decision.abstained ? "warn" : "info",
      message: decision.abstained
        ? `Abstained on ${data.name} (${decision.rubric.legsFired}/3 legs): ${rationale}`
        : `Scored ${data.name}: ${decision.score} (conf ${decision.confidence.toFixed(2)})`,
    });

    // Bridge a viz signal so the scene reflects the decision.
    await ctx.runMutation(internal.mutations.bridge.bridgeSignal, {
      message: decision.abstained
        ? `${data.name}: abstained (${decision.rubric.legsFired}/3)`
        : `${data.name}: scored ${decision.score}`,
      signalType: decision.abstained ? "abstain" : "score",
    });

    if (!decision.abstained) {
      await ctx.runMutation(internal.act.proposeAction, {
        companyId: args.companyId,
        leadId: data.leadId,
        type: "slack",
        body: `${data.name} scored ${decision.score}/100 (conf ${decision.confidence.toFixed(
          2
        )}). ${rationale}`,
      });
    }

    return { scored: true, abstained: decision.abstained, score: decision.score };
  },
});

/**
 * companyLegs — internalQuery feeding scoreCompany (an action cannot read
 * ctx.db). Returns the persisted leg shapes plus the primary lead id.
 */
export const companyLegs = internalQuery({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const company = await ctx.db.get(args.companyId);
    if (!company) return null;
    const lead = await ctx.db
      .query("leads")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .first();
    const enrichment = (company.enrichment ?? {}) as Record<string, unknown>;
    return {
      name: company.name,
      legs: enrichment.legs ?? null,
      leadId: lead?._id,
    };
  },
});

/**
 * recordScore — writes the scores row and advances the primary lead to
 * "scored". Runs as a mutation so the action stays db-free.
 */
export const recordScore = internalMutation({
  args: {
    companyId: v.id("companies"),
    leadId: v.optional(v.id("leads")),
    score: v.number(),
    rubric: v.any(),
    rationale: v.string(),
    confidence: v.number(),
    abstained: v.boolean(),
    legs: v.any(),
  },
  handler: async (ctx, args) => {
    const scoreId = await ctx.db.insert("scores", {
      companyId: args.companyId,
      leadId: args.leadId,
      score: args.score,
      rubric: args.rubric,
      rationale: args.rationale,
      confidence: args.confidence,
      abstained: args.abstained,
      legs: args.legs,
      createdAt: Date.now(),
    });

    if (args.leadId) {
      await ctx.db.patch(args.leadId, {
        score: args.score,
        stage: "scored",
      });
    }
    return scoreId;
  },
});

/**
 * Normalize a persisted legs blob into the strict Legs shape decide() expects.
 * Provider fixtures already return { ageDays?, count?, present? } | null per
 * leg, but we defensively coerce anything unexpected to null.
 */
function normalizeLegs(raw: unknown): Legs {
  const blob = (raw ?? {}) as Record<string, unknown>;
  return {
    funding: coerceLeg(blob.funding),
    hiring: coerceLeg(blob.hiring),
    tech: coerceLeg(blob.tech),
  };
}

function coerceLeg(value: unknown): Legs["funding"] {
  if (value == null || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const leg: { ageDays?: number; count?: number; present?: boolean } = {};
  if (typeof v.ageDays === "number") leg.ageDays = v.ageDays;
  if (typeof v.count === "number") leg.count = v.count;
  if (typeof v.present === "boolean") leg.present = v.present;
  if (leg.ageDays === undefined && leg.count === undefined && leg.present === undefined) {
    return null;
  }
  return leg;
}
