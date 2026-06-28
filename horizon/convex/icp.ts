// ICP intake action: turn a natural-language ICP into candidate domains, then
// fan each domain into the EXISTING domain pipeline via recordSignal.
//
// v1 is deterministic and fixture-backed (see lib/icpFixtures). The resolution
// is labeled `mode: "icp-fixture"` so nothing here is presented as a live
// lookup. Each derived signal is recorded with kind "icp-derived" and a payload
// noting `resolvedBy: "icp-fixture"`, so the provenance is explicit downstream.

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { resolveIcpToDomains } from "./lib/icpFixtures";

/**
 * resolveIcp — resolve an ICP to domains and record one signal per domain.
 *
 * Plain internalAction (no "use node"): it only maps the ICP to domains and
 * calls recordSignal for each. Returns the wire shape the HTTP action forwards
 * verbatim: `{ ok, mode, icp, matched, domains, results }`, where each result
 * is `{ domain, deduped, runId }`. On a same-day dedupe recordSignal returns no
 * runId, so we surface "" rather than leak `undefined` onto the wire.
 */
export const resolveIcp = internalAction({
  args: {
    icp: v.string(),
    limit: v.number(),
    source: v.string(),
  },
  handler: async (ctx, { icp, limit, source }) => {
    const { matched, domains } = resolveIcpToDomains(icp, limit);

    const results: Array<{ domain: string; deduped: boolean; runId: string }> =
      [];
    for (const domain of domains) {
      const r = await ctx.runMutation(internal.detect.recordSignal, {
        source,
        kind: "icp-derived",
        companyDomain: domain,
        payload: { icp, resolvedBy: "icp-fixture", matched },
      });
      results.push({
        domain,
        deduped: r.deduped,
        runId: r.runId ?? "",
      });
    }

    return { ok: true as const, mode: "icp-fixture" as const, icp, matched, domains, results };
  },
});
