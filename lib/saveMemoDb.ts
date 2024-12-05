import { supabase } from './supabase/client'
import { logger } from './logger'
import type { Memo, MemoInput, MemoResponse, DatabaseMemo } from '@/types/memo'
import { PostgrestError } from '@supabase/supabase-js'

export class SupabaseError extends Error {
    constructor(
        message: string,
        public readonly supabaseError: PostgrestError | null,
        public readonly context?: any
    ) {
        super(message);
        this.name = 'SupabaseError';
    }
}

export async function saveMemoToDb(input: MemoInput): Promise<MemoResponse> {
    try {
        logger.info('Attempting to save memo:', {
            ...input,
            content: input.content.substring(0, 50) + '...'
        });

        // Test connection first
        const { data: testData, error: testError } = await supabase
            .from('memos')
            .select('count')
            .limit(1);

        if (testError) {
            logger.error('Supabase connection test failed:', testError);
            throw new SupabaseError('Failed to connect to database', testError, null);
        }

        logger.info('Supabase connection test successful');

        const { data, error } = await supabase
            .from('memos')
            .insert([
                {
                    user_id: input.userId,
                    content: input.content,
                    book_id: input.bookId,
                    chapter_id: input.chapterId,
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            logger.error('Supabase error details:', {
                code: error.code,
                message: error.message,
                details: error.details,
                hint: error.hint
            });
            throw new SupabaseError('Failed to save memo', error, input);
        }

        if (!data) {
            throw new SupabaseError('No data returned from Supabase', null, input);
        }

        const dbMemo = data as DatabaseMemo;
        logger.info('Successfully saved memo to Supabase');

        // Convert to client-friendly format
        return {
            id: dbMemo.id,
            userId: dbMemo.user_id,
            content: dbMemo.content,
            bookId: dbMemo.book_id,
            chapterId: dbMemo.chapter_id ?? undefined,
            createdAt: dbMemo.created_at
        };
    } catch (error) {
        if (error instanceof SupabaseError) {
            throw error;
        }

        logger.error('Unexpected error saving memo to Supabase:', {
            error,
            input: {
                ...input,
                content: input.content.substring(0, 50) + '...'
            }
        });
        throw new SupabaseError(
            'Unexpected error saving memo',
            null,
            { originalError: error, input }
        );
    }
}

export async function getMemosByUserId(userId: string): Promise<MemoResponse[]> {
    try {
        const { data, error } = await supabase
            .from('memos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new SupabaseError('Failed to fetch memos', error, { userId });
        }

        if (!data) {
            return [];
        }

        return data.map((dbMemo: DatabaseMemo) => ({
            id: dbMemo.id,
            userId: dbMemo.user_id,
            content: dbMemo.content,
            bookId: dbMemo.book_id,
            chapterId: dbMemo.chapter_id ?? undefined,
            createdAt: dbMemo.created_at
        }));
    } catch (error) {
        if (error instanceof SupabaseError) {
            throw error;
        }

        logger.error('Error fetching memos from Supabase:', error);
        throw new SupabaseError(
            'Unexpected error fetching memos',
            null,
            { originalError: error, userId }
        );
    }
}
