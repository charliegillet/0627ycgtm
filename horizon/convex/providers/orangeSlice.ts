// Orange Slice provider — funding / hiring / tech legs.
//
// FIXTURE MODE by default: when `ORANGESLICE_API_KEY` is absent we return the
// seeded fixture for the domain. When the key is present we call the real
// `orangeslice` services (crunchbase / predictLeads / builtWith), wrapped in
// try/catch so a live failure degrades to the fixture rather than crashing the
// pipeline.
//
// Every call goes through `withCache` (cache-first over `apiCache`) and writes a
// `traces` row describing the stage. Responses are normalized into the contract
// `Leg` shape: { ageDays } | { count } | { present }.

import { v } from "convex/values";
import { internalAction, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Leg } from "../lib/convergence";
import { fixtureLeg } from "./fixtures";
import { withCache } from "./cache";

const PROVIDER = "orangeSlice";

// ----- trace writer (db layer) -----------------------------------------------

// Write a single `traces` row. Called from the action via runMutation.
export const writeTrace = internalMutation({
  args: {
    runId: v.id("runs"),
    stage: v.string(),
    level: v.union(v.literal("info"), v.literal("warn"), v.literal("error")),
    message: v.string(),
    durationMs: v.optional(v.number()),
  },
  handler: async (ctx, { runId, stage, level, message, durationMs }) => {
    await ctx.db.insert("traces", {
      runId,
      stage,
      level,
      message,
      durationMs,
      at: Date.now(),
    });
  },
});

// ----- normalization ---------------------------------------------------------
//
// Map a raw provider response into the `Leg` shape for each op. These are
// defensive: real provider payloads vary, so we read the most likely fields and
// fall back to null (an absent leg) when nothing usable is found.

function normalizeFunding(raw: unknown): Leg {
  // Expect rows from crunchbase lean table; take the most recent funding date.
  const rows = Array.isArray(raw) ? raw : [];
  let newestMs: number | null = null;
  for (const row of rows as Array<Record<string, unknown>>) {
    const dateVal =
      row.announced_on ?? row.last_funding_at ?? row.funding_date ?? row.date;
    if (typeof dateVal === "string" || typeof dateVal === "number") {
      const ms = new Date(dateVal).getTime();
      if (!Number.isNaN(ms) && (newestMs === null || ms > newestMs)) {
        newestMs = ms;
      }
    }
  }
  if (newestMs === null) return null;
  const ageDays = Math.max(0, Math.round((Date.now() - newestMs) / 86_400_000));
  return { ageDays };
}

function normalizeHiring(raw: unknown): Leg {
  // predictLeads companyJobOpenings → count of open roles.
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const data = obj.data;
    if (Array.isArray(data)) return { count: data.length };
    if (typeof obj.total === "number") return { count: obj.total };
    if (typeof obj.count === "number") return { count: obj.count };
  }
  if (Array.isArray(raw)) return { count: raw.length };
  return null;
}

function normalizeTech(raw: unknown): Leg {
  // builtWith lookupDomain → presence of any detected technology.
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const techs =
      (obj.technologies as unknown) ??
      (obj.results as unknown) ??
      (obj.data as unknown);
    if (Array.isArray(techs)) return { present: techs.length > 0 };
    if (techs && typeof techs === "object") {
      return { present: Object.keys(techs).length > 0 };
    }
  }
  if (Array.isArray(raw)) return { present: raw.length > 0 };
  return null;
}

// ----- live calls (only when ORANGESLICE_API_KEY is set) ---------------------

async function liveFetch(
  op: "funding" | "hiring" | "tech",
  domain: string,
): Promise<Leg> {
  // Imported lazily so fixture mode never loads the SDK / network layer.
  const { services, configure } = await import("orangeslice");
  configure({ apiKey: process.env.ORANGESLICE_API_KEY as string });

  if (op === "funding") {
    const rows = await services.crunchbase.search({
      sql: `SELECT announced_on FROM funding_rounds WHERE company_domain = '${domain}' ORDER BY announced_on DESC LIMIT 5`,
    });
    return normalizeFunding(rows);
  }
  if (op === "hiring") {
    const res = await services.predictLeads.companyJobOpenings({ domain });
    return normalizeHiring(res);
  }
  // tech
  const res = await services.builtWith.lookupDomain({ domain });
  return normalizeTech(res);
}

// ----- public internalAction -------------------------------------------------

// Fetch one convergence leg for a domain. Goes through the cache, writes a
// trace, and returns a normalized `Leg`. `runId` is optional so the leg can be
// fetched outside a pipeline run (no trace written in that case).
export const callOrangeSlice = internalAction({
  args: {
    op: v.union(v.literal("funding"), v.literal("hiring"), v.literal("tech")),
    domain: v.string(),
    runId: v.optional(v.id("runs")),
  },
  handler: async (ctx, { op, domain, runId }): Promise<Leg> => {
    const started = Date.now();
    const live = Boolean(process.env.ORANGESLICE_API_KEY);

    let level: "info" | "warn" | "error" = "info";
    let mode = live ? "live" : "fixture";

    const leg = await withCache<Leg>(
      ctx,
      { provider: PROVIDER, op, key: domain },
      async () => {
        if (live) {
          try {
            return await liveFetch(op, domain);
          } catch (err) {
            // Live failure degrades to fixture so the pipeline keeps moving.
            level = "warn";
            mode = "fixture(live-failed)";
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(`[orangeSlice] live ${op} failed for ${domain}: ${msg}`);
            return fixtureLeg(op, domain);
          }
        }
        return fixtureLeg(op, domain);
      },
    );

    if (runId) {
      await ctx.runMutation(internal.providers.orangeSlice.writeTrace, {
        runId,
        stage: `orangeSlice:${op}`,
        level,
        message: `${op} leg for ${domain} (${mode}) → ${JSON.stringify(leg)}`,
        durationMs: Date.now() - started,
      });
    }

    return leg;
  },
});
