import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { signalKey } from "./lib/idempotency";
import type { Id } from "./_generated/dataModel";

/**
 * Seeded domains the cron poll re-detects. Fixture mode: these match the
 * provider fixtures keyed by domain. All synthetic.
 */
const SEED_DOMAINS = [
  "stripe.com", // fixture: all 3 legs strong -> routes (green card)
  "linear.app", // fixture: mixed legs
  "acme.com", // hits the "*" fallback fixture: single weak leg -> ABSTAINS
];

/**
 * recordSignal — entry point for new GTM signals (cron poll + POST /signal).
 * Dedupes same-day same-signal via signalKey against by_dedupe, inserts a
 * signalEvents row, opens a runs row, schedules the pipeline, and bridges a
 * viz signal + log so the 3D scene lights up.
 */
export const recordSignal = internalMutation({
  args: {
    source: v.string(),
    companyDomain: v.string(),
    kind: v.string(),
    payload: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const key = signalKey({
      source: args.source,
      companyDomain: args.companyDomain,
      kind: args.kind,
      at: now,
    });

    // Dedupe: look up any same-day signal for this (source, domain, kind) and
    // confirm its key matches (same UTC day bucket).
    const candidates = await ctx.db
      .query("signalEvents")
      .withIndex("by_dedupe", (q) =>
        q
          .eq("source", args.source)
          .eq("companyDomain", args.companyDomain)
          .eq("kind", args.kind)
      )
      .collect();
    const duplicate = candidates.find(
      (c) =>
        signalKey({
          source: c.source,
          companyDomain: c.companyDomain,
          kind: c.kind,
          at: c.detectedAt,
        }) === key
    );
    if (duplicate) {
      return { deduped: true, signalEventId: duplicate._id };
    }

    const signalEventId = await ctx.db.insert("signalEvents", {
      source: args.source,
      kind: args.kind,
      companyDomain: args.companyDomain,
      payload: args.payload ?? { __synthetic: true },
      processed: false,
      detectedAt: now,
    });

    const runId = await ctx.db.insert("runs", {
      stage: "detect",
      status: "running",
      startedAt: now,
    });

    await ctx.db.insert("traces", {
      runId,
      stage: "detect",
      level: "info",
      message: `Signal detected: ${args.source}/${args.kind} for ${args.companyDomain}`,
      at: now,
    });

    // Light up the 3D viz scene.
    await ctx.runMutation(internal.mutations.bridge.bridgeSignal, {
      message: `${args.source}: ${args.kind} @ ${args.companyDomain}`,
      signalType: "detect",
    });

    // Default path: one-shot scheduled pipeline (fully tested via convex-test).
    // A durable equivalent is defined in pipeline.ts (gtmPipeline) and deploys,
    // but the convex-test harness cannot drive the workflow component yet, so
    // switching the live path onto it is deferred to a focused session.
    await ctx.scheduler.runAfter(0, internal.detect.runPipeline, {
      companyDomain: args.companyDomain,
      runId,
      signalEventId,
    });

    return { deduped: false, signalEventId, runId };
  },
});

/**
 * poll — cron target. Re-detects each seeded domain via recordSignal. Dedupe
 * keeps the same-day re-poll idempotent, so this is safe to run on an interval.
 */
export const poll = internalAction({
  args: {},
  handler: async (ctx) => {
    for (const domain of SEED_DOMAINS) {
      await ctx.runMutation(internal.detect.recordSignal, {
        source: "poll",
        companyDomain: domain,
        kind: "funding",
        payload: { __synthetic: true, reason: "cron-poll" },
      });
    }
    return { polled: SEED_DOMAINS.length };
  },
});

/**
 * runPipeline — fan out the three OrangeSlice legs in parallel, upsert the
 * company + a primary lead (by_domain), trace each stage, then hand off to
 * scoreCompany.
 */
