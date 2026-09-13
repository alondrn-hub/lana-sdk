import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { AgentsView } from './components/AgentsView';
import { EventsView } from './components/EventsView';
import { PluginsView } from './components/PluginsView';
import { RuntimeView } from './components/RuntimeView';
import { CliTerminalView } from './components/CliTerminalView';
import { DocsView } from './components/DocsView';
import { EnterprisePillarsView } from './components/EnterprisePillarsView';
import { SDKStatus } from './types';
import { RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [status, setStatus] = useState<SDKStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch SDK status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Poll status every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && !status) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-spin text-white font-bold text-xl">
            L
          </div>
          <p className="text-sm font-mono text-slate-400">Booting Lana SDK Studio Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        status={status} 
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {currentTab === 'dashboard' && (
          <DashboardView status={status} setCurrentTab={setCurrentTab} />
        )}
        {currentTab === 'pillars' && (
          <EnterprisePillarsView />
        )}
        {currentTab === 'agents' && (
          <AgentsView agents={status?.agents || []} onRefresh={fetchStatus} />
        )}
        {currentTab === 'events' && (
          <EventsView events={status?.events || []} onRefresh={fetchStatus} />
        )}
        {currentTab === 'plugins' && (
          <PluginsView plugins={status?.plugins || []} onRefresh={fetchStatus} />
        )}
        {currentTab === 'runtime' && (
          <RuntimeView tasks={status?.tasks || []} resources={status?.resources} onRefresh={fetchStatus} />
        )}
        {currentTab === 'cli' && (
          <CliTerminalView onRefresh={fetchStatus} />
        )}
        {currentTab === 'docs' && (
          <DocsView />
        )}
      </main>
    </div>
  );
}
