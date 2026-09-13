/**
 * Lana SDK - Capability Graph Engine (CGE)
 */
export class CapabilityGraphEngine {
  private capabilities: Map<string, { id: string; name: string; providers: string[] }> = new Map();

  registerCapability(id: string, name: string, provider: string) {
    const existing = this.capabilities.get(id) || { id, name, providers: [] };
    if (!existing.providers.includes(provider)) {
      existing.providers.push(provider);
    }
    this.capabilities.set(id, existing);
  }

  findProviders(capabilityId: string): string[] {
    return this.capabilities.get(capabilityId)?.providers || [];
  }

  getGraph() {
    return Array.from(this.capabilities.values());
  }
}
