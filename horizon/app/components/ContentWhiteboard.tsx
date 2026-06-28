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

const NODE_W = 320;
const NODE_H = 260;
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
      background: "#000000",
    }),
    []
  );

  const minimapStyle = useMemo(
    () => ({
      backgroundColor: "#09090b",
      maskColor: "rgba(0, 0, 0, 0.7)",
    }),
    []
  );

  return (
    <div className="w-full h-full relative">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black to-transparent pointer-events-none">
        <div className="flex items-center gap-2 font-sans">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: isRunning ? "#10b981" : "#3f3f46",
              boxShadow: isRunning ? "0 0 8px #10b981" : "none",
            }}
          />
          <span className="text-xs font-semibold text-zinc-100 tracking-wide uppercase">
            Lead Board
          </span>
          <span className="text-xs text-zinc-500 ml-1">
            {items.length} companies
          </span>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-5 pointer-events-none font-sans">
          <div className="w-12 h-12 border border-zinc-800 rounded-xl flex items-center justify-center bg-zinc-950/50 shadow-sm">
            <div className="w-4 h-4 border border-dashed border-zinc-600 rounded-sm" />
          </div>
          <span className="text-sm font-medium text-zinc-400">
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
          gap={24}
          size={1}
          color="#27272a"
        />
        <Controls
          showInteractive={false}
          className="!bg-zinc-950 !border-zinc-800 !rounded-lg [&>button]:!border-b-zinc-800 [&>button]:!bg-zinc-950 [&>button>svg]:!fill-zinc-400 hover:[&>button]:!bg-zinc-900 overflow-hidden shadow-md"
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
