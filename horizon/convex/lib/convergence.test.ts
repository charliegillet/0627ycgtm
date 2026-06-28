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

  it("does NOT count a present-but-zero-point leg as fired (tech present:false)", () => {
    const legs: Legs = {
      funding: { ageDays: 20 }, // fresh -> positive points -> fired
      hiring: null,
      tech: { present: false }, // present but 0 points -> NOT fired
    };
    const d = decide(legs);
    // tech is non-null but contributes 0 points, so only 1 leg actually fired.
    expect(d.rubric.perLeg.tech).toBe(0);
    expect(d.rubric.legsFired).toBe(1);
  });

  it("does NOT count stale funding (0 points) as fired and abstains on it", () => {
    const legs: Legs = {
      funding: { ageDays: 400 }, // too old (>=360d) -> 0 points -> NOT fired
      hiring: { count: 5 }, // strong -> fired
      tech: null,
    };
    const d = decide(legs);
    expect(d.rubric.perLeg.funding).toBe(0);
    // Only hiring fired, so despite two non-null legs we are at 1/3 and abstain.
    expect(d.rubric.legsFired).toBe(1);
    expect(d.abstained).toBe(true);
    expect(d.rationale).toContain("1/3");
    // The fired-leg summary must not mention funding (it contributed nothing).
    expect(d.rationale.toLowerCase()).not.toContain("funding");
  });

  it("routing threshold (>=2 fired) uses the corrected positive-point count", () => {
    // Two present legs but funding is stale (0 pts): real fired count is 1, so
    // we must abstain even though two legs are non-null.
    const stale: Legs = {
      funding: { ageDays: 400 }, // 0 pts
      hiring: { count: 5 }, // fired
      tech: { present: false }, // 0 pts
    };
    const dStale = decide(stale);
    expect(dStale.rubric.legsFired).toBe(1);
    expect(dStale.abstained).toBe(true);

    // Now two legs genuinely contribute -> route.
    const strong: Legs = {
      funding: { ageDays: 30 }, // fired
      hiring: { count: 5 }, // fired
      tech: { present: false }, // 0 pts, not fired
    };
    const dStrong = decide(strong);
    expect(dStrong.rubric.legsFired).toBe(2);
    expect(dStrong.abstained).toBe(false);
  });
});
