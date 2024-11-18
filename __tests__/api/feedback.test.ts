import { POST } from '@/app/api/feedback/route';
import { adminAuth } from '@/lib/firebase/admin';
import { saveFeedback } from '@/lib/firebase/feedback';

// Mock des dépendances
jest.mock('@/lib/firebase/admin', () => ({
    adminAuth: {
        verifySessionCookie: jest.fn()
    }
}));

jest.mock('@/lib/firebase/feedback', () => ({
    saveFeedback: jest.fn()
}));

describe('API Feedback', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('devrait retourner une erreur 400 si le feedback est vide', async () => {
        const request = new Request('http://localhost:3000/api/feedback', {
            method: 'POST',
            body: JSON.stringify({ feedback: '' })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Feedback invalide');
    });

    it('devrait sauvegarder le feedback avec memoRequest', async () => {
        const mockFeedback = 'Test feedback';
        const mockMemoRequest = 'Test memo request';
        (saveFeedback as jest.Mock).mockResolvedValue('test-feedback-id');

        const request = new Request('http://localhost:3000/api/feedback', {
            method: 'POST',
            body: JSON.stringify({
                feedback: mockFeedback,
                memoRequest: mockMemoRequest
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(saveFeedback).toHaveBeenCalledWith(mockFeedback, mockMemoRequest, undefined);
    });

    it('devrait sauvegarder le feedback avec userId et memoRequest', async () => {
        const mockUserId = 'test-user-id';
        const mockFeedback = 'Test feedback';
        const mockMemoRequest = 'Test memo request';

        (adminAuth.verifySessionCookie as jest.Mock).mockResolvedValue({ uid: mockUserId });
        (saveFeedback as jest.Mock).mockResolvedValue('test-feedback-id');

        const request = new Request('http://localhost:3000/api/feedback', {
            method: 'POST',
            body: JSON.stringify({
                feedback: mockFeedback,
                sessionId: 'valid-session-id',
                memoRequest: mockMemoRequest
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(saveFeedback).toHaveBeenCalledWith(mockFeedback, mockMemoRequest, mockUserId);
    });

    it('devrait gérer les erreurs de sauvegarde', async () => {
        (saveFeedback as jest.Mock).mockRejectedValue(new Error('Erreur de sauvegarde'));

        const request = new Request('http://localhost:3000/api/feedback', {
            method: 'POST',
            body: JSON.stringify({
                feedback: 'Test feedback',
                memoRequest: 'Test memo request'
            })
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Erreur lors de l\'enregistrement du feedback');
    });
});
