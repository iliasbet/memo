import { generateMemo } from '@/lib/memoGeneration';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { content } = await request.json();

        if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) {
            throw new Error('Configuration du serveur incomplète');
        }

        const memo = await generateMemo(content);

        return NextResponse.json({ memo }, { status: 200 });
    } catch (error) {
        console.error('Erreur API:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erreur inconnue' },
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