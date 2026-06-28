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
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#020408",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: "2px solid #141822",
              borderTopColor: "#00f0ff",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: "#334",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Initializing Command Center
          </span>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [icpStatus, setIcpStatus] = useState<string | null>(null);

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
  // Returns true on success (input should clear); false if the ICP could not
  // be resolved (input stays so the user can refine it).
  const handleCreateMission = useCallback(async (prompt: string): Promise<boolean> => {
    const value = prompt.trim();
    if (!value) return false;
    setIsDeploying(true);
    setIcpStatus(null);
    try {
      // A bare domain seeds detection directly; free text is treated as an ICP.
      const isDomain = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
      if (isDomain) {
        // Domain path: fire-and-forget, clear on submit (success assumed).
        await fetch("/api/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: "manual", kind: "manual", companyDomain: value }),
        }).catch(() => {});
        return true;
      }
      // ICP path: capture the response and surface status.
      let data: { ok?: boolean; domains?: string[] } | null = null;
      try {
        const res = await fetch("/api/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: "manual", kind: "icp", payload: { icp: value }, limit: 3 }),
        });
        data = await res.json().catch(() => null);
      } catch {
        // Network failure — treat as unresolved.
      }
      if (data && data.ok && Array.isArray(data.domains) && data.domains.length > 0) {
        setIcpStatus(`Resolved to: ${data.domains.join(", ")}`);
        return true;
      }
      setIcpStatus("Could not resolve that ICP. Try a domain, or a broader description.");
      return false;
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
        "RESET ALL? This deletes the BEACHHEAD tables (companies, leads, signal events, scores, actions, runs, traces, API cache) and the legacy viz tables (logs, signals). This cannot be undone."
      )
    ) {
      await resetAll();
    }
  }, [resetAll]);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#020408" }}>
      <ResizablePane
        defaultWidth={520}
        minWidth={320}
        maxWidth={960}
        left={<ContentWhiteboard items={items} isRunning={isRunning} />}
        right={
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
        icpStatus={icpStatus}
        onCreateMission={handleCreateMission}
        onStopAll={handleStopAll}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
