"use client";

/**
 * AbstainCard — First-class React Flow node for a company the scorer ABSTAINED
 * on. Visually distinct (muted, dashed, amber-warning accent) so abstentions
 * read as a deliberate "not routing" decision, not a low score. Shows which
 * single leg fired and the "1/3 legs" rationale.
 */

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { MinusCircle, ShieldAlert, Check } from "lucide-react";
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
      className="w-[310px] glass-panel border border-amber-500/20 rounded-xl overflow-hidden font-sans opacity-90 shadow-2xl relative transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/40 hud-glow-amber"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-[8px] !h-[8px] !bg-zinc-700 !border-2 !border-zinc-950 !rounded-full"
      />

      {/* Decorative corner status indicator */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-amber-500/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-amber-500/30" />

      {/* Header: identity + ABSTAIN marker */}
      <div className="flex items-center gap-3 p-4 border-b border-white/5 relative bg-gradient-to-r from-amber-500/[0.02] to-transparent">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <MinusCircle size={18} className="text-amber-500 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-zinc-300 tracking-wide leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.name || company?.domain || "Unknown Company"}
          </div>
          <div className="text-[10.5px] text-zinc-500 font-mono tracking-tight font-medium mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
            {company?.domain}
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[8.5px] font-bold tracking-widest text-amber-500 shrink-0 font-display">
          ABSTAINED
        </span>
      </div>

      {/* Body: which leg fired + not-routing rationale */}
      <div className="p-4 bg-black/30">
        <div className="text-[11px] font-bold text-amber-500/90 tracking-wide mb-3 flex items-center gap-1.5 font-display">
          <ShieldAlert size={12} className="text-amber-500" />
          {legsFired} OF 3 LEGS VERIFIED — ROUTING HALTED
        </div>

        {/* Badges display */}
        <div className="flex items-center gap-2 mb-3.5">
          {LEG_ORDER.map((name) => {
            const fired = !!legs?.[name];
            const c = LEG_COLORS[name];
            return (
              <div
                key={name}
                className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider font-display flex items-center gap-1"
                style={{
                  background: fired ? `${c}10` : "rgba(255,255,255,0.01)",
                  border: `1px solid ${fired ? `${c}20` : "rgba(255,255,255,0.03)"}`,
                  color: fired ? c : "#52525b",
                }}
              >
                {fired && <Check size={8} style={{ color: c }} />}
                {LEG_BADGES[name].toUpperCase()}
              </div>
            );
          })}
        </div>

        <div className="text-[11.5px] text-zinc-400 leading-relaxed font-medium p-2.5 rounded-lg bg-white/[0.01] border border-white/5">
          {score?.rationale ||
            "Insufficient signal correlation to route this prospect. High-fidelity plays require a convergence of at least 2 verified signals."}
        </div>
      </div>
    </div>
  );
});
