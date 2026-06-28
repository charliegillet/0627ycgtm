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

function post(body: string) {
  return {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  };
}

// Fails-if-reverted: drop parseSignalBody from http.ts and the type-invalid body
// would reach recordSignal's v.string() validator, returning a 500 with a stack
// (the stack-assertion below would fail). Drop normalization and the stored
// companyDomain would be the raw "HTTPS://WWW.Stripe.com/x". Drop the rate
// limiter and the take-based assertions would fail.

describe("POST /signal intake hardening (B1)", () => {
  it("accepts a valid body and records a signalEvents row", async () => {
    const t = convexTest(schema, modules);
    const res = await t.fetch(
      "/signal",
      post(
        JSON.stringify({
          source: "webhook",
          companyDomain: "acme.com",
          kind: "funding",
        }),
      ),
    );
    expect(res.status).toBe(200);

    const rows = await t.run((ctx) => ctx.db.query("signalEvents").collect());
    expect(rows.length).toBe(1);
    expect(rows[0].companyDomain).toBe("acme.com");
  });

  it("rejects a type-invalid body with 400 and no stack leak", async () => {
    const t = convexTest(schema, modules);
    const res = await t.fetch(
      "/signal",
      post(JSON.stringify({ source: 123, companyDomain: "x.com", kind: "k" })),
    );
    expect(res.status).toBe(400);
    const text = await res.text();
    // No internal stack / ConvexError / file:line leak.
    expect(text).not.toMatch(/at \w|ConvexError|Uncaught|\.ts:\d/);

    // And nothing was recorded.
    const rows = await t.run((ctx) => ctx.db.query("signalEvents").collect());
    expect(rows.length).toBe(0);
  });

  it("rejects invalid JSON with 400", async () => {
    const t = convexTest(schema, modules);
    const res = await t.fetch("/signal", post("not json"));
    expect(res.status).toBe(400);
  });

  it("normalizes companyDomain before recordSignal", async () => {
    const t = convexTest(schema, modules);
    const res = await t.fetch(
      "/signal",
      post(
        JSON.stringify({
          source: "webhook",
          companyDomain: "HTTPS://WWW.Stripe.com/x",
          kind: "funding",
        }),
      ),
    );
    expect(res.status).toBe(200);
    const rows = await t.run((ctx) => ctx.db.query("signalEvents").collect());
    expect(rows.length).toBe(1);
    expect(rows[0].companyDomain).toBe("stripe.com");
  });

  it("rate limiter: allows up to limit then blocks, resets after window", async () => {
    vi.useFakeTimers();
    try {
      const t = convexTest(schema, modules);
      const key = "signal:acme.com";
      const args = { key, limit: 3, windowMs: 60_000 };

      const r1 = await t.mutation(internal.rateLimit.take, args);
      const r2 = await t.mutation(internal.rateLimit.take, args);
      const r3 = await t.mutation(internal.rateLimit.take, args);
      const r4 = await t.mutation(internal.rateLimit.take, args);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);
      expect(r2.allowed).toBe(true);
      expect(r3.allowed).toBe(true);
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);

      // Advance past the window -> fresh allowance.
      vi.advanceTimersByTime(60_000);
      const r5 = await t.mutation(internal.rateLimit.take, args);
      expect(r5.allowed).toBe(true);
      expect(r5.remaining).toBe(2);
    } finally {
      vi.useRealTimers();
    }
  });

  it("returns 429 over HTTP once the per-domain limit is exhausted", async () => {
    const t = convexTest(schema, modules);
    const body = post(
      JSON.stringify({
        source: "webhook",
        companyDomain: "flood.com",
        kind: "funding",
      }),
    );
    // Default limit is 30; fire 31 and expect the last to be a 429.
    let last = 0;
    for (let i = 0; i < 31; i++) {
      const res = await t.fetch("/signal", body);
      last = res.status;
    }
    expect(last).toBe(429);
  });
});
