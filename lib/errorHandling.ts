import { Logger, LogLevel } from './logger';
import { ErrorCode, MemoError } from '@/types/errors';

export interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
    context?: Record<string, unknown>;
}

interface ErrorHandlerStatic {
    withRetry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
    transformError(error: Error, context?: Record<string, unknown>): Error;
}

export const ErrorHandler: ErrorHandlerStatic = {
    async withRetry<T>(
        fn: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const {
            maxRetries = 3,
            baseDelay = 1000,
            onRetry,
            context
        } = options;

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await fn();
                return result;
            } catch (error) {
                lastError = error as Error;

                if (lastError instanceof MemoError) {
                    throw lastError;
                }

                if (attempt === maxRetries) {
                    throw ErrorHandler.transformError(lastError, context);
                }

                if (onRetry) {
                    onRetry(attempt, lastError);
                }

                await new Promise<void>(resolve =>
                    setTimeout(resolve, baseDelay * Math.pow(2, attempt))
                );
            }
        }

        throw lastError || new Error('Unknown error');
    },

    transformError(error: Error, context?: Record<string, unknown>): Error {
        return new MemoError(
            ErrorCode.VALIDATION_ERROR,
            error.message,
            context
        );
    }
};

export { MemoError } from '@/types/errors';