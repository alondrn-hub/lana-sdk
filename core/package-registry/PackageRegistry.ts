/**
 * Lana SDK - Package Registry (Agents, Plugins, Workflows)
 */
export class PackageRegistry {
  private registry: Map<string, { name: string; version: string; type: string; author: string }> = new Map();

  publish(name: string, version: string, type: string, author: string) {
    const key = `${name}@${version}`;
    this.registry.set(key, { name, version, type, author });
    return { success: true, key };
  }

  search(name: string) {
    return Array.from(this.registry.values()).filter(p => p.name.includes(name));
  }

  list() {
    return Array.from(this.registry.values());
  }
}
