import { describe, it, expect } from "vitest";
import { decide, type Legs } from "./convergence";

const NONE: Legs = { funding: null, hiring: null, tech: null };

describe("decide", () => {
  it("routes when two or more legs fire recently/strongly", () => {
    const legs: Legs = {
      funding: { ageDays: 30 }, // fresh -> full strength
      hiring: { count: 5 }, // >= 3 -> full strength
      tech: null,
    };
    const d = decide(legs);
    expect(d.abstained).toBe(false);
    expect(d.rubric.legsFired).toBe(2);
    expect(d.confidence).toBeGreaterThanOrEqual(0.5);
    expect(d.score).toBeGreaterThan(40);
    expect(d.rationale.toLowerCase()).toContain("routing");
  });

  it("abstains on a single weak leg and mentions 1/3", () => {
    const legs: Legs = {
      funding: { ageDays: 30 },
      hiring: null,
      tech: null,
    };
    const d = decide(legs);
    expect(d.abstained).toBe(true);
    expect(d.rubric.legsFired).toBe(1);
    expect(d.score).toBeLessThanOrEqual(40);
    expect(d.rationale).toContain("1/3");
    expect(d.rationale.toLowerCase()).toContain("insufficient");
  });

  it("abstains when nothing fires", () => {
    const d = decide(NONE);
    expect(d.abstained).toBe(true);
    expect(d.rubric.legsFired).toBe(0);
    expect(d.score).toBeLessThanOrEqual(40);
    expect(d.rationale).toContain("0/3");
  });

  it("abstains on a mid-confidence boundary: two weak legs below the confidence floor", () => {
    const legs: Legs = {
      funding: { ageDays: 300 }, // heavily decayed -> weak
      hiring: { count: 1 }, // below the count>=3 threshold -> weak
      tech: null,
    };
    const d = decide(legs);
    expect(d.rubric.legsFired).toBe(2);
    expect(d.confidence).toBeLessThan(0.5);
    expect(d.abstained).toBe(true);
    expect(d.score).toBeLessThanOrEqual(40);
  });

  it("routes all three strong legs at a high score", () => {
    const legs: Legs = {
      funding: { ageDays: 10 },
      hiring: { count: 8 },
      tech: { present: true },
    };
    const d = decide(legs);
    expect(d.abstained).toBe(false);
    expect(d.rubric.legsFired).toBe(3);
    expect(d.score).toBeGreaterThanOrEqual(95);
    expect(d.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it("treats present:false tech as a fired-but-zero leg", () => {
    const legs: Legs = {
      funding: { ageDays: 20 },
      hiring: null,
      tech: { present: false },
    };
    const d = decide(legs);
    // Two legs are non-null, but tech contributes 0 points.
    expect(d.rubric.legsFired).toBe(2);
    expect(d.rubric.perLeg.tech).toBe(0);
  });
});
