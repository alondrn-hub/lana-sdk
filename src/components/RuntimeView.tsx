import React, { useState } from 'react';
import { Cpu, Plus, CheckCircle2, Clock, Server, Activity, RefreshCw, Layers } from 'lucide-react';
import { Task } from '../types';

interface RuntimeViewProps {
  tasks: Task[];
  resources: any;
  onRefresh: () => void;
}

export function RuntimeView({ tasks, resources, onRefresh }: RuntimeViewProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('normal');
  const [assignedAgent, setAssignedAgent] = useState('ResearchAgent');
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setSubmitting(true);
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          priority: taskPriority,
          assignedAgent
        })
      });
      setTaskTitle('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" /> Core Engine / Runtime & Sandbox
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Runtime Engine & Task Queue</h1>
          <p className="text-sm text-slate-400 mt-1">
            FIFO, priority, and delayed task queues, execution sandbox monitors, and resource allocation.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Runtime
        </button>
      </div>

      {/* Resource Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">CPU Usage</span>
            <h3 className="text-xl font-bold text-white mt-1">{resources?.cpuUsage || 14}%</h3>
          </div>
          <Cpu className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">Memory Allocation</span>
            <h3 className="text-xl font-bold text-white mt-1">{resources?.memoryUsageMB || 182} MB</h3>
          </div>
          <Server className="w-8 h-8 text-violet-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">Active Events</span>
            <h3 className="text-xl font-bold text-white mt-1">{resources?.activeEventsCount || 4}</h3>
          </div>
          <Activity className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium">Active Agents</span>
            <h3 className="text-xl font-bold text-white mt-1">{resources?.activeAgentsCount || 3}</h3>
          </div>
          <Layers className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      {/* Grid: Enqueue Task Form & Task Queue List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enqueue Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" /> Enqueue Task
            </h2>
            <span className="text-xs font-mono text-slate-500">FIFO / Priority</span>
          </div>

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Task Title / Instructions</label>
              <input 
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g., Run security vulnerability audit"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Priority Level</label>
              <select 
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority (Immediate)</option>
                <option value="delayed">Delayed Schedule</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Assigned Agent</label>
              <select 
                value={assignedAgent}
                onChange={(e) => setAssignedAgent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="ResearchAgent">ResearchAgent</option>
                <option value="CodeArchitectAgent">CodeArchitectAgent</option>
                <option value="WorkflowRouter">WorkflowRouter</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Task to Queue
            </button>
          </form>
        </div>

        {/* Task Queue List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Active Task Queue ({tasks.length})</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                      task.priority === 'high' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-indigo-400 font-mono">Assigned: {task.assignedAgent}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{task.title}</h3>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${
                    task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {task.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
