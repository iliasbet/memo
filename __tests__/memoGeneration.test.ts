import { parseFormattedResponse, parseDuration, isValidAIResponse } from '@/lib/memoGeneration';
import { SectionType } from '@/types';
import { MemoError, ErrorCode } from '@/types/errors';

// Tests des fonctions utilitaires uniquement
describe('Utility Functions', () => {
    describe('parseFormattedResponse', () => {
        const validResponses = [
            {
                input: '{"contenu": "Test content"}',
                expected: { contenu: "Test content" }
            },
            {
                input: '```{"titre": "Test", "contenu": "Test content"}```',
                expected: { titre: "Test", contenu: "Test content" }
            },
            {
                input: '{"titre": "Test", "contenu": "Test content", "duree": "30 min"}',
                expected: {
                    titre: "Test",
                    contenu: "Test content",
                    duree: { value: 30, unit: "min" }
                }
            }
        ];

        test.each(validResponses)('should parse valid response: $input', ({ input, expected }) => {
            const result = parseFormattedResponse(input, SectionType.Idee);
            expect(result).toMatchObject(expected);
        });
    });

    describe('parseDuration', () => {
        test('should parse valid duration strings', () => {
            expect(parseDuration('30 minutes')).toEqual({ value: 30, unit: 'min' });
            expect(parseDuration('2 heures')).toEqual({ value: 2, unit: 'h' });
            expect(parseDuration('1 jour')).toEqual({ value: 1, unit: 'j' });
        });

        test('should return undefined for invalid duration strings', () => {
            expect(parseDuration('invalid')).toBeUndefined();
            expect(parseDuration('')).toBeUndefined();
            expect(parseDuration(undefined)).toBeUndefined();
        });
    });

    describe('isValidAIResponse', () => {
        test('should validate correct responses', () => {
            expect(isValidAIResponse({ contenu: 'Test content' })).toBe(true);
            expect(isValidAIResponse({
                titre: 'Test',
                contenu: 'Test content'
            })).toBe(true);
        });

        test('should reject invalid responses', () => {
            expect(isValidAIResponse(null)).toBe(false);
            expect(isValidAIResponse({})).toBe(false);
            expect(isValidAIResponse({ contenu: '' })).toBe(false);
            expect(isValidAIResponse({
                contenu: 'x'.repeat(401)
            })).toBe(false);
        });
    });
}); 