// Error codes for better error handling and categorization
export enum ErrorCode {
    // Auth related errors
    AUTH_INVALID_CREDENTIALS = 'AUTH001',
    AUTH_TOKEN_EXPIRED = 'AUTH002',
    AUTH_UNAUTHORIZED = 'AUTH003',

    // Validation related errors
    VALIDATION_INVALID_INPUT = 'VAL001',
    VALIDATION_MISSING_FIELD = 'VAL002',
    VALIDATION_INVALID_FORMAT = 'VAL003',

    // API related errors
    API_RATE_LIMIT = 'API001',
    API_SERVICE_UNAVAILABLE = 'API002',
    API_TIMEOUT = 'API003',

    // Data related errors
    DATA_NOT_FOUND = 'DATA001',
    DATA_ALREADY_EXISTS = 'DATA002',
    DATA_CORRUPTED = 'DATA003'
}

// Base error class with enhanced context
export class BaseError extends Error {
    public readonly code: ErrorCode;
    public readonly context?: Record<string, unknown>;
    public readonly timestamp: Date;

    constructor(message: string, code: ErrorCode, context?: Record<string, unknown>) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.context = context;
        this.timestamp = new Date();

        // Maintains proper stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    public toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack
        };
    }
}

export class AuthError extends BaseError {
    constructor(
        message: string,
        code: ErrorCode = ErrorCode.AUTH_UNAUTHORIZED,
        context?: Record<string, unknown>
    ) {
        super(message, code, context);
    }
}

export class ValidationError extends BaseError {
    constructor(
        message: string,
        code: ErrorCode = ErrorCode.VALIDATION_INVALID_INPUT,
        context?: Record<string, unknown>
    ) {
        super(message, code, context);
    }
}

export class APIError extends BaseError {
    constructor(
        message: string,
        code: ErrorCode = ErrorCode.API_SERVICE_UNAVAILABLE,
        context?: Record<string, unknown>
    ) {
        super(message, code, context);
    }
}

export class DataError extends BaseError {
    constructor(
        message: string,
        code: ErrorCode = ErrorCode.DATA_NOT_FOUND,
        context?: Record<string, unknown>
    ) {
        super(message, code, context);
    }
}

// Utility function to ensure errors are always of our custom error types
export function ensureCustomError(error: unknown, defaultCode: ErrorCode = ErrorCode.API_SERVICE_UNAVAILABLE): BaseError {
    if (error instanceof BaseError) {
        return error;
    }

    const message = error instanceof Error ? error.message : String(error);
    return new BaseError(message, defaultCode, { originalError: error });
} 