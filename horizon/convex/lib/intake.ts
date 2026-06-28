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
 * Validate and normalize an untrusted signal body.
 *
 * Rejects anything that is not a non-null object, or where `source`,
 * `companyDomain`, or `kind` is not a non-empty string. `payload` is optional
 * (any). On success the returned value carries the NORMALIZED `companyDomain`;
 * if normalization yields an empty string the body is rejected.
 *
 * `error` is always a short, clean human string: no stack, no raw exception.
 */
export function parseSignalBody(
  body: unknown,
): { ok: true; value: SignalInput } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "body must be a JSON object" };
  }
  const b = body as Record<string, unknown>;
  if (!isNonEmptyString(b.source)) {
    return { ok: false, error: "source must be a non-empty string" };
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
      source: b.source,
      companyDomain,
      kind: b.kind,
      payload: b.payload,
    },
  };
}
