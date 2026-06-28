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
 * POST /signal — external webhook for GTM signals. Body: { source, companyDomain, kind, payload? }.
 * Routes into the same recordSignal entry point the cron poll uses.
 *
 * Hardening (audit #4): the body is validated and normalized by parseSignalBody
 * BEFORE it reaches internal.detect.recordSignal (whose args are strict
 * v.string()). A type-invalid body used to slip past the truthy check, trip the
 * Convex validator, and leak an internal stack as a 500; now it returns a clean
 * 400. A per-domain fixed-window rate limit caps the intake.
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

    // Rate-limit per normalized companyDomain.
    const { allowed } = await ctx.runMutation(internal.rateLimit.take, {
      key: `signal:${parsed.value.companyDomain}`,
    });
    if (!allowed) {
      return jsonError("rate limit exceeded; try again later", 429);
    }

    const result = await ctx.runMutation(
      internal.detect.recordSignal,
      parsed.value,
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
