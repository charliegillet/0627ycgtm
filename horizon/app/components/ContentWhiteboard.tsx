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

import { ContentNode } from "./ContentNode";
import { AbstainCard } from "./AbstainCard";
import { type BoardItem } from "../hooks/useAgentData";

const nodeTypes: NodeTypes = {
  content: ContentNode,
  abstain: AbstainCard,
};

const NODE_W = 280;
const NODE_H = 240;
const GAP_X = 40;
const GAP_Y = 40;
const COLS = 3;
const ORIGIN_X = 80;
const ORIGIN_Y = 80;

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
      background: "#020408",
    }),
    []
  );

  const minimapStyle = useMemo(
    () => ({
      backgroundColor: "#080a10",
      maskColor: "rgba(0, 0, 0, 0.7)",
    }),
    []
  );

  return (
    <div className="w-full h-full relative">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center justify-between bg-gradient-to-b from-[#020408] to-transparent pointer-events-none">
        <div className="flex items-center gap-1.5 font-mono">
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: isRunning ? "#00f0ff" : "#333344",
              boxShadow: isRunning ? "0 0 6px #00f0ff" : "none",
            }}
          />
          <span className="text-[9px] font-bold text-[#00f0ff] tracking-[2px] uppercase">
            Lead Board
          </span>
          <span className="text-[9px] text-[#333344]">
            {items.length} companies
          </span>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-5 pointer-events-none font-mono">
          <div className="w-8 h-8 border border-[#141822] rounded-[3px] flex items-center justify-center">
            <div className="w-3 h-3 border border-dashed border-[#2a2f3e] rounded-sm" />
          </div>
          <span className="text-[10px] text-[#333344] tracking-[1px]">
            {isRunning
              ? "Detecting signals & scoring companies..."
              : "Describe your ICP or paste a domain to begin"}
          </span>
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
          gap={20}
          size={0.8}
          color="#141822"
        />
        <Controls
          showInteractive={false}
          className="!bg-[#080a10] !border-[#141822] !rounded-[3px] [&>button]:!border-b-[#141822] [&>button]:!bg-[#080a10] [&>button>svg]:!fill-[#c8d0e0] hover:[&>button]:!bg-[#141822]"
        />
        <MiniMap
          style={minimapStyle}
          nodeColor={(n) => {
            if (n.type === "abstain") return "#f59e0b";
            const score = (n.data as { score?: { score?: number } })?.score?.score;
            if (typeof score === "number") {
              if (score >= 70) return "#10b981";
              if (score >= 50) return "#f59e0b";
            }
            return "#445";
          }}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}
