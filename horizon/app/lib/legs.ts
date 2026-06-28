// Shared, pure "did this leg fire?" logic for the board cards.
//
// A leg has "fired" ONLY when it contributed POSITIVE points in the
// convergence rubric. A present-but-zero leg (stale funding with ageDays>=360,
// or tech {present:false}) is real evidence that did NOT fire, so it must not
// light up its badge or inflate the "X/3 legs" count. This mirrors the server
// rubric in convex/lib/convergence.ts (legsFired counts only perLeg[name] > 0).
//
// Both ContentNode (routed cards) and AbstainCard (abstained cards) consume
// this so their badge/count logic cannot drift apart again.

import { type ScoreData, type LegName } from "../hooks/useAgentData";

export const LEG_ORDER: LegName[] = ["funding", "hiring", "tech"];

// True when the named leg contributed positive points to the score.
export function legFired(score: ScoreData | null | undefined, name: LegName): boolean {
  return (score?.rubric?.perLeg?.[name] ?? 0) > 0;
}

// The set of legs that actually fired (positive points), in canonical order.
export function firedLegs(score: ScoreData | null | undefined): LegName[] {
  return LEG_ORDER.filter((n) => legFired(score, n));
}

// The "X/3 legs" count. Prefers the server-computed rubric.legsFired (the
// source of truth that also drives the route/abstain decision); falls back to
// the locally derived positive-point count so the count and the lit badges can
// never disagree even if the rubric is absent.
export function firedLegCount(score: ScoreData | null | undefined): number {
  return score?.rubric?.legsFired ?? firedLegs(score).length;
}
