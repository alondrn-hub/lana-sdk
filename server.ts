import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client safely
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({ apiKey });
  }

  // In-memory Lana SDK State for Studio workspace
  let sdkState = {
    version: "1.0.0-enterprise",
    runtimeMode: "local",
    status: "running",
    uptime: Date.now(),
    resources: {
      cpuUsage: 14.2,
      memoryUsageMB: 182.4,
      activeEventsCount: 4,
      activeAgentsCount: 3,
    },
    agents: [
      {
        id: "agent-researcher-01",
        name: "ResearchAgent",
        capabilities: ["web-search", "document-summarization", "fact-checking"],
        tools: ["fetch", "summarize", "vector-search"],
        memory: { type: "vector+short", itemsCount: 42 },
        goals: "Gather comprehensive research data on requested topics and synthesize concise briefs.",
        status: "idle",
        mode: "deterministic"
      },
      {
        id: "agent-coder-02",
        name: "CodeArchitectAgent",
        capabilities: ["typescript-generation", "code-review", "refactoring"],
        tools: ["file-writer", "linter", "compiler"],
        memory: { type: "long-term", itemsCount: 128 },
        goals: "Produce enterprise-grade, clean, bug-free TypeScript and Python implementations.",
        status: "idle",
        mode: "non-deterministic"
      },
      {
        id: "agent-coordinator-03",
        name: "WorkflowRouter",
        capabilities: ["routing", "event-dispatch", "orchestration"],
        tools: ["event-bus", "queue-manager"],
        memory: { type: "short-term", itemsCount: 15 },
        goals: "Analyze inbound tasks and delegate sub-tasks to specialized agents.",
        status: "active",
        mode: "deterministic"
      }
    ],
    events: [
      { id: "evt-001", type: "system.boot", source: "runtime", payload: { mode: "local" }, timestamp: new Date().toISOString() },
      { id: "evt-002", type: "sensor.trigger", source: "iot-hub", payload: { temp: 22.5, status: "normal" }, timestamp: new Date().toISOString() },
      { id: "evt-003", type: "user.request", source: "api-gateway", payload: { action: "agent.run" }, timestamp: new Date().toISOString() }
    ],
    plugins: [
      { id: "plugin-vector-db", name: "VectorMemoryPlugin", version: "1.2.0", type: "memory", loaded: true, description: "Provides local FAISS/Chroma vector embeddings for agent long-term recall." },
      { id: "plugin-discord-notifier", name: "DiscordNotifierPlugin", version: "1.0.4", type: "sensor", loaded: true, description: "Broadcasts agent execution milestones to Discord webhooks." },
      { id: "plugin-python-sandbox", name: "PythonExecutionSandbox", version: "2.1.0", type: "tool", loaded: false, description: "Secure Docker-isolated Python runtime sandbox for executing generated scripts." }
    ],
    tasks: [
      { id: "task-101", title: "Analyze quarterly market reports", priority: "high", status: "completed", assignedAgent: "ResearchAgent", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "task-102", title: "Generate SDK REST client bindings", priority: "normal", status: "queued", assignedAgent: "CodeArchitectAgent", createdAt: new Date().toISOString() }
    ],
    logs: [
      { timestamp: new Date().toLocaleTimeString(), level: "INFO", message: "Lana SDK Runtime initialized successfully in local mode." },
      { timestamp: new Date().toLocaleTimeString(), level: "INFO", message: "Loaded 2 plugins: VectorMemoryPlugin, DiscordNotifierPlugin." },
      { timestamp: new Date().toLocaleTimeString(), level: "DEBUG", message: "Event Bus listening on ports 3000 (HTTP) and 3001 (WS Stream)." }
    ]
  };

  // API Routes
  app.get("/api/status", (req, res) => {
    res.json({
      ...sdkState,
      uptimeSeconds: Math.floor((Date.now() - sdkState.uptime) / 1000)
    });
  });

  // Agents API
  app.get("/api/agents", (req, res) => {
    res.json(sdkState.agents);
  });

  app.post("/api/agents", (req, res) => {
    const { name, capabilities, tools, goals, mode } = req.body;
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: name || "CustomAgent",
      capabilities: capabilities || ["general-inference"],
      tools: tools || ["default-tool"],
      memory: { type: "short-term", itemsCount: 0 },
      goals: goals || "Perform requested tasks efficiently.",
      status: "idle",
      mode: mode || "deterministic"
    };
    sdkState.agents.push(newAgent);
    sdkState.logs.push({ timestamp: new Date().toLocaleTimeString(), level: "INFO", message: `Agent registered: ${newAgent.name} (${newAgent.id})` });
    res.json(newAgent);
  });

  // Run Agent with Gemini API
  app.post("/api/agents/:id/run", async (req, res) => {
    const agentId = req.params.id;
    const { prompt } = req.body;
    const agent = sdkState.agents.find(a => a.id === agentId);
    
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }

    try {
      const ai = getGenAI();
      const systemInstruction = `You are ${agent.name}, an AI agent in Lana SDK. 
Capabilities: ${agent.capabilities.join(", ")}.
Tools available: ${agent.tools.join(", ")}.
Goals: ${agent.goals}.
Mode: ${agent.mode}.
Respond concisely, professionally, and execute the requested task with expert precision.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: agent.mode === "deterministic" ? 0.2 : 0.7,
        }
      });

      const resultText = response.text || "Task completed successfully.";
      
      sdkState.logs.push({
        timestamp: new Date().toLocaleTimeString(),
        level: "INFO",
        message: `Agent ${agent.name} executed task: "${prompt.slice(0, 40)}..."`
      });

      res.json({ success: true, agentId, agentName: agent.name, response: resultText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const fallbackResponse = `[Lana Sandbox Simulator] Agent ${agent.name} processed prompt: "${prompt}". (Gemini API note: ${error.message || "Key not configured"})`;
      res.json({ success: true, agentId, agentName: agent.name, response: fallbackResponse });
    }
  });

  // Events API
  app.get("/api/events", (req, res) => {
    res.json(sdkState.events);
  });

  app.post("/api/events", (req, res) => {
    const { type, source, payload } = req.body;
    const newEvent = {
      id: `evt-${Date.now()}`,
      type: type || "custom.event",
      source: source || "user",
      payload: payload || {},
      timestamp: new Date().toISOString()
    };
    sdkState.events.unshift(newEvent);
    if (sdkState.events.length > 50) sdkState.events.pop();
    
    sdkState.logs.push({ timestamp: new Date().toLocaleTimeString(), level: "DEBUG", message: `Event dispatched: ${newEvent.type} from ${newEvent.source}` });
    res.json(newEvent);
  });

  // Plugins API
  app.get("/api/plugins", (req, res) => {
    res.json(sdkState.plugins);
  });

  app.post("/api/plugins/:id/toggle", (req, res) => {
    const pluginId = req.params.id;
    const plugin = sdkState.plugins.find(p => p.id === pluginId);
    if (!plugin) return res.status(404).json({ error: "Plugin not found" });
    
    plugin.loaded = !plugin.loaded;
    sdkState.logs.push({ timestamp: new Date().toLocaleTimeString(), level: "INFO", message: `Plugin ${plugin.name} is now ${plugin.loaded ? "LOADED" : "UNLOADED"}` });
    res.json(plugin);
  });

  // Runtime & Tasks API
  app.get("/api/runtime", (req, res) => {
    res.json({
      tasks: sdkState.tasks,
      resources: sdkState.resources,
      logs: sdkState.logs,
      runtimeMode: sdkState.runtimeMode
    });
  });

  app.post("/api/tasks", (req, res) => {
    const { title, priority, assignedAgent } = req.body;
    const newTask = {
      id: `task-${Date.now()}`,
      title: title || "New SDK Task",
      priority: priority || "normal",
      status: "queued",
      assignedAgent: assignedAgent || "WorkflowRouter",
      createdAt: new Date().toISOString()
    };
    sdkState.tasks.unshift(newTask);
    sdkState.logs.push({ timestamp: new Date().toLocaleTimeString(), level: "INFO", message: `Task queued: ${newTask.title} [Priority: ${newTask.priority}]` });
    res.json(newTask);
  });

  // Developer CLI Execution Simulator
  app.post("/api/cli/execute", (req, res) => {
    const { command } = req.body;
    const cmd = (command || "").trim();
    let output = "";

    if (cmd.startsWith("lana create project")) {
      const projName = cmd.split(" ")[3] || "my-lana-app";
      output = `✨ Initializing Lana SDK Enterprise Project: ${projName}\n📂 Created /core, /plugins, /api, /cli, /utils, /docs, /installer, /examples\n📦 Installed core dependencies\n🚀 Project '${projName}' is ready! Run 'lana run' to start.`;
    } else if (cmd.startsWith("lana add agent")) {
      const agentName = cmd.split(" ")[3] || "CustomAgent";
      sdkState.agents.push({
        id: `agent-${Date.now()}`,
        name: agentName,
        capabilities: ["custom-tool-execution"],
        tools: ["default"],
        memory: { type: "short-term", itemsCount: 0 },
        goals: "Generated via CLI command.",
        status: "idle",
        mode: "deterministic"
      });
      output = `🤖 Successfully generated and registered agent '${agentName}' in /core/agent-engine/.`;
    } else if (cmd.startsWith("lana add plugin")) {
      const plugName = cmd.split(" ")[3] || "CustomPlugin";
      sdkState.plugins.push({
        id: `plugin-${Date.now()}`,
        name: plugName,
        version: "1.0.0",
        type: "tool",
        loaded: true,
        description: "Added via developer CLI."
      });
      output = `🔌 Successfully loaded and registered plugin '${plugName}' in /plugins/.`;
    } else if (cmd.startsWith("lana run")) {
      output = `🚀 Starting Lana SDK Runtime (Local Mode)...\n⚡ Event Bus active on ws://localhost:3001\n🟢 Multi-Agent Engine ready. 3 active agents online.\n💡 Server listening on http://localhost:3000`;
    } else if (cmd.startsWith("lana build")) {
      output = `📦 Bundling Lana SDK workspace with esbuild...\n✓ Compiled core engines\n✓ Minified plugin bundles\n✓ Generated production distribution in /dist`;
    } else if (cmd.startsWith("lana deploy")) {
      output = `☁️ Packaging container for Google Cloud Run / Enterprise Cluster...\n✓ Uploading SDK assets\n✓ Provisioning secure sandbox\n🚀 Deployment successful! URL: https://lana-sdk-enterprise.a.run.app`;
    } else if (cmd === "lana --help" || cmd === "help") {
      output = `Lana SDK CLI v1.0.0-enterprise\nAvailable commands:\n  lana create project <name>  - Initialize a new project\n  lana add agent <name>       - Scaffold a new AI agent\n  lana add plugin <name>      - Scaffold a new plugin\n  lana run                    - Start the local SDK runtime\n  lana build                  - Bundle project for production\n  lana deploy                 - Deploy to cloud runtime`;
    } else {
      output = `Command not recognized: '${cmd}'. Type 'lana --help' for available commands.`;
    }

    sdkState.logs.push({ timestamp: new Date().toLocaleTimeString(), level: "INFO", message: `CLI executed: ${cmd}` });
    res.json({ command: cmd, output });
  });

  // Documentation Endpoint
  app.get("/api/docs", (req, res) => {
    res.json({
      title: "Lana SDK Documentation",
      sections: [
        { id: "getting-started", title: "1. Getting Started", content: "Lana SDK is a cross-platform AI engineering kit designed for enterprise strength and simple developer ergonomics. Install via CLI or download the installer." },
        { id: "agent-engine", title: "2. Multi-Agent Engine", content: "Configure agents with specific goals, capabilities, and tool interfaces. Supports event-driven activation and short/long-term vector memory." },
        { id: "event-engine", title: "3. Multi-Event Engine", content: "Central event bus with triggers, listeners, pipelines, and cron schedulers for real-time and background workflows." },
        { id: "plugin-loader", title: "4. Plugin System", content: "Dynamically load/unload agent, event, tool, and sensor plugins from the plugin registry." },
        { id: "runtime-engine", title: "5. Runtime & Sandbox", content: "Task queue with FIFO and priority execution, state manager, resource monitor, and secure tool execution sandbox." },
        { id: "api-reference", title: "6. REST & WebSocket API", content: "Access all engines programmatically via standard REST endpoints and real-time WebSocket event streams." }
      ]
    });
  });

  // Beginner Templates
  app.get("/api/templates", (req, res) => {
    res.json([
      { id: "tpl-chatbot", name: "Enterprise Customer Support Chatbot", category: "Agent Workflow", description: "Multi-agent setup with vector memory recall and escalation router." },
      { id: "tpl-sensor", name: "IoT Sensor Automated Incident Responder", category: "Event-Driven", description: "Listens to IoT temperature/pressure events and triggers automated diagnostic agents." },
      { id: "tpl-workflow", name: "Automated Code Review Pipeline", category: "CI/CD AI", description: "Webhook listener that triggers code linter and CodeArchitectAgent on git commit." },
      { id: "tpl-plugin", name: "Custom Web Search Tool Plugin", category: "Plugin Extension", description: "Boilerplate plugin for adding custom external APIs into agent tool interfaces." }
    ]);
  });

  // Vite middleware setup for development or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lana SDK Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
