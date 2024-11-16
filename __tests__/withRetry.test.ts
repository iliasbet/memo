import { ErrorHandler } from '@/lib/errorHandling';
import { MemoError, ErrorCode } from '@/types/errors';

describe('withRetry', () => {
    beforeEach(() => {
        jest.useFakeTimers({ advanceTimers: true });
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.clearAllMocks();
    });

    test('should throw after max retries', async () => {
        const error = new Error('fail');
        const fn = jest.fn().mockRejectedValue(error);
        const maxRetries = 2;

        const promise = ErrorHandler.withRetry(fn, { maxRetries });

        for (let i = 0; i <= maxRetries; i++) {
            jest.advanceTimersByTime(1000 * Math.pow(2, i));
            await Promise.resolve();
        }

        await expect(promise).rejects.toThrow(error);
        expect(fn).toHaveBeenCalledTimes(maxRetries + 1);
    }, 15000);

    test('should not retry on certain errors', async () => {
        const noRetryError = new MemoError(
            ErrorCode.VALIDATION_ERROR,
            'Invalid input'
        );
        const fn = jest.fn().mockRejectedValue(noRetryError);

        const promise = ErrorHandler.withRetry(fn);
        jest.advanceTimersByTime(1000);
        await Promise.resolve();

        await expect(promise).rejects.toThrow(noRetryError);
        expect(fn).toHaveBeenCalledTimes(1);
    }, 15000);
}); 