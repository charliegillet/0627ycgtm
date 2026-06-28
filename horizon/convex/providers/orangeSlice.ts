"use node";

// Orange Slice provider — funding / hiring / tech legs.
//
// Runs in the Convex NODE runtime ("use node" above): the `orangeslice` npm SDK
// fails in the default V8 runtime ("a is not a function"), so this action file
// must run in Node. A "use node" file may export ONLY actions, so the trace
// writer (an internalMutation) lives in ./trace and is called via runMutation.
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
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";
import type { Leg } from "../lib/convergence";
import {
  normalizeFunding,
  normalizeHiring,
  normalizeTech,
} from "../lib/normalizeLegs";
import { fixtureLeg } from "./fixtures";
import { withCacheStatus } from "./cache";

const PROVIDER = "orangeSlice";

// True for any leg value that carries the synthetic marker (i.e. came from a
// fixture, including a fixture produced inside the live-failure catch branch).
// Live results never carry this flag: even a genuine empty live result is a
// plain `null`, so this distinguishes "real no-rows" from "degraded to fixture".
function isSynthetic(leg: unknown): boolean {
  return Boolean(
    leg && typeof leg === "object" && (leg as Record<string, unknown>).__synthetic,
  );
}

// ----- normalization ---------------------------------------------------------
//
// The pure response normalizers (normalizeFunding / normalizeHiring /
// normalizeTech) live in ../lib/normalizeLegs so they can be unit-tested
// directly. This file is "use node" and may export only actions, so it imports
// them rather than defining (and exporting) them here.

// ----- live calls (only when ORANGESLICE_API_KEY is set) ---------------------

async function liveFetch(
  op: "funding" | "hiring" | "tech",
  domain: string,
): Promise<Leg> {
  // Imported lazily so fixture mode never loads the SDK / network layer.
  // `orangeslice` is a CommonJS package; under Convex's Node bundling its named
  // exports (`configure`, `services`) can land on `.default` via CJS/ESM interop,
  // so fall back to the default export when the named exports aren't on top.
  const mod = (await import("orangeslice")) as unknown as Record<string, unknown>;
  const sdk = (
    typeof mod.configure === "function" ? mod : (mod.default ?? mod)
  ) as {
    configure: (opts: { apiKey: string }) => void;
    services: typeof import("orangeslice")["services"];
  };
  const { services, configure } = sdk;
  configure({ apiKey: process.env.ORANGESLICE_API_KEY as string });

  if (op === "funding") {
    // Only `public.crunchbase_scraper_lean` is allowed on this plan. The
    // funding-date column is `last_funding_date`; the domain-ish column is
    // `website_url` (no bare-domain column exists). We extract the host from
    // website_url and compare it exactly, so `replit.com` matches but
    // `soundstripe.com` does not. The SDK's search only accepts { sql } (no
    // bound params), so the domain is lowercased and single-quotes are doubled
    // to remove the injection risk before interpolation.
    const safeDomain = domain.toLowerCase().replace(/'/g, "''");
    const rows = await services.crunchbase.search({
      sql: `SELECT name, website_url, last_funding_date, last_funding_type, last_funding_total_usd FROM public.crunchbase_scraper_lean WHERE lower(regexp_replace(website_url, '^https?://(www\\.)?([^/]+).*$', '\\2')) = '${safeDomain}' AND last_funding_date IS NOT NULL ORDER BY last_funding_date DESC NULLS LAST LIMIT 1`,
    });
    return normalizeFunding(rows);
  }
  if (op === "hiring") {
    // The SDK requires `company_id_or_domain` (not `domain`); `page: 1` is
    // required for the response to include the true total at meta.count.
    const res = await services.predictLeads.companyJobOpenings({
      company_id_or_domain: domain,
      page: 1,
    });
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

    // Did the live call actually fail (degraded to fixture) on THIS invocation?
    // Only meaningful on a cache miss; on a hit the fetcher never runs.
    let liveFailed = false;

    const { value: leg, cacheHit } = await withCacheStatus<Leg>(
      ctx,
      { provider: PROVIDER, op, key: domain },
      async () => {
        if (live) {
          try {
            // Live success returns a plain `Leg` (no __synthetic marker), so a
            // genuine empty result (null) stays distinguishable from a fixture.
            return await liveFetch(op, domain);
          } catch (err) {
            // Live failure degrades to fixture so the pipeline keeps moving.
            liveFailed = true;
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(`[orangeSlice] live ${op} failed for ${domain}: ${msg}`);
            return fixtureLeg(op, domain);
          }
        }
        return fixtureLeg(op, domain);
      },
      // CRITICAL: never cache a synthetic/fixture result. Caching it would let a
      // later cache HIT short-circuit the try/catch and replay the fixture as a
      // clean "live" success forever (cache poisoning). Only true live data is
      // cached, so a re-fired domain re-attempts the live call until it succeeds.
      (value) => !isSynthetic(value),
    );

    // Label the trace from what actually happened, not from optimistic defaults:
    //   - synthetic value         -> fixture (it is a labeled fixture, period)
    //       * served from cache   -> fixture(cached)        [pre-fix poisoned rows]
    //       * live failed this run -> fixture(live-failed)  [honest degrade]
    //       * no key at all        -> fixture
    //   - real live value
    //       * served from cache   -> live(cached)
    //       * fetched this run     -> live
    const synthetic = isSynthetic(leg);
    let mode: string;
    let level: "info" | "warn" | "error" = "info";
    if (synthetic) {
      if (cacheHit) {
        // A synthetic value served from cache means a pre-fix poisoned row
        // (post-fix we never cache synthetics). Surface it honestly as a fixture
        // and at warn so it is never mistaken for live data.
        mode = "fixture(cached)";
        level = "warn";
      } else if (liveFailed) {
        // Live call ran and failed this invocation: honest degrade.
        mode = "fixture(live-failed)";
        level = "warn";
      } else {
        // No key at all: the documented default fixture mode (info).
        mode = "fixture";
        level = "info";
      }
    } else {
      mode = cacheHit ? "live(cached)" : "live";
    }

    if (runId) {
      await ctx.runMutation(internal.providers.trace.writeTrace, {
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
