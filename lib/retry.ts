import { MemoError, ErrorCode } from '@/types/errors';
import { Logger } from './logger';
import { LogLevel } from './logger';

interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
    shouldRetry?: (error: Error) => boolean;
}

export const withRetry = async <T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> => {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        shouldRetry = () => true
    } = options;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            if (!shouldRetry(lastError) || attempt === maxRetries - 1) {
                break;
            }

            Logger.log(LogLevel.WARN, `Retry ${attempt + 1}/${maxRetries}`, { error });
            await new Promise(r => setTimeout(r, baseDelay * (attempt + 1)));
        }
    }

    throw new MemoError(
        ErrorCode.API_ERROR,
        `Operation failed after ${maxRetries} attempts`,
        { originalError: lastError }
    );
};
