import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function saveFeedback(content: string, userId?: string) {
    try {
        const feedbackData = {
            content,
            timestamp: new Date().toISOString(),
        };

        const feedbacksRef = collection(db, 'feedbacks');
        const docRef = await addDoc(feedbacksRef, feedbackData);
        return docRef.id;
    } catch (error) {
        console.error('Erreur détaillée lors de la sauvegarde du feedback:', error);
        throw error;
    }
}
