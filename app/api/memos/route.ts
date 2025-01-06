// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { NextResponse } from 'next/server';
import { generateMemo } from '@/lib/memoGeneration';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, language } = body;

        if (!content) {
            console.error('API Error: Missing content in request body');
            return NextResponse.json(
                { error: 'Missing required field: content' },
                { status: 400 }
            );
        }

        console.log('Generating memo for content:', content, 'language:', language);
        const generatedMemo = await generateMemo(content, language);
        console.log('Generated memo:', generatedMemo);

        return NextResponse.json({ 
            memo: {
                id: generatedMemo.id,
                content: content,
                sections: generatedMemo.sections
            }
        });

    } catch (error) {
        // Log the full error details
        console.error('API Error Details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            error
        });

        // Return a more informative error response
        return NextResponse.json(
            { 
                error: 'Failed to generate memo',
                details: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
}