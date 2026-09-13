import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Workflow, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Sliders, 
  Activity, 
  Boxes,
  Zap,
  Server,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  status: any;
}

export function Sidebar({ currentTab, setCurrentTab, status }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'SDK Dashboard', icon: LayoutDashboard },
    { id: 'pillars', label: '20-Point Pillars', icon: Sparkles, count: 20 },
    { id: 'agents', label: 'Multi-Agent Engine', icon: Bot, count: status?.agents?.length },
    { id: 'events', label: 'Multi-Event Bus', icon: Workflow, count: status?.events?.length },
    { id: 'plugins', label: 'Plugin Registry', icon: Boxes, count: status?.plugins?.filter((p: any) => p.loaded).length },
    { id: 'runtime', label: 'Runtime & Queue', icon: Cpu, count: status?.tasks?.length },
    { id: 'cli', label: 'Developer CLI', icon: Terminal },
    { id: 'docs', label: 'Docs & Templates', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none shrink-0 text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="font-bold text-slate-100 text-base tracking-tight">Lana SDK</h1>
            <p className="text-xs text-indigo-400 font-mono">v1.0.0-enterprise</p>
          </div>
        </div>
      </div>

      {/* Runtime Mode indicator */}
      <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Runtime
        </span>
        <span className="font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-wider text-[10px]">
          {status?.runtimeMode || 'local'}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-500 uppercase px-3 pb-2 tracking-wider">
          Workspace Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400 space-y-2">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1"><Server className="w-3.5 h-3.5 text-slate-500" /> CPU Usage</span>
          <span className="font-mono text-slate-200">{status?.resources?.cpuUsage || 14}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${status?.resources?.cpuUsage || 14}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center pt-1 text-[11px] text-slate-500">
          <span>Uptime: {Math.floor((status?.uptimeSeconds || 0) / 60)}m {(status?.uptimeSeconds || 0) % 60}s</span>
          <span className="text-emerald-400 font-mono">Healthy</span>
        </div>
      </div>
    </aside>
  );
}
