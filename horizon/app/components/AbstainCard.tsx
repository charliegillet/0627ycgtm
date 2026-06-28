"use client";

/**
 * AbstainCard — First-class React Flow node for a company the scorer ABSTAINED
 * on. Visually distinct (muted, dashed, amber-warning accent) so abstentions
 * read as a deliberate "not routing" decision, not a low score. Shows which
 * single leg fired and the "1/3 legs" rationale.
 */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { MinusCircle } from "lucide-react";
import {
  LEG_COLORS,
  LEG_BADGES,
  type BoardItem,
  type LegName,
} from "../hooks/useAgentData";

const LEG_ORDER: LegName[] = ["funding", "hiring", "tech"];

export const AbstainCard = memo(function AbstainCard({ data }: NodeProps) {
  const item = data as unknown as BoardItem;
  const company = item.company;
  const score = item.score;
  const legs = score?.legs ?? null;

  const firedLegs = LEG_ORDER.filter((n) => legs?.[n]);
  const legsFired = score?.rubric?.legsFired ?? firedLegs.length;

  return (
    <div
      className="w-[270px] border border-dashed border-amber-500/40 rounded-[3px] overflow-hidden font-mono opacity-[0.92]"
      style={{
        background: "repeating-linear-gradient(135deg, #0a0c14 0px, #0a0c14 8px, #0c0e16 8px, #0c0e16 16px)"
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-[5px] !h-[5px] !bg-[#333344] !border !border-[#0a0c14] !rounded-full"
      />

      {/* Header: identity + ABSTAIN marker */}
      <div className="flex items-center gap-2 p-2.5 border-b border-dashed border-amber-500/25">
        <div className="w-7 h-7 rounded-[3px] bg-amber-500/10 flex items-center justify-center shrink-0">
          <MinusCircle size={14} className="text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-[#9aa3b5] leading-[14px] overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.name || company?.domain || "Unknown company"}
          </div>
          <div className="text-[8px] text-[#555566] overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.domain}
          </div>
        </div>
        <span className="px-1.5 py-[2px] rounded-[2px] bg-amber-500/10 border border-amber-500/40 text-[7px] font-bold tracking-[1px] text-amber-500 shrink-0">
          ABSTAIN
        </span>
      </div>

      {/* Body: which leg fired + not-routing rationale */}
      <div className="p-2.5">
        <div className="text-[10px] font-bold text-amber-500 tracking-[0.5px] mb-1.5">
          {legsFired}/3 legs — not routing
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          {LEG_ORDER.map((name) => {
            const fired = !!legs?.[name];
            const c = LEG_COLORS[name];
            return (
              <div
                key={name}
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
        </div>

        <div className="text-[8px] text-[#777788] leading-[13px]">
          {score?.rationale ||
            "Insufficient signal to route — needs at least 2 corroborating legs."}
        </div>
      </div>
    </div>
  );
});
