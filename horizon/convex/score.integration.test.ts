// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { describe, it, expect, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { internal } from "./_generated/api";

const modules = import.meta.glob([
  "./**/*.*s",
  "!./**/*.test.ts",
  "!./**/*.integration.test.ts",
]);

const WIRED_GAP = "live LLM rationale is not wired";

// Fails-if-reverted (B4, audit #11): the old code wrapped a dynamic `ai` import
// in `catch { return null }`, swallowing any failure silently. Reverting to that
// removes the explicit trace, so the "key set -> trace present" assertion fails.
// The "key unset -> trace absent" case guards that we only trace when the gap is
// actually reachable.

async function runScoreAndGetTraces(t: ReturnType<typeof convexTest>) {
  vi.useFakeTimers();
  try {
    await t.mutation(internal.detect.recordSignal, {
      source: "test",
      kind: "manual",
      companyDomain: "stripe.com",
    });
    await t.finishAllScheduledFunctions(vi.runAllTimers);
  } finally {
    vi.useRealTimers();
  }
  return await t.run((ctx) => ctx.db.query("traces").collect());
}

describe("score OPENAI_API_KEY gap trace (B4)", () => {
  it("traces the unwired-LLM gap when OPENAI_API_KEY is set", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    try {
      const t = convexTest(schema, modules);
      const traces = await runScoreAndGetTraces(t);
      const gap = traces.filter((tr) => tr.message.includes(WIRED_GAP));
      expect(gap.length).toBeGreaterThan(0);
      // The trace is a warn at the score stage.
      expect(gap[0].stage).toBe("score");
      expect(gap[0].level).toBe("warn");
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("does NOT trace the gap when OPENAI_API_KEY is unset", async () => {
    // Ensure the key is absent in this case.
    vi.stubEnv("OPENAI_API_KEY", "");
    try {
      const t = convexTest(schema, modules);
      const traces = await runScoreAndGetTraces(t);
      const gap = traces.filter((tr) => tr.message.includes(WIRED_GAP));
      expect(gap.length).toBe(0);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
