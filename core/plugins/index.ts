/**
 * Lana SDK - Plugin System
 */
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  type: string;
  loaded: boolean;
  description: string;
}

export class PluginLoader {
  private plugins: Map<string, PluginManifest> = new Map();

  register(plugin: PluginManifest) {
    this.plugins.set(plugin.id, plugin);
  }

  toggle(id: string) {
    const plugin = this.plugins.get(id);
    if (plugin) {
      plugin.loaded = !plugin.loaded;
    }
    return plugin;
  }

  list() {
    return Array.from(this.plugins.values());
  }
}
