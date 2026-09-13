import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Sparkles, Layers, Code, ArrowRight } from 'lucide-react';
import { Template } from '../types';

export function DocsView() {
  const [docs, setDocs] = useState<any>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeSection, setActiveSection] = useState('getting-started');

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setDocs(data))
      .catch(err => console.error(err));

    fetch('/api/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono mb-2">
          <BookOpen className="w-3.5 h-3.5" /> Documentation & Beginner Templates
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Lana SDK Knowledge Base</h1>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive developer guides, API references, and 1-click beginner starter templates.
        </p>
      </div>

      {/* Beginner Templates Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Beginner Starter Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {templates.map((tpl) => (
            <div 
              key={tpl.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {tpl.category}
                </span>
                <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{tpl.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tpl.description}</p>
              </div>
              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">{tpl.id}</span>
                <span className="text-xs text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  Use Template <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Documentation Index</h2>
          {docs?.sections?.map((sec: any) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                activeSection === sec.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <span>{sec.title}</span>
              <FileText className="w-4 h-4 opacity-70" />
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          {docs?.sections?.filter((s: any) => s.id === activeSection).map((sec: any) => (
            <div key={sec.id} className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Lana SDK Manual</span>
                <h2 className="text-2xl font-bold text-white mt-1">{sec.title}</h2>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                <p>{sec.content}</p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300">
                  {`// Lana SDK Code Example\nimport { LanaEngine } from '@lana/sdk';\n\nconst engine = new LanaEngine({\n  mode: 'enterprise',\n  enableTelemetry: true\n});\n\nawait engine.initialize();`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
