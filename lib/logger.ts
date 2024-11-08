export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export class Logger {
  static log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context
    };

    switch (level) {
      case LogLevel.ERROR:
        console.error(JSON.stringify(logEntry, null, 2));
        break;
      case LogLevel.WARN:
        console.warn(JSON.stringify(logEntry, null, 2));
        break;
      default:
        console.log(JSON.stringify(logEntry, null, 2));
    }
  }
}
