import { generateMemo } from '@/lib/memoGeneration';
import { NextResponse } from 'next/server';
import { Memo } from '@/types';

export async function POST(request: Request) {
    const encoder = new TextEncoder();
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
        return NextResponse.json(
            { message: 'Le contenu est requis et doit être une chaîne de caractères' },
            { status: 400 }
        );
    }

    try {
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        generateMemo(content, async (section) => {
            try {
                const sectionData = JSON.stringify({ type: 'update', section });
                await writer.write(encoder.encode(`data: ${sectionData}\n\n`));
            } catch (error) {
                console.error('Erreur écriture section:', error);
            }
        }).then(async (memo) => {
            try {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'complete', memo })}\n\n`));
            } catch (error) {
                console.error('Erreur completion:', error);
            } finally {
                await writer.close();
            }
        }).catch(async (error) => {
            console.error('Erreur génération:', error);
            try {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`));
            } catch (e) {
                console.error('Erreur envoi erreur:', e);
            } finally {
                await writer.close();
            }
        });

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            },
        });
    } catch (error) {
        console.error('Erreur API:', error);
        return NextResponse.json(
            { message: 'Échec de la génération du mémo' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'Méthode GET non supportée' },
        { status: 405 }
    );
} 