import { NextResponse } from 'next/server';
import { Logger, LogLevel } from '@/lib/logger';
import { saveFeedback } from '@/lib/firebase/feedback';
import { adminAuth } from '@/lib/firebase/admin';
import { MemoError, ErrorCode } from '@/types/errors';

export async function POST(request: Request) {
    try {
        const { feedback, sessionId } = await request.json();

        if (!feedback || typeof feedback !== 'string') {
            Logger.log(LogLevel.WARN, 'Feedback invalide reçu', {
                timestamp: Date.now()
            });
            return NextResponse.json(
                { error: 'Feedback invalide' },
                { status: 400 }
            );
        }

        // Récupérer l'utilisateur si sessionId est fourni
        let userId: string | undefined;
        if (sessionId) {
            try {
                const decodedToken = await adminAuth.verifySessionCookie(sessionId, true);
                userId = decodedToken.uid;
            } catch (error) {
                // Log l'erreur mais continue sans userId
                Logger.log(LogLevel.WARN, 'Session invalide', {
                    error,
                    timestamp: Date.now()
                });
            }
        }

        const feedbackId = await saveFeedback(feedback, userId);

        Logger.log(LogLevel.INFO, 'Feedback enregistré avec succès', {
            feedbackId,
            timestamp: Date.now()
        });

        return NextResponse.json({ success: true, feedbackId });
    } catch (error) {
        Logger.log(LogLevel.ERROR, 'Erreur lors de l\'enregistrement du feedback', {
            error,
            timestamp: Date.now()
        });

        return NextResponse.json(
            { error: 'Erreur lors de l\'enregistrement du feedback' },
            { status: 500 }
        );
    }
}
