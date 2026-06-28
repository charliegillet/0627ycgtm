"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Zap,
  Activity,
  Radio,
  StopCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp
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
  const [isLogMinimized, setIsLogMinimized] = useState(false);
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
      <div className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-6 bg-black/60 backdrop-blur-lg border-b border-white/5 z-50 font-sans">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: isRunning ? "#10b981" : "#3f3f46",
              boxShadow: isRunning ? "0 0 8px #10b981" : "none",
            }}
          />
          <span className="text-sm font-semibold text-zinc-100 tracking-wide">
            Horizon
          </span>
          <span className="text-xs text-zinc-500 font-medium px-2 py-0.5 bg-zinc-900 rounded-md border border-white/5">
            Beta
          </span>
        </div>

        <div className="flex items-center gap-5">
          {isRunning && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <Activity size={14} />
              <span>{activeAgentCount} Active Pipelines</span>
            </div>
          )}
          {stats && (
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-zinc-300">{stats.routed} Routed</span>
              <span className="text-zinc-500">{stats.abstained} Abstained</span>
              {stats.failed > 0 && (
                <span className="text-red-400">{stats.failed} Failed</span>
              )}
            </div>
          )}
          <div className="w-[1px] h-4 bg-zinc-800" />
          <button
            onClick={onResetAll}
            title="Reset All"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-zinc-400 text-xs font-medium hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </div>

      {/* Signal/Log panel - right side */}
      {logs.length > 0 && (
        <div
          className={`fixed top-20 right-6 w-96 font-sans bg-zinc-950/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl transition-all duration-300 z-40 ${
            isLogMinimized ? "max-h-[50px] overflow-hidden" : "max-h-[calc(100vh-180px)] flex flex-col gap-3 p-4"
          }`}
        >
          {isLogMinimized ? (
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setIsLogMinimized(false)}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-100">
                <Radio size={12} className="text-zinc-400" />
                Activity Log
                <span className="text-zinc-500 font-normal ml-1">
                  ({logs.length})
                </span>
              </div>
              <ChevronDown size={14} className="text-zinc-400" />
            </div>
          ) : (
            <>
              <div className="text-xs font-semibold text-zinc-100 flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Radio size={12} className="text-zinc-400" />
                  Activity Log
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-normal">
                    {logs.length} entries
                  </span>
                  <button 
                    onClick={() => setIsLogMinimized(true)}
                    className="text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    <ChevronUp size={14} />
                  </button>
                </div>
              </div>
              <div ref={logRef} className="flex flex-col overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 240px)" }}>
                {logs.slice(0, 30).map((log, i) => {
                  const agent = getAgentById(log.agent_id);
                  return (
                    <div
                      key={log._id || i}
                      className={`py-3 border-b border-white/5 last:border-0 ${i === 0 ? 'animate-[fade-in_0.3s_ease]' : ''}`}
                      style={{
                        opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.05),
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide"
                          style={{
                            background: `${agent.color}15`,
                            color: agent.color,
                            border: `1px solid ${agent.color}30`
                          }}
                        >
                          {agent.name}
                        </span>
                        <span className="text-zinc-500 text-xs font-mono">
                          {new Date(log.timestamp * 1000).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm mt-0.5">{getLogIcon(log.type)}</span>
                        <span className="text-sm text-zinc-300 leading-relaxed flex-1">{log.message}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom command input */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pt-8 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent z-50 font-sans">
        <div className="max-w-[720px] mx-auto flex flex-col gap-3">
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 items-center bg-zinc-900/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-2xl focus-within:border-zinc-700 transition-colors"
          >
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search size={18} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your ICP or paste a domain..."
                disabled={isDeploying}
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder:text-zinc-500 h-10"
                style={{
                  cursor: isDeploying ? "not-allowed" : "text",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isDeploying}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                query.trim() && !isDeploying
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-md cursor-pointer'
                  : 'bg-zinc-800/50 text-zinc-500 cursor-default'
              }`}
            >
              <Zap size={14} className={query.trim() && !isDeploying ? "text-black" : "text-zinc-500"} />
              {isDeploying ? "Detecting..." : (isRunning ? "New Search" : "Detect")}
            </button>

            {isRunning && (
              <button
                type="button"
                onClick={onStopAll}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 text-sm font-semibold cursor-pointer transition-all duration-200"
              >
                <StopCircle size={14} />
                Stop
              </button>
            )}
          </form>

          {!isRunning && (
            <div className="text-center text-xs text-zinc-500 font-medium tracking-wide">
              Try: &quot;Series A fintech in the US, 50-200 employees&quot; or paste a domain like &quot;stripe.com&quot;
            </div>
          )}
        </div>
      </div>

    </>
  );
}
