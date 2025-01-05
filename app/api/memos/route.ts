// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, bookId } = body;

        if (!content || !bookId) {
            return NextResponse.json(
                { error: 'Missing required fields: content and bookId are required' },
                { status: 400 }
            );
        }

        let userId = 'anonymous';
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            userId = user.id;
        }

        const { data, error } = await supabase
            .from('memos')
            .insert([{
                user_id: userId,
                content,
                book_id: bookId
            }])
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new Error('No data returned from database');

        return NextResponse.json({ memo: data });
    } catch (error) {
        // Type guard for PostgrestError
        const isPostgrestError = (err: unknown): err is PostgrestError =>
            typeof err === 'object' && err !== null && 'code' in err;

        if (isPostgrestError(error)) {
            return NextResponse.json(
                { error: 'Database error occurred' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user ? user.id : 'anonymous';

        const { data, error } = await supabase
            .from('memos')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ memos: data });
    } catch (error) {
        const isPostgrestError = (err: unknown): err is PostgrestError =>
            typeof err === 'object' && err !== null && 'code' in err;

        if (isPostgrestError(error)) {
            return NextResponse.json(
                { error: 'Database error occurred' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 