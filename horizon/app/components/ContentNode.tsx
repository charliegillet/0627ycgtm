"use client";

/**
 * ContentNode (LeadNode) — Custom React Flow node for a scored company.
 * Shows the company name, score, ICP fit and per-leg signal badges
 * (funding / hiring / tech). Clicking the card reveals lineage: the
 * per-leg source + the leg's contribution to the score.
 */

import { memo, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Building2, ChevronDown, ChevronUp, Check, X } from "lucide-react";
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
  if (score >= 70) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#667";
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
      style={{
        width: 270,
        background: "#0a0c14",
        border: "1px solid #141822",
        borderRadius: 3,
        overflow: "hidden",
        fontFamily: MONO,
        cursor: "pointer",
        transition: "border-color 0.15s ease",
      }}
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
        style={{
          width: 5,
          height: 5,
          background: accent,
          border: "1px solid #0a0c14",
          borderRadius: "50%",
        }}
      />
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

      {/* Header: company identity + score */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 10,
          borderBottom: "1px solid #141822",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 3,
            background: `${accent}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Building2 size={14} style={{ color: accent }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#c8d0e0",
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
            {company?.industry ? ` · ${company.industry}` : ""}
          </div>
        </div>
        {/* Score chip */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, color: accent, lineHeight: "18px" }}>
            {score ? Math.round(scoreVal) : "—"}
          </span>
          <span style={{ fontSize: 7, color: "#445", letterSpacing: 1 }}>SCORE</span>
        </div>
      </div>

      {/* Per-leg badges */}
      <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        {LEG_ORDER.map((name) => {
          const isFired = legFired(score, name);
          const c = LEG_COLORS[name];
          return (
            <div
              key={name}
              title={`${name}: ${legSummary(name, legs?.[name] ?? null)}`}
              style={{
                padding: "2px 6px",
                borderRadius: 2,
                background: isFired ? `${c}20` : "#0e1118",
                border: `1px solid ${isFired ? `${c}40` : "#141822"}`,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: isFired ? c : "#334",
              }}
            >
              {LEG_BADGES[name]}
            </div>
          );
        })}
        <span style={{ marginLeft: "auto", fontSize: 8, color: "#445" }}>
          {fired.length}/3 legs
        </span>
        {open ? (
          <ChevronUp size={10} style={{ color: "#445" }} />
        ) : (
          <ChevronDown size={10} style={{ color: "#445" }} />
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
          style={{
            padding: "0 10px 10px",
            borderTop: "1px solid #141822",
            paddingTop: 8,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {score?.rationale && (
            <div
              style={{
                fontSize: 8,
                color: "#889",
                lineHeight: "13px",
                marginBottom: 8,
              }}
            >
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 0",
                  opacity: leg ? 1 : 0.4,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: leg ? c : "#334",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 8, color: c, fontWeight: 600, width: 36 }}>
                  {LEG_BADGES[name]}
                </span>
                <span style={{ fontSize: 8, color: "#667", flex: 1 }}>
                  {LEG_SOURCE[name]}
                </span>
                <span style={{ fontSize: 8, color: "#889" }}>
                  {legSummary(name, leg)}
                  {typeof contribution === "number" ? ` (+${Math.round(contribution)})` : ""}
                </span>
              </div>
            );
          })}
          {typeof company?.icpFit === "number" && (
            <div style={{ fontSize: 8, color: "#445", marginTop: 6 }}>
              ICP fit: {Math.round(company.icpFit)}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
