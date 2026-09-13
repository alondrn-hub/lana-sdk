import React from 'react';
import { 
  Bot, 
  Workflow, 
  Boxes, 
  Cpu, 
  Terminal, 
  Server, 
  Zap, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  Code,
  FileText
} from 'lucide-react';

interface DashboardViewProps {
  status: any;
  setCurrentTab: (tab: string) => void;
}

export function DashboardView({ status, setCurrentTab }: DashboardViewProps) {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-4">
              <Zap className="w-3.5 h-3.5" /> Enterprise AI Engineering Kit
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Lana SDK Studio
            </h1>
            <p className="mt-2 text-slate-300 max-w-2xl text-sm sm:text-base leading-relaxed">
              Cross-platform AI kit containing a multi-agent engine, event bus, plugin loader, runtime sandbox, and developer CLI — built for enterprise strength and simple developer ergonomics.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setCurrentTab('agents')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4" /> Open Agent Engine
            </button>
            <button 
              onClick={() => setCurrentTab('cli')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Terminal className="w-4 h-4" /> Open CLI Studio
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Agents</p>
            <h3 className="text-2xl font-bold text-white mt-1">{status?.agents?.length || 3}</h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">● All systems operational</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Bot className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Event Bus Stream</p>
            <h3 className="text-2xl font-bold text-white mt-1">{status?.events?.length || 3} events</h3>
            <p className="text-xs text-indigo-400 mt-1 font-mono">Real-time dispatcher active</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Workflow className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Loaded Plugins</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {status?.plugins?.filter((p: any) => p.loaded).length || 2} / {status?.plugins?.length || 3}
            </h3>
            <p className="text-xs text-emerald-400 mt-1 font-mono">Dynamic registry synced</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Task Queue</p>
            <h3 className="text-2xl font-bold text-white mt-1">{status?.tasks?.length || 2} tasks</h3>
            <p className="text-xs text-amber-400 mt-1 font-mono">FIFO / Priority mode</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Architecture Blueprint Tree */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">SDK Core Architecture Blueprint</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore the structured directories and engines powering Lana SDK.</p>
          </div>
          <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-700">
            lana-sdk/
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Core Engine */}
          <div 
            onClick={() => setCurrentTab('agents')}
            className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold">/core</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-white text-sm">Multi-Agent & Event Engines</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Agent models, router, short/long-term memory, event bus, triggers, pipelines, cron scheduler, state manager, and task queue.
            </p>
          </div>

          {/* Plugins */}
          <div 
            onClick={() => setCurrentTab('plugins')}
            className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-violet-500/10 text-violet-400 font-mono text-xs font-bold">/plugins</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-white text-sm">Dynamic Plugin System</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Plugin loader, registry with versioning, hook interfaces, tool plugins, sensor adapters, and workflow extensions.
            </p>
          </div>

          {/* CLI & API */}
          <div 
            onClick={() => setCurrentTab('cli')}
            className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">/cli & /api</span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-semibold text-white text-sm">Developer CLI & REST API</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Interactive CLI commands (`lana run`, `lana add agent`), REST endpoints (`/api/agents`, `/api/events`), and WebSocket streaming.
            </p>
          </div>
        </div>
      </div>

      {/* Recent System Activity Logs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" /> Runtime & System Logs
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live Stream</span>
        </div>
        <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs space-y-2 border border-slate-800 max-h-56 overflow-y-auto">
          {status?.logs?.map((log: any, idx: number) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                log.level === 'INFO' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-amber-500/10 text-amber-300'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-300">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
