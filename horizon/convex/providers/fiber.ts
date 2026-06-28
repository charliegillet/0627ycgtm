// Fiber provider — contact reveal / live LinkedIn lookup.
//
// REST API: https://api.fiber.ai/v1/...  with `Authorization: Bearer $FIBER_API_KEY`.
// FIXTURE MODE by default: returns synthetic data unless `FIBER_API_KEY` is set.
//
// IMPORTANT: `reveal` is intentionally OFF the live path. Even when a key is
// present we never hit the live reveal endpoint here (cost / compliance) — it
// always returns a synthetic, clearly-labeled contact. Only `liveLinkedin`
// makes a real network call when the key exists.

import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { withCache } from "./cache";

const PROVIDER = "fiber";
const BASE_URL = "https://api.fiber.ai/v1";

// True for any value carrying the synthetic marker (a labeled fixture).
function isSynthetic(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as Record<string, unknown>).__synthetic,
  );
}

// Synthetic fixtures, keyed by op. Every payload is tagged __synthetic: true.
function fixtureReveal(ref: string) {
  return {
    ref,
    fullName: "Synthetic Contact",
    title: "VP of Engineering",
    email: `contact@${ref.includes("@") ? ref.split("@")[1] : "example.com"}`,
    __synthetic: true,
  };
}

function fixtureLiveLinkedin(ref: string) {
  return {
    ref,
    linkedin: `https://www.linkedin.com/in/synthetic-${ref.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
    active: true,
    __synthetic: true,
  };
}

// Live LinkedIn lookup via Fiber REST. Only called when FIBER_API_KEY is set.
async function liveLinkedin(ref: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/linkedin/live`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FIBER_API_KEY as string}`,
    },
    body: JSON.stringify({ ref }),
  });
  if (!res.ok) {
    throw new Error(`Fiber liveLinkedin ${res.status}: ${await res.text()}`);
  }
  return await res.json();
}

// Fetch a Fiber result. reveal is always fixture; liveLinkedin goes live when
// FIBER_API_KEY is set, else fixture. Cache-first either way.
export const callFiber = internalAction({
  args: {
    op: v.union(v.literal("reveal"), v.literal("liveLinkedin")),
    ref: v.string(),
  },
  handler: async (ctx, { op, ref }): Promise<unknown> => {
    return await withCache(
      ctx,
      { provider: PROVIDER, op, key: ref },
      async () => {
        // reveal is OFF the live path — always synthetic.
        if (op === "reveal") {
          return fixtureReveal(ref);
        }

        // liveLinkedin: live only when a key is present.
        if (process.env.FIBER_API_KEY) {
          try {
            return await liveLinkedin(ref);
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            console.warn(`[fiber] live liveLinkedin failed for ${ref}: ${msg}`);
            return fixtureLiveLinkedin(ref);
          }
        }
        return fixtureLiveLinkedin(ref);
      },
      // Same cache-poisoning guard as the convergence legs: never persist a
      // synthetic value. `reveal` (intentionally always synthetic) is therefore
      // re-derived per call rather than cached, and a degraded liveLinkedin
      // re-attempts the live call next time instead of replaying a fixture.
      (value) => !isSynthetic(value),
    );
  },
});
