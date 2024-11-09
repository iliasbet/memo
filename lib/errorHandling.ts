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
        onRetry: () => { }
    };

    static async withRetry<T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> {
        const opts = { ...this.DEFAULT_OPTIONS, ...options };
        let lastError: Error | null = null;

        for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;

                // Log l'erreur avec le contexte approprié
                Logger.log(LogLevel.WARN, `Retry ${attempt + 1}/${opts.maxRetries}`, {
                    error: lastError,
                    context: opts.context
                });

                if (attempt < opts.maxRetries - 1) {
                    const delay = opts.baseDelay * Math.pow(2, attempt);
                    opts.onRetry(attempt + 1, lastError);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        // Transformation de l'erreur finale
        const finalError = this.transformError(lastError!, opts.context);
        Logger.log(LogLevel.ERROR, 'Final error after retries', {
            error: finalError,
            context: opts.context
        });

        throw finalError;
    }

    private static transformError(error: Error, context: Record<string, unknown>): MemoError {
        if (error instanceof MemoError) {
            return error;
        }

        // Catégorisation des erreurs
        if (error.name === 'OpenAIError') {
            return new MemoError(ErrorCode.OPENAI_ERROR, error.message, context);
        }

        if (error.name === 'TypeError' || error.name === 'ValidationError') {
            return new MemoError(ErrorCode.VALIDATION_ERROR, error.message, context);
        }

        if (error.message.includes('network') || error.message.includes('timeout')) {
            return new MemoError(ErrorCode.NETWORK_ERROR, error.message, context);
        }

        return new MemoError(ErrorCode.API_ERROR, error.message, context);
    }
} 