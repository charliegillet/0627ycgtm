"use client";

/**
 * ContentNode (LeadNode) — Custom React Flow node for a scored company.
 * Shows the company name, score, ICP fit and per-leg signal badges
 * (funding / hiring / tech). Clicking the card reveals lineage: the
 * per-leg source + the leg's contribution to the score.
 */

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Building2, ChevronDown, ChevronUp, Check, X, Layers, CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  LEG_COLORS,
  LEG_BADGES,
  type BoardItem,
  type Leg,
  type LegName,
} from "../hooks/useAgentData";
import { LEG_ORDER, legFired, firedLegs } from "../lib/legs";

const MONO = "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace";

// Color for a settled (non-pending) action state in the approval gate.
const ACTION_STATUS_COLOR: Record<string, string> = {
  approved: "#10b981",
  sent: "#10b981",
  blocked: "#dc2626",
  failed: "#dc2626",
};

// Human-readable source for each leg, shown in the lineage drawer.
const LEG_SOURCE: Record<LegName, string> = {
  funding: "OrangeSlice · Crunchbase",
  hiring: "OrangeSlice · Jobs",
  tech: "OrangeSlice · BuiltWith",
};

function legSummary(name: LegName, leg: Leg | null): string {
  if (!leg) return "no signal";
  if (name === "funding") {
    return typeof leg.ageDays === "number"
      ? `raise ${leg.ageDays}d ago`
      : "funding signal";
  }
  if (name === "hiring") {
    return typeof leg.count === "number"
      ? `${leg.count} open roles`
      : "hiring signal";
  }
  return leg.present ? "stack match" : "no stack match";
}

function scoreColor(score: number): string {
  if (score >= 70) return "#10b981"; // emerald
  if (score >= 50) return "#f59e0b"; // amber
  return "#a1a1aa"; // zinc-400
}

function scoreGlowClass(score: number): string {
  if (score >= 70) return "hud-glow-green border-emerald-500/20 hover:border-emerald-500/50";
  if (score >= 50) return "hud-glow-amber border-amber-500/20 hover:border-amber-500/50";
  return "border-zinc-800 hover:border-zinc-500";
}

