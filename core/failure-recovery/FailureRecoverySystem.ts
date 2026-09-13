/**
 * Lana SDK - Failure Recovery System (Circuit Breakers & Retries)
 */
export class FailureRecoverySystem {
  async executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        return await fn();
      } catch (err) {
        attempts++;
        if (attempts >= maxRetries) throw err;
        await new Promise(r => setTimeout(r, 100 * attempts));
      }
    }
    throw new Error("Max retries exceeded.");
  }
}