export const runPipeline = internalAction({
  args: {
    companyDomain: v.string(),
    runId: v.id("runs"),
    signalEventId: v.optional(v.id("signalEvents")),
  },
  // Explicit return type breaks the circular type inference caused by this
  // action referencing other functions in its own module (internal.detect.*).
  handler: async (ctx, args): Promise<{ companyId: Id<"companies"> }> => {
    const start = Date.now();
    await ctx.runMutation(internal.detect.trace, {
      runId: args.runId,
      stage: "enrich",
      level: "info",
      message: `Enriching ${args.companyDomain} via OrangeSlice (3 legs)`,
    });

    // Three legs in parallel — each provider action caches + traces internally
    // (passing runId so per-leg traces land on this run's timeline).
    const [funding, hiring, tech] = await Promise.all([
      ctx.runAction(internal.providers.router.callLeg, {
        leg: "funding",
        domain: args.companyDomain,
        runId: args.runId,
      }),
      ctx.runAction(internal.providers.router.callLeg, {
        leg: "hiring",
        domain: args.companyDomain,
        runId: args.runId,
      }),
      ctx.runAction(internal.providers.router.callLeg, {
        leg: "tech",
        domain: args.companyDomain,
        runId: args.runId,
      }),
    ]);

    const legDurationMs = Date.now() - start;
    await ctx.runMutation(internal.detect.trace, {
      runId: args.runId,
      stage: "enrich",
      level: "info",
      message: `OrangeSlice legs returned for ${args.companyDomain}`,
      durationMs: legDurationMs,
    });

    // Upsert company + primary lead, persisting the leg shapes for scoring.
    const { companyId } = await ctx.runMutation(internal.detect.upsertCompany, {
      domain: args.companyDomain,
      runId: args.runId,
      legs: { funding, hiring, tech },
      signalEventId: args.signalEventId,
    });

    await ctx.runMutation(internal.detect.trace, {
      runId: args.runId,
      stage: "score",
      level: "info",
      message: `Handing ${args.companyDomain} to scoring`,
    });

    await ctx.runAction(internal.score.scoreCompany, {
      companyId,
      runId: args.runId,
    });

    await ctx.runMutation(internal.detect.finishRun, {
      runId: args.runId,
      companyId,
      status: "succeeded",
    });

    return { companyId };
  },
});

/**
 * finishRun — close out a run (status + finishedAt + companyId) so liveBoard's
 * running-runs list drains as the pipeline completes.
 */
export const finishRun = internalMutation({
  args: {
    runId: v.id("runs"),
    companyId: v.optional(v.id("companies")),
    status: v.union(v.literal("succeeded"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.runId, {
      status: args.status,
      finishedAt: Date.now(),
      ...(args.companyId ? { companyId: args.companyId } : {}),
    });
  },
});

/**
 * upsertCompany — internalMutation used by runPipeline (an action cannot touch
 * ctx.db). Upserts company by_domain, ensures a primary lead, stashes the raw
 * legs on the company enrichment blob, and marks the source signals processed.
 */
export const upsertCompany = internalMutation({
  args: {
    domain: v.string(),
    runId: v.id("runs"),
    legs: v.any(),
    signalEventId: v.optional(v.id("signalEvents")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    const enrichment = {
      __synthetic: true,
      legs: args.legs,
      enrichedAt: Date.now(),
    };
    const name = deriveName(args.domain);

    let companyId: Id<"companies">;
    if (existing) {
      await ctx.db.patch(existing._id, { enrichment, name: existing.name || name });
      companyId = existing._id;
    } else {
      companyId = await ctx.db.insert("companies", {
        domain: args.domain,
        name,
        enrichment,
      });
    }

    // Ensure a primary lead exists for the company.
    const lead = await ctx.db
      .query("leads")
      .withIndex("by_company", (q) => q.eq("companyId", companyId))
      .first();
    if (lead) {
      await ctx.db.patch(lead._id, { stage: "enriching" });
    } else {
      await ctx.db.insert("leads", {
        companyId,
        fullName: `Decision Maker (${name})`,
        title: "VP / Director",
        stage: "enriching",
      });
    }

    // Mark ONLY the signal that triggered this run as processed (run-scoped,
    // exact idempotency). A global domain scan would wrongly mark sibling
    // signals from concurrent runs before their own pipeline enriches them.
    if (args.signalEventId) {
      const sig = await ctx.db.get(args.signalEventId);
      if (sig && !sig.processed) {
        await ctx.db.patch(args.signalEventId, { processed: true, companyId });
      }
    }

    return { companyId };
  },
});

/**
 * trace — small internalMutation so actions can write traces rows without
 * touching ctx.db directly.
 */
export const trace = internalMutation({
  args: {
    runId: v.id("runs"),
    stage: v.string(),
    level: v.union(v.literal("info"), v.literal("warn"), v.literal("error")),
    message: v.string(),
    durationMs: v.optional(v.number()),
    agentId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("traces", {
      runId: args.runId,
      stage: args.stage,
      level: args.level,
      message: args.message,
      durationMs: args.durationMs,
      agentId: args.agentId,
      at: Date.now(),
    });
  },
});

function deriveName(domain: string): string {
  const base = domain.split(".")[0] ?? domain;
  return base.charAt(0).toUpperCase() + base.slice(1);
}
