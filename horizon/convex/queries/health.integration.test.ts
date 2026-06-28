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

describe("queries/health (integration)", () => {
  it("failedRuns returns only failed runs, excludes succeeded/running", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    await t.run(async (ctx) => {
      await ctx.db.insert("runs", {
        stage: "detect",
        status: "failed",
        startedAt: now - 1000,
        finishedAt: now,
      });
      await ctx.db.insert("runs", {
        stage: "score",
        status: "failed",
        startedAt: now - 500,
        finishedAt: now,
      });
      await ctx.db.insert("runs", {
        stage: "act",
        status: "succeeded",
        startedAt: now - 200,
        finishedAt: now,
      });
      await ctx.db.insert("runs", {
        stage: "enrich",
        status: "running",
        startedAt: now,
      });
    });

    const failed = await t.query(api.queries.health.failedRuns, {});
    expect(failed.length).toBe(2);
    expect(failed.every((r) => r.status === "failed")).toBe(true);
    expect(failed.some((r) => r.status === "succeeded")).toBe(false);
    expect(failed.some((r) => r.status === "running")).toBe(false);
    // Newest first.
    expect(failed[0].startedAt).toBeGreaterThanOrEqual(failed[1].startedAt);
  });

  it("failedRuns honors the limit argument", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();
    await t.run(async (ctx) => {
      for (let i = 0; i < 5; i++) {
        await ctx.db.insert("runs", {
          stage: "detect",
          status: "failed",
          startedAt: now - i * 100,
        });
      }
    });

    const failed = await t.query(api.queries.health.failedRuns, { limit: 3 });
    expect(failed.length).toBe(3);
  });

  it("stuckRuns flags an old running run and excludes a fresh one", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();
    const thresholdMs = 5 * 60 * 1000;

    await t.run(async (ctx) => {
      // Old running run (10 min ago) -> stuck.
      await ctx.db.insert("runs", {
        stage: "detect",
        status: "running",
        startedAt: now - 10 * 60 * 1000,
      });
      // Fresh running run (just now) -> not stuck.
      await ctx.db.insert("runs", {
        stage: "score",
        status: "running",
        startedAt: now,
      });
      // A failed run that is old -> must not appear (wrong status).
      await ctx.db.insert("runs", {
        stage: "act",
        status: "failed",
        startedAt: now - 30 * 60 * 1000,
        finishedAt: now,
      });
    });

    const stuck = await t.query(api.queries.health.stuckRuns, { thresholdMs });
    expect(stuck.length).toBe(1);
    expect(stuck[0].status).toBe("running");
    expect(stuck[0].startedAt).toBeLessThan(now - thresholdMs);
  });

  it("stuckRuns defaults to a 5-minute threshold", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();
    await t.run(async (ctx) => {
      await ctx.db.insert("runs", {
        stage: "detect",
        status: "running",
        startedAt: now - 6 * 60 * 1000, // 6 min ago, past the default 5 min
      });
      await ctx.db.insert("runs", {
        stage: "score",
        status: "running",
        startedAt: now - 60 * 1000, // 1 min ago, within default
      });
    });

    const stuck = await t.query(api.queries.health.stuckRuns, {});
    expect(stuck.length).toBe(1);
  });

  it("pipelineStats counts runs by status and routed/abstained accounts", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const companyId = await t.run(async (ctx) => {
      const id = await ctx.db.insert("companies", {
        domain: "acme.com",
        name: "Acme",
      });
      await ctx.db.insert("runs", {
        stage: "detect",
        status: "running",
        startedAt: now,
      });
      await ctx.db.insert("runs", {
        stage: "score",
        status: "failed",
        startedAt: now,
        finishedAt: now,
      });
      await ctx.db.insert("runs", {
        stage: "act",
        status: "succeeded",
        startedAt: now,
        finishedAt: now,
      });
      return id;
    });

    // One routed score and one abstained score for two different companies.
    await t.run(async (ctx) => {
      const other = await ctx.db.insert("companies", {
        domain: "beta.com",
        name: "Beta",
      });
      await ctx.db.insert("scores", {
        companyId,
        score: 80,
        rubric: { legsFired: 3 },
        rationale: "strong",
        confidence: 0.9,
        abstained: false,
        legs: {},
        createdAt: now,
      });
      await ctx.db.insert("scores", {
        companyId: other,
        score: 0,
        rubric: { legsFired: 1 },
        rationale: "weak",
        confidence: 0.2,
        abstained: true,
        legs: {},
        createdAt: now,
      });
    });

    const stats = await t.query(api.queries.health.pipelineStats, {});
    expect(stats.running).toBe(1);
    expect(stats.failed).toBe(1);
    expect(stats.succeeded).toBe(1);
    expect(stats.routed).toBe(1);
    expect(stats.abstained).toBe(1);
  });
});
