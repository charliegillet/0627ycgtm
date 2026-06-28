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
} from "../hooks/useAgentData";
import { LEG_ORDER, legFired, firedLegCount } from "../lib/legs";

const MONO = "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace";
const AMBER = "#f59e0b";

export const AbstainCard = memo(function AbstainCard({ data }: NodeProps) {
  const item = data as unknown as BoardItem;
  const company = item.company;
  const score = item.score;

  // A leg "fired" only when it contributed POSITIVE points. A present-but-zero
  // leg (stale funding, tech present:false) is real evidence that did NOT fire,
  // so it must not light a badge or inflate the "X/3 legs" count. Mirrors the
  // convergence rubric and ContentNode via the shared app/lib/legs helper.
  const legsFired = firedLegCount(score);

  return (
    <div
      style={{
        width: 270,
        background: "repeating-linear-gradient(135deg, #0a0c14 0px, #0a0c14 8px, #0c0e16 8px, #0c0e16 16px)",
        border: `1px dashed ${AMBER}40`,
        borderRadius: 3,
        overflow: "hidden",
        fontFamily: MONO,
        opacity: 0.92,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 5,
          height: 5,
          background: "#334",
          border: "1px solid #0a0c14",
          borderRadius: "50%",
        }}
      />

      {/* Header: identity + ABSTAIN marker */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 10,
          borderBottom: `1px dashed ${AMBER}25`,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 3,
            background: `${AMBER}12`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MinusCircle size={14} style={{ color: AMBER }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9aa3b5",
              lineHeight: "14px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {company?.name || company?.domain || "Unknown company"}
          </div>
          <div
            style={{
              fontSize: 8,
              color: "#556",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {company?.domain}
          </div>
        </div>
        <span
          style={{
            padding: "2px 6px",
            borderRadius: 2,
            background: `${AMBER}18`,
            border: `1px solid ${AMBER}40`,
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: 1,
            color: AMBER,
            flexShrink: 0,
          }}
        >
          ABSTAIN
        </span>
      </div>

      {/* Body: which leg fired + not-routing rationale */}
      <div style={{ padding: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: AMBER,
            letterSpacing: 0.5,
            marginBottom: 6,
          }}
        >
          {legsFired}/3 legs — not routing
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          {LEG_ORDER.map((name) => {
            const fired = legFired(score, name);
            const c = LEG_COLORS[name];
            return (
              <div
                key={name}
                style={{
                  padding: "2px 6px",
                  borderRadius: 2,
                  background: fired ? `${c}20` : "#0e1118",
                  border: `1px solid ${fired ? `${c}40` : "#141822"}`,
                  fontSize: 8,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: fired ? c : "#334",
                }}
              >
                {LEG_BADGES[name]}
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: 8, color: "#778", lineHeight: "13px" }}>
          {score?.rationale ||
            "Insufficient signal to route — needs at least 2 corroborating legs."}
        </div>
      </div>
    </div>
  );
});
