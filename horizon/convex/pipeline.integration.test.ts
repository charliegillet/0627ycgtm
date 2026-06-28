// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { describe, it, expect, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { internal, api } from "./_generated/api";

// Load all function modules for convex-test, including _generated/, but exclude
// the test files themselves.
const modules = import.meta.glob([
  "./**/*.*s",
  "!./**/*.test.ts",
  "!./**/*.integration.test.ts",
]);

type BoardItem = {
  company?: { domain?: string };
  score?: { abstained: boolean; rubric: { legsFired: number } };
};

function boardItem(board: { items: BoardItem[] }, domain: string) {
  return board.items.find((i) => i.company?.domain === domain);
}

describe("BEACHHEAD pipeline (integration, fixture mode)", () => {
  it("routes a strong account and abstains on a weak one", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);

    await t.mutation(internal.detect.recordSignal, {
      source: "test",
      kind: "manual",
      companyDomain: "stripe.com", // fixture: 3 strong legs
    });
    await t.mutation(internal.detect.recordSignal, {
      source: "test",
      kind: "manual",
      companyDomain: "acme.com", // "*" fixture: 1 weak leg
    });

    // Drain the scheduled runPipeline chains (enrich -> score -> act) fully.
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();

    const board = await t.query(api.queries.board.liveBoard, {});
    const stripe = boardItem(board, "stripe.com");
    const acme = boardItem(board, "acme.com");

    expect(stripe).toBeDefined();
    expect(stripe!.score!.abstained).toBe(false);
    expect(stripe!.score!.rubric.legsFired).toBe(3);

    expect(acme).toBeDefined();
    expect(acme!.score!.abstained).toBe(true);
    expect(acme!.score!.rubric.legsFired).toBeLessThan(2);
  });

  it("dedupes the same signal within the same day", async () => {
    const t = convexTest(schema, modules);

    const first = await t.mutation(internal.detect.recordSignal, {
      source: "test",
      kind: "manual",
      companyDomain: "stripe.com",
    });
    const second = await t.mutation(internal.detect.recordSignal, {
      source: "test",
      kind: "manual",
      companyDomain: "stripe.com",
    });

    expect(first.deduped).toBe(false);
    expect(second.deduped).toBe(true);
  });

  it("upsertCompany marks ONLY the triggering signal (run-scoped idempotency)", async () => {
    const t = convexTest(schema, modules);
    const now = Date.now();
    // Two pending signals for the same domain (different kinds).
    const a = await t.run((ctx) =>
      ctx.db.insert("signalEvents", {
        source: "x", kind: "funding", companyDomain: "acme.com",
        payload: {}, processed: false, detectedAt: now,
      })
    );
    const b = await t.run((ctx) =>
      ctx.db.insert("signalEvents", {
        source: "x", kind: "hiring", companyDomain: "acme.com",
        payload: {}, processed: false, detectedAt: now,
      })
    );
    const runId = await t.run((ctx) =>
      ctx.db.insert("runs", { stage: "detect", status: "running", startedAt: now })
    );

    await t.mutation(internal.detect.upsertCompany, {
      domain: "acme.com", runId,
      legs: { funding: null, hiring: null, tech: null },
      signalEventId: a,
    });

    const sa = await t.run((ctx) => ctx.db.get(a));
    const sb = await t.run((ctx) => ctx.db.get(b));
    expect(sa!.processed).toBe(true);
    expect(sb!.processed).toBe(false); // not wrongly marked by a sibling run
  });

  it("never caches a synthetic fixture, and never labels a fixture as (live)", async () => {
    // Cache-poisoning guard (must-fix #1/#2). In fixture mode every leg returns a
    // labeled __synthetic fixture. Those must NOT be written to apiCache (a cached
    // synthetic would later be served as a clean cache HIT and mislabeled live),
    // and no trace may ever read "(live)" while carrying __synthetic.
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "test",
      kind: "manual",
      companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();

    // No apiCache row may hold a synthetic payload.
    const cacheRows = await t.run((ctx) => ctx.db.query("apiCache").collect());
    const poisoned = cacheRows.filter(
      (r) =>
        r.response &&
        typeof r.response === "object" &&
        (r.response as Record<string, unknown>).__synthetic,
    );
    expect(poisoned).toHaveLength(0);

    // No trace may claim (live) while its message contains __synthetic.
    const traceRows = await t.run((ctx) => ctx.db.query("traces").collect());
    const mislabeled = traceRows.filter(
      (tr) => tr.message.includes("(live)") && tr.message.includes("__synthetic"),
    );
    expect(mislabeled).toHaveLength(0);

    // Fixture legs are honestly labeled "(fixture)" (no key in the test env).
    const fixtureLegTraces = traceRows.filter((tr) =>
      tr.message.includes("leg for stripe.com (fixture)"),
    );
    expect(fixtureLegTraces.length).toBeGreaterThan(0);
  });

  it("act approval gate: routed account proposes a pending action that approve advances", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "test", kind: "manual", companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();

    const action = await t.run((ctx) => ctx.db.query("actions").first());
    expect(action).toBeDefined();
    expect(action!.status).toBe("pending"); // nothing auto-sent

    await t.mutation(api.act.approve, { actionId: action!._id });
    await t.finishInProgressScheduledFunctions();
    const after = await t.run((ctx) => ctx.db.get(action!._id));
    expect(["approved", "sent"]).toContain(after!.status);
  });

  it("double-approve does not double-send (status guard is idempotent)", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "test", kind: "manual", companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const action = await t.run((ctx) => ctx.db.query("actions").first());
    expect(action!.status).toBe("pending");

    // First approve schedules the send; drain it (under fake timers) to "sent".
    await t.mutation(api.act.approve, { actionId: action!._id });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const afterFirst = await t.run((ctx) => ctx.db.get(action!._id));
    expect(afterFirst!.status).toBe("sent");

    // The fixture-mode send appends exactly one bracketed note to the body.
    const noteCount = (body: string | undefined) =>
      (body ?? "").match(/\n\[/g)?.length ?? 0;
    expect(noteCount(afterFirst!.body)).toBe(1);

    // Second approve must be a no-op: status stays "sent", nothing re-scheduled,
    // and no second note is appended (i.e. no duplicate send).
    const res = await t.mutation(api.act.approve, { actionId: action!._id });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();
    const afterSecond = await t.run((ctx) => ctx.db.get(action!._id));
    expect(res).toMatchObject({ alreadyHandled: true });
    expect(afterSecond!.status).toBe("sent");
    expect(noteCount(afterSecond!.body)).toBe(1); // still exactly one send
  });

  it("block prevents the send and is idempotent", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "test", kind: "manual", companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const action = await t.run((ctx) => ctx.db.query("actions").first());
    expect(action!.status).toBe("pending");

    await t.mutation(api.act.block, { actionId: action!._id });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    const blocked = await t.run((ctx) => ctx.db.get(action!._id));
    expect(blocked!.status).toBe("blocked");
    // Never sent: no bracketed send note was appended.
    expect((blocked!.body ?? "").includes("\n[")).toBe(false);
    // Lead marked dead.
    if (blocked!.leadId) {
      const lead = await t.run((ctx) => ctx.db.get(blocked!.leadId!));
      expect(lead!.stage).toBe("dead");
    }

    // Approving a blocked action is a no-op (does not resurrect / send it).
    const res = await t.mutation(api.act.approve, { actionId: action!._id });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();
    const after = await t.run((ctx) => ctx.db.get(action!._id));
    expect(res).toMatchObject({ alreadyHandled: true });
    expect(after!.status).toBe("blocked");
  });

  it("approve freshens the action body from the CURRENT score (no stale number)", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "test", kind: "manual", companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);

    const action = await t.run((ctx) => ctx.db.query("actions").first());
    expect(action!.status).toBe("pending");

    // Simulate the board rescoring lower AFTER the action was proposed: insert a
    // newer score with a different number for the same company.
    await t.run((ctx) =>
      ctx.db.insert("scores", {
        companyId: action!.companyId,
        leadId: action!.leadId,
        score: 66,
        rubric: { legsFired: 2, perLeg: { funding: 33, hiring: 33, tech: 0 } },
        rationale: "Rescored lower.",
        confidence: 0.6,
        abstained: false,
        legs: { funding: { ageDays: 45 }, hiring: { count: 12 }, tech: null },
        createdAt: Date.now() + 1_000_000,
      })
    );

    await t.mutation(api.act.approve, { actionId: action!._id });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();
    const after = await t.run((ctx) => ctx.db.get(action!._id));
    // Body reflects the latest (66), not the stale proposed number.
    expect(after!.body).toContain("66/100");
  });

  it("live-derived board + log rows are NOT mislabeled synthetic", async () => {
    // Simulate a LIVE enrichment: legs WITHOUT the __synthetic marker (live
    // results never carry it). The company enrichment and the bridged log must
    // therefore be labeled live, not synthetic.
    const t = convexTest(schema, modules);
    const now = Date.now();
    const runId = await t.run((ctx) =>
      ctx.db.insert("runs", { stage: "detect", status: "running", startedAt: now })
    );

    await t.mutation(internal.detect.upsertCompany, {
      domain: "liveco.com",
      runId,
      // Plain live legs — no __synthetic marker anywhere.
      legs: {
        funding: { ageDays: 30 },
        hiring: { count: 7 },
        tech: { present: true },
      },
    });

    const company = await t.run((ctx) =>
      ctx.db
        .query("companies")
        .withIndex("by_domain", (q) => q.eq("domain", "liveco.com"))
        .first()
    );
    expect(company).toBeDefined();
    // Enrichment provenance must be live (false), not over-tagged synthetic.
    expect((company!.enrichment as { __synthetic?: boolean }).__synthetic).toBe(false);

    // A bridged log row from a live signal must not be labeled synthetic.
    await t.mutation(internal.mutations.bridge.bridgeSignal, {
      message: "live: funding @ liveco.com",
      signalType: "detect",
      synthetic: false,
    });
    const logs = await t.run((ctx) => ctx.db.query("logs").collect());
    const liveLog = logs.find((l) => l.message.includes("liveco.com"));
    expect(liveLog).toBeDefined();
    const meta = JSON.parse(liveLog!.metadata ?? "{}") as { __synthetic?: boolean };
    expect(meta.__synthetic).toBe(false);
  });

  it("fixture-derived rows STAY labeled synthetic (honesty preserved)", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "poll",
      kind: "funding",
      companyDomain: "stripe.com",
      payload: { __synthetic: true, reason: "cron-poll" },
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();

    const company = await t.run((ctx) =>
      ctx.db
        .query("companies")
        .withIndex("by_domain", (q) => q.eq("domain", "stripe.com"))
        .first()
    );
    // Fixture-mode legs carry __synthetic, so the enrichment is honestly synthetic.
    expect((company!.enrichment as { __synthetic?: boolean }).__synthetic).toBe(true);
  });

  it("resetAll empties the BEACHHEAD tables it claims to clear", async () => {
    vi.useFakeTimers();
    const t = convexTest(schema, modules);
    await t.mutation(internal.detect.recordSignal, {
      source: "test", kind: "manual", companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
    vi.useRealTimers();

    const beachheadTables = [
      "companies",
      "leads",
      "signalEvents",
      "scores",
      "actions",
      "runs",
      "traces",
    ] as const;

    // Pre-condition: the pipeline populated the BEACHHEAD tables.
    const before = await t.run(async (ctx) => {
      const counts: Record<string, number> = {};
      for (const table of beachheadTables) {
        counts[table] = (await ctx.db.query(table).collect()).length;
      }
      return counts;
    });
    expect(before.companies).toBeGreaterThan(0);
    expect(before.scores).toBeGreaterThan(0);
    expect(before.actions).toBeGreaterThan(0);

    await t.mutation(api.cleanup.resetAll, {});

    // Post-condition: every BEACHHEAD table is empty.
    const after = await t.run(async (ctx) => {
      const counts: Record<string, number> = {};
      for (const table of beachheadTables) {
        counts[table] = (await ctx.db.query(table).collect()).length;
      }
      return counts;
    });
    for (const table of beachheadTables) {
      expect(after[table]).toBe(0);
    }
  });
});
