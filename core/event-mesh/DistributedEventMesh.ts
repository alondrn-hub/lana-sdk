/**
 * Lana SDK - Distributed Event Mesh
 */
export class DistributedEventMesh {
  private nodes: Set<string> = new Set(['node-cloud-primary', 'node-edge-gateway']);
  private topicSubscribers: Map<string, Array<(payload: any) => void>> = new Map();

  publish(topic: string, payload: any) {
    const subs = this.topicSubscribers.get(topic) || [];
    subs.forEach(sub => sub(payload));
  }

  subscribe(topic: string, callback: (payload: any) => void) {
    const subs = this.topicSubscribers.get(topic) || [];
    subs.push(callback);
    this.topicSubscribers.set(topic, subs);
  }

  getNodes() {
    return Array.from(this.nodes);
  }
}
