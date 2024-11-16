import { ideePrompt } from '@/lib/prompts';
import { MemoContext } from '@/types';

describe('Idee prompt tests', () => {
    // Tests avec différents contextes
    describe('Context handling', () => {
        test('should handle basic context', () => {
            const basicContext: MemoContext = {
                topic: "Leadership",
                objective: "Maîtriser le leadership situationnel",
                currentSections: [],
                ideaGroups: [],
                currentPartIndex: 0
            };

            const prompt = ideePrompt(basicContext);
            expect(prompt).toContain('Leadership');
            expect(prompt).toContain('Maîtriser le leadership situationnel');
        });

        test('should handle empty context', () => {
            const emptyContext: MemoContext = {
                topic: "",
                objective: "",
                currentSections: [],
                ideaGroups: [],
                currentPartIndex: 0
            };

            const prompt = ideePrompt(emptyContext);
            expect(prompt).toContain('Sujet:');
            expect(prompt).toContain('Objectif:');
        });
    });

    // Tests de structure du prompt
    describe('Prompt structure', () => {
        const basicContext: MemoContext = {
            topic: "Test",
            objective: "Test",
            currentSections: [],
            ideaGroups: [],
            currentPartIndex: 0
        };

        const prompt = ideePrompt(basicContext);

        test('should include role and task', () => {
            expect(prompt).toContain('Rôle: Philosophe pédagogique');
            expect(prompt).toContain('Tâche: Identifier le principe fondamental');
        });

        test('should include depth criteria', () => {
            expect(prompt).toContain('PARADOXE');
            expect(prompt).toContain('UNIVERSALITÉ');
            expect(prompt).toContain('TRANSFORMATION');
            expect(prompt).toContain('SIMPLICITÉ');
        });

        test('should include format instructions', () => {
            expect(prompt).toContain('Maximum 15 mots');
            expect(prompt).toContain('Formulation paradoxale');
            expect(prompt).toContain('aha moment');
        });
    });
}); 