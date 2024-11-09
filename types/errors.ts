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

export class SpecificMemoError extends MemoError {
  constructor(
    code: ErrorCode,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(code, message, context);
    this.name = `${code}Error`;
  }
}

export class OpenAIError extends SpecificMemoError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.OPENAI_ERROR, message, context);
  }
}

export class ValidationError extends SpecificMemoError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.VALIDATION_ERROR, message, context);
  }
}

export class AnthropicError extends SpecificMemoError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorCode.API_ERROR, message, context);
  }
}
