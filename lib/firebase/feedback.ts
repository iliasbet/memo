import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function saveFeedback(content: string, memoRequest?: string, userId?: string, idMemo?: string) {
    try {
        // Construire les données du feedback avec idMemo
        const feedbackData = {
            content,
            memoRequest,
            idMemo: idMemo || 'unknown', // Valeur par défaut si idMemo est non défini
            timestamp: new Date().toISOString(),
            userId: userId || 'anonymous', // Valeur par défaut si userId est non défini
        };

        // Référence à la collection 'feedbacks'
        const feedbacksRef = collection(db, 'feedbacks');

        // Ajouter les données à Firestore
        const docRef = await addDoc(feedbacksRef, feedbackData);
        return docRef.id;
    } catch (error) {
        console.error('Erreur détaillée lors de la sauvegarde du feedback:', error);
        throw error;
    }
}
