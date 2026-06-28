import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Durable enrich -> score -> act workflow. Survives restarts; each step is
 * journaled with exactly-once mutations and automatic retries. recordSignal
 * starts this instead of a one-shot scheduled action, so a crash mid-enrich
 * resumes from the exact step without re-charging completed work.
 */
export const workflow = new WorkflowManager(components.workflow);

export const gtmPipeline = workflow.define({
  args: {
    companyDomain: v.string(),
    runId: v.id("runs"),
    signalEventId: v.optional(v.id("signalEvents")),
  },
  handler: async (step, args): Promise<null> => {
    // Three enrichment legs in parallel (each a journaled step).
    const [funding, hiring, tech] = await Promise.all([
      step.runAction(internal.providers.orangeSlice.callOrangeSlice, {
        op: "funding",
        domain: args.companyDomain,
        runId: args.runId,
      }),
      step.runAction(internal.providers.orangeSlice.callOrangeSlice, {
        op: "hiring",
        domain: args.companyDomain,
        runId: args.runId,
      }),
      step.runAction(internal.providers.orangeSlice.callOrangeSlice, {
        op: "tech",
        domain: args.companyDomain,
        runId: args.runId,
      }),
    ]);

    const { companyId } = await step.runMutation(
      internal.detect.upsertCompany,
      {
        domain: args.companyDomain,
        runId: args.runId,
        legs: { funding, hiring, tech },
        signalEventId: args.signalEventId,
      }
    );

    await step.runAction(internal.score.scoreCompany, {
      companyId,
      runId: args.runId,
    });

    await step.runMutation(internal.detect.finishRun, {
      runId: args.runId,
      companyId,
      status: "succeeded",
    });

    return null;
  },
});
