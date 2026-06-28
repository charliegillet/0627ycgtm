import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

/**
 * POST /signal — external webhook for GTM signals. Body: { source, companyDomain, kind, payload? }.
 * Routes into the same recordSignal entry point the cron poll uses.
 */
http.route({
  path: "/signal",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: {
      source?: string;
      companyDomain?: string;
      kind?: string;
      payload?: unknown;
    };
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { source, companyDomain, kind, payload } = body;
    if (!source || !companyDomain || !kind) {
      return new Response(
        JSON.stringify({
          error: "source, companyDomain and kind are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await ctx.runMutation(internal.detect.recordSignal, {
      source,
      companyDomain,
      kind,
      payload,
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
