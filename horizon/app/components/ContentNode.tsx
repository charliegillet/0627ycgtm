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
      className="w-[270px] bg-[#0a0c14] border border-[#141822] rounded-[3px] overflow-hidden font-mono cursor-pointer transition-colors duration-150 ease-out"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = accent + "60";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#141822";
      }}
      onClick={() => setOpen((v) => !v)}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="!w-[5px] !h-[5px] !border !border-[#0a0c14] !rounded-full"
        style={{ background: accent }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-[5px] !h-[5px] !bg-[#333344] !border !border-[#0a0c14] !rounded-full"
      />

      {/* Header: company identity + score */}
      <div className="flex items-center gap-2 p-2.5 border-b border-[#141822]">
        <div
          className="w-7 h-7 rounded-[3px] flex items-center justify-center shrink-0"
          style={{ background: `${accent}15` }}
        >
          <Building2 size={14} style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-[#c8d0e0] leading-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.name || company?.domain || "Unknown company"}
          </div>
          <div className="text-[8px] text-[#555566] overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.domain}
            {company?.industry ? ` · ${company.industry}` : ""}
          </div>
        </div>
        {/* Score chip */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-[18px] font-bold leading-[18px]" style={{ color: accent }}>
            {score ? Math.round(scoreVal) : "—"}
          </span>
          <span className="text-[7px] text-[#444455] tracking-[1px]">SCORE</span>
        </div>
      </div>

      {/* Per-leg badges */}
      <div className="flex items-center gap-1.5 px-2.5 py-2">
        {LEG_ORDER.map((name) => {
          const fired = !!legs?.[name];
          const c = LEG_COLORS[name];
          return (
            <div
              key={name}
              title={`${name}: ${legSummary(name, legs?.[name] ?? null)}`}
              className="px-1.5 py-[2px] rounded-[2px] text-[8px] font-bold tracking-[0.5px]"
              style={{
                background: fired ? `${c}20` : "#0e1118",
                border: `1px solid ${fired ? `${c}40` : "#141822"}`,
                color: fired ? c : "#333344",
              }}
            >
              {LEG_BADGES[name]}
            </div>
          );
        })}
        <span className="ml-auto text-[8px] text-[#444455]">
          {firedLegs.length}/3 legs
        </span>
        {open ? (
          <ChevronUp size={10} className="text-[#444455]" />
        ) : (
          <ChevronDown size={10} className="text-[#444455]" />
        )}
      </div>

      {/* Lineage drawer (revealed on click) */}
      {open && (
        <div
          className="px-2.5 pb-2.5 pt-2 border-t border-[#141822]"
          onClick={(e) => e.stopPropagation()}
        >
          {score?.rationale && (
            <div className="text-[8px] text-[#888899] leading-[13px] mb-2">
              {score.rationale}
            </div>
          )}
          {LEG_ORDER.map((name) => {
            const leg = legs?.[name] ?? null;
            const c = LEG_COLORS[name];
            const contribution = score?.rubric?.perLeg?.[name];
            return (
              <div
                key={name}
                className="flex items-center gap-1.5 py-[3px]"
                style={{ opacity: leg ? 1 : 0.4 }}
              >
                <div
                  className="w-1 h-1 rounded-full shrink-0"
                  style={{ background: leg ? c : "#333344" }}
                />
                <span className="text-[8px] font-semibold w-9" style={{ color: c }}>
                  {LEG_BADGES[name]}
                </span>
                <span className="text-[8px] text-[#666677] flex-1">
                  {LEG_SOURCE[name]}
                </span>
                <span className="text-[8px] text-[#888899]">
                  {legSummary(name, leg)}
                  {typeof contribution === "number" ? ` (+${Math.round(contribution)})` : ""}
                </span>
              </div>
            );
          })}
          {typeof company?.icpFit === "number" && (
            <div className="text-[8px] text-[#444455] mt-1.5">
              ICP fit: {Math.round(company.icpFit)}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
