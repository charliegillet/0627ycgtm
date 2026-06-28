import { describe, it, expect } from "vitest";
import { normalizeDomain, parseSignalBody } from "./intake";

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
    if (r.ok) expect(r.value.payload).toEqual({ headcount: 12, nested: { ok: true } });
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
});
