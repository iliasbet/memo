// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { NextResponse } from 'next/server';
import { generateMemo } from '@/lib/memoGeneration';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'Missing required field: content' },
                { status: 400 }
            );
        }

        // Generate memo content using AI
        const generatedMemo = await generateMemo(content);

        // Return the generated memo directly without saving to database
        return NextResponse.json({ 
            memo: {
                id: generatedMemo.id,
                content: content,
                sections: generatedMemo.sections
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}