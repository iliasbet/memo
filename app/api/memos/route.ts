// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/admin';
import { saveMemoToDb, getMemosByUserId, SupabaseError } from '@/lib/saveMemoDb';
import { generateMemo } from '@/lib/memoGeneration';
import { logger } from '@/lib/logger';
import { ValidationError } from '@/lib/errors';
import type { MemoInput } from '@/types/memo';
import { termcolor } from '@/lib/logger';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { content, bookId, chapterId } = body;

        if (!content || !bookId) {
            throw new ValidationError('Missing required fields: content and bookId are required');
        }

        if (typeof content !== 'string' || typeof bookId !== 'string') {
            throw new ValidationError('Invalid field types: content and bookId must be strings');
        }

        // Get user ID from auth token if available, otherwise use anonymous
        let userId = 'anonymous';
        const authHeader = request.headers.get('Authorization');

        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.split('Bearer ')[1];
                const decodedToken = await verifyAuth(token);
                userId = decodedToken.uid;
                logger.info('Authenticated user creating memo:', { userId });
            } catch (error) {
                logger.info('Authentication failed, proceeding as anonymous:', error);
            }
        } else {
            logger.info('No authentication provided, proceeding as anonymous user');
        }

        // First, generate the structured memo
        termcolor.blue('🚀 Generating structured memo...');
        const structuredMemo = await generateMemo(content.trim());
        termcolor.green('✓ Structured memo generated');

        // Then save it to the database
        termcolor.blue('💾 Saving memo to database...');
        const input: MemoInput = {
            userId,
            content: content.trim(),
            bookId,
            chapterId: typeof chapterId === 'string' ? chapterId : undefined
        };

        const dbMemo = await saveMemoToDb(input);
        termcolor.green('✓ Memo saved to database');

        // Combine the structured memo with the database info
        const memo = {
            ...structuredMemo,
            id: dbMemo.id,
            user_id: dbMemo.userId,
            book_id: dbMemo.bookId,
            chapter_id: dbMemo.chapterId,
            created_at: dbMemo.createdAt
        };

        logger.info('Successfully created memo:', {
            memoId: memo.id,
            userId: memo.user_id
        });

        return NextResponse.json({ memo });
    } catch (error) {
        logger.error('Error in POST /api/memos:', error);

        if (error instanceof ValidationError) {
            return NextResponse.json(
                {
                    error: 'Validation Error',
                    message: error.message
                },
                { status: 400 }
            );
        }

        if (error instanceof SupabaseError) {
            const status = error.supabaseError?.code === 'PGRST301' ? 403 : 500;
            return NextResponse.json(
                {
                    error: 'Database Error',
                    message: error.message,
                    details: error.supabaseError,
                    context: error.context
                },
                { status }
            );
        }

        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        let userId = 'anonymous';
        const authHeader = request.headers.get('Authorization');

        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.split('Bearer ')[1];
                const decodedToken = await verifyAuth(token);
                userId = decodedToken.uid;
                logger.info('Authenticated user fetching memos:', { userId });
            } catch (error) {
                logger.info('Authentication failed, proceeding as anonymous:', error);
            }
        }

        const memos = await getMemosByUserId(userId);
        return NextResponse.json({ memos });
    } catch (error) {
        logger.error('Error in GET /api/memos:', error);

        if (error instanceof SupabaseError) {
            const status = error.supabaseError?.code === 'PGRST301' ? 403 : 500;
            return NextResponse.json(
                {
                    error: error.message,
                    details: error.supabaseError
                },
                { status }
            );
        }

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 