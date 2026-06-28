"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { ResizablePane } from "./components/ResizablePane";
import { ContentWhiteboard } from "./components/ContentWhiteboard";
import { CommandOverlay } from "./components/CommandOverlay";
import {
  type BoardItem,
  type LogEntry,
  type AgentData,
  type AgentSignal,
} from "./hooks/useAgentData";

// Dynamically import HorizonScene to avoid SSR issues with Three.js
const HorizonScene = dynamic(
  () => import("./components/HorizonScene").then((mod) => mod.HorizonScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-black flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-zinc-800 border-t-white animate-[spin_0.8s_linear_infinite]" />
          <span className="text-xs text-zinc-400 tracking-widest uppercase font-medium">
            Initializing Command Center
          </span>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [isDeploying, setIsDeploying] = useState(false);

  // ---- Queries -----------------------------------------------------------
  // Board: running runs + scored companies (join companies + latest score).
  const board = useQuery(api.queries.board.liveBoard);
  // Viz tables (kept) power the 3D flourish + activity feed.
  const allAgents = useQuery(api.agents.getAllAgents) as AgentData[] | undefined;
  const recentLogs = useQuery(api.logs.getRecentLogs, { limit: 50 }) as LogEntry[] | undefined;
  const recentSignals = useQuery(api.signals.getRecentSignals, { limit: 50 });
  // Reactive pipeline health (observability) for the command overlay.
  const pipelineStats = useQuery(api.queries.health.pipelineStats);

  // ---- Mutations ---------------------------------------------------------
  // detect.recordSignal is internal; the public ingress for a typed ICP / domain
  // is the HTTP POST /signal endpoint. We POST from the client.
  // TODO(verify): confirm the public ingress (HTTP /signal) vs a public mutation.
  const sendCommand = useMutation(api.control.sendCommand);
  const resetAll = useMutation(api.cleanup.resetAll);

  // liveBoard shape is loosely typed (resolves after codegen). Accept either an
  // array of board items or an object { items, runningCount }.
  // TODO(verify): confirm liveBoard return shape against convex/queries/board.ts.
  const { items, runningCount } = useMemo(() => {
    if (!board) return { items: [] as BoardItem[], runningCount: 0 };
    if (Array.isArray(board)) {
      return { items: board as unknown as BoardItem[], runningCount: 0 };
    }
    const b = board as { items?: BoardItem[]; runningCount?: number; running?: unknown[] };
    return {
      items: (b.items ?? []) as BoardItem[],
      runningCount: b.runningCount ?? (Array.isArray(b.running) ? b.running.length : 0),
    };
  }, [board]);

  // Running = there is an active run OR signals are still flowing in.
  const isRunning = useMemo(
    () => runningCount > 0 || (recentSignals?.length ?? 0) > 0,
    [runningCount, recentSignals]
  );

  // Signal sources have static live URLs (none in fixture mode); the 3D scene
  // still lights up from the bridged signals table.
  const liveUrls = useMemo(() => ({}) as Record<number, string | null>, []);

  const signals = useMemo(() => {
    return (recentSignals || []) as AgentSignal[];
  }, [recentSignals]);

  // ---- Handlers ----------------------------------------------------------
  const handleCreateMission = useCallback(async (prompt: string) => {
    const value = prompt.trim();
    if (!value) return;
    setIsDeploying(true);
    try {
      // A bare domain seeds detection directly; free text is treated as an ICP.
      const isDomain = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
      await fetch("/api/signal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isDomain
            ? { source: "manual", kind: "manual", companyDomain: value }
            : { source: "manual", kind: "icp", payload: { icp: value } }
        ),
      }).catch(() => {
        // Convex HTTP actions are served from the deployment origin; the lead
        // wires the exact route. Swallow errors so the UI stays responsive.
      });
    } finally {
      setIsDeploying(false);
    }
  }, []);

  const handleStopAll = useCallback(async () => {
    if (confirm("Stop all running pipelines?")) {
      await sendCommand({ command: "stop_all" });
    }
  }, [sendCommand]);

  const handleResetAll = useCallback(async () => {
    if (
      confirm(
        "RESET ALL? This deletes companies, leads, scores, actions, runs and logs. This cannot be undone."
      )
    ) {
      await resetAll();
    }
  }, [resetAll]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-zinc-100 font-sans">
      <ResizablePane
        defaultWidth={640}
        minWidth={420}
        maxWidth={960}
        left={<ContentWhiteboard items={items} isRunning={isRunning} />}
        right={
          <div className="relative w-full h-full">
            <HorizonScene
              agents={allAgents || []}
              signals={signals}
              liveUrls={liveUrls}
              isRunning={isRunning}
            />
          </div>
        }
      />

      {/* Command overlay sits on top of everything */}
      <CommandOverlay
        isRunning={isRunning}
        isDeploying={isDeploying}
        logs={recentLogs || []}
        activeAgentCount={runningCount}
        stats={pipelineStats}
        onCreateMission={handleCreateMission}
        onStopAll={handleStopAll}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
