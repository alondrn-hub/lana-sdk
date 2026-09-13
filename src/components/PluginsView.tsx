import React from 'react';
import { Boxes, Power, CheckCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { Plugin } from '../types';

interface PluginsViewProps {
  plugins: Plugin[];
  onRefresh: () => void;
}

export function PluginsView({ plugins, onRefresh }: PluginsViewProps) {
  const handleTogglePlugin = async (id: string) => {
    try {
      await fetch(`/api/plugins/${id}/toggle`, { method: 'POST' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
            <Boxes className="w-3.5 h-3.5" /> Core System / Plugin Registry
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Plugin System & Registry</h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamically load and unload agent, event, tool, and sensor plugins with full versioning and metadata inspection.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Registry
        </button>
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <div 
            key={plugin.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
              plugin.loaded 
                ? 'bg-slate-900 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                : 'bg-slate-900/40 border-slate-800 opacity-75'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    plugin.loaded ? 'bg-emerald-600 shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{plugin.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">v{plugin.version}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                  plugin.loaded ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                }`}>
                  {plugin.loaded ? 'Loaded' : 'Unloaded'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {plugin.description}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-800 uppercase">
                  Type: {plugin.type}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">{plugin.id}</span>
              <button
                onClick={() => handleTogglePlugin(plugin.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  plugin.loaded 
                    ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                {plugin.loaded ? 'Unload Plugin' : 'Load Plugin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