export const ContentNode = memo(function ContentNode({ data }: NodeProps) {
  const item = data as unknown as BoardItem;
  const company = item.company;
  const score = item.score;
  const legs = score?.legs ?? null;
  const action = item.action ?? null;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const approve = useMutation(api.act.approve);
  const block = useMutation(api.act.block);

  const onApprove = async () => {
    if (!action || busy) return;
    setBusy(true);
    try {
      await approve({ actionId: action._id as Id<"actions"> });
    } finally {
      setBusy(false);
    }
  };
  const onBlock = async () => {
    if (!action || busy) return;
    setBusy(true);
    try {
      await block({ actionId: action._id as Id<"actions"> });
    } finally {
      setBusy(false);
    }
  };

  const scoreVal = score?.score ?? 0;
  // A leg "fired" only when it contributed POSITIVE points (matches the
  // convergence rubric). A present-but-zero leg is real evidence that did not
  // fire, so it must not inflate the "X/3 legs" count or light up its badge.
  // Shared with AbstainCard via app/lib/legs so the two cards cannot drift.
  const fired = firedLegs(score);
  const accent = score ? scoreColor(scoreVal) : "#334";

  return (
    <div
      className={`w-[310px] glass-panel border rounded-xl overflow-hidden font-sans cursor-pointer shadow-2xl transition-all duration-300 ease-out hover:scale-[1.02] ${score ? scoreGlowClass(scoreVal) : "border-white/10 hover:border-zinc-600"}`}
      onClick={() => setOpen((v) => !v)}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="!w-[8px] !h-[8px] !border-2 !border-zinc-950 !rounded-full transition-colors"
        style={{ background: accent }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-[8px] !h-[8px] !bg-zinc-700 !border-2 !border-zinc-950 !rounded-full"
      />

      {/* Decorative cyber corner indicators */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 opacity-30" style={{ borderColor: accent }} />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 opacity-30" style={{ borderColor: accent }} />

      {/* Header: company identity + score */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5 relative bg-gradient-to-r from-white/[0.01] to-transparent">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300"
          style={{ 
            background: `${accent}12`,
            borderColor: `${accent}25`
          }}
        >
          <Building2 size={18} style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-white tracking-wide leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.name || company?.domain || "Unknown Company"}
          </div>
          <div className="text-[10.5px] text-zinc-400 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-mono tracking-tight font-medium">
            {company?.domain}
            {company?.industry ? ` · ${company.industry}` : ""}
          </div>
        </div>
        
        {/* HUD Score Display */}
        <div className="flex flex-col items-end shrink-0 pl-2">
          <span className="text-3xl font-bold leading-none tracking-tight font-display" style={{ color: accent }}>
            {score ? Math.round(scoreVal) : "—"}
          </span>
          <span className="text-[8px] text-zinc-500 font-bold tracking-widest mt-1 uppercase font-display">ICP SCORE</span>
        </div>
      </div>

      {/* Per-leg status badges */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border-b border-white/5">
        {LEG_ORDER.map((name) => {
          const isFired = legFired(score, name);
          const c = LEG_COLORS[name];
          return (
            <div
              key={name}
              title={`${name}: ${legSummary(name, legs?.[name] ?? null)}`}
              className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider font-display flex items-center gap-1 transition-all"
              style={{
                background: isFired ? `${c}12` : "rgba(255,255,255,0.01)",
                border: `1px solid ${isFired ? `${c}25` : "rgba(255,255,255,0.03)"}`,
                color: isFired ? c : "#52525b",
              }}
            >
              {isFired && <div className="w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: c }} />}
              {LEG_BADGES[name].toUpperCase()}
            </div>
          );
        })}
        <span className="ml-auto text-[8px] font-bold text-zinc-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md uppercase font-display">
          {fired.length}/3 LEGS
        </span>
        
        {open ? (
          <ChevronUp size={13} className="text-zinc-500 ml-1 hover:text-white transition-colors" />
        ) : (
          <ChevronDown size={13} className="text-zinc-500 ml-1 hover:text-white transition-colors" />
        )}
      </div>

      {/* Approval gate — Approve/Block a pending action, else show its state. */}
      {action && (
        <div
          style={{
            padding: "0 10px 8px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {action.status === "pending" ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onApprove}
                title="Approve — send the Slack action"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: "4px 6px",
                  background: "#10b98115",
                  border: "1px solid #10b98140",
                  borderRadius: 2,
                  color: "#10b981",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  cursor: busy ? "default" : "pointer",
                  opacity: busy ? 0.5 : 1,
                  fontFamily: MONO,
                }}
              >
                <Check size={9} /> APPROVE
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onBlock}
                title="Block — mark this lead dead, do not send"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: "4px 6px",
                  background: "#dc262615",
                  border: "1px solid #dc262640",
                  borderRadius: 2,
                  color: "#dc2626",
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  cursor: busy ? "default" : "pointer",
                  opacity: busy ? 0.5 : 1,
                  fontFamily: MONO,
                }}
              >
                <X size={9} /> BLOCK
              </button>
            </>
          ) : (
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: ACTION_STATUS_COLOR[action.status] ?? "#445",
              }}
            >
              {action.type} · {action.status}
            </span>
          )}
        </div>
      )}

      {/* Lineage drawer (revealed on click) */}
      {open && (
        <div
          className="px-4 pb-4 pt-3.5 bg-black/40 border-t border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          {score?.rationale && (
            <div className="text-[11.5px] text-zinc-300 leading-relaxed mb-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/5 font-medium">
              {score.rationale}
            </div>
          )}
          
          <div className="text-[8.5px] font-bold text-zinc-500 tracking-wider font-display uppercase mb-2 flex items-center gap-1.5">
            <Layers size={10} />
            CONVERGENCE VERIFICATION SIGNALS
          </div>
          
          <div className="flex flex-col gap-2">
            {LEG_ORDER.map((name) => {
              const leg = legs?.[name] ?? null;
              const c = LEG_COLORS[name];
              const contribution = score?.rubric?.perLeg?.[name];
              return (
                <div
                  key={name}
                  className="flex items-center gap-2.5 p-2 rounded border transition-all"
                  style={{ 
                    opacity: leg ? 1 : 0.4,
                    backgroundColor: leg ? `${c}04` : "transparent",
                    borderColor: leg ? `${c}10` : "rgba(255,255,255,0.01)"
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ 
                      background: leg ? c : "#3f3f46",
                      boxShadow: leg ? `0 0 6px ${c}` : "none"
                    }}
                  />
                  <span className="text-[9.5px] font-bold w-12 uppercase tracking-wider font-display" style={{ color: c }}>
                    {LEG_BADGES[name]}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 flex-1 truncate">
                    {LEG_SOURCE[name]}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-300 whitespace-nowrap tracking-tight">
                    {legSummary(name, leg)}
                    {typeof contribution === "number" ? (
                      <span className="text-zinc-500 font-semibold font-sans ml-1 text-[9px]">
                        (+{Math.round(contribution)})
                      </span>
                    ) : ""}
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between text-[9px] font-semibold text-zinc-500 mt-4 pt-3.5 border-t border-white/5 font-display tracking-widest">
            <div className="flex items-center gap-1">
              <CheckCircle size={10} className="text-emerald-500" />
              ICP MATCH RATIO
            </div>
            {typeof company?.icpFit === "number" ? (
              <span className="text-zinc-200 bg-white/5 border border-white/5 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                {Math.round(company.icpFit)}%
              </span>
            ) : (
              <span className="text-zinc-500 font-mono">N/A</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
