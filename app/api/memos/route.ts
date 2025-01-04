// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { saveMemoToDb, getMemosByUserId } from '@/lib/saveMemoDb';
import { ValidationError } from '@/lib/errors';
import type { PostgrestError } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, bookId } = body;

        if (!content || !bookId) {
            throw new ValidationError('Missing required fields: content and bookId are required');
        }

        let userId = 'anonymous';
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            userId = user.id;
        }

        const dbMemo = await saveMemoToDb({ userId, content, bookId });
        return NextResponse.json({ memo: dbMemo });
    } catch (error) {
        if (error instanceof ValidationError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        const isPostgrestError = typeof error === 'object' && error !== null && 'code' in error;
        if (isPostgrestError) {
            return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const memos = await getMemosByUserId(user ? user.id : 'anonymous');
        return NextResponse.json({ memos });
    } catch (error) {
        const isPostgrestError = typeof error === 'object' && error !== null && 'code' in error;
        if (isPostgrestError) {
            return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 