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
  ChevronUp,
  PanelLeft,
  Cpu,
  CheckCircle2,
  Lock
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
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  icpStatus?: string | null;
  onCreateMission: (prompt: string) => Promise<boolean>;
  onStopAll: () => void;
  onResetAll: () => void;
}

export function CommandOverlay({
  isRunning,
  isDeploying,
  logs,
  activeAgentCount,
  stats,
  isSidebarOpen,
  onToggleSidebar,
  icpStatus,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const success = await onCreateMission(query.trim());
    if (success) setQuery("");
  };

  return (
    <>
      {/* HUD Top bar */}
      <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-[#020204]/80 border-b border-white/10 z-50 font-sans backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg border transition-all duration-300 ${
              isSidebarOpen 
                ? "bg-zinc-900 border-white/15 text-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.1)]" 
                : "text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-900/60 hover:border-white/15"
            }`}
            title="Toggle Lead Board"
          >
            <PanelLeft size={16} />
          </button>
          
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                isRunning 
                  ? "bg-[#10b981] shadow-[0_0_8px_#10b981]" 
                  : "bg-zinc-700 shadow-none"
              }`}
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-[0.2em] font-display uppercase leading-tight">
                BEACHHEAD
              </span>
              <span className="text-[9px] text-[#10b981] font-bold tracking-widest font-display uppercase">
                GTM SIGNAL INTEL
              </span>
            </div>
            
            <span className="text-[9px] text-[#10b981] font-extrabold px-1.5 py-0.5 bg-[#10b981]/10 rounded border border-[#10b981]/25 font-mono tracking-widest ml-1 animate-pulse">
              PROD
            </span>
          </div>
        </div>

        {/* HUD Statistics Widget */}
        <div className="flex items-center gap-6">
          {isRunning && (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-[#10b981] font-display tracking-wider bg-[#10b981]/5 px-3 py-1.5 rounded-lg border border-[#10b981]/15 animate-pulse">
              <Activity size={14} />
              <span>{activeAgentCount} ACTIVE STREAMING PROFILES</span>
            </div>
          )}
          
          {stats ? (
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-1.5 text-[11px] font-bold font-display tracking-widest">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 size={12} />
                <span>{stats.routed} ROUTED</span>
              </div>
              <div className="w-[1px] h-3 bg-white/10" />
              <div className="flex items-center gap-1.5 text-amber-500">
                <MinusCircleIcon size={12} />
                <span>{stats.abstained} ABSTAINED</span>
              </div>
              {stats.failed > 0 && (
                <>
                  <div className="w-[1px] h-3 bg-white/10" />
                  <span className="text-red-400">{stats.failed} FAILED</span>
                </>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-zinc-500 tracking-widest border border-white/5 rounded-lg font-display bg-white/[0.01]">
              <Lock size={10} className="text-zinc-600" />
              <span>SECURE CONSOLE CONNECTION LINK ESTABLISHED</span>
            </div>
          )}
          
          <div className="w-[1px] h-5 bg-white/10" />
          
          <button
            onClick={onResetAll}
            title="Reset All"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-zinc-400 text-xs font-bold font-display tracking-wider hover:text-white hover:bg-zinc-900 hover:border-white/15 transition-all"
          >
            <RotateCcw size={12} className="text-zinc-500 group-hover:rotate-180 transition-transform duration-500" />
            RESET INSTANCE
          </button>
        </div>
      </div>

      {/* Signal/Log HUD panel - right side */}
      {logs.length > 0 && (
        <div className="fixed top-22 right-6 z-40 font-sans flex flex-col items-end pointer-events-none">
          {isLogMinimized ? (
            <button 
              onClick={() => setIsLogMinimized(false)}
              className="flex items-center gap-2 bg-[#020204]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl px-4 py-3 hover:bg-zinc-900 hover:border-white/20 transition-all group pointer-events-auto cursor-pointer font-display tracking-wider font-bold"
            >
              <Radio size={12} className="text-zinc-400 group-hover:text-[#10b981] transition-colors animate-pulse" />
              <span className="text-xs text-zinc-200">REALTIME TELEMETRY LOG</span>
              <span className="text-xs text-[#10b981]">({logs.length})</span>
              <ChevronDown size={14} className="text-zinc-400 ml-1 group-hover:text-white transition-colors" />
            </button>
          ) : (
            <div className="w-[410px] bg-[#020204]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4.5 flex flex-col gap-3 max-h-[calc(100vh-220px)] overflow-hidden pointer-events-auto">
              <div className="text-xs font-bold text-zinc-200 flex items-center justify-between pb-2.5 border-b border-white/5 shrink-0 font-display tracking-wider uppercase">
                <div className="flex items-center gap-2 text-zinc-100">
                  <Cpu size={14} className="text-[#10b981] animate-pulse" />
                  Realtime Telemetry Log
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 font-bold">
                    {logs.length} ENTRIES
                  </span>
                  <button 
                    onClick={() => setIsLogMinimized(true)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                  >
                    <ChevronUp size={14} />
                  </button>
                </div>
              </div>
              
              <div ref={logRef} className="flex flex-col overflow-y-auto pr-1 gap-2.5 custom-scrollbar">
                {logs.slice(0, 30).map((log, i) => {
                  const agent = getAgentById(log.agent_id);
                  return (
                    <div
                      key={log._id || i}
                      className={`p-3 rounded-lg border bg-white/[0.01] border-white/5 transition-all ${i === 0 ? 'animate-[fade-in_0.3s_ease] border-white/15 bg-white/[0.03]' : ''}`}
                      style={{
                        opacity: i === 0 ? 1 : Math.max(0.35, 1 - i * 0.04),
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-extrabold tracking-widest font-mono uppercase"
                          style={{
                            background: `${agent.color}10`,
                            color: agent.color,
                            border: `1px solid ${agent.color}25`
                          }}
                        >
                          {agent.name}
                        </span>
                        <span className="text-zinc-500 text-[10px] font-mono font-medium">
                          {new Date(log.timestamp * 1000).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <span className="text-sm shrink-0 mt-0.5">{getLogIcon(log.type)}</span>
                        <span className="text-[11.5px] text-zinc-300 leading-relaxed font-sans font-medium flex-1">
                          {log.message}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom control room command console */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pt-10 pb-8 bg-gradient-to-t from-[#020204] via-[#020204]/90 to-transparent z-50 font-sans">
        <div className="max-w-[740px] mx-auto flex flex-col gap-3.5">
          <form
            onSubmit={handleSubmit}
            className="flex gap-3.5 items-center bg-[#020204]/85 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:border-[#10b981]/40 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.06)] transition-all duration-300 relative"
          >
            {/* Corner visual details to look like premium military/tactical HUD */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-zinc-600 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-zinc-600 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-zinc-600 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-zinc-600 rounded-br-sm pointer-events-none" />

            <div className="flex-1 flex items-center gap-3 px-3">
              <Search size={18} className="text-zinc-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="INPUT IDEAL CUSTOMER PROFILE SPECIFICATIONS OR SPECIFIC TARGET DOMAIN..."
                disabled={isDeploying}
                className="flex-1 bg-transparent border-none outline-none text-xs font-semibold font-mono tracking-wide text-zinc-100 placeholder:text-zinc-600 h-11"
                style={{
                  cursor: isDeploying ? "not-allowed" : "text",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!query.trim() || isDeploying}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-display tracking-widest transition-all duration-300 uppercase ${
                query.trim() && !isDeploying
                  ? 'bg-[#10b981] text-zinc-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer'
                  : 'bg-zinc-900 border border-white/5 text-zinc-600 cursor-default'
              }`}
            >
              <Zap size={13} className={query.trim() && !isDeploying ? "text-zinc-950 animate-bounce" : "text-zinc-600"} />
              {isDeploying ? "ORCHESTRATING..." : "RUN INTEL PIPELINE"}
            </button>

            {isRunning && (
              <button
                type="button"
                onClick={onStopAll}
                className="flex items-center gap-2 px-6 py-3 bg-red-950/20 hover:bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold font-display tracking-widest cursor-pointer transition-all duration-300"
              >
                <StopCircle size={13} />
                STOP SIGNAL
              </button>
            )}
          </form>

          {icpStatus && (
            <div
              style={{
                fontSize: 9,
                letterSpacing: 1,
                color: icpStatus.startsWith("Resolved") ? "#10b981" : "#f59e0b",
              }}
            >
              {icpStatus}
            </div>
          )}

          {!isRunning && (
            <div className="text-center text-[10px] text-zinc-500 font-bold tracking-widest font-display uppercase flex items-center justify-center gap-2.5">
              <span>TRY SPECIFICATION</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400 font-mono tracking-tight font-medium lowercase italic">&quot;fintech companies in SF that raised funding&quot;</span>
              <span className="text-zinc-700">·</span>
              <span>OR SPECIFIC DOMAIN</span>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-400 font-mono tracking-tight font-medium lowercase italic">&quot;stripe.com&quot;</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Inline fallback for MinusCircle to avoid missing exports
function MinusCircleIcon({ size = 16, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
