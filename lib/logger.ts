// ANSI escape codes for colors
const colors = {
  reset: "\x1b[0m",
  blue: "\x1b[34m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m"
} as const;

// Configure colored output
export const termcolor = {
  blue: (message: string): void => {
    console.log(`${colors.blue}${message}${colors.reset}`);
  },
  green: (message: string): void => {
    console.log(`${colors.green}${message}${colors.reset}`);
  },
  red: (message: string): void => {
    console.log(`${colors.red}${message}${colors.reset}`);
  },
  yellow: (message: string): void => {
    console.log(`${colors.yellow}${message}${colors.reset}`);
  }
} as const;

// Basic logger implementation with colored prefixes
export const logger = {
  info: (message: string, context?: unknown): void => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`, context ?? '');
  },
  error: (message: string, error?: unknown): void => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${message}`, error ?? '');
  },
  warn: (message: string, context?: unknown): void => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${message}`, context ?? '');
  },
  debug: (message: string, context?: unknown): void => {
    console.debug(`${colors.green}[DEBUG]${colors.reset} ${message}`, context ?? '');
  }
} as const;
