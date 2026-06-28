import { NextResponse } from "next/server";
import { parseSignalBody } from "../../../convex/lib/intake";

/**
 * Ingress proxy: the client POSTs typed ICP / domain here; we forward to the
 * Convex HTTP action `POST /signal` (served from the deployment's *.convex.site
 * origin). Keeping a same-origin Next route avoids CORS and hides the Convex URL.
 *
 * In fixture mode (no deployment configured) this returns 503 and the client
 * swallows it, so the UI stays responsive.
 */
function convexSiteUrl(): string | null {
  const cloud =
    process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
  if (!cloud) return null;
  // https://<deployment>.convex.cloud -> https://<deployment>.convex.site
  return cloud.replace(/\.convex\.cloud\/?$/, ".convex.site");
}

export async function POST(req: Request) {
  const site = convexSiteUrl();
  if (!site) {
    return NextResponse.json(
      { ok: false, error: "Convex deployment not configured (fixture mode)." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Validate + normalize up front (audit #4): reject type-invalid bodies here
  // instead of round-tripping them to Convex only to get a 500. parseSignalBody
  // is pure (no Convex server imports) so it bundles cleanly into this route.
  const parsed = parseSignalBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  try {
    const res = await fetch(`${site}/signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.value),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "upstream error" },
      { status: 502 }
    );
  }
}
