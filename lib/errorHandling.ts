import { Logger, LogLevel } from './logger';
import { ErrorCode, MemoError } from '@/types/errors';

interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    context?: Record<string, unknown>;
    onRetry?: (attempt: number, error: Error) => void;
}

export class ErrorHandler {
    private static readonly DEFAULT_OPTIONS: Required<RetryOptions> = {
        maxRetries: 3,
        baseDelay: 1000,
        context: {},
        onRetry: () => { },
    };

    static async withRetry<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const { maxRetries, baseDelay, context, onRetry } = {
            ...this.DEFAULT_OPTIONS,
            ...options,
        };
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                Logger.log(LogLevel.WARN, `Retry ${attempt}/${maxRetries}`, {
                    error: lastError,
                    context,
                });

                if (attempt < maxRetries) {
                    const delay = baseDelay * 2 ** (attempt - 1);
                    onRetry(attempt, lastError);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        }

        const finalError = this.transformError(lastError!, context);
        Logger.log(LogLevel.ERROR, 'Final error after retries', {
            error: finalError,
            context,
        });

        throw finalError;
    }

    static handle(error: Error, context: Record<string, unknown> = {}): MemoError {
        return this.transformError(error, context);
    }

    private static transformError(error: Error, context: Record<string, unknown>): MemoError {
        if (error instanceof MemoError) {
            return error;
        }

        const errorMapping: Record<string, ErrorCode> = {
            OpenAIError: ErrorCode.OPENAI_ERROR,
            ValidationError: ErrorCode.VALIDATION_ERROR,
            TypeError: ErrorCode.VALIDATION_ERROR,
            network: ErrorCode.NETWORK_ERROR,
            timeout: ErrorCode.NETWORK_ERROR,
        };

        for (const [key, code] of Object.entries(errorMapping)) {
            if (error.name === key || error.message.includes(key)) {
                return new MemoError(code, error.message, context);
            }
        }

        return new MemoError(ErrorCode.API_ERROR, error.message, context);
    }
}

export { MemoError } from '@/types/errors';