"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Zap,
  Activity,
  Radio,
  StopCircle,
  RotateCcw,
} from "lucide-react";
import { 
  getAgentById, 
  getLogIcon, 
  type LogEntry 
} from "../hooks/useAgentData";

interface PipelineStats {
  running: number;
  failed: number;
  succeeded: number;
  routed: number;
  abstained: number;
}

interface CommandOverlayProps {
  isRunning: boolean;
  isDeploying: boolean;
  logs: LogEntry[];
  activeAgentCount: number;
  stats?: PipelineStats;
  onCreateMission: (prompt: string) => void;
  onStopAll: () => void;
  onResetAll: () => void;
}

export function CommandOverlay({
  isRunning,
  isDeploying,
  logs,
  activeAgentCount,
  stats,
  onCreateMission,
  onStopAll,
  onResetAll,
}: CommandOverlayProps) {
  const [query, setQuery] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onCreateMission(query.trim());
    setQuery("");
  };

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-5 bg-gradient-to-b from-[#020408]/95 to-transparent z-50 font-mono">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: isRunning ? "#00f0ff" : "#333",
              boxShadow: isRunning ? "0 0 8px #00f0ff" : "none",
            }}
          />
          <span className="text-[11px] font-bold text-[#00f0ff] tracking-[3px] uppercase">
            Horizon
          </span>
          <span className="text-[9px] text-[#333344] ml-2 font-normal">
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 tracking-widest">
              <Activity size={10} />
              <span>{activeAgentCount} PIPELINES RUNNING</span>
            </div>
          )}
          {stats && (
            <div className="flex items-center gap-2.5 text-[10px] tracking-widest">
              <span className="text-emerald-500">{stats.routed} ROUTED</span>
              <span className="text-amber-500">{stats.abstained} ABSTAIN</span>
              {stats.failed > 0 && (
                <span className="text-red-600">{stats.failed} FAILED</span>
              )}
            </div>
          )}
          <button
            onClick={onResetAll}
            title="Reset All (Delete Everything)"
            className="flex items-center gap-1 px-2 py-1 bg-transparent border border-red-600/20 rounded-sm text-red-600 text-[9px] font-semibold cursor-pointer transition-all duration-200 tracking-widest uppercase hover:bg-red-600/10 hover:border-red-600/40"
          >
            <RotateCcw size={9} />
            Reset
          </button>
          <div className="text-[10px] text-[#334455] tracking-widest">
            {new Date().toLocaleTimeString("en-US", { hour12: false })}
          </div>
        </div>
      </div>

      {/* Signal/Log panel - right side */}
      {logs.length > 0 && (
        <div
          ref={logRef}
          className="fixed top-14 right-3 w-80 max-h-[calc(100vh-160px)] overflow-y-auto z-40 font-mono bg-[#020408]/85 backdrop-blur-md rounded border border-[#141822] p-3"
        >
          <div className="text-[9px] text-[#444455] tracking-widest uppercase mb-3 flex items-center gap-1">
            <Radio size={8} />
            Activity
            <span className="ml-auto text-[#333344]">
              {logs.length} entries
            </span>
          </div>
          {logs.slice(0, 30).map((log, i) => {
            const agent = getAgentById(log.agent_id);
            return (
              <div
                key={log._id || i}
                className={`text-[9px] leading-4 py-1.5 border-b border-[#0a0e14] ${i === 0 ? 'animate-[fade-in_0.3s_ease]' : ''}`}
                style={{
                  opacity: i === 0 ? 1 : Math.max(0.3, 1 - i * 0.05),
                }}
              >
                <div className="flex items-center gap-1.5 mb-[3px]">
                  <span
                    className="px-1.5 py-[1px] rounded-[2px] text-[8px] font-semibold tracking-wide"
                    style={{
                      background: `${agent.color}15`,
                      color: agent.color,
                    }}
                  >
                    {agent.name}
                  </span>
                  <span className="text-[#333344] text-[8px]">
                    {new Date(log.timestamp * 1000).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[11px]">{getLogIcon(log.type)}</span>
                  <span className="text-[#888899] flex-1">{log.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom command input */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pt-4 pb-5 bg-gradient-to-t from-[#020408]/98 via-[#020408]/80 to-transparent z-50 font-mono">
        <div className="max-w-[680px] mx-auto flex flex-col gap-2.5">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-center"
          >
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[#080a10] border border-[#141822] rounded-sm">
              <Search size={14} className="text-[#333344] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your ICP or paste a domain..."
                disabled={isDeploying}
                className="flex-1 bg-transparent border-none outline-none text-[12px] tracking-[0.3px]"
                style={{
                  color: isDeploying ? "#555566" : "#c8d0e0",
                  cursor: isDeploying ? "not-allowed" : "text",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isDeploying}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-sm text-[11px] font-semibold tracking-widest uppercase transition-all duration-200 ${
                query.trim() && !isDeploying
                  ? 'bg-gradient-to-br from-[#00c8ff] to-[#0088cc] border border-[#00d4ff]/40 text-[#020408] cursor-pointer'
                  : 'bg-[#0a0e14] border border-[#141822] text-[#333344] cursor-default'
              }`}
            >
              <Zap size={12} />
              {isDeploying ? "Detecting..." : (isRunning ? "New Search" : "Detect")}
            </button>

            {isRunning && (
              <button
                type="button"
                onClick={onStopAll}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-transparent border border-red-600/40 rounded-sm text-red-600 text-[11px] font-semibold cursor-pointer transition-all duration-200 tracking-widest uppercase hover:bg-red-600/10"
              >
                <StopCircle size={12} />
                Stop All
              </button>
            )}
          </form>

          {!isRunning && (
            <div className="text-center text-[9px] text-[#222233] tracking-widest">
              Try: &quot;Series A fintech in the US, 50-200 employees&quot; or paste a domain like &quot;stripe.com&quot;
            </div>
          )}
        </div>
      </div>

    </>
  );
}
