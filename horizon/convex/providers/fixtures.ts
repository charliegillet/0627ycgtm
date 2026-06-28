// Seeded provider fixtures for FIXTURE MODE (no real API keys yet).
//
// Each domain provides the three convergence legs (funding/hiring/tech) shaped
// to the contract `Legs` type from convex/lib/convergence.ts. Every fixture
// object is tagged `__synthetic: true` so synthetic data is never mistaken for
// real provider output anywhere downstream.

import type { Leg, Legs } from "../lib/convergence";

// A leg value plus the synthetic marker. The marker is additive — consumers
// that only read ageDays/count/present (the `Leg` shape) ignore it.
export type SyntheticLeg = (NonNullable<Leg> & { __synthetic: true }) | null;

export type SyntheticLegs = {
  funding: SyntheticLeg;
  hiring: SyntheticLeg;
  tech: SyntheticLeg;
  __synthetic: true;
};

// Fixture company metadata used when upserting `companies` in fixture mode.
export type FixtureCompany = {
  name: string;
  industry?: string;
  employeeCount?: number;
  legs: SyntheticLegs;
  __synthetic: true;
};

// Keyed by domain. "stripe.com" and "linear.app" are explicit; "*" is the
// generic fallback used for any unknown domain.
export const FIXTURES: Record<string, FixtureCompany> = {
  "stripe.com": {
    name: "Stripe",
    industry: "Payments",
    employeeCount: 8000,
    legs: {
      funding: { ageDays: 45, __synthetic: true },
      hiring: { count: 12, __synthetic: true },
      tech: { present: true, __synthetic: true },
      __synthetic: true,
    },
    __synthetic: true,
  },
  "linear.app": {
    name: "Linear",
    industry: "Developer Tools",
    employeeCount: 120,
    legs: {
      funding: { ageDays: 200, __synthetic: true },
      hiring: { count: 5, __synthetic: true },
      tech: { present: true, __synthetic: true },
      __synthetic: true,
    },
    __synthetic: true,
  },
  // Generic fallback: a single weak leg so unknown domains tend to ABSTAIN
  // (1/3 legs) — exercising the abstain path by default.
  "*": {
    name: "Unknown Company",
    industry: undefined,
    employeeCount: undefined,
    legs: {
      funding: null,
      hiring: { count: 1, __synthetic: true },
      tech: null,
      __synthetic: true,
    },
    __synthetic: true,
  },
};

// Resolve the fixture company for a domain, falling back to the generic "*".
export function fixtureCompany(domain: string): FixtureCompany {
  return FIXTURES[domain] ?? FIXTURES["*"];
}

// Resolve a single leg fixture for a given op + domain. Returned in the plain
// `Leg` shape (the synthetic marker rides along but is structurally compatible).
export function fixtureLeg(
  op: "funding" | "hiring" | "tech",
  domain: string,
): SyntheticLeg {
  return fixtureCompany(domain).legs[op];
}

// Convenience: all three legs for a domain in the contract `Legs` shape.
export function fixtureLegs(domain: string): Legs {
  const { legs } = fixtureCompany(domain);
  return { funding: legs.funding, hiring: legs.hiring, tech: legs.tech };
}
