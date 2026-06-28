import { mutation } from "./_generated/server";

export const deleteAllMissions = mutation({
  args: {},
  handler: async (ctx) => {
    const missions = await ctx.db.query("missions").collect();
    for (const mission of missions) {
      await ctx.db.delete(mission._id);
    }
    return `Deleted ${missions.length} missions`;
  },
});

export const deleteAllAgents = mutation({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    for (const agent of agents) {
      await ctx.db.delete(agent._id);
    }
    return `Deleted ${agents.length} agents`;
  },
});

export const deleteAllDiscoveries = mutation({
  args: {},
  handler: async (ctx) => {
    const discoveries = await ctx.db.query("discoveries").collect();
    for (const discovery of discoveries) {
      await ctx.db.delete(discovery._id);
    }
    return `Deleted ${discoveries.length} discoveries`;
  },
});

export const deleteAllLivestreams = mutation({
  args: {},
  handler: async () => {
    // Livestream table removed from schema - this is a no-op
    return `Livestream table no longer exists`;
  },
});

export const deleteAllLogs = mutation({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db.query("logs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
    return `Deleted ${logs.length} logs`;
  },
});

export const deleteAllControlCommands = mutation({
  args: {},
  handler: async (ctx) => {
    const commands = await ctx.db.query("control").collect();
    for (const command of commands) {
      await ctx.db.delete(command._id);
    }
    return `Deleted ${commands.length} control commands`;
  },
});

// The BEACHHEAD GTM tables the demo actually populates. resetAll clears these
// so a reset returns the lead board to empty (the confirm text promises this).
const BEACHHEAD_TABLES = [
  "companies",
  "leads",
  "signalEvents",
  "scores",
  "actions",
  "runs",
  "traces",
  "apiCache",
] as const;

// Legacy viz tables (3D scene / activity feed) reset alongside the GTM data so
// the whole UI returns to a clean state.
const LEGACY_TABLES = [
  "missions",
  "agents",
  "discoveries",
  "logs",
  "signals",
  "control",
] as const;

/**
 * Reset everything - delete all data for both the BEACHHEAD GTM pipeline and the
 * legacy viz tables, so the lead board AND the 3D scene return to empty.
 *
 * NOTE: This is a PUBLIC mutation with no auth — anyone who can reach the
 * deployment can wipe all data. Locking this down (auth / role check) is
 * deferred to a dedicated security PR; this change only makes the reset
 * CORRECT and its confirm text HONEST about what it deletes.
 *
 * We don't send stop_all here because:
 * 1. If there's no running orchestrator, the command lingers and stops the NEXT mission.
 * 2. The orchestrator should handle cleanup via the Stop All UI button, not reset.
 */
export const resetAll = mutation({
  args: {},
  handler: async (ctx) => {
    const deleted: Record<string, number> = {};

    for (const table of [...BEACHHEAD_TABLES, ...LEGACY_TABLES]) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
      deleted[table] = rows.length;
    }

    // DO NOT insert stop_all - it causes issues with new missions.
    // If the user wants to stop running sessions, they should use Stop All first.

    return deleted;
  },
});
