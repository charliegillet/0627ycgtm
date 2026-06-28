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
      className="w-[320px] bg-zinc-950 border border-amber-500/20 rounded-xl overflow-hidden font-sans opacity-95 shadow-lg"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-[6px] !h-[6px] !bg-zinc-600 !border-2 !border-zinc-950 !rounded-full"
      />

      {/* Header: identity + ABSTAIN marker */}
      <div className="flex items-center gap-3 p-4 border-b border-amber-500/10">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
          <MinusCircle size={18} className="text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-300 leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.name || company?.domain || "Unknown company"}
          </div>
          <div className="text-xs font-medium text-zinc-500 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.domain}
          </div>
        </div>
        <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold tracking-widest text-amber-500 shrink-0">
          ABSTAIN
        </span>
      </div>

      {/* Body: which leg fired + not-routing rationale */}
      <div className="p-4 bg-zinc-900/20">
        <div className="text-[11px] font-bold text-amber-500 tracking-wide mb-3">
          {legsFired}/3 legs — not routing
        </div>

        <div className="flex items-center gap-2 mb-3">
          {LEG_ORDER.map((name) => {
            const fired = !!legs?.[name];
            const c = LEG_COLORS[name];
            return (
              <div
                key={name}
                className="px-2 py-1 rounded-md text-[10px] font-bold tracking-wide"
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
        </div>

        <div className="text-xs text-zinc-500 leading-relaxed font-medium">
          {score?.rationale ||
            "Insufficient signal to route — needs at least 2 corroborating legs."}
        </div>
      </div>
    </div>
  );
});
