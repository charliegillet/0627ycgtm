import { describe, it, expect } from "vitest";
import {
  normalizeFunding,
  normalizeHiring,
  normalizeTech,
} from "./normalizeLegs";

describe("normalizeFunding", () => {
  it("reads last_funding_date and returns a finite non-negative ageDays", () => {
    const recent = new Date(Date.now() - 10 * 86_400_000).toISOString();
    const leg = normalizeFunding([{ last_funding_date: recent }]);
    expect(leg).not.toBeNull();
    expect(typeof leg!.ageDays).toBe("number");
    expect(Number.isFinite(leg!.ageDays)).toBe(true);
    expect(leg!.ageDays).toBeGreaterThanOrEqual(0);
    // ~10 days old, allowing for rounding.
    expect(leg!.ageDays).toBeLessThanOrEqual(11);
  });

  it("falls back to announced_on", () => {
    const recent = new Date(Date.now() - 3 * 86_400_000).toISOString();
    const leg = normalizeFunding([{ announced_on: recent }]);
    expect(leg).not.toBeNull();
    expect(leg!.ageDays).toBeGreaterThanOrEqual(0);
    expect(leg!.ageDays).toBeLessThanOrEqual(4);
  });

  it("takes the most recent date across multiple rows", () => {
    const old = new Date(Date.now() - 400 * 86_400_000).toISOString();
    const recent = new Date(Date.now() - 5 * 86_400_000).toISOString();
    const leg = normalizeFunding([
      { last_funding_date: old },
      { last_funding_date: recent },
    ]);
    expect(leg).not.toBeNull();
    expect(leg!.ageDays).toBeLessThanOrEqual(6);
  });

  it("returns null for an empty array", () => {
    expect(normalizeFunding([])).toBeNull();
  });

  it("returns null when no usable date field is present", () => {
    expect(normalizeFunding([{ name: "Acme" }])).toBeNull();
  });

  it("returns null for a non-array input", () => {
    expect(normalizeFunding(null)).toBeNull();
    expect(normalizeFunding({ last_funding_date: "2020-01-01" })).toBeNull();
  });

  it("ignores unparseable dates", () => {
    expect(normalizeFunding([{ last_funding_date: "not-a-date" }])).toBeNull();
  });
});

describe("normalizeHiring", () => {
  it("prefers meta.count over data.length", () => {
    const leg = normalizeHiring({
      meta: { count: 137 },
      data: [{}, {}, {}], // page-capped sample, must be ignored
    });
    expect(leg).toEqual({ count: 137 });
  });

  it("falls back to data.length when meta.count is absent", () => {
    const leg = normalizeHiring({ data: [{}, {}, {}, {}] });
    expect(leg).toEqual({ count: 4 });
  });

  it("falls back to total then count fields", () => {
    expect(normalizeHiring({ total: 9 })).toEqual({ count: 9 });
    expect(normalizeHiring({ count: 12 })).toEqual({ count: 12 });
  });

  it("counts a bare array", () => {
    expect(normalizeHiring([{}, {}])).toEqual({ count: 2 });
    expect(normalizeHiring([])).toEqual({ count: 0 });
  });

  it("returns null for a non-object, non-array input", () => {
    expect(normalizeHiring(null)).toBeNull();
    expect(normalizeHiring("nope")).toBeNull();
    expect(normalizeHiring(42)).toBeNull();
  });

  it("returns null for an object with no usable fields", () => {
    expect(normalizeHiring({ unrelated: true })).toBeNull();
  });
});

describe("normalizeTech", () => {
  it("reports present:true for a non-empty technologies array", () => {
    expect(normalizeTech({ technologies: ["react", "next"] })).toEqual({
      present: true,
    });
  });

  it("reports present:false for an empty technologies array", () => {
    expect(normalizeTech({ technologies: [] })).toEqual({ present: false });
  });

  it("reports present from a technologies object's key count", () => {
    expect(normalizeTech({ technologies: { react: 1 } })).toEqual({
      present: true,
    });
    expect(normalizeTech({ technologies: {} })).toEqual({ present: false });
  });

  it("falls back to results / data fields", () => {
    expect(normalizeTech({ results: ["x"] })).toEqual({ present: true });
    expect(normalizeTech({ data: [] })).toEqual({ present: false });
  });

  it("handles a bare array", () => {
    expect(normalizeTech(["x", "y"])).toEqual({ present: true });
    expect(normalizeTech([])).toEqual({ present: false });
  });

  it("returns null for null / non-object input", () => {
    expect(normalizeTech(null)).toBeNull();
    expect(normalizeTech("nope")).toBeNull();
  });

  it("returns null for an object with no tech fields", () => {
    expect(normalizeTech({ unrelated: true })).toBeNull();
  });
});
