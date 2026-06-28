"use client";

/**
 * ContentWhiteboard — React Flow canvas (the HERO) showing the live lead board.
 * Each scored company appears as a draggable card; companies the scorer
 * abstained on render as a visually distinct AbstainCard. Cards are laid out in
 * a FIFO grid with a minimap; clicking a routed card reveals its lineage.
 */

import { useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Terminal } from "lucide-react";

import { ContentNode } from "./ContentNode";
import { AbstainCard } from "./AbstainCard";
import { type BoardItem } from "../hooks/useAgentData";

const nodeTypes: NodeTypes = {
  content: ContentNode,
  abstain: AbstainCard,
};

const NODE_W = 310;
const NODE_H = 260;
const GAP_X = 50;
const GAP_Y = 50;
const COLS = 2; // Form factor is split 50/50, so 2 columns are perfect for high readability!
const ORIGIN_X = 60;
const ORIGIN_Y = 100;

interface ContentWhiteboardProps {
  items: BoardItem[];
  isRunning: boolean;
}

export function ContentWhiteboard({ items, isRunning }: ContentWhiteboardProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const knownIds = useRef<Set<string>>(new Set());
  const knownIdsOrder = useRef<string[]>([]);
  const MAX_KNOWN_IDS = 1000;
  const MAX_DISPLAY_NODES = 100;

  useEffect(() => {
    if (items.length === 0) {
      knownIds.current.clear();
      knownIdsOrder.current = [];
      setNodes([]);
      setEdges([]);
      return;
    }

    const newItems = items.filter((c) => !knownIds.current.has(c._id));
    if (newItems.length === 0 && nodes.length > 0) return;

    // Track known ids with FIFO eviction so the board stays bounded.
    items.forEach((c) => {
      if (!knownIds.current.has(c._id)) {
        knownIds.current.add(c._id);
        knownIdsOrder.current.push(c._id);

        if (knownIds.current.size > MAX_KNOWN_IDS) {
          const toRemove = knownIdsOrder.current.shift();
          if (toRemove) {
            knownIds.current.delete(toRemove);
          }
        }
      }
    });

    // Limit displayed cards to the most recent items.
    const display = items.slice(0, MAX_DISPLAY_NODES);

    // One card per company; abstained companies use the distinct abstain node.
    const cardNodes: Node[] = display.map((item, idx) => {
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const abstained = item.score?.abstained === true;
      return {
        id: item._id,
        type: abstained ? "abstain" : "content",
        position: {
          x: ORIGIN_X + col * (NODE_W + GAP_X),
          y: ORIGIN_Y + row * (NODE_H + GAP_Y),
        },
        data: { ...item } as unknown as Record<string, unknown>,
      };
    });

    setNodes(cardNodes);
    setEdges([]);
  }, [items, setNodes, setEdges, nodes.length]);

  const rfStyle = useMemo(
    () => ({
      background: "#020204",
    }),
    []
  );

  const minimapStyle = useMemo(
    () => ({
      backgroundColor: "rgba(4, 4, 8, 0.85)",
      borderColor: "rgba(255, 255, 255, 0.08)",
    }),
    []
  );

  return (
    <div className="w-full h-full relative">
      {/* HUD Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-[#020204]/90 via-[#020204]/40 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 py-1.5 px-3 rounded-full bg-zinc-950/80 border border-white/5 shadow-xl backdrop-blur-md">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              isRunning ? "bg-[#10b981] animate-pulse shadow-[0_0_10px_#10b981]" : "bg-zinc-700"
            }`}
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-100 tracking-widest uppercase font-display">
              ACTIVE INTELLIGENCE RECORD
            </span>
            <div className="w-[1px] h-3 bg-white/10" />
            <span className="text-xs font-bold text-zinc-400 font-display">
              {items.length} COMPANIES TRACKED
            </span>
          </div>
        </div>
      </div>

      {/* Empty state styled like a secure terminal diagnostic */}
      {items.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-5 pointer-events-none font-sans">
          <div className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center bg-zinc-950/40 shadow-2xl relative">
            <div className="absolute inset-0.5 rounded-xl border border-dashed border-white/5 animate-[pulse-opacity_2s_infinite]" />
            <Terminal size={22} className="text-zinc-500 animate-[pulse-opacity_1.5s_infinite]" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[13px] font-bold text-zinc-300 font-display tracking-widest uppercase">
              {isRunning
                ? "DECRYPTING PARALLEL SIGNALS & SCORING..."
                : "WAR ROOM INACTIVE"}
            </span>
            <p className="text-[11px] text-zinc-500 font-medium text-center max-w-[280px] leading-normal font-sans">
              {isRunning
                ? "Ingesting data streams. Real-time convergence assessment is currently underway."
                : "Describe your ideal customer profile or insert a specific domain above to initiate active tracking."}
            </p>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={rfStyle}
        proOptions={{ hideAttribution: true }}
        minZoom={0.15}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "default",
          animated: true,
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={32}
          size={1}
          color="rgba(255, 255, 255, 0.03)"
        />
        <Controls
          showInteractive={false}
          className="!bg-zinc-950/95 !border-white/10 !rounded-xl overflow-hidden shadow-2xl backdrop-blur-md"
        />
        <MiniMap
          style={minimapStyle}
          nodeColor={(n) => {
            if (n.type === "abstain") return "rgba(245, 158, 11, 0.8)";
            const score = (n.data as { score?: { score?: number } })?.score?.score;
            if (typeof score === "number") {
              if (score >= 70) return "rgba(16, 185, 129, 0.8)";
              if (score >= 50) return "rgba(245, 158, 11, 0.8)";
            }
            return "#3f3f46";
          }}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
