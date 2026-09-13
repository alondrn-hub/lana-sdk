import React, { useState } from 'react';
import { Workflow, Plus, Radio, Send, RefreshCw, Clock, Filter, Layers } from 'lucide-react';
import { SDKEvent } from '../types';

interface EventsViewProps {
  events: SDKEvent[];
  onRefresh: () => void;
}

export function EventsView({ events, onRefresh }: EventsViewProps) {
  const [eventType, setEventType] = useState('user.action');
  const [eventSource, setEventSource] = useState('studio-dashboard');
  const [eventPayload, setEventPayload] = useState('{\n  "action": "trigger_workflow",\n  "target": "all"\n}');
  const [submitting, setSubmitting] = useState(false);

  const handleDispatchEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(eventPayload);
      } catch {
        parsedPayload = { raw: eventPayload };
      }

      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: eventType,
          source: eventSource,
          payload: parsedPayload
        })
      });
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono mb-2">
            <Workflow className="w-3.5 h-3.5" /> Core Engine / Multi-Event Bus
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Multi-Event Engine</h1>
          <p className="text-sm text-slate-400 mt-1">
            Central event dispatcher supporting real-time event streaming, triggers, listeners, pipelines, and cron schedulers.
          </p>
        </div>
        <button 
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Stream
        </button>
      </div>

      {/* Grid: Dispatcher Form & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dispatcher Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-violet-400" /> Dispatch Event
            </h2>
            <span className="text-xs font-mono text-slate-500">EventBus v1.0</span>
          </div>

          <form onSubmit={handleDispatchEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Event Type</label>
              <input 
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                placeholder="e.g., sensor.trigger or user.login"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm font-mono focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Source</label>
              <input 
                type="text"
                value={eventSource}
                onChange={(e) => setEventSource(e.target.value)}
                placeholder="e.g., iot-hub or api-gateway"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm font-mono focus:outline-none focus:border-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">Payload (JSON)</label>
              <textarea 
                rows={5}
                value={eventPayload}
                onChange={(e) => setEventPayload(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono text-xs focus:outline-none focus:border-violet-500 resize-none shadow-inner"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" /> Dispatch Event to Bus
            </button>
          </form>
        </div>

        {/* Live Event Stream Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Event Bus Stream ({events.length})
            </h2>
            <span className="text-xs text-slate-500 font-mono">Real-time Dispatcher</span>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div 
                key={evt.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-sm hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                    <span className="font-mono font-bold text-white text-sm">{evt.type}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {evt.source}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-900">
                  <pre>{JSON.stringify(evt.payload, null, 2)}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
