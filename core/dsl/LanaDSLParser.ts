/**
 * Lana SDK - Domain-Specific Language (DSL) Parser
 */
export class LanaDSLParser {
  parse(dslString: string) {
    const lines = dslString.split("\n").map(l => l.trim()).filter(Boolean);
    const parsedSteps = lines.map(line => {
      if (line.startsWith("on ")) {
        return { type: "TRIGGER", event: line.replace("on ", "").replace(":", "") };
      } else if (line.includes(".")) {
        return { type: "ACTION", target: line };
      }
      return { type: "UNKNOWN", raw: line };
    });
    return { valid: true, steps: parsedSteps };
  }
}
