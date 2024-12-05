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
  const cleanup = () => clearTimeout(timeout);
  return { controller, cleanup };
}

export function handleApiError(error: unknown): NextResponse {
  logger.error('API Error:', error);
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}
