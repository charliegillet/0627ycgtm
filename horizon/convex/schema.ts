import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  missions: defineTable({
    prompt: v.string(),
    status: v.union(v.literal("active"), v.literal("completed")),
    liveUrl: v.optional(v.string()),
    liveUrl2: v.optional(v.string()),
    liveUrl3: v.optional(v.string()),
    liveUrl4: v.optional(v.string()),
    liveUrl5: v.optional(v.string()),
    liveUrl6: v.optional(v.string()),
    liveUrl7: v.optional(v.string()),
    liveUrl8: v.optional(v.string()),
    liveUrl9: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    shareUrl: v.optional(v.string()),
  }),
  
  agents: defineTable({
    agent_id: v.number(),
    status: v.union(
      v.literal("idle"),
      v.literal("searching"),
      v.literal("found_trend"),
      v.literal("weak"),
      v.literal("reassigning"),
      v.literal("exploiting")
    ),
    current_url: v.string(),
    profile_id: v.string(),
    energy: v.number(),  // Energy level (0-100) for risk/reward system
  }).index("by_agent_id", ["agent_id"]),
  
  discoveries: defineTable({
    video_url: v.string(),
    thumbnail: v.string(),
    found_by_agent_id: v.number(),
    keywords: v.optional(v.string()),  // 2-3 defining keywords extracted by LLM
    likes: v.optional(v.number()),     // Number of likes
    views: v.optional(v.number()),     // Number of views
    comments: v.optional(v.number()),  // Number of comments
  }),
  
  logs: defineTable({
    agent_id: v.number(),
    message: v.string(),
    type: v.union(
      v.literal("search"),        // Started searching for term
      v.literal("analysis"),      // Analyzing a video
      v.literal("likes"),         // Found likes count
      v.literal("discovery"),     // Made a discovery
      v.literal("energy_gain"),   // Energy increased
      v.literal("energy_loss"),   // Energy decreased
      v.literal("task_swap"),     // Swapped to exploitation mode
      v.literal("status"),        // Status change
      v.literal("error")          // Error occurred
    ),
    timestamp: v.number(),        // Unix timestamp
    metadata: v.optional(v.string()),  // JSON string for extra data
  }).index("by_agent_id", ["agent_id"])
    .index("by_timestamp", ["timestamp"]),
  
  control: defineTable({
    command: v.union(
      v.literal("stop_all"),      // Stop all sessions
      v.literal("restart"),        // Restart orchestrator
      v.literal("pause")           // Pause all agents
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed")
    ),
    timestamp: v.number(),
    metadata: v.optional(v.string()),
  }).index("by_status", ["status"])
    .index("by_timestamp", ["timestamp"]),
  
  signals: defineTable({
    fromAgent: v.number(),      // Source agent (0 = blackboard center)
    toAgent: v.number(),        // Target agent (0 = blackboard center)
    message: v.string(),        // Event message
    signalType: v.string(),     // Type of signal (log, discovery, etc)
    timestamp: v.number(),      // Unix timestamp
  }).index("by_timestamp", ["timestamp"]),

  // ---------------------------------------------------------------------------
  // BEACHHEAD GTM tables (all NEW fields use v.optional where the contract allows)
  // ---------------------------------------------------------------------------

  companies: defineTable({
    domain: v.string(),
    name: v.string(),
    industry: v.optional(v.string()),
    employeeCount: v.optional(v.number()),
    enrichment: v.optional(v.any()),
    icpFit: v.optional(v.number()),
  }).index("by_domain", ["domain"]),

  leads: defineTable({
    companyId: v.id("companies"),
    fullName: v.string(),
    title: v.optional(v.string()),
    email: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    score: v.optional(v.number()),
    stage: v.union(
      v.literal("detected"),
      v.literal("enriching"),
      v.literal("scored"),
      v.literal("acting"),
      v.literal("done"),
      v.literal("dead")
    ),
  })
    .index("by_company", ["companyId"])
    .index("by_stage", ["stage"]),

  signalEvents: defineTable({
    source: v.string(),
    kind: v.string(),
    companyDomain: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    payload: v.any(),
    strength: v.optional(v.number()),
    processed: v.boolean(),
    detectedAt: v.number(),
  })
    .index("by_processed", ["processed", "detectedAt"])
    .index("by_dedupe", ["source", "companyDomain", "kind"]),

  scores: defineTable({
    leadId: v.optional(v.id("leads")),
    companyId: v.id("companies"),
    score: v.number(),
    rubric: v.any(),
    rationale: v.string(),
    confidence: v.number(),
    abstained: v.boolean(),
    legs: v.any(),
    createdAt: v.number(),
  }).index("by_company", ["companyId"]),

  actions: defineTable({
    leadId: v.optional(v.id("leads")),
    companyId: v.id("companies"),
    type: v.union(
      v.literal("slack"),
      v.literal("crm"),
      v.literal("email_draft")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("blocked"),
      v.literal("sent"),
      v.literal("failed")
    ),
    body: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_company", ["companyId"]),

  runs: defineTable({
    companyId: v.optional(v.id("companies")),
    stage: v.string(),
    status: v.union(
      v.literal("running"),
      v.literal("succeeded"),
      v.literal("failed")
    ),
    startedAt: v.number(),
    finishedAt: v.optional(v.number()),
  }).index("by_status", ["status"]),

  traces: defineTable({
    runId: v.id("runs"),
    stage: v.string(),
    agentId: v.optional(v.number()),
    level: v.union(v.literal("info"), v.literal("warn"), v.literal("error")),
    message: v.string(),
    durationMs: v.optional(v.number()),
    at: v.number(),
  }).index("by_run", ["runId"]),

  apiCache: defineTable({
    provider: v.string(),
    op: v.string(),
    key: v.string(),
    response: v.any(),
    fetchedAt: v.number(),
  }).index("by_key", ["provider", "op", "key"]),
});
