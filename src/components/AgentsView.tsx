import React, { useState } from 'react';
import { Bot, Plus, Play, Cpu, Shield, Wrench, Database, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { Agent } from '../types';

interface AgentsViewProps {
  agents: Agent[];
  onRefresh: () => void;
}

export function AgentsView({ agents, onRefresh }: AgentsViewProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [promptInput, setPromptInput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  
  // New Agent Modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGoals, setNewGoals] = useState('');
  const [newCapabilities, setNewCapabilities] = useState('data-analysis, python-sandbox');
  const [newMode, setNewMode] = useState('deterministic');

  const selectedAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || !selectedAgent) return;

    setExecuting(true);
    setExecutionResult(null);

    try {
      const res = await fetch(`/api/agents/${selectedAgent.id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput })
      });
      const data = await res.json();
      setExecutionResult(data.response);
    } catch (err) {
      setExecutionResult('Error executing agent task.');
    } finally {
      setExecuting(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          goals: newGoals,
          capabilities: newCapabilities.split(',').map(s => s.trim()),
          tools: ['default-tool', 'fetch'],
          mode: newMode
        })
      });
      setShowNewModal(false);
      setNewName('');
      setNewGoals('');
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-2">
            <Bot className="w-3.5 h-3.5" /> Core Engine / Multi-Agent
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Agent Engine</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure agent models, tool interfaces, memory layers, and test live agent execution via Gemini AI.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button 
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Agent
          </button>
        </div>
      </div>

      {/* Main Grid: Agents List & Agent Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Agent Cards Column */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Registered Agents ({agents.length})</h2>
          <div className="space-y-3">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        isSelected ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : 'bg-slate-800'
                      }`}>
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{agent.name}</h3>
                        <p className="text-xs text-indigo-400 font-mono mt-0.5">{agent.id}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      agent.mode === 'deterministic' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                    }`}>
                      {agent.mode}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {agent.goals}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {agent.capabilities.map((cap, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Playground Column */}
        <div className="lg:col-span-7 space-y-6">
          {selectedAgent ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" /> Agent Execution Sandbox
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Testing agent: <span className="text-indigo-400 font-semibold">{selectedAgent.name}</span></p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Ready
                </span>
              </div>

              {/* Agent Specs Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Memory Layer</span>
                  <span className="text-slate-200 font-mono flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-indigo-400" /> {selectedAgent.memory.type} ({selectedAgent.memory.itemsCount} items)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Tool Interface</span>
                  <span className="text-slate-200 font-mono flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-violet-400" /> {selectedAgent.tools.join(', ')}
                  </span>
                </div>
              </div>

              {/* Prompt Execution Form */}
              <form onSubmit={handleRunAgent} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                    Prompt Task / Instructions for {selectedAgent.name}
                  </label>
                  <textarea 
                    rows={4}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={`e.g., "Analyze recent cloud telemetry logs and summarize anomaly risks."`}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono resize-none shadow-inner"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={executing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {executing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Executing via Gemini AI...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Run Agent Task
                    </>
                  )}
                </button>
              </form>

              {/* Execution Result Output */}
              {executionResult && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Agent Execution Response
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Gemini-2.5-Flash</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {executionResult}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              Select an agent to inspect its runtime configuration and test execution.
            </div>
          )}
        </div>
      </div>

      {/* New Agent Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" /> Register New Agent
              </h3>
              <button 
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Agent Name</label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., SecurityAuditorAgent"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Goals & Objective</label>
                <textarea 
                  rows={3}
                  value={newGoals}
                  onChange={(e) => setNewGoals(e.target.value)}
                  placeholder="Describe agent goals..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Capabilities (comma separated)</label>
                <input 
                  type="text"
                  value={newCapabilities}
                  onChange={(e) => setNewCapabilities(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Execution Mode</label>
                <select 
                  value={newMode}
                  onChange={(e) => setNewMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="deterministic">Deterministic (Low Temp)</option>
                  <option value="non-deterministic">Non-Deterministic (Creative)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
