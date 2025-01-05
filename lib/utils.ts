import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextResponse } from 'next/server';
import { logger } from './logger';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type TimeoutController = {
  controller: AbortController;
  cleanup: () => void;
};

export function createTimeoutController(timeoutMs: number): TimeoutController {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, cleanup: () => clearTimeout(timeout) };
}

type ErrorWithCode = Error & { code?: string | number; status?: number };

export function handleApiError(error: unknown): NextResponse {
    const err = error as ErrorWithCode;
    const status = err.status || 
                  (err.code === 'VALIDATION_ERROR' ? 400 : 
                   err.code === 'NOT_FOUND' ? 404 : 500);
                   
    logger.error('API Error:', { error: err, status });
    
    return NextResponse.json(
        { 
            error: err.message || 'Internal Server Error',
            code: err.code
        },
        { status }
    );
}

export function formatMemoContent(content: string): string {
    return content
        .replace(/\*\*(.*?)\*\*|__([^_]+)__/g, (_, p1, p2) => 
            p1 ? `<strong>${p1}</strong>` : `<em>${p2}</em>`);
}
