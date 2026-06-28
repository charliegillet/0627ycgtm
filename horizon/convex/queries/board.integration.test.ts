// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "../schema";
import { api } from "../_generated/api";

// Load all function modules for convex-test. These test files live in
// convex/queries/, so a "./**" glob would lose the "queries/" path segment that
// convex-test needs to resolve function references. We use a root-absolute
// "/convex/**" glob (resolved from the Vitest project root) so every module key
// is uniformly rooted at /convex/, matching how convex-test strips the prefix.
const modules = import.meta.glob([
  "/convex/**/*.*s",
  "!/convex/**/*.test.ts",
  "!/convex/**/*.integration.test.ts",
]);

describe("queries/board (integration)", () => {
  it("liveBoard returns scored-company items with the expected shape and runStatus join", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    await t.run(async (ctx) => {
      const companyId = await ctx.db.insert("companies", {
        domain: "stripe.com",
        name: "Stripe",
        industry: "Payments",
        employeeCount: 8000,
        icpFit: 0.95,
      });
      await ctx.db.insert("leads", {
        companyId,
        fullName: "Pat Doe",
        title: "VP Eng",
        stage: "scored",
        score: 0.8,
      });
      await ctx.db.insert("scores", {
        companyId,
        score: 88,
        rubric: { legsFired: 3 },
        rationale: "three legs fired",
        confidence: 0.9,
        abstained: false,
        legs: { funding: { ageDays: 5 } },
        createdAt: now,
      });
      await ctx.db.insert("actions", {
        companyId,
        type: "slack",
        status: "pending",
        body: "ping",
        createdAt: now,
      });
      // A running run for this company so runStatus joins to "running".
      await ctx.db.insert("runs", {
        companyId,
        stage: "score",
        status: "running",
        startedAt: now,
      });
    });

    const board = await t.query(api.queries.board.liveBoard, {});
    expect(board.runningCount).toBe(1);
    expect(board.items.length).toBe(1);

    const item = board.items[0];
    expect(item.company.domain).toBe("stripe.com");
    expect(item.company.name).toBe("Stripe");
    expect(item.score.score).toBe(88);
    expect(item.score.abstained).toBe(false);
    expect(item.score.rubric.legsFired).toBe(3);
    expect(item.runStatus).toBe("running");
    expect(item.lead?.fullName).toBe("Pat Doe");
    expect(item.action?.type).toBe("slack");
    expect(item.action?.status).toBe("pending");
  });

  it("liveBoard keeps only the latest score per company and sorts newest first", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    await t.run(async (ctx) => {
      const a = await ctx.db.insert("companies", { domain: "a.com", name: "A" });
      const b = await ctx.db.insert("companies", { domain: "b.com", name: "B" });
      // Two scores for company A; only the newest (older=10, newer=70) must show.
      await ctx.db.insert("scores", {
        companyId: a,
        score: 10,
        rubric: {},
        rationale: "old",
        confidence: 0.5,
        abstained: false,
        legs: {},
        createdAt: now - 10_000,
      });
      await ctx.db.insert("scores", {
        companyId: a,
        score: 70,
        rubric: {},
        rationale: "new",
        confidence: 0.7,
        abstained: false,
        legs: {},
        createdAt: now - 1_000,
      });
      // Company B scored most recently, so it sorts first.
      await ctx.db.insert("scores", {
        companyId: b,
        score: 50,
        rubric: {},
        rationale: "b",
        confidence: 0.6,
        abstained: false,
        legs: {},
        createdAt: now,
      });
    });

    const board = await t.query(api.queries.board.liveBoard, {});
    expect(board.items.length).toBe(2); // one item per company
    // Newest score first -> company B.
    expect(board.items[0].company.domain).toBe("b.com");
    const aItem = board.items.find((i) => i.company.domain === "a.com");
    expect(aItem?.score.score).toBe(70); // latest score for A, not the stale 10
  });

  it("leadsPage returns a paginated page joined with company", async () => {
    const t = convexTest(schema, modules);

    await t.run(async (ctx) => {
      const companyId = await ctx.db.insert("companies", {
        domain: "lead.com",
        name: "LeadCo",
      });
      for (let i = 0; i < 3; i++) {
        await ctx.db.insert("leads", {
          companyId,
          fullName: `Lead ${i}`,
          stage: "detected",
        });
      }
    });

    const page = await t.query(api.queries.board.leadsPage, {
      paginationOpts: { numItems: 2, cursor: null },
    });
    expect(page.page.length).toBe(2);
    expect(page.page[0].company?.domain).toBe("lead.com");
    expect(typeof page.isDone).toBe("boolean");
    // With 3 leads and a page of 2, there is more to fetch.
    expect(page.isDone).toBe(false);
    expect(page.continueCursor).toBeTruthy();
  });
});
