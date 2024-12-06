// ANSI escape codes for colors
const COLORS = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m",
  cyan: "\x1b[36m"
} as const;

// Log levels with their corresponding colors and priorities
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogConfig {
  minLevel: LogLevel;
  enableColors: boolean;
  showTimestamp: boolean;
  showLogLevel: boolean;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: unknown;
}

// Default configuration
const DEFAULT_CONFIG: LogConfig = {
  minLevel: LogLevel.INFO,
  enableColors: true,
  showTimestamp: true,
  showLogLevel: true
};

// Logger class with enhanced features
class Logger {
  private config: LogConfig;

  constructor(config: Partial<LogConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private formatTimestamp(date: Date): string {
    return date.toISOString();
  }

  private formatLogLevel(level: LogLevel): string {
    const labels: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR'
    };

    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: COLORS.gray,
      [LogLevel.INFO]: COLORS.blue,
      [LogLevel.WARN]: COLORS.yellow,
      [LogLevel.ERROR]: COLORS.red
    };

    const label = labels[level];
    return this.config.enableColors ? `${colors[level]}[${label}]${COLORS.reset}` : `[${label}]`;
  }

  private log(entry: LogEntry): void {
    if (entry.level < this.config.minLevel) return;

    const parts: string[] = [];

    if (this.config.showTimestamp) {
      const timestamp = this.formatTimestamp(entry.timestamp);
      parts.push(`${COLORS.cyan}${timestamp}${COLORS.reset}`);
    }

    if (this.config.showLogLevel) {
      parts.push(this.formatLogLevel(entry.level));
    }

    parts.push(entry.message);

    const logMessage = parts.join(' ');

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(logMessage, entry.context ?? '');
        break;
      case LogLevel.WARN:
        console.warn(logMessage, entry.context ?? '');
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, entry.context ?? '');
        break;
      default:
        console.log(logMessage, entry.context ?? '');
    }
  }

  public debug(message: string, context?: unknown): void {
    this.log({
      level: LogLevel.DEBUG,
      message,
      timestamp: new Date(),
      context
    });
  }

  public info(message: string, context?: unknown): void {
    this.log({
      level: LogLevel.INFO,
      message,
      timestamp: new Date(),
      context
    });
  }

  public warn(message: string, context?: unknown): void {
    this.log({
      level: LogLevel.WARN,
      message,
      timestamp: new Date(),
      context
    });
  }

  public error(message: string, context?: unknown): void {
    this.log({
      level: LogLevel.ERROR,
      message,
      timestamp: new Date(),
      context
    });
  }

  public setConfig(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// Terminal color utility for user feedback
export const termcolor = {
  blue: (message: string): void => {
    console.log(`${COLORS.blue}${message}${COLORS.reset}`);
  },
  green: (message: string): void => {
    console.log(`${COLORS.green}${message}${COLORS.reset}`);
  },
  red: (message: string): void => {
    console.log(`${COLORS.red}${message}${COLORS.reset}`);
  },
  yellow: (message: string): void => {
    console.log(`${COLORS.yellow}${message}${COLORS.reset}`);
  },
  gray: (message: string): void => {
    console.log(`${COLORS.gray}${message}${COLORS.reset}`);
  }
} as const;

// Export a default logger instance
export const logger = new Logger();
