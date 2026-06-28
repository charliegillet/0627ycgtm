// Signal intake validation and domain normalization.
//
// Pure TypeScript (no `convex/server` imports) so the Next route
// (`app/api/signal/route.ts`) can import it without bundling Convex server
// code. The Convex HTTP action (`convex/http.ts`) and the Next proxy both run
// this BEFORE handing a body to `internal.detect.recordSignal`, whose args are
// strict `v.string()`. Without this guard a type-invalid body (e.g.
// `{ source: 123, ... }`) passes a truthy check, reaches the Convex validator,
// and throws, leaking an internal stack as a 500. Validating here turns that
// into a clean 400.

export type SignalInput = {
  source: string;
  companyDomain: string;
  kind: string;
  payload?: unknown;
};

/**
 * A parsed, validated signal body. Two shapes share the one ingress contract:
 *   - "domain": the original Batch B path (validate + normalize a companyDomain).
 *   - "icp": a natural-language ICP description that the resolver turns into
 *     candidate domains, each of which then runs the normal domain pipeline.
 * The `mode` discriminant is internal only; `toWireBody` strips it so nothing
 * forwarded upstream carries it.
 */
export type ParsedSignal =
  | {
      mode: "domain";
      source: string;
      kind: string;
      companyDomain: string;
      payload?: unknown;
    }
  | { mode: "icp"; source: string; icp: string; limit: number };

// Default and bounds for the ICP resolver fan-out (how many domains we resolve
// an ICP to). Clamped so a caller cannot request an unbounded fan-out.
const ICP_DEFAULT_LIMIT = 3;
const ICP_MIN_LIMIT = 1;
const ICP_MAX_LIMIT = 5;

/**
 * Normalize a company domain to a bare host:
 *   - trim and lowercase
 *   - strip a leading scheme (`http://` / `https://`)
 *   - strip a leading userinfo segment (`user@` / `user:pass@`)
 *   - strip one or more leading `www.` prefixes
 *   - keep host only (drop any path / query / fragment)
 *   - strip a trailing `:port`
 *   - strip a trailing dot and trailing slash
 *
 * Examples:
 *   "HTTPS://WWW.Stripe.com/pricing?x=1#a"      -> "stripe.com"
 *   "Acme.COM/"                                 -> "acme.com"
 *   "  http://www.foo.io  "                     -> "foo.io"
 *   "host.com:8080"                             -> "host.com"
 *   "user:pass@host.com"                        -> "host.com"
 *   "https://user@WWW.WWW.Foo.com:443/x?y#z"    -> "foo.com"
 *
 * Empty / whitespace-only input returns "". Pure and never throws.
 */
export function normalizeDomain(input: string): string {
  let s = input.trim().toLowerCase();
  if (s === "") return "";
  // Strip scheme.
  s = s.replace(/^https?:\/\//, "");
  // Strip a leading userinfo segment (everything up to and including an `@`
  // that precedes the host). The class excludes path/query/fragment delims so a
  // later `@` inside a path cannot be mistaken for userinfo.
  s = s.replace(/^[^@/?#]+@/, "");
  // Strip one or more leading www. prefixes (e.g. www.www.foo.com -> foo.com).
  s = s.replace(/^(www\.)+/, "");
  // Keep host only: cut at the first path / query / fragment delimiter.
  s = s.split(/[/?#]/)[0];
  // Strip a trailing :port from the host segment.
  s = s.replace(/:\d+$/, "");
  // Strip a trailing dot (FQDN root) and any stray trailing slash.
  s = s.replace(/[./]+$/, "");
  return s;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Validate and normalize an untrusted signal body into a `ParsedSignal`.
 *
 * Both modes require `source` to be a non-empty string and `body` to be a
 * non-null object.
 *
 * ICP mode (`body.kind === "icp"`): `body.payload` must be an object with a
 * non-empty string `payload.icp`. `limit` defaults to 3; a provided `limit`
 * must be a number (else reject) and is clamped to [1, 5].
 *
 * Domain mode (anything else): the original Batch B checks unchanged. `kind`
 * and `companyDomain` must be non-empty strings; `companyDomain` is normalized
 * and rejected if it normalizes to empty. A body with neither `kind:"icp"` nor
 * a valid `companyDomain` falls through to these checks and is rejected.
 *
 * `error` is always a short, clean human string: no stack, no raw exception.
 */
export function parseSignalBody(
  body: unknown,
): { ok: true; value: ParsedSignal } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  if (!isNonEmptyString(b.source)) {
    return { ok: false, error: "source must be a non-empty string" };
  }

  if (b.kind === "icp") {
    if (typeof b.payload !== "object" || b.payload === null) {
      return { ok: false, error: "payload must be an object with an icp string" };
    }
    const icp = (b.payload as Record<string, unknown>).icp;
    if (!isNonEmptyString(icp)) {
      return { ok: false, error: "payload.icp must be a non-empty string" };
    }
    let limit = ICP_DEFAULT_LIMIT;
    if (b.limit !== undefined) {
      if (typeof b.limit !== "number" || !Number.isFinite(b.limit)) {
        return { ok: false, error: "limit must be a number" };
      }
      limit = Math.max(ICP_MIN_LIMIT, Math.min(ICP_MAX_LIMIT, Math.floor(b.limit)));
    }
    return { ok: true, value: { mode: "icp", source: b.source, icp, limit } };
  }

  if (!isNonEmptyString(b.companyDomain)) {
    return { ok: false, error: "companyDomain must be a non-empty string" };
  }
  if (!isNonEmptyString(b.kind)) {
    return { ok: false, error: "kind must be a non-empty string" };
  }
  const companyDomain = normalizeDomain(b.companyDomain);
  if (companyDomain === "") {
    return { ok: false, error: "companyDomain is not a valid domain" };
  }
  return {
    ok: true,
    value: {
      mode: "domain",
      source: b.source,
      companyDomain,
      kind: b.kind,
      payload: b.payload,
    },
  };
}

/**
 * Canonical body to forward upstream from the Next proxy to the Convex HTTP
 * action. Strips the internal `mode` discriminant so the wire body re-parses to
 * the identical `ParsedSignal` on the Convex side. Domain mode echoes the
 * (now-normalized) fields; ICP mode rebuilds the `{ payload: { icp }, limit }`
 * shape the action re-parses.
 */
export function toWireBody(value: ParsedSignal): Record<string, unknown> {
  if (value.mode === "icp") {
    return {
      source: value.source,
      kind: "icp",
      payload: { icp: value.icp },
      limit: value.limit,
    };
  }
  return {
    source: value.source,
    kind: value.kind,
    companyDomain: value.companyDomain,
    payload: value.payload,
  };
}
