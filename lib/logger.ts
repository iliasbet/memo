export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

export class Logger {
  private static logs: LogMessage[] = [];
  private static maxLogs = 100;

  static log(level: LogLevel, message: string, data?: unknown) {
    const logMessage: LogMessage = {
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    };

    this.logs.push(logMessage);

    // Garder seulement les derniers logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // En développement, on affiche aussi dans la console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level}] ${message}`, data);
    }
  }

  static getLogs(): LogMessage[] {
    return [...this.logs];
  }

  static clearLogs(): void {
    this.logs = [];
  }
}
