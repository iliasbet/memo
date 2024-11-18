import { NextResponse } from 'next/server';
import { Logger, LogLevel } from '@/lib/logger';
import { saveFeedback } from '@/lib/firebase/feedback';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        const { feedback, sessionId } = await request.json();
        console.log('Tentative d\'enregistrement du feedback:', { feedback, sessionId });

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
        let userId;
        if (sessionId) {
            try {
                const decodedToken = await adminAuth.verifySessionCookie(sessionId);
                userId = decodedToken.uid;
            } catch (error) {
                Logger.log(LogLevel.WARN, 'Session invalide', {
                    error,
                    timestamp: Date.now()
                });
                // On continue sans userId si la session est invalide
            }
        }

        const feedbackId = await saveFeedback(feedback, userId);

        Logger.log(LogLevel.INFO, 'Feedback enregistré avec succès', {
            feedbackId,
            timestamp: Date.now()
        });

        return NextResponse.json({ success: true, feedbackId });
    } catch (error) {
        console.error('Erreur détaillée:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'enregistrement du feedback' },
            { status: 500 }
        );
    }
}
