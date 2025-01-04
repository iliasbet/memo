import { supabase } from './supabase/client'
import { logger } from './logger'
import type { MemoInput, MemoResponse, DatabaseMemo } from '@/types/memo'
import { PostgrestError } from '@supabase/supabase-js'

export type SupabaseError = PostgrestError;

export async function saveMemoToDb(input: MemoInput): Promise<MemoResponse> {
    try {
        const { data, error } = await supabase
            .from('memos')
            .insert([{ user_id: input.userId, content: input.content, book_id: input.bookId, chapter_id: input.chapterId }])
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned from database after insert');

        const dbMemo = data as DatabaseMemo;
        return {
            id: dbMemo.id,
            userId: dbMemo.user_id,
            content: dbMemo.content,
            bookId: dbMemo.book_id,
            chapterId: dbMemo.chapter_id ?? undefined,
            createdAt: dbMemo.created_at,
        };
    } catch (error) {
        logger.error('Error saving memo:', error);
        throw error;
    }
}

export async function getMemosByUserId(userId: string): Promise<MemoResponse[]> {
    try {
        const { data, error } = await supabase
            .from('memos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((dbMemo: DatabaseMemo) => ({
            id: dbMemo.id,
            userId: dbMemo.user_id,
            content: dbMemo.content,
            bookId: dbMemo.book_id,
            chapterId: dbMemo.chapter_id ?? undefined,
            createdAt: dbMemo.created_at,
        }));
    } catch (error) {
        logger.error('Error fetching memos:', error);
        throw error;
    }
}
