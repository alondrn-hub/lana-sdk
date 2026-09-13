/**
 * Lana SDK - Observability Layer (Metrics, Traces, Logs)
 */
export class ObservabilityLayer {
  private metrics: Map<string, number> = new Map();
  private traces: Array<{ traceId: string; span: string; durationMs: number; timestamp: string }> = [];

  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
  }

  addTrace(span: string, durationMs: number) {
    this.traces.push({
      traceId: Math.random().toString(36).substring(7),
      span,
      durationMs,
      timestamp: new Date().toISOString()
    });
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  getTraces() {
    return this.traces.slice(-20);
  }
}
