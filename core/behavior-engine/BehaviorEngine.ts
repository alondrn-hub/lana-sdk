/**
 * Lana SDK - Behavior Engine (Behavior Trees & State Machines)
 */
export class BehaviorEngine {
  private states: Map<string, string> = new Map();

  transition(agentId: string, newState: string) {
    const oldState = this.states.get(agentId) || 'IDLE';
    this.states.set(agentId, newState);
    return { agentId, oldState, newState };
  }

  getState(agentId: string) {
    return this.states.get(agentId) || 'IDLE';
  }
}
