import { describe, it, expect } from "vitest";
import { legFired, firedLegs, firedLegCount, LEG_ORDER } from "./legs";
import { decide } from "../../convex/lib/convergence";
import { type ScoreData } from "../hooks/useAgentData";

// Build a board ScoreData from the server convergence rubric so these tests
// exercise the EXACT shape the cards receive on the wire (score.rubric.perLeg
// + score.rubric.legsFired + score.legs). This is what AbstainCard and
// ContentNode render their badges and "X/3 legs" count from.
function scoreFor(legs: {
  funding?: { ageDays?: number };
  hiring?: { count?: number };
  tech?: { present?: boolean };
}): ScoreData {
  const full = {
    funding: legs.funding ?? null,
    hiring: legs.hiring ?? null,
    tech: legs.tech ?? null,
  };
  const d = decide(full);
  return {
    score: d.score,
    confidence: d.confidence,
    abstained: d.abstained,
    rationale: d.rationale,
    rubric: d.rubric,
    legs: full,
  };
}

describe("legFired / firedLegs / firedLegCount (card badge logic)", () => {
  it("a present-but-zero leg does NOT fire (the F1 bug): stale funding ageDays>=360", () => {
    // Two NON-NULL legs, but funding is stale (>=360d -> 0 points). The old
    // truthiness check (`!!legs.funding`) lit the FUND badge anyway. The fixed
    // logic must report funding as NOT fired.
    const score = scoreFor({ funding: { ageDays: 400 }, hiring: { count: 5 } });
    expect(score.rubric?.perLeg?.funding).toBe(0);
    expect(legFired(score, "funding")).toBe(false);
    expect(legFired(score, "hiring")).toBe(true);
    expect(firedLegs(score)).toEqual(["hiring"]);
    // Only one leg genuinely fired despite two non-null legs.
    expect(firedLegCount(score)).toBe(1);
  });

  it("a tech leg with present:false does NOT fire even though it is non-null", () => {
    const score = scoreFor({ funding: { ageDays: 20 }, tech: { present: false } });
    expect(score.rubric?.perLeg?.tech).toBe(0);
    expect(legFired(score, "tech")).toBe(false);
    expect(legFired(score, "funding")).toBe(true);
    expect(firedLegs(score)).toEqual(["funding"]);
    expect(firedLegCount(score)).toBe(1);
  });

  it("the self-contradiction case: 1/3 headline but two non-null legs must light only ONE badge", () => {
    // funding stale (0pts) + tech present:false (0pts) + hiring strong (fired).
    // Pre-fix: firedLegCount said 1 (from rubric) while two badges lit -> the
    // card contradicted itself. Now the lit badges and the count must agree.
    const score = scoreFor({
      funding: { ageDays: 400 },
      hiring: { count: 5 },
      tech: { present: false },
    });
    expect(firedLegCount(score)).toBe(1);
    const lit = LEG_ORDER.filter((n) => legFired(score, n));
    expect(lit).toEqual(["hiring"]);
    // Count and lit badges agree -> no self-contradicting card.
    expect(lit.length).toBe(firedLegCount(score));
  });

  it("counts legs that contribute positive points as fired", () => {
    const score = scoreFor({
      funding: { ageDays: 30 },
      hiring: { count: 8 },
      tech: { present: true },
    });
    expect(firedLegs(score)).toEqual(["funding", "hiring", "tech"]);
    expect(firedLegCount(score)).toBe(3);
    for (const n of LEG_ORDER) expect(legFired(score, n)).toBe(true);
  });

  it("firedLegCount prefers rubric.legsFired but falls back to positive perLeg when rubric absent", () => {
    // No rubric at all -> derive from nothing -> 0.
    const bare: ScoreData = {
      score: 0,
      confidence: 0,
      abstained: true,
      rationale: "",
      legs: { funding: { ageDays: 400 }, hiring: null, tech: { present: false } },
    };
    expect(firedLegCount(bare)).toBe(0);
    expect(firedLegs(bare)).toEqual([]);
  });

  it("handles null/undefined score safely", () => {
    expect(firedLegCount(null)).toBe(0);
    expect(firedLegCount(undefined)).toBe(0);
    expect(firedLegs(null)).toEqual([]);
    expect(legFired(null, "funding")).toBe(false);
  });
});
