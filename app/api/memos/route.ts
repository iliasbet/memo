import { generateMemo } from '@/lib/memoGeneration';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        console.log('API Route - Start');
        const encoder = new TextEncoder();
        const { content } = await request.json();
        console.log('Content received:', content);

        if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) {
            console.error('Missing API keys');
            throw new Error('Configuration du serveur incomplète');
        }

        const stream = new TransformStream();
        const writer = stream.writable.getWriter();

        // Gestion de la promesse de génération
        const memoPromise = generateMemo(content, async (section) => {
            try {
                const sectionData = JSON.stringify({ type: 'update', section });
                await writer.write(encoder.encode(`data: ${sectionData}\n\n`));
            } catch (error) {
                console.error('Erreur écriture section:', error);
                throw error; // Propager l'erreur
            }
        });

        // Gestion asynchrone avec Promise.race pour éviter les blocages
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')),
                process.env.NODE_ENV === 'production' ? 15000 : 30000
            )
        );

        Promise.race([memoPromise, timeout])
            .then(async (memo) => {
                const completeData = JSON.stringify({ type: 'complete', memo });
                await writer.write(encoder.encode(`data: ${completeData}\n\n`));
                await writer.close();
            })
            .catch(async (error) => {
                console.error('Erreur génération:', error);
                const errorData = JSON.stringify({
                    type: 'error',
                    message: error.message || 'Erreur inconnue'
                });
                await writer.write(encoder.encode(`data: ${errorData}\n\n`));
                await writer.close();
            });

        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            },
        });
    } catch (error) {
        console.error('Erreur API:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Échec de la génération du mémo' },
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