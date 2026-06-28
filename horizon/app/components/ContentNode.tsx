"use client";

/**
 * ContentNode (LeadNode) — Custom React Flow node for a scored company.
 * Shows the company name, score, ICP fit and per-leg signal badges
 * (funding / hiring / tech). Clicking the card reveals lineage: the
 * per-leg source + the leg's contribution to the score.
 */

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import {
  LEG_COLORS,
  LEG_BADGES,
  type BoardItem,
  type Leg,
  type LegName,
} from "../hooks/useAgentData";

const LEG_ORDER: LegName[] = ["funding", "hiring", "tech"];

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
  if (score >= 70) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#667";
}

export const ContentNode = memo(function ContentNode({ data }: NodeProps) {
  const item = data as unknown as BoardItem;
  const company = item.company;
  const score = item.score;
  const legs = score?.legs ?? null;
  const [open, setOpen] = useState(false);

  const scoreVal = score?.score ?? 0;
  const firedLegs = LEG_ORDER.filter((n) => legs?.[n]);
  const accent = score ? scoreColor(scoreVal) : "#334";

  return (
    <div
      className="w-[300px] bg-zinc-950/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden font-sans cursor-pointer shadow-xl transition-all duration-200 ease-out hover:border-zinc-700 hover:shadow-2xl"
      onClick={() => setOpen((v) => !v)}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="!w-[6px] !h-[6px] !border-2 !border-zinc-950 !rounded-full transition-colors"
        style={{ background: accent }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-[6px] !h-[6px] !bg-zinc-600 !border-2 !border-zinc-950 !rounded-full"
      />

      {/* Header: company identity + score */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accent}15` }}
        >
          <Building2 size={18} style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-100 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.name || company?.domain || "Unknown company"}
          </div>
          <div className="text-xs text-zinc-400 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            {company?.domain}
            {company?.industry ? ` · ${company.industry}` : ""}
          </div>
        </div>
        {/* Score chip */}
        <div className="flex flex-col items-end shrink-0 pl-2">
          <span className="text-2xl font-bold leading-none tracking-tight" style={{ color: accent }}>
            {score ? Math.round(scoreVal) : "—"}
          </span>
          <span className="text-[9px] text-zinc-500 font-semibold tracking-wider mt-1 uppercase">SCORE</span>
        </div>
      </div>

      {/* Per-leg badges */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/30">
        {LEG_ORDER.map((name) => {
          const fired = !!legs?.[name];
          const c = LEG_COLORS[name];
          return (
            <div
              key={name}
              title={`${name}: ${legSummary(name, legs?.[name] ?? null)}`}
              className="px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide"
              style={{
                background: fired ? `${c}15` : "transparent",
                border: `1px solid ${fired ? `${c}30` : "rgba(255,255,255,0.05)"}`,
                color: fired ? c : "#71717a",
              }}
            >
              {LEG_BADGES[name]}
            </div>
          );
        })}
        <span className="ml-auto text-[10px] font-medium text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded-md">
          {firedLegs.length}/3 legs
        </span>
        {open ? (
          <ChevronUp size={14} className="text-zinc-500 ml-1" />
        ) : (
          <ChevronDown size={14} className="text-zinc-500 ml-1" />
        )}
      </div>

      {/* Lineage drawer (revealed on click) */}
      {open && (
        <div
          className="px-4 pb-4 pt-3 border-t border-white/5 bg-zinc-900/20"
          onClick={(e) => e.stopPropagation()}
        >
          {score?.rationale && (
            <div className="text-xs text-zinc-400 leading-relaxed mb-3">
              {score.rationale}
            </div>
          )}
          <div className="flex flex-col gap-2">
            {LEG_ORDER.map((name) => {
              const leg = legs?.[name] ?? null;
              const c = LEG_COLORS[name];
              const contribution = score?.rubric?.perLeg?.[name];
              return (
                <div
                  key={name}
                  className="flex items-center gap-2.5"
                  style={{ opacity: leg ? 1 : 0.5 }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: leg ? c : "#3f3f46" }}
                  />
                  <span className="text-[10px] font-bold w-10 uppercase tracking-wide" style={{ color: c }}>
                    {LEG_BADGES[name]}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-500 flex-1 truncate">
                    {LEG_SOURCE[name]}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap">
                    {legSummary(name, leg)}
                    {typeof contribution === "number" ? ` (+${Math.round(contribution)})` : ""}
                  </span>
                </div>
              );
            })}
          </div>
          {typeof company?.icpFit === "number" && (
            <div className="text-[10px] font-medium text-zinc-500 mt-3 pt-3 border-t border-white/5">
              ICP Fit: <span className="text-zinc-300">{Math.round(company.icpFit)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
