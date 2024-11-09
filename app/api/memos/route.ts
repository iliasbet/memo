import { generateMemo } from '@/lib/memoGeneration';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const encoder = new TextEncoder();
        const { content } = await request.json();

        if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) {
            throw new Error('Configuration du serveur incomplète');
        }

        // Créer un stream avec une taille de chunk plus grande
        const stream = new TransformStream({}, {
            highWaterMark: 1024 * 1024, // 1MB buffer
            size() { return 1; }
        });
        const writer = stream.writable.getWriter();

        // Fonction pour écrire dans le stream de manière fiable
        const writeToStream = async (data: any) => {
            try {
                await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            } catch (error) {
                console.error('Erreur écriture stream:', error);
            }
        };

        // Lancer la génération en arrière-plan
        (async () => {
            try {
                const memo = await generateMemo(content, async (section) => {
                    await writeToStream({ type: 'update', section });
                });
                await writeToStream({ type: 'complete', memo });
            } catch (error) {
                await writeToStream({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Erreur inconnue'
                });
            } finally {
                await writer.close();
            }
        })();

        // Retourner immédiatement la réponse avec les bons headers
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
                'Transfer-Encoding': 'chunked'
            },
        });
    } catch (error) {
        console.error('Erreur API:', error);
        return new Response(
            JSON.stringify({
                message: error instanceof Error ? error.message : 'Erreur inconnue'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: 'Méthode GET non supportée' },
        { status: 405 }
    );
} 