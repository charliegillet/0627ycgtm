import { describe, it, expect } from "vitest";
import { normalizeDomain, parseSignalBody, toWireBody } from "./intake";

// Fails-if-reverted: if normalizeDomain were removed/weakened, the scheme/www/
// path-stripping cases below would return the raw input and fail. If
// parseSignalBody's type checks were reverted to a truthy check, the
// `source: 123` / non-object / empty-string cases would wrongly return ok:true.

describe("normalizeDomain", () => {
  it("strips scheme, www, path, query, fragment and lowercases", () => {
    expect(normalizeDomain("HTTPS://WWW.Stripe.com/pricing?x=1#a")).toBe(
      "stripe.com",
    );
  });

  it("strips a trailing slash", () => {
    expect(normalizeDomain("Acme.COM/")).toBe("acme.com");
  });

  it("trims surrounding whitespace and strips scheme + www", () => {
    expect(normalizeDomain("  http://www.foo.io  ")).toBe("foo.io");
  });

  it("strips a trailing dot (FQDN root)", () => {
    expect(normalizeDomain("Example.com.")).toBe("example.com");
  });

  it("returns empty string for empty / whitespace input", () => {
    expect(normalizeDomain("")).toBe("");
    expect(normalizeDomain("   ")).toBe("");
  });

  it("leaves an already-bare domain untouched (just lowercases)", () => {
    expect(normalizeDomain("stripe.com")).toBe("stripe.com");
  });

  // M1: strip a trailing :port so "host.com:8080" and "host.com" share one key.
  it("strips a trailing port", () => {
    expect(normalizeDomain("host.com:8080")).toBe("host.com");
  });

  // M1: strip leading userinfo so credentials never fragment the key.
  it("strips leading userinfo (user:pass@)", () => {
    expect(normalizeDomain("user:pass@host.com")).toBe("host.com");
  });

  // M2: collapse repeated leading www. prefixes.
  it("collapses repeated leading www. prefixes", () => {
    expect(normalizeDomain("WWW.WWW.foo.com")).toBe("foo.com");
  });

  // M1 + M2 combined: scheme + userinfo + repeated www + port + path/query/fragment.
  it("handles scheme, userinfo, repeated www, port and path together", () => {
    expect(normalizeDomain("https://user@WWW.WWW.Foo.com:443/x?y#z")).toBe(
      "foo.com",
    );
  });
});

describe("parseSignalBody", () => {
  it("accepts a valid body and normalizes the domain", () => {
    const r = parseSignalBody({
      source: "webhook",
      companyDomain: "HTTPS://WWW.Stripe.com/x",
      kind: "funding",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toEqual({
        mode: "domain",
        source: "webhook",
        companyDomain: "stripe.com",
        kind: "funding",
        payload: undefined,
      });
    }
  });

  it("accepts an optional payload of any shape", () => {
    const r = parseSignalBody({
      source: "webhook",
      companyDomain: "acme.com",
      kind: "hiring",
      payload: { headcount: 12, nested: { ok: true } },
    });
    expect(r.ok).toBe(true);
    if (r.ok && r.value.mode === "domain")
      expect(r.value.payload).toEqual({ headcount: 12, nested: { ok: true } });
  });

  it("rejects a numeric source (type-invalid) with a clean error", () => {
    const r = parseSignalBody({ source: 123, companyDomain: "x.com", kind: "k" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(typeof r.error).toBe("string");
      // No stack leak.
      expect(r.error).not.toMatch(/at \w|\.ts:\d|Error:/);
    }
  });

  it("rejects a missing kind", () => {
    expect(parseSignalBody({ source: "s", companyDomain: "x.com" }).ok).toBe(false);
  });

  it("rejects null", () => {
    expect(parseSignalBody(null).ok).toBe(false);
  });

  it("rejects a non-object (string / number)", () => {
    expect(parseSignalBody("not json").ok).toBe(false);
    expect(parseSignalBody(42).ok).toBe(false);
  });

  it("rejects empty-string fields", () => {
    expect(
      parseSignalBody({ source: "", companyDomain: "x.com", kind: "k" }).ok,
    ).toBe(false);
    expect(
      parseSignalBody({ source: "s", companyDomain: "   ", kind: "k" }).ok,
    ).toBe(false);
  });

  it("rejects a domain that normalizes to empty", () => {
    // "https://" alone has no host -> normalizes to "".
    expect(
      parseSignalBody({ source: "s", companyDomain: "https://", kind: "k" }).ok,
    ).toBe(false);
  });

  it("tags domain bodies with mode:'domain'", () => {
    const r = parseSignalBody({
      source: "s",
      companyDomain: "acme.com",
      kind: "k",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.mode).toBe("domain");
  });
});

// Fails-if-reverted: if the kind:"icp" branch were dropped, an ICP body would
// fall through to the domain checks and be rejected for a missing companyDomain
// (mode-checks below would fail). If the icp/payload validation were weakened,
// the missing/empty/typed-wrong cases would wrongly parse ok.
describe("parseSignalBody — ICP mode", () => {
  it("accepts a valid ICP body, defaults limit to 3", () => {
    const r = parseSignalBody({
      source: "manual",
      kind: "icp",
      payload: { icp: "Series A fintech in the US, 50-200 employees" },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.mode).toBe("icp");
      if (r.value.mode === "icp") {
        expect(r.value.source).toBe("manual");
        expect(r.value.icp).toBe(
          "Series A fintech in the US, 50-200 employees",
        );
        expect(r.value.limit).toBe(3);
      }
    }
  });

  it("clamps an out-of-range limit into [1, 5] and floors it", () => {
    const hi = parseSignalBody({
      source: "s",
      kind: "icp",
      payload: { icp: "devtools" },
      limit: 99,
    });
    const lo = parseSignalBody({
      source: "s",
      kind: "icp",
      payload: { icp: "devtools" },
      limit: 0,
    });
    const frac = parseSignalBody({
      source: "s",
      kind: "icp",
      payload: { icp: "devtools" },
      limit: 2.9,
    });
    expect(hi.ok && hi.value.mode === "icp" && hi.value.limit).toBe(5);
    expect(lo.ok && lo.value.mode === "icp" && lo.value.limit).toBe(1);
    expect(frac.ok && frac.value.mode === "icp" && frac.value.limit).toBe(2);
  });

  it("rejects an ICP body with missing or empty payload.icp", () => {
    expect(
      parseSignalBody({ source: "s", kind: "icp", payload: {} }).ok,
    ).toBe(false);
    expect(
      parseSignalBody({ source: "s", kind: "icp", payload: { icp: "" } }).ok,
    ).toBe(false);
    expect(
      parseSignalBody({ source: "s", kind: "icp", payload: { icp: "   " } }).ok,
    ).toBe(false);
    // payload itself missing / not an object.
    expect(parseSignalBody({ source: "s", kind: "icp" }).ok).toBe(false);
    expect(
      parseSignalBody({ source: "s", kind: "icp", payload: "nope" }).ok,
    ).toBe(false);
  });

  it("rejects an ICP body with a non-numeric limit", () => {
    const r = parseSignalBody({
      source: "s",
      kind: "icp",
      payload: { icp: "devtools" },
      limit: "3",
    });
    expect(r.ok).toBe(false);
  });

  it("rejects a body with neither companyDomain nor kind:'icp'", () => {
    // Falls through to the domain path, which needs a companyDomain.
    expect(parseSignalBody({ source: "s", kind: "manual" }).ok).toBe(false);
    expect(parseSignalBody({ source: "s" }).ok).toBe(false);
  });
});

// Fails-if-reverted: toWireBody must strip the internal `mode` discriminant and
// re-emit a body that parseSignalBody re-parses to the identical ParsedSignal.
// If `mode` leaked or the icp shape were wrong, the round-trip below would fail.
describe("toWireBody", () => {
  it("round-trips a domain body without leaking `mode`", () => {
    const parsed = parseSignalBody({
      source: "webhook",
      companyDomain: "HTTPS://WWW.Stripe.com/x",
      kind: "funding",
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const wire = toWireBody(parsed.value);
    expect("mode" in wire).toBe(false);
    expect(wire).toEqual({
      source: "webhook",
      kind: "funding",
      companyDomain: "stripe.com",
      payload: undefined,
    });
    // Re-parse yields the identical ParsedSignal.
    const reparsed = parseSignalBody(wire);
    expect(reparsed.ok && reparsed.value).toEqual(parsed.value);
  });

  it("round-trips an ICP body without leaking `mode`", () => {
    const parsed = parseSignalBody({
      source: "manual",
      kind: "icp",
      payload: { icp: "devtools shop" },
      limit: 2,
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const wire = toWireBody(parsed.value);
    expect("mode" in wire).toBe(false);
    expect(wire).toEqual({
      source: "manual",
      kind: "icp",
      payload: { icp: "devtools shop" },
      limit: 2,
    });
    const reparsed = parseSignalBody(wire);
    expect(reparsed.ok && reparsed.value).toEqual(parsed.value);
  });
});
