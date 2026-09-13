/**
 * Lana SDK - Event Engine
 */
export interface SDKEvent {
  id: string;
  type: string;
  source: string;
  payload: Record<string, any>;
  timestamp: string;
}

export class EventBus {
  private listeners: Array<(event: SDKEvent) => void> = [];

  subscribe(listener: (event: SDKEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  dispatch(event: SDKEvent) {
    this.listeners.forEach(listener => listener(event));
  }
}
