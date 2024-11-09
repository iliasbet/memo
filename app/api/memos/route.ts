// API Route pour la gestion des mémos
// Gère la création et la validation des mémos via les endpoints POST et GET

import { generateMemo } from '@/lib/memoGeneration';
import { NextResponse } from 'next/server';
import { MemoError, ErrorCode } from '@/types/errors';
import { ErrorHandler } from '@/lib/errorHandling';
import { Logger, LogLevel } from '@/lib/logger';

// POST: Crée un nouveau mémo à partir du contenu fourni
export async function POST(request: Request) {
    try {
        const { content } = await request.json();

        // Validation du contenu
        if (typeof content !== 'string' || !content.trim()) {
            throw new MemoError(ErrorCode.VALIDATION_ERROR, 'Le contenu du mémo est invalide.');
        }

        // Vérification des clés API requises
        if (!process.env.OPENAI_API_KEY || !process.env.ANTHROPIC_API_KEY) {
            throw new MemoError(ErrorCode.API_ERROR, 'Configuration du serveur incomplète.');
        }

        const memo = await generateMemo(content);

        return NextResponse.json({ memo }, { status: 200 });
    } catch (error) {
        Logger.log(LogLevel.ERROR, 'Erreur API:', { error });
        const memoError = ErrorHandler.handle(error as Error, {});

        return NextResponse.json({ message: memoError.message }, { status: 500 });
    }
}

// GET: Endpoint non supporté (méthode de démonstration)
export async function GET() {
    return NextResponse.json(
        { message: 'Méthode GET non supportée' },
        { status: 405 }
    );
} 