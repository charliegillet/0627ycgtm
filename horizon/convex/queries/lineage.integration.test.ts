// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "../schema";
import { api } from "../_generated/api";
import type { Id } from "../_generated/dataModel";

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

describe("queries/lineage (integration)", () => {
  it("scoresByCompany returns that company's scores newest-first", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const { companyId, otherId } = await t.run(async (ctx) => {
      const companyId = await ctx.db.insert("companies", {
        domain: "acme.com",
        name: "Acme",
      });
      const otherId = await ctx.db.insert("companies", {
        domain: "beta.com",
        name: "Beta",
      });
      // Three scores for Acme at increasing createdAt.
      await ctx.db.insert("scores", {
        companyId,
        score: 10,
        rubric: {},
        rationale: "first",
        confidence: 0.4,
        abstained: false,
        legs: {},
        createdAt: now - 3000,
      });
      await ctx.db.insert("scores", {
        companyId,
        score: 20,
        rubric: {},
        rationale: "second",
        confidence: 0.5,
        abstained: false,
        legs: {},
        createdAt: now - 2000,
      });
      await ctx.db.insert("scores", {
        companyId,
        score: 30,
        rubric: {},
        rationale: "third",
        confidence: 0.6,
        abstained: false,
        legs: {},
        createdAt: now - 1000,
      });
      // A score for another company that must NOT leak in.
      await ctx.db.insert("scores", {
        companyId: otherId,
        score: 99,
        rubric: {},
        rationale: "other",
        confidence: 0.9,
        abstained: false,
        legs: {},
        createdAt: now,
      });
      return { companyId, otherId };
    });

    const scores = await t.query(api.queries.lineage.scoresByCompany, {
      companyId,
    });
    expect(scores.length).toBe(3);
    expect(scores.every((s) => s.companyId === companyId)).toBe(true);
    // Newest first.
    expect(scores.map((s) => s.rationale)).toEqual([
      "third",
      "second",
      "first",
    ]);
    expect(scores[0].createdAt).toBeGreaterThan(scores[1].createdAt);

    // The other company's history is independent.
    const otherScores = await t.query(api.queries.lineage.scoresByCompany, {
      companyId: otherId,
    });
    expect(otherScores.length).toBe(1);
    expect(otherScores[0].rationale).toBe("other");
  });

  it("tracesByRun returns the run's traces in ascending order", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();

    const { runId, otherRunId } = await t.run(async (ctx) => {
      const runId: Id<"runs"> = await ctx.db.insert("runs", {
        stage: "detect",
        status: "running",
        startedAt: now,
      });
      const otherRunId = await ctx.db.insert("runs", {
        stage: "detect",
        status: "running",
        startedAt: now,
      });
      // The by_run index is keyed on runId only, so `.order("asc")` returns the
      // run's traces in insertion (creation) order. The pipeline writes traces
      // chronologically, so we insert them in `at` order and assert that order
      // is preserved on read.
      await ctx.db.insert("traces", {
        runId,
        stage: "detect",
        level: "info",
        message: "first",
        at: now + 100,
      });
      await ctx.db.insert("traces", {
        runId,
        stage: "score",
        level: "info",
        message: "second",
        at: now + 200,
      });
      await ctx.db.insert("traces", {
        runId,
        stage: "act",
        level: "info",
        message: "third",
        at: now + 300,
      });
      // A trace on another run must not appear.
      await ctx.db.insert("traces", {
        runId: otherRunId,
        stage: "detect",
        level: "warn",
        message: "other-run",
        at: now + 50,
      });
      return { runId, otherRunId };
    });

    const traces = await t.query(api.queries.lineage.tracesByRun, { runId });
    expect(traces.length).toBe(3);
    expect(traces.every((tr) => tr.runId === runId)).toBe(true);
    // Ascending order preserved, and `at` is non-decreasing along the timeline.
    expect(traces.map((tr) => tr.message)).toEqual([
      "first",
      "second",
      "third",
    ]);
    expect(traces[0].at).toBeLessThan(traces[1].at);
    expect(traces[1].at).toBeLessThan(traces[2].at);

    const otherTraces = await t.query(api.queries.lineage.tracesByRun, {
      runId: otherRunId,
    });
    expect(otherTraces.length).toBe(1);
    expect(otherTraces[0].message).toBe("other-run");
  });
});
