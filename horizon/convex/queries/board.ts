import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";

/**
 * liveBoard — reactive hero query. Returns currently-running runs plus scored
 * companies joined with their latest score, for the lead board.
 */
export const liveBoard = query({
  args: {},
  handler: async (ctx) => {
    const runningRuns = await ctx.db
      .query("runs")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .order("desc")
      .take(25);

    // Latest score per company. Pull recent scores and dedupe by companyId
    // keeping the newest (scores are append-only with createdAt).
    const recentScores = await ctx.db.query("scores").order("desc").take(200);
    const latestByCompany = new Map<string, (typeof recentScores)[number]>();
    for (const s of recentScores) {
      const key = s.companyId as unknown as string;
      if (!latestByCompany.has(key)) latestByCompany.set(key, s);
    }

    const runningCompanyIds = new Set(
      runningRuns
        .map((r) => r.companyId as unknown as string)
        .filter(Boolean)
    );

    // Shape matches the UI `BoardItem` contract (app/hooks/useAgentData.ts):
    // { _id, companyId, company: CompanyData, score: ScoreData | null, runStatus? }.
    const items = [];
    for (const score of latestByCompany.values()) {
      const company = await ctx.db.get(score.companyId);
      if (!company) continue;
      const lead = await ctx.db
        .query("leads")
        .withIndex("by_company", (q) => q.eq("companyId", score.companyId))
        .first();
      // Latest action for this company (if any) so the board can show state.
      const actions = await ctx.db
        .query("actions")
        .withIndex("by_company", (q) => q.eq("companyId", score.companyId))
        .collect();
      const latestAction = actions.sort((a, b) => b.createdAt - a.createdAt)[0];

      items.push({
        _id: score._id,
        companyId: company._id,
        company: {
          _id: company._id,
          domain: company.domain,
          name: company.name,
          industry: company.industry,
          employeeCount: company.employeeCount,
          icpFit: company.icpFit,
        },
        score: {
          _id: score._id,
          score: score.score,
          confidence: score.confidence,
          abstained: score.abstained,
          rationale: score.rationale,
          rubric: score.rubric,
          legs: score.legs, // per-leg badges on the card need this
          createdAt: score.createdAt,
        },
        runStatus: runningCompanyIds.has(company._id as unknown as string)
          ? ("running" as const)
          : undefined,
        // Extra context (UI reads fields by name, so extras are harmless):
        lead: lead
          ? {
              _id: lead._id,
              fullName: lead.fullName,
              title: lead.title,
              stage: lead.stage,
              score: lead.score,
            }
          : null,
        action: latestAction
          ? {
              _id: latestAction._id,
              type: latestAction.type,
              status: latestAction.status,
            }
          : null,
      });
    }

    // Newest scored first.
    items.sort((a, b) => (b.score.createdAt ?? 0) - (a.score.createdAt ?? 0));

    return { items, runningCount: runningRuns.length };
  },
});

/**
 * leadsPage — paginated leads for the full list view.
 */
export const leadsPage = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("leads")
      .order("desc")
      .paginate(args.paginationOpts);

    const enriched = await Promise.all(
      page.page.map(async (lead) => {
        const company = await ctx.db.get(lead.companyId);
        return {
          ...lead,
          company: company
            ? { domain: company.domain, name: company.name }
            : null,
        };
      })
    );

    return { ...page, page: enriched };
  },
});
