// @vitest-environment edge-runtime
/// <reference types="vite/client" />
import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { api, internal } from "./_generated/api";

const modules = import.meta.glob([
  "./**/*.*s",
  "!./**/*.test.ts",
  "!./**/*.integration.test.ts",
]);

// Fails-if-reverted (B2, audit #2): if any locked-down function were reverted
// from internalMutation/internalQuery back to mutation/query, the source-level
// assertions below would fail. The kept-public functions are exercised via
// api.* so an accidental demotion of those (which would break app/page.tsx)
// also fails here. We additionally probe whether convex-test enforces
// visibility and assert accordingly (see PROBE comment).

describe("public surface reduction (B2)", () => {
  it("kept-public functions still work via api.*", async () => {
    const t = convexTest(schema, modules);
    // getRecentSignals (query) and getRecentLogs (query) return arrays.
    const signals = await t.query(api.signals.getRecentSignals, { limit: 5 });
    const logs = await t.query(api.logs.getRecentLogs, { limit: 5 });
    expect(Array.isArray(signals)).toBe(true);
    expect(Array.isArray(logs)).toBe(true);
    // sendCommand (mutation) still public; returns the inserted id.
    const id = await t.mutation(api.control.sendCommand, { command: "stop_all" });
    expect(id).toBeTruthy();
  });

  it("locked-down functions are callable via internal.*", async () => {
    const t = convexTest(schema, modules);
    const sigId = await t.mutation(internal.signals.createSignal, {
      fromAgent: 1,
      toAgent: 0,
      message: "hi",
      signalType: "log",
      timestamp: Date.now(),
    });
    expect(sigId).toBeTruthy();

    const cleared = await t.mutation(internal.logs.clearLogs, {});
    expect(cleared).toEqual({ deleted: expect.any(Number) });

    const pending = await t.query(internal.control.getPendingCommands, {});
    expect(Array.isArray(pending)).toBe(true);
  });

  it("locked-down functions are no longer in the public api", async () => {
    // PROBE: empirically determine whether convex-test enforces visibility when
    // a now-internal function is referenced through api.*. We try createSignal
    // via api.* and record whether it throws.
    const t = convexTest(schema, modules);
    let threw = false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await t.mutation((api as any).signals.createSignal, {
        fromAgent: 1,
        toAgent: 0,
        message: "probe",
        signalType: "log",
        timestamp: Date.now(),
      });
    } catch {
      threw = true;
    }

    if (threw) {
      // convex-test DOES enforce visibility: calling an internal function via
      // api.* throws. Strongest fails-if-reverted signal.
      expect(threw).toBe(true);
    } else {
      // convex-test does NOT enforce visibility at the api.* proxy. Fall back to
      // a source-level guarantee: assert the wrapper kind in each file. This is
      // still fails-if-reverted (flipping internalMutation->mutation fails it),
      // and we cannot use `npx convex function-spec` (it hits the deployment).
      const { readFileSync } = await import("node:fs");
      const dir = new URL(".", import.meta.url).pathname;
      const signalsSrc = readFileSync(`${dir}signals.ts`, "utf8");
      const controlSrc = readFileSync(`${dir}control.ts`, "utf8");
      const logsSrc = readFileSync(`${dir}logs.ts`, "utf8");

      // Locked down.
      expect(signalsSrc).toMatch(/export const createSignal = internalMutation/);
      expect(signalsSrc).toMatch(/export const broadcastSignal = internalMutation/);
      expect(signalsSrc).toMatch(/export const cleanupOldSignals = internalMutation/);
      expect(controlSrc).toMatch(/export const markCommandProcessing = internalMutation/);
      expect(controlSrc).toMatch(/export const markCommandCompleted = internalMutation/);
      expect(controlSrc).toMatch(/export const updateCommandStatus = internalMutation/);
      expect(controlSrc).toMatch(/export const clearCompletedCommands = internalMutation/);
      expect(controlSrc).toMatch(/export const getPendingCommands = internalQuery/);
      expect(logsSrc).toMatch(/export const addLog = internalMutation/);
      expect(logsSrc).toMatch(/export const clearLogs = internalMutation/);
      expect(logsSrc).toMatch(/export const getLogsByAgent = internalQuery/);

      // Kept public.
      expect(signalsSrc).toMatch(/export const getRecentSignals = query/);
      expect(controlSrc).toMatch(/export const sendCommand = mutation/);
      expect(logsSrc).toMatch(/export const getRecentLogs = query/);
    }
  });
});
