/**
 * Lana SDK - Toolchain Compiler
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, string>;
  handler: (args: any) => Promise<any>;
}

export class ToolchainCompiler {
  private compiledTools: Map<string, ToolDefinition> = new Map();

  compile(tool: ToolDefinition): ToolDefinition {
    // Validate schema & optimize
    if (!tool.name || !tool.handler) {
      throw new Error("Invalid tool definition: missing name or handler.");
    }
    this.compiledTools.set(tool.name, tool);
    return tool;
  }

  getTool(name: string) {
    return this.compiledTools.get(name);
  }

  listTools() {
    return Array.from(this.compiledTools.keys());
  }
}
