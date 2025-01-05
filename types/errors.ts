export enum ErrorCode {
  API_ERROR = 'API_ERROR',
  OPENAI_ERROR = 'OPENAI_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}

export interface MemoError extends Error {
  code: ErrorCode;
  context?: Record<string, unknown>;
}

export const createError = (code: ErrorCode, message: string, context?: Record<string, unknown>): MemoError => {
  const error = new Error(message) as MemoError;
  error.code = code;
  error.context = context;
  error.name = `${code}Error`;
  return error;
};

export const createOpenAIError = (message: string, context?: Record<string, unknown>): MemoError =>
  createError(ErrorCode.OPENAI_ERROR, message, context);

export const createValidationError = (message: string, context?: Record<string, unknown>): MemoError =>
  createError(ErrorCode.VALIDATION_ERROR, message, context);
