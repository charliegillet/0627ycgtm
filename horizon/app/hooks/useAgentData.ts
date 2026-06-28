"use client";

// GTM signal-source agents. The pipeline runs three OrangeSlice legs (funding /
// hiring / tech) plus Fiber reveal + web detection. We map those sources onto a
// 9-plane ring for the 3D flourish — three planes per primary signal family.
export const AGENTS = [
  { id: "crunchbase-1", agentId: 1, name: "Crunchbase", color: "#0288d1", baseRole: "Funding", platform: "funding" },
  { id: "crunchbase-2", agentId: 2, name: "Pitchbook", color: "#039be5", baseRole: "Funding", platform: "funding" },
  { id: "crunchbase-3", agentId: 3, name: "OrangeSlice", color: "#29b6f6", baseRole: "Funding", platform: "funding" },
  { id: "jobs-1", agentId: 4, name: "Greenhouse", color: "#43a047", baseRole: "Hiring", platform: "hiring" },
  { id: "jobs-2", agentId: 5, name: "Lever", color: "#2e7d32", baseRole: "Hiring", platform: "hiring" },
  { id: "jobs-3", agentId: 6, name: "Jobs", color: "#66bb6a", baseRole: "Hiring", platform: "hiring" },
  { id: "tech-1", agentId: 7, name: "BuiltWith", color: "#f59e0b", baseRole: "Tech", platform: "tech" },
  { id: "fiber-1", agentId: 8, name: "Fiber", color: "#a855f7", baseRole: "Reveal", platform: "fiber" },
  { id: "web-1", agentId: 9, name: "Web", color: "#7c3aed", baseRole: "Detection", platform: "web" },
] as const;

export type AgentId = (typeof AGENTS)[number]["id"];

export interface AgentData {
  _id: string;
  agent_id: number;
  status: "idle" | "searching" | "found_trend" | "weak" | "reassigning" | "exploiting";
  current_url: string;
  profile_id: string;
  energy: number;
}

export interface AgentSignal {
  _id: string;
  fromAgent: number;
  toAgent: number;
  message: string;
  signalType: string;
  timestamp: number;
}

export interface LogEntry {
  _id: string;
  agent_id: number;
  message: string;
  type: "search" | "analysis" | "likes" | "discovery" | "energy_gain" | "energy_loss" | "task_swap" | "status" | "error";
  timestamp: number;
  metadata?: string;
}

// ---------------------------------------------------------------------------
// GTM board types — bound to api.queries.board.liveBoard (see BUILD-CONTRACT).
// A single Leg can be a recency/count/presence shape or null (did not fire).
// ---------------------------------------------------------------------------
export type LegName = "funding" | "hiring" | "tech";

export interface Leg {
  ageDays?: number;
  count?: number;
  present?: boolean;
}

export interface Legs {
  funding: Leg | null;
  hiring: Leg | null;
  tech: Leg | null;
}

export interface ScoreData {
  _id?: string;
  score: number;
  confidence: number;
  abstained: boolean;
  rationale: string;
  // rubric: { legsFired, perLeg } — typed loosely to match `v.any()` on the wire.
  rubric?: { legsFired?: number; perLeg?: Record<string, number> };
  legs?: Legs;
  createdAt?: number;
}

export interface CompanyData {
  _id: string;
  domain: string;
  name: string;
  industry?: string;
  employeeCount?: number;
  icpFit?: number;
}

// Action status for a company's latest action (drives the Approve/Block gate).
export type ActionStatus =
  | "pending"
  | "approved"
  | "blocked"
  | "sent"
  | "failed";

export interface ActionData {
  _id: string;
  type: "slack" | "crm" | "email_draft";
  status: ActionStatus;
}

// One card on the board. `liveBoard` returns scored companies joined with their
// latest score; we also carry running-run state so cards can show "scoring…" and
// the latest action so the card can render the Approve/Block gate.
export interface BoardItem {
  _id: string;
  companyId: string;
  company: CompanyData;
  score: ScoreData | null;
  runStatus?: "running" | "succeeded" | "failed";
  action?: ActionData | null;
}

// Per-signal-family colors used by leg badges + 3D planes.
export const LEG_COLORS: Record<LegName, string> = {
  funding: "#0288d1",
  hiring: "#43a047",
  tech: "#f59e0b",
};

export const PLATFORM_COLORS: Record<string, string> = {
  funding: "#0288d1",
  hiring: "#43a047",
  tech: "#f59e0b",
  fiber: "#a855f7",
  web: "#7c3aed",
};

// Short badge labels for each leg.
export const LEG_BADGES: Record<LegName, string> = {
  funding: "FUND",
  hiring: "HIRE",
  tech: "TECH",
};

// Helper to get agent info by agent_id
export function getAgentById(agentId: number) {
  return AGENTS.find(a => a.agentId === agentId) || AGENTS[0];
}

// Helper to get agent color by agent_id
export function getAgentColor(agentId: number): string {
  const agent = getAgentById(agentId);
  return agent?.color || "#666";
}

// Helper to get the signal family for an agent plane.
export function getAgentPlatform(agentId: number): string {
  if (agentId === 0) return "Orchestrator";
  if (agentId <= 3) return "Funding";
  if (agentId <= 6) return "Hiring";
  if (agentId === 7) return "Tech";
  if (agentId === 8) return "Fiber";
  return "Web";
}

// Map a trace/log level to a marker used in the activity feed.
export function getLogIcon(type: string): string {
  switch (type) {
    case "error": return "ERR";
    case "warn": return "WARN";
    case "info": return "·";
    // Legacy viz-bridge log types still flow through the same feed.
    case "search": return "DETECT";
    case "analysis": return "SCORE";
    case "discovery": return "FOUND";
    case "status": return "·";
    default: return "·";
  }
}

// Helper to get badge color classes by signal family.
export function getAgentBadgeColor(agentId: number): string {
  if (agentId === 0) return "bg-gray-700 text-gray-300";
  if (agentId <= 3) return "bg-sky-900/50 text-sky-300";
  if (agentId <= 6) return "bg-green-900/50 text-green-300";
  if (agentId === 7) return "bg-amber-900/50 text-amber-300";
  return "bg-purple-900/50 text-purple-300";
}

// Convert logs to signals for the 3D visualization
export function logsToSignals(logs: LogEntry[]): AgentSignal[] {
  return logs
    .filter(log => log.agent_id > 0)
    .slice(0, 20)
    .map((log, idx) => ({
      _id: log._id || `signal_${idx}`,
      fromAgent: log.agent_id,
      toAgent: log.agent_id === 9 ? 1 : log.agent_id + 1, // Chain to next agent
      message: log.message,
      signalType: log.type,
      timestamp: log.timestamp,
    }));
}
