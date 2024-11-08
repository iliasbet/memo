import { ErrorCode, MemoError, OpenAIError } from '@/types/errors';
import { Logger } from './logger';
import { LogLevel } from './logger';

interface ErrorContext {
    type?: string;
    error?: unknown;
    [key: string]: unknown;
}

export class ErrorHandler {
    static handle(error: unknown, context: ErrorContext = {}): never {
        // Log l'erreur
        Logger.log(LogLevel.ERROR, 'Error caught:', { error, context });

        // Transformer l'erreur en MemoError si ce n'est pas déjà le cas
        if (error instanceof MemoError) {
            throw error;
        }

        // Gérer les erreurs OpenAI
        if (error instanceof Error && error.name === 'OpenAIError') {
            throw new OpenAIError(error.message, context);
        }

        // Gérer les erreurs réseau
        if (error instanceof Error && error.name === 'NetworkError') {
            throw new MemoError(ErrorCode.NETWORK_ERROR, 'Erreur de connexion', context);
        }

        // Erreur par défaut
        throw new MemoError(
            ErrorCode.API_ERROR,
            error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
            context
        );
    }
} 