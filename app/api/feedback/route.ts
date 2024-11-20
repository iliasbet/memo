import { NextResponse } from 'next/server';
import { Logger, LogLevel } from '@/lib/logger';
import { saveFeedback } from '@/lib/firebase/feedback';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        const { feedback, sessionId, memoRequest, idMemo } = await request.json();

        // Vérification des champs obligatoires
        if (!feedback || typeof feedback !== 'string') {
            Logger.log(LogLevel.WARN, 'Feedback invalide reçu', {
                timestamp: Date.now(),
                feedback,
            });
            return NextResponse.json(
                { error: 'Feedback invalide ou manquant' },
                { status: 400 }
            );
        }

        // Assigner une valeur par défaut si memoRequest est undefined ou invalide
        const validatedMemoRequest =
            memoRequest && typeof memoRequest === 'string' ? memoRequest : 'message default';

        // Vérification de idMemo
        const validatedIdMemo =
            idMemo && typeof idMemo === 'string' ? idMemo : 'unknown'; // Valeur par défaut si idMemo est absent ou invalide

        // Récupérer l'utilisateur à partir de la session si disponible
        let userId: string | undefined = 'anonyme'; // Valeur par défaut

        if (sessionId) {
            try {
                const decodedToken = await adminAuth.verifySessionCookie(sessionId, true);
                userId = decodedToken.uid; // Si sessionId valide, remplace "anonyme" par l'UID réel
            } catch (error) {
                Logger.log(LogLevel.WARN, 'Session invalide, utilisateur anonyme', {
                    error,
                    timestamp: Date.now(),
                });
            }
        }

        // Sauvegarder le feedback avec idMemo
        const feedbackId = await saveFeedback(feedback, validatedMemoRequest, userId, validatedIdMemo);

        Logger.log(LogLevel.INFO, 'Feedback enregistré avec succès', {
            feedbackId,
            userId,
            idMemo: validatedIdMemo,
            timestamp: Date.now(),
        });

        return NextResponse.json({ success: true, feedbackId });
    } catch (error) {
        Logger.log(LogLevel.ERROR, 'Erreur lors de l\'enregistrement du feedback', {
            error,
            timestamp: Date.now(),
        });

        return NextResponse.json(
            { error: 'Erreur lors de l\'enregistrement du feedback' },
            { status: 500 }
        );
    }
}
