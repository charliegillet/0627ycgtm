// Pure convergence logic for the BEACHHEAD pipeline.
// No Convex imports — unit-tested with vitest.
//
// A "leg" is one independent buying signal. We converge three legs:
//   - funding: recent funding event (fresh = strong)         recency <= 90d
//   - hiring:  open roles / hiring velocity (more = strong)   count   >= 3
//   - tech:    relevant tech detected on the stack            present  === true
//
// We only route an account when at least two legs fire AND we have enough
// confidence. Otherwise we ABSTAIN — a first-class outcome, not a failure.

export type Leg = { ageDays?: number; count?: number; present?: boolean } | null;

export type Legs = {
  funding: Leg;
  hiring: Leg;
  tech: Leg;
};

export type Decision = {
  score: number;
  confidence: number;
  abstained: boolean;
  rationale: string;
  rubric: { legsFired: number; perLeg: Record<string, number> };
};

// Each leg contributes up to this many points when fully satisfied.
const MAX_PER_LEG = 100 / 3;

// Score a single funding leg: full strength when fresh (<=90d), decaying to
// zero at ~360d. Absent leg contributes 0.
function scoreFunding(leg: Leg): number {
  if (!leg) return 0;
  const age = leg.ageDays;
  if (age === undefined) return 0;
  if (age <= 90) return MAX_PER_LEG;
  if (age >= 360) return 0;
  // Linear decay from 90d -> 360d.
  const decay = 1 - (age - 90) / (360 - 90);
  return MAX_PER_LEG * decay;
}

// Score a hiring leg: full strength at count >= 3, partial below.
function scoreHiring(leg: Leg): number {
  if (!leg) return 0;
  const count = leg.count ?? 0;
  if (count >= 3) return MAX_PER_LEG;
  if (count <= 0) return 0;
  return MAX_PER_LEG * (count / 3);
}

// Score a tech leg: present === true gives full strength, else 0.
function scoreTech(leg: Leg): number {
  if (!leg) return 0;
  return leg.present === true ? MAX_PER_LEG : 0;
}

export function decide(legs: Legs): Decision {
  const perLeg: Record<string, number> = {
    funding: round(scoreFunding(legs.funding)),
    hiring: round(scoreHiring(legs.hiring)),
    tech: round(scoreTech(legs.tech)),
  };

  const legsFired =
    (legs.funding !== null ? 1 : 0) +
    (legs.hiring !== null ? 1 : 0) +
    (legs.tech !== null ? 1 : 0);

  const score = round(perLeg.funding + perLeg.hiring + perLeg.tech);

  // Confidence rises with both how many legs fired and how strong they are.
  // A single strong leg is still low confidence; convergence is what matters.
  const coverage = legsFired / 3;
  const strength = score / 100;
  const confidence = round2((coverage * 0.6 + strength * 0.4));

  const abstained = legsFired < 2 || confidence < 0.5;

  const rationale = abstained
    ? buildAbstainRationale(legs, legsFired, perLeg)
    : buildRouteRationale(legsFired, perLeg, score);

  return {
    // When abstaining we cap the surfaced score at 40 per the contract so the
    // UI never shows an abstain as a hot lead.
    score: abstained ? Math.min(score, 40) : score,
    confidence,
    abstained,
    rationale,
    rubric: { legsFired, perLeg },
  };
}

function buildAbstainRationale(
  legs: Legs,
  legsFired: number,
  perLeg: Record<string, number>
): string {
  const fired = describeFired(legs, perLeg);
  if (legsFired === 0) {
    return "Abstaining: 0/3 legs fired — insufficient signal to route this account.";
  }
  if (legsFired === 1) {
    return `Abstaining: only ${legsFired}/3 legs fired (${fired}) — insufficient convergence to route. Need at least 2 legs.`;
  }
  // legsFired >= 2 but confidence too low.
  return `Abstaining: ${legsFired}/3 legs fired (${fired}) but combined confidence is insufficient to route.`;
}

function buildRouteRationale(
  legsFired: number,
  perLeg: Record<string, number>,
  score: number
): string {
  const fired = describeFired(
    null,
    perLeg
  );
  return `Routing: ${legsFired}/3 legs fired (${fired}) for a converged score of ${score}/100.`;
}

// Human-readable summary of which legs contributed.
function describeFired(
  legs: Legs | null,
  perLeg: Record<string, number>
): string {
  const parts: string[] = [];
  for (const name of ["funding", "hiring", "tech"]) {
    const pts = perLeg[name];
    if (legs) {
      const leg = legs[name as keyof Legs];
      if (leg !== null) parts.push(`${name} ${pts}pts`);
    } else if (pts > 0) {
      parts.push(`${name} ${pts}pts`);
    }
  }
  return parts.length > 0 ? parts.join(", ") : "none";
}

function round(n: number): number {
  return Math.round(n);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
