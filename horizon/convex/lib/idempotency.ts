// Pure idempotency helpers for signal dedupe.
// No Convex imports — unit-tested with vitest.
//
// signalKey produces a deterministic key for a signal so that the same signal
// observed multiple times within the same UTC day collapses to one event.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function signalKey(a: {
  source: string;
  companyDomain?: string;
  kind: string;
  at: number;
}): string {
  // Bucket the timestamp by UTC day so same-day same-signal => equal key.
  const dayBucket = Math.floor(a.at / MS_PER_DAY);
  const domain = a.companyDomain ?? "";
  return `${a.source}:${domain}:${a.kind}:${dayBucket}`;
}
