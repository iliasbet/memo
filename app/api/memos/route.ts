// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { NextResponse } from 'next/server';
import { MemoError, ErrorCode } from '@/types/errors';
import { Logger, LogLevel } from '@/lib/logger';
import { generateMemo } from '@/lib/memoGeneration';

function truncateContent(content: string): string {
    return content.length > 140 ? content.slice(0, 137) + '...' : content;
}

// export const runtime = 'edge' // optional
export const maxDuration = 60

// POST: Crée un nouveau mémo à partir du contenu fourni
export async function POST(request: Request) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 secondes

    try {
        const { content } = await request.json();

        if (!content) {
            throw new MemoError(
                ErrorCode.VALIDATION_ERROR,
                'Le contenu est requis'
            );
        }

        Logger.log(LogLevel.INFO, 'Début de la génération de mémo', { content, timestamp: Date.now() });

        const memo = await generateMemo(content);
        clearTimeout(timeoutId);

        Logger.log(LogLevel.INFO, 'Mémo généré avec succès', { memo, timestamp: Date.now() });

        return NextResponse.json({ memo });

    } catch (error) {
        clearTimeout(timeoutId);
        Logger.log(LogLevel.ERROR, 'Erreur lors de la génération du mémo', { error, timestamp: Date.now() });

        if ((error as Error).name === 'AbortError') {
            return NextResponse.json(
                { message: 'La requête a pris trop de temps à répondre.' },
                { status: 504 }
            );
        }

        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Erreur serveur' },
            { status: 500 }
        );
    }
}

// GET: Endpoint non supporté (méthode de démonstration)
export async function GET() {
    return NextResponse.json(
        { message: 'Méthode GET non supportée' },
        { status: 405 }
    );
} 