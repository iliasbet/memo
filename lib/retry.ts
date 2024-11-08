import { MemoError, ErrorCode } from '@/types/errors';
import { Logger } from './logger';
import { LogLevel } from './logger';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

export async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            Logger.log(LogLevel.WARN, `Tentative ${attempt + 1}/${MAX_RETRIES} échouée`, { error });
            
            if (attempt < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, BASE_DELAY * (attempt + 1)));
            }
        }
    }

    throw new MemoError(
        ErrorCode.API_ERROR,
        `Échec après ${MAX_RETRIES} tentatives`,
        { originalError: lastError }
    );
}
