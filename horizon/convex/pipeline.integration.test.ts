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
});
