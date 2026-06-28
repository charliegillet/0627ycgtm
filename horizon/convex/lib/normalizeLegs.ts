// Pure normalizers for orangeSlice provider responses.
//
// Extracted from convex/providers/orangeSlice.ts so they can be unit-tested
// directly. orangeSlice.ts is a "use node" file (it may export ONLY actions),
// so these pure helpers live here (no "use node") where they can be exported.
// Behavior is byte-identical to the originals.
//
// Map a raw provider response into the `Leg` shape for each op. These are
// defensive: real provider payloads vary, so we read the most likely fields and
// fall back to null (an absent leg) when nothing usable is found.

import type { Leg } from "./convergence";

export function normalizeFunding(raw: unknown): Leg {
  // Expect rows from crunchbase lean table; take the most recent funding date.
  const rows = Array.isArray(raw) ? raw : [];
  let newestMs: number | null = null;
  for (const row of rows as Array<Record<string, unknown>>) {
    const dateVal =
      row.last_funding_date ??
      row.announced_on ??
      row.last_funding_at ??
      row.funding_date ??
      row.date;
    if (typeof dateVal === "string" || typeof dateVal === "number") {
      const ms = new Date(dateVal).getTime();
      if (!Number.isNaN(ms) && (newestMs === null || ms > newestMs)) {
        newestMs = ms;
      }
    }
  }
  if (newestMs === null) return null;
  const ageDays = Math.max(0, Math.round((Date.now() - newestMs) / 86_400_000));
  return { ageDays };
}

export function normalizeHiring(raw: unknown): Leg {
  // predictLeads companyJobOpenings → count of open roles. The JSON:API envelope
  // exposes the TRUE total at meta.count (only present when page is passed);
  // obj.data is page-capped at 100, so prefer meta.count and fall back to it.
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const meta = obj.meta as Record<string, unknown> | undefined;
    if (meta && typeof meta.count === "number") return { count: meta.count };
    const data = obj.data;
    if (Array.isArray(data)) return { count: data.length };
    if (typeof obj.total === "number") return { count: obj.total };
    if (typeof obj.count === "number") return { count: obj.count };
  }
  if (Array.isArray(raw)) return { count: raw.length };
  return null;
}

export function normalizeTech(raw: unknown): Leg {
  // builtWith lookupDomain → presence of any detected technology.
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    const techs =
      (obj.technologies as unknown) ??
      (obj.results as unknown) ??
      (obj.data as unknown);
    if (Array.isArray(techs)) return { present: techs.length > 0 };
    if (techs && typeof techs === "object") {
      return { present: Object.keys(techs).length > 0 };
    }
  }
  if (Array.isArray(raw)) return { present: raw.length > 0 };
  return null;
}
