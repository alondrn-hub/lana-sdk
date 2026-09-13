import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Sparkles, CornerDownLeft } from 'lucide-react';

interface CliTerminalViewProps {
  onRefresh: () => void;
}

export function CliTerminalView({ onRefresh }: CliTerminalViewProps) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ cmd: string; output: string; time: string }>>([
    {
      cmd: 'lana --help',
      output: 'Lana SDK CLI v1.0.0-enterprise\nAvailable commands:\n  lana create project <name>  - Initialize a new project\n  lana add agent <name>       - Scaffold a new AI agent\n  lana add plugin <name>      - Scaffold a new plugin\n  lana run                    - Start local SDK runtime\n  lana build                  - Bundle project for production\n  lana deploy                 - Deploy to cloud runtime',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleRunCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const currentCmd = command.trim();
    setCommand('');
    setLoading(true);

    try {
      const res = await fetch('/api/cli/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: currentCmd })
      });
      const data = await res.json();
      
      setHistory(prev => [...prev, {
        cmd: currentCmd,
        output: data.output,
        time: new Date().toLocaleTimeString()
      }]);
      onRefresh();
    } catch (err) {
      setHistory(prev => [...prev, {
        cmd: currentCmd,
        output: 'Error executing CLI command.',
        time: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sampleCommands = [
    'lana create project my-ai-agent-app',
    'lana add agent RiskAnalyzerAgent',
    'lana add plugin SlackNotifierPlugin',
    'lana run',
    'lana build',
    'lana deploy'
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-2">
            <Terminal className="w-3.5 h-3.5" /> Developer Tools / CLI
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interactive Developer CLI</h1>
          <p className="text-sm text-slate-400 mt-1">
            Execute enterprise Lana CLI commands to scaffold projects, register agents, load plugins, and deploy.
          </p>
        </div>
        <button 
          onClick={() => setHistory([])}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" /> Clear Terminal
        </button>
      </div>

      {/* Quick Sample Commands */}
      <div className="flex flex-wrap gap-2 shrink-0">
        <span className="text-xs text-slate-400 self-center font-mono mr-1">Quick Run:</span>
        {sampleCommands.map((sc, idx) => (
          <button
            key={idx}
            onClick={() => setCommand(sc)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-indigo-300 transition-all cursor-pointer"
          >
            {sc}
          </button>
        ))}
      </div>

      {/* Terminal Window */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 font-mono text-xs text-slate-400">lana-cli — bash — 80x24</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Terminal Output Log */}
        <div className="flex-1 p-6 font-mono text-xs overflow-y-auto space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1.5 animate-fadeIn">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-emerald-400 font-bold">lana@sdk-env:~$</span>
                <span className="text-white font-semibold">{item.cmd}</span>
                <span className="text-[10px] text-slate-600 ml-auto">{item.time}</span>
              </div>
              <div className="text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-900 whitespace-pre-wrap leading-relaxed">
                {item.output}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Bar */}
        <form onSubmit={handleRunCommand} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3 shrink-0">
          <span className="text-emerald-400 font-mono font-bold pl-2">$</span>
          <input 
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Type a lana command (e.g., lana run, lana add agent MyAgent)..."
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
