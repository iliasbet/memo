export enum ErrorCode {
  API_ERROR = 'API_ERROR',
  OPENAI_ERROR = 'OPENAI_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export class MemoError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'MemoError';
  }
}

export class OpenAIError extends MemoError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.OPENAI_ERROR, message, context);
    this.name = 'OpenAIError';
  }
}

export class ValidationError extends MemoError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.VALIDATION_ERROR, message, context);
    this.name = 'ValidationError';
  }
}
