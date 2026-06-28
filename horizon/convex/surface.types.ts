// Compile-time guard for the B2 public-surface reduction (audit #2).
//
// This file is never imported or executed; it exists only so `tsc --noEmit`
// (which CI runs) fails if the locked-down functions are accidentally made
// public again. It is a stronger guard than the source-regex check in
// surface.integration.test.ts: convex-test does NOT enforce api/internal
// visibility, but the generated `api` type DOES.
//
// How it works: `api` is FilterApi<..., "public">, so a function defined with
// internalMutation/internalQuery is NOT a property of `api.<mod>`. Referencing
// it as `api.<mod>.<fn>` is therefore a real type error (TS2339). We wrap each
// such reference in `@ts-expect-error`, which consumes that error. If someone
// reverts a function to a public `mutation`/`query`, the reference type-checks,
// the directive becomes unused, and tsc raises TS2578 ("Unused '@ts-expect-error'
// directive"), failing the build. The positive references (no directive) assert
// the inverse: the kept-public functions MUST stay on `api`, and the locked-down
// functions MUST exist on `internal`; demoting a kept-public one or removing a
// locked-down one breaks compilation here too.

import { api, internal } from "./_generated/api";

// Exported so it is unambiguously part of the module, but never called: the
// body is pure type references with zero runtime side effects, and `void` keeps
// each one a statement so a `@ts-expect-error` maps to exactly one expected error.
export function __auditTwoSurfaceGuard(): void {
  // --- Locked down: must NOT be on the public `api` (each line must error). ---

  // signals.ts
  // @ts-expect-error createSignal is internalMutation, not public
  void api.signals.createSignal;
  // @ts-expect-error broadcastSignal is internalMutation, not public
  void api.signals.broadcastSignal;
  // @ts-expect-error cleanupOldSignals is internalMutation, not public
  void api.signals.cleanupOldSignals;

  // control.ts
  // @ts-expect-error getPendingCommands is internalQuery, not public
  void api.control.getPendingCommands;
  // @ts-expect-error markCommandProcessing is internalMutation, not public
  void api.control.markCommandProcessing;
  // @ts-expect-error updateCommandStatus is internalMutation, not public
  void api.control.updateCommandStatus;
  // @ts-expect-error markCommandCompleted is internalMutation, not public
  void api.control.markCommandCompleted;
  // @ts-expect-error clearCompletedCommands is internalMutation, not public
  void api.control.clearCompletedCommands;

  // logs.ts
  // @ts-expect-error addLog is internalMutation, not public
  void api.logs.addLog;
  // @ts-expect-error clearLogs is internalMutation, not public
  void api.logs.clearLogs;
  // @ts-expect-error getLogsByAgent is internalQuery, not public
  void api.logs.getLogsByAgent;

  // --- Locked down: must BE on `internal` (no directive: must type-check). ---

  void internal.signals.createSignal;
  void internal.signals.broadcastSignal;
  void internal.signals.cleanupOldSignals;
  void internal.control.getPendingCommands;
  void internal.control.markCommandProcessing;
  void internal.control.updateCommandStatus;
  void internal.control.markCommandCompleted;
  void internal.control.clearCompletedCommands;
  void internal.logs.addLog;
  void internal.logs.clearLogs;
  void internal.logs.getLogsByAgent;

  // --- Kept public: must stay on `api` (no directive: must type-check). ---

  void api.signals.getRecentSignals;
  void api.control.sendCommand;
  void api.logs.getRecentLogs;
}
