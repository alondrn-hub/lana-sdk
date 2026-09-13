/**
 * Lana SDK - Runtime Engine
 */
export class RuntimeManager {
  private mode: string;
  private status: string;

  constructor(mode = 'local') {
    this.mode = mode;
    this.status = 'running';
  }

  getMode() {
    return this.mode;
  }

  getStatus() {
    return this.status;
  }
}
