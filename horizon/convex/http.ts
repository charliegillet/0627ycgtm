import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { parseSignalBody } from "./lib/intake";

const http = httpRouter();

function jsonError(error: string, status: number): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * POST /signal — external webhook for GTM signals. Two body shapes share one
 * route (discriminated by parseSignalBody):
 *   - domain: { source, companyDomain, kind, payload? } -> recordSignal.
 *   - icp:    { source, kind:"icp", payload:{ icp }, limit? } -> resolveIcp,
 *     which resolves the ICP to candidate domains and fans each into the same
 *     recordSignal entry point.
 *
 * Hardening (audit #4): the body is validated and normalized by parseSignalBody
 * BEFORE it reaches internal.detect.recordSignal (whose args are strict
 * v.string()). A type-invalid body used to slip past the truthy check, trip the
 * Convex validator, and leak an internal stack as a 500; now it returns a clean
 * 400. A fixed-window rate limit caps the intake (per-domain for domain mode,
 * per-(source, icp) for ICP mode).
 */
http.route({
  path: "/signal",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("invalid JSON body", 400);
    }

    const parsed = parseSignalBody(body);
    if (!parsed.ok) {
      return jsonError(parsed.error, 400);
    }

    if (parsed.value.mode === "icp") {
      const { source, icp, limit } = parsed.value;
      // Rate-limit per (source, icp) so one description cannot flood the
      // resolver (and, through it, the per-domain pipeline).
      const { allowed } = await ctx.runMutation(internal.rateLimit.take, {
        key: `icp:${source}:${icp}`,
      });
      if (!allowed) {
        return jsonError("rate limit exceeded; try again later", 429);
      }

      const result = await ctx.runAction(internal.icp.resolveIcp, {
        icp,
        limit,
        source,
      });
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Domain mode: unchanged Batch B behavior.
    const { source, kind, companyDomain, payload } = parsed.value;
    // Rate-limit per normalized companyDomain.
    const { allowed } = await ctx.runMutation(internal.rateLimit.take, {
      key: `signal:${companyDomain}`,
    });
    if (!allowed) {
      return jsonError("rate limit exceeded; try again later", 429);
    }

    const result = await ctx.runMutation(internal.detect.recordSignal, {
      source,
      kind,
      companyDomain,
      payload,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
