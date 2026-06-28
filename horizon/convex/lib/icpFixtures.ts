// Deterministic ICP -> candidate-domains resolver (v1, fixture-backed).
//
// Pure TypeScript (no convex/server imports) so both the Convex action
// (convex/icp.ts) and tests can import it freely. There is NO live lookup and
// NO randomness here: this maps a natural-language ICP onto a small, fixed list
// of well-known B2B domains by broad keyword category. The caller labels the
// resolution `mode: "icp-fixture"` for honesty; nothing here is presented as a
// live search result.

// Broad B2B categories. `keywords` are matched as whole tokens against the
// tokenized ICP (so short tokens like "ai" / "ml" / "api" match a standalone
// word, not a substring of "retail" or "maintain"); `phrases` are matched as
// substrings of the raw lowercased ICP (for multi-word terms like "machine
// learning"). The FIRST category whose keywords/phrases match wins, so
// categories are listed most-specific-first where they could overlap.
const CATEGORIES: Array<{
  key: string;
  keywords: string[];
  phrases: string[];
  domains: string[];
}> = [
  {
    key: "fintech",
    keywords: ["fintech", "financial", "payments", "payment", "banking", "bank"],
    phrases: [],
    domains: ["mercury.com", "stripe.com", "ramp.com"],
  },
  {
    key: "devtools",
    keywords: ["devtools", "developer", "developers", "api", "apis", "sdk", "sdks"],
    phrases: ["developer tools", "developer tooling"],
    domains: ["linear.app", "clerk.com", "vercel.com"],
  },
  {
    key: "infra",
    keywords: ["cloud", "infra", "infrastructure", "devops"],
    phrases: [],
    domains: ["hashicorp.com", "mongodb.com", "cloudflare.com"],
  },
  {
    key: "ai",
    keywords: ["ai", "ml", "llm", "llms"],
    phrases: ["machine learning", "artificial intelligence"],
    domains: ["openai.com", "anthropic.com", "huggingface.co"],
  },
  {
    key: "security",
    keywords: ["security", "cyber", "cybersecurity", "infosec", "appsec"],
    phrases: [],
    domains: ["snyk.io", "okta.com", "crowdstrike.com"],
  },
  {
    key: "data",
    keywords: ["data", "analytics", "warehouse", "etl"],
    phrases: [],
    domains: ["snowflake.com", "databricks.com", "fivetran.com"],
  },
  {
    key: "saas",
    keywords: ["saas", "b2b", "crm", "sales", "marketing"],
    phrases: [],
    domains: ["hubspot.com", "salesforce.com", "notion.so"],
  },
];

// Generic fallback when no category matches, so the user still gets at least
// one domain-backed run rather than an empty result.
const FALLBACK_DOMAINS = ["stripe.com", "mercury.com"];

/**
 * Resolve a natural-language ICP to a small, deterministic list of candidate
 * company domains.
 *
 * Returns `matched` = the category key that matched (e.g. "fintech"), or `null`
 * if no category matched and the generic fallback was used. `domains` is the
 * matched list sliced to `limit` (always at least one domain). Same input
 * always yields the same output.
 */
export function resolveIcpToDomains(
  icp: string,
  limit: number,
): { matched: string | null; domains: string[] } {
  const lower = icp.toLowerCase();
  // Tokenize on any non-alphanumeric run so "ai/ml", "ai-first", "fintech."
  // all split into whole words. A Set gives O(1) whole-token membership.
  const tokens = new Set(lower.split(/[^a-z0-9]+/).filter((t) => t !== ""));
  const slice = Math.max(1, Math.floor(limit));

  for (const category of CATEGORIES) {
    const tokenHit = category.keywords.some((kw) => tokens.has(kw));
    const phraseHit = category.phrases.some((p) => lower.includes(p));
    if (tokenHit || phraseHit) {
      return { matched: category.key, domains: category.domains.slice(0, slice) };
    }
  }

  return { matched: null, domains: FALLBACK_DOMAINS.slice(0, slice) };
}
