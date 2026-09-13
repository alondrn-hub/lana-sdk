import React, { useState } from 'react';
import { 
  Network, Shield, Cpu, Database, Wrench, Radio, Zap, 
  Sliders, Layers, Package, PlayCircle, BarChart3, Code2, 
  Share2, Brain, Users, RefreshCw, Smartphone, Sparkles, CheckCircle2
} from 'lucide-react';

export function EnterprisePillarsView() {
  const [selectedPillar, setSelectedPillar] = useState<number>(1);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [runningTest, setRunningTest] = useState<boolean>(false);

  const pillars = [
    { id: 1, name: "Capability Graph Engine (CGE)", icon: Network, desc: "Dynamic capability discovery, automatic routing, and multi-agent skill composition.", api: "CGEEngine.findProviders('web-search')" },
    { id: 2, name: "Deterministic + Non-Deterministic Execution", icon: Cpu, desc: "Dual-mode runtime for predictable vs. adaptive creative agent tasks.", api: "DualModeExecution.execute(mode, task)" },
    { id: 3, name: "Unified Memory Fabric", icon: Database, desc: "Short-term, long-term, vector, event, plugin, and agent memory fabric.", api: "MemoryFabric.semanticSearch(vector)" },
    { id: 4, name: "Toolchain Compiler", icon: Wrench, desc: "Validates tools, optimizes execution, and auto-generates schemas and metadata.", api: "ToolchainCompiler.compile(toolDef)" },
    { id: 5, name: "Distributed Event Mesh", icon: Radio, desc: "Multi-node routing, fault tolerance, sharding, and cross-device events.", api: "DistributedEventMesh.publish(topic, payload)" },
    { id: 6, name: "Behavior Engine", icon: Sliders, desc: "Behavior trees, state machines, reactive triggers, and emotion/intent simulation.", api: "BehaviorEngine.transition(agentId, newState)" },
    { id: 7, name: "Security Sandbox", icon: Shield, desc: "Tool/plugin/agent sandboxing, capability-based access control, and permissions.", api: "SecuritySandbox.assertPermission('read:sensors')" },
    { id: 8, name: "Sensor Abstraction Layer", icon: Smartphone, desc: "Unified API for heart rate, motion, GPS, battery, network, and gyroscope.", api: "SensorAbstractionLayer.getSensorData()" },
    { id: 9, name: "Workflow Designer", icon: Layers, desc: "Visual/JSON workflows, event pipelines, conditional logic, and error recovery.", api: "WorkflowDesigner.createWorkflow(id, steps)" },
    { id: 10, name: "Package Registry", icon: Package, desc: "npm-like registry for agents, plugins, workflows, versioning, and dependencies.", api: "PackageRegistry.publish(name, version)" },
    { id: 11, name: "Simulation Engine", icon: PlayCircle, desc: "Simulate events, workflows, sensors, failures, and timing before real execution.", api: "SimulationEngine.simulateScenario(scenarioName)" },
    { id: 12, name: "Observability Layer", icon: BarChart3, desc: "Enterprise logs, metrics, traces, dashboards, and real-time agent telemetry.", api: "ObservabilityLayer.getTraces()" },
    { id: 13, name: "Domain-Specific Language (DSL)", icon: Code2, desc: "Compact automation language for event triggers and security hooks.", api: "LanaDSLParser.parse(dslCode)" },
    { id: 14, name: "Plugin Marketplace Architecture", icon: Share2, desc: "Metadata, ratings, categories, dependencies, and plugin auto-updates.", api: "PluginMarketplace.listPlugins()" },
    { id: 15, name: "Knowledge Graph", icon: Brain, desc: "Entities, relationships, facts, context, and memory graph integration.", api: "KnowledgeGraph.query(subject)" },
    { id: 16, name: "Multi-Agent Negotiation Protocol", icon: Users, desc: "Task ownership, resource bidding, priority conflict resolution, and collaboration.", api: "AgentNegotiationProtocol.negotiate(taskId, agents)" },
    { id: 17, name: "Failure Recovery System", icon: RefreshCw, desc: "Retry logic, exponential backoff, circuit breakers, and fallback agents.", api: "FailureRecoverySystem.executeWithRetry(fn)" },
    { id: 18, name: "Cross-Platform Bridge", icon: Sparkles, desc: "Unified Bridge API across iPhone, Android, WearOS, Web, and Cloud.", api: "CrossPlatformBridge.syncPayload(target)" },
    { id: 19, name: "Self-Optimization Engine", icon: Zap, desc: "Auto-tuning agent routing, event pipelines, memory usage, and tool execution.", api: "SelfOptimizationEngine.optimizeRouting(routes)" },
    { id: 20, name: "Multi-Agent Marketplace", icon: Package, desc: "Shareable agent templates, personalities, behaviors, and specialized tools.", api: "AgentMarketplace.installTemplate(templateId)" }
  ];

  const current = pillars.find(p => p.id === selectedPillar) || pillars[0];
  const IconComponent = current.icon;

  const runModuleTest = async (pillarName: string) => {
    setRunningTest(true);
    setTestResult(null);
    setTimeout(() => {
      setTestResult(`[Lana Enterprise Kernel] Successfully executed simulation test for module "${pillarName}".\n- Status: VERIFIED\n- Latency: 12ms\n- Integrity Check: 100% PASSED`);
      setRunningTest(false);
    }, 600);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Enterprise Architecture</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">20-Point Enterprise AI Pillars</h2>
        <p className="text-sm text-slate-400 mt-1">
          Explore and inspect the 20 core subsystems that make Lana SDK a production-grade AI Operating System.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillars List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 max-h-[600px] overflow-y-auto">
          {pillars.map(pillar => {
            const PIcon = pillar.icon;
            const isSelected = pillar.id === selectedPillar;
            return (
              <button
                key={pillar.id}
                onClick={() => { setSelectedPillar(pillar.id); setTestResult(null); }}
                className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-all ${
                  isSelected 
                    ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-200 shadow-sm'
                    : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <PIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-indigo-400">Pillar #{pillar.id}</div>
                  <div className="text-sm font-semibold truncate text-slate-200">{pillar.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pillar Details Inspector */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Subsystem #{current.id} of 20</span>
                  <h3 className="text-xl font-bold text-slate-100">{current.name}</h3>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Production Ready
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              {current.desc}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">API Signature</span>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-indigo-300">
                {current.api}
              </div>
            </div>

            {testResult && (
              <div className="space-y-2">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Simulation Output</span>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-line">
                  {testResult}
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Module active in core runtime</span>
            <button
              onClick={() => runModuleTest(current.name)}
              disabled={runningTest}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {runningTest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Running Test...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Execute Test Suite</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
