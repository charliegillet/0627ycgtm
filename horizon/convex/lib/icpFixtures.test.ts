import { describe, it, expect } from "vitest";
import { resolveIcpToDomains } from "./icpFixtures";

// Fails-if-reverted: if the category matching were dropped (always fallback) the
// fintech/devtools assertions below would fail; if the fallback were removed the
// unknown-phrase case would return an empty list; if the slice were dropped the
// limit assertion would fail.

describe("resolveIcpToDomains", () => {
  it("resolves a fintech ICP to fintech domains with a truthy match", () => {
    const r = resolveIcpToDomains(
      "Series A fintech in the US, 50-200 employees",
      3,
    );
    expect(r.matched).toBeTruthy();
    expect(r.matched).toBe("fintech");
    expect(r.domains).toContain("mercury.com");
    expect(r.domains).toContain("stripe.com");
  });

  it("resolves a devtools phrase to devtools domains", () => {
    const r = resolveIcpToDomains("developer tools / API platform", 3);
    expect(r.matched).toBe("devtools");
    expect(r.domains).toContain("linear.app");
  });

  it("matches short standalone tokens (ai/ml) without substring false hits", () => {
    expect(resolveIcpToDomains("an AI/ML startup", 3).matched).toBe("ai");
    // "retail" / "maintain" contain the substring "ai" but are not the token.
    expect(resolveIcpToDomains("retail brand for maintainers", 3).matched).not.toBe(
      "ai",
    );
  });

  it("falls back to a non-empty list with matched=null on an unknown phrase", () => {
    const r = resolveIcpToDomains("purple llama farms in Peru", 3);
    expect(r.matched).toBeNull();
    expect(r.domains.length).toBeGreaterThan(0);
  });

  it("never returns more domains than the limit and is deterministic", () => {
    const one = resolveIcpToDomains("fintech payments", 1);
    expect(one.domains.length).toBeLessThanOrEqual(1);
    expect(one.domains.length).toBeGreaterThan(0);

    const five = resolveIcpToDomains("fintech payments", 5);
    expect(five.domains.length).toBeLessThanOrEqual(5);

    // Same input -> same output.
    expect(resolveIcpToDomains("cloud infra devops", 3)).toEqual(
      resolveIcpToDomains("cloud infra devops", 3),
    );
  });
});
