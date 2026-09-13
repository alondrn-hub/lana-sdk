export interface Agent {
  id: string;
  name: string;
  capabilities: string[];
  tools: string[];
  memory: {
    type: string;
    itemsCount: number;
  };
  goals: string;
  status: string;
  mode: string;
}

export interface SDKEvent {
  id: string;
  type: string;
  source: string;
  payload: Record<string, any>;
  timestamp: string;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  type: string;
  loaded: boolean;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  priority: string;
  status: string;
  assignedAgent: string;
  createdAt: string;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export interface SDKStatus {
  version: string;
  runtimeMode: string;
  status: string;
  uptimeSeconds: number;
  resources: {
    cpuUsage: number;
    memoryUsageMB: number;
    activeEventsCount: number;
    activeAgentsCount: number;
  };
  agents: Agent[];
  events: SDKEvent[];
  plugins: Plugin[];
  tasks: Task[];
  logs: LogEntry[];
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
}
