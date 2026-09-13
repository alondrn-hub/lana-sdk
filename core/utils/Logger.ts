/**
 * Lana SDK - Logger Utility
 */
export class Logger {
  static info(message: string, meta?: any) {
    console.log(`[INFO] [${new Date().toLocaleTimeString()}] ${message}`, meta || '');
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] [${new Date().toLocaleTimeString()}] ${message}`, error || '');
  }

  static debug(message: string, meta?: any) {
    console.debug(`[DEBUG] [${new Date().toLocaleTimeString()}] ${message}`, meta || '');
  }
}
