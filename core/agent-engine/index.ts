/**
 * Lana SDK - Agent Engine
 */
export interface AgentDefinition {
  id: string;
  name: string;
  capabilities: string[];
  tools: string[];
  goals: string;
  mode: 'deterministic' | 'non-deterministic';
}

export class AgentEngine {
  private agents: Map<string, AgentDefinition> = new Map();

  registerAgent(agent: AgentDefinition) {
    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgent(id: string) {
    return this.agents.get(id);
  }

  listAgents() {
    return Array.from(this.agents.values());
  }
}
