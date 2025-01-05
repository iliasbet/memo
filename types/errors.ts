export type ErrorCode = 'API_ERROR' | 'OPENAI_ERROR' | 'PARSING_ERROR' | 
                     'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'TIMEOUT_ERROR';

export class MemoError extends Error {
    constructor(
        public code: ErrorCode,
        message: string,
        public context?: Record<string, unknown>
    ) {
        super(message);
        this.name = `${code}Error`;
    }
}

export const createOpenAIError = (message: string, context?: Record<string, unknown>): MemoError =>
    new MemoError('OPENAI_ERROR', message, context);

export const createValidationError = (message: string, context?: Record<string, unknown>): MemoError =>
    new MemoError('VALIDATION_ERROR', message, context);
