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

// Simple logger with color support
class Logger {
  private formatMessage(level: string, color: string, message: string, context?: unknown): string {
    const timestamp = new Date().toISOString();
    return `${COLORS.cyan}${timestamp}${COLORS.reset} ${color}[${level}]${COLORS.reset} ${message}${context ? ' ' + JSON.stringify(context) : ''}`;
  }

  public debug(message: string, context?: unknown): void {
    console.debug(this.formatMessage('DEBUG', COLORS.gray, message, context));
  }

  public info(message: string, context?: unknown): void {
    console.log(this.formatMessage('INFO', COLORS.blue, message, context));
  }

  public warn(message: string, context?: unknown): void {
    console.warn(this.formatMessage('WARN', COLORS.yellow, message, context));
  }

  public error(message: string, context?: unknown): void {
    console.error(this.formatMessage('ERROR', COLORS.red, message, context));
  }
}

// Terminal color utility for user feedback
export const termcolor = {
  blue: (message: string): void => console.log(`${COLORS.blue}${message}${COLORS.reset}`),
  green: (message: string): void => console.log(`${COLORS.green}${message}${COLORS.reset}`),
  red: (message: string): void => console.log(`${COLORS.red}${message}${COLORS.reset}`),
  yellow: (message: string): void => console.log(`${COLORS.yellow}${message}${COLORS.reset}`),
  gray: (message: string): void => console.log(`${COLORS.gray}${message}${COLORS.reset}`)
} as const;

// Export a default logger instance
export const logger = new Logger();
