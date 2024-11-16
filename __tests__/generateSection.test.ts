// Mock declarations first
jest.mock('@/lib/errorHandling', () => ({
    ErrorHandler: {
        withRetry: jest.fn().mockImplementation(async (fn) => fn())
    }
}));

const mockAnthropicCreate = jest.fn();

jest.mock('@anthropic-ai/sdk', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        messages: {
            create: mockAnthropicCreate
        }
    }))
}));

import { generateSection } from '@/lib/memoGeneration';
import { SectionType, MemoContext } from '@/types';
import { ideePrompt } from '@/lib/prompts';
import { ErrorHandler } from '@/lib/errorHandling';
import Anthropic from '@anthropic-ai/sdk';

describe('generateSection', () => {
    const mockContext: MemoContext = {
        topic: 'test',
        objective: 'test',
        currentSections: [],
        ideaGroups: [],
        currentPartIndex: 0
    };

    // Add console.error mock
    const originalConsoleError = console.error;
    beforeAll(() => {
        jest.useFakeTimers();
        console.error = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockAnthropicCreate.mockClear();
        (console.error as jest.Mock).mockClear();
    });

    afterAll(() => {
        jest.useRealTimers();
        console.error = originalConsoleError;
    });

    test('should generate a valid section', async () => {
        mockAnthropicCreate.mockResolvedValueOnce({
            content: [{ text: '{"titre":"Test Title","contenu":"Test Content"}' }]
        });

        const result = await generateSection(
            'Test content',
            ideePrompt,
            SectionType.Idee,
            mockContext
        );

        expect(ErrorHandler.withRetry).toHaveBeenCalledTimes(1);
        expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
        expect(console.error).not.toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({
            type: SectionType.Idee,
            titre: 'Test Title',
            contenu: 'Test Content'
        }));
    }, 15000);

    test('should handle generation errors', async () => {
        const error = new Error('AI generation failed');
        mockAnthropicCreate.mockRejectedValueOnce(error);

        await expect(generateSection(
            'Test content',
            ideePrompt,
            SectionType.Idee,
            mockContext
        )).rejects.toThrow('AI generation failed');

        expect(ErrorHandler.withRetry).toHaveBeenCalledTimes(1);
        expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith(
            'Erreur lors de la génération de la section idee:',
            error
        );
    }, 15000);
}); 