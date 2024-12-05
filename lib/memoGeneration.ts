import { OpenAI } from 'openai';
import { logger } from './logger';
import { memoPlanner, objectifPrompt, accrochePrompt, techniquePrompt, histoirePrompt, atelierPrompt } from './prompts';
import { MemoSection, SectionType, Memo, MemoContext } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import { OpenAIError, ValidationError } from '@/types/errors';
import { termcolor } from './logger';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to parse AI responses
function parseAIResponse(response: string): { titre?: string; contenu: string } {
    try {
        // First try to parse as JSON
        if (response.includes('{') && response.includes('}')) {
            // Extract JSON part if it's wrapped in backticks or other text
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.contenu && parsed.contenu.length > 220) {
                    logger.warn('Concept content exceeds 220 characters, truncating...', { length: parsed.contenu.length });
                    parsed.contenu = parsed.contenu.substring(0, 220).trim();
                }
                return {
                    titre: parsed.titre,
                    contenu: parsed.contenu || parsed.content || ''
                };
            }
        }

        // If not JSON or parsing fails, return the raw content
        const content = response.trim();
        if (content.length > 220) {
            logger.warn('Raw content exceeds 220 characters, truncating...', { length: content.length });
            return {
                contenu: content.substring(0, 220).trim()
            };
        }
        return {
            contenu: content
        };
    } catch (error) {
        logger.warn('Failed to parse AI response as JSON, using raw text', { response });
        const content = response.trim();
        if (content.length > 220) {
            return {
                contenu: content.substring(0, 220).trim()
            };
        }
        return {
            contenu: content
        };
    }
}

export async function generateMemo(content: string): Promise<Memo> {
    try {
        logger.info('Starting memo generation');
        termcolor.blue('🎯 Generating objective...');

        // 1. Generate objective
        const objective = await generateObjective(content);
        termcolor.green('✓ Objective generated');

        // 2. Generate plan using memo planner
        termcolor.blue('📋 Planning memo structure...');
        const context: MemoContext = {
            topic: content,
            objective
        };

        const plan = await generatePlan(context);
        termcolor.green('✓ Memo plan generated');

        // 3. Generate sections based on the plan
        termcolor.blue('📝 Generating sections...');
        const sections: MemoSection[] = [];

        // Add objective section
        sections.push({
            type: SectionType.Objectif,
            contenu: objective,
            couleur: MEMO_COLORS.objectif
        });

        // Generate accroche
        const accroche = await generateAccroche(context);
        sections.push({
            type: SectionType.Accroche,
            contenu: accroche,
            couleur: MEMO_COLORS.accroche
        });

        // Generate histoire
        termcolor.blue('📖 Generating histoire...');
        const histoire = await generateHistoire({
            ...context,
            histoireType: plan.progression.histoire.type,
            accrocheAngle: plan.progression.accroche.angle
        });
        sections.push({
            type: SectionType.Histoire,
            titre: plan.progression.histoire.type,
            contenu: histoire,
            couleur: MEMO_COLORS.histoire
        });

        // Generate concepts
        termcolor.blue('💡 Generating concepts...');
        for (const [index, concept] of plan.progression.concepts.entries()) {
            const conceptContent = await generateConcept({
                ...context,
                conceptIndex: index + 1,
                totalConcepts: plan.progression.concepts.length,
                conceptFocus: concept.focus
            });
            sections.push({
                type: SectionType.Concept,
                titre: concept.titre,
                contenu: conceptContent,
                couleur: MEMO_COLORS.concept
            });
        }

        // Generate technique
        termcolor.blue('🛠️ Generating technique...');
        const technique = await generateTechnique({
            ...context,
            techniqueApproche: plan.progression.technique.approche
        });
        sections.push({
            type: SectionType.Technique,
            titre: plan.progression.technique.titre,
            contenu: technique,
            couleur: MEMO_COLORS.technique
        });

        // Generate atelier
        termcolor.blue('🎨 Generating atelier...');
        const atelier = await generateAtelier({
            ...context,
            atelierType: plan.progression.atelier.type
        });
        sections.push({
            type: SectionType.Atelier,
            titre: plan.progression.atelier.titre,
            contenu: atelier,
            couleur: MEMO_COLORS.atelier,
            duree: parseDuration(plan.progression.atelier.durée)
        });

        termcolor.green('✓ All sections generated');

        // 4. Create the final memo structure
        const memo: Memo = {
            id: `memo-${Date.now()}`,
            user_id: 'anonymous',
            content,
            book_id: 'default',
            created_at: new Date().toISOString(),
            sections,
            metadata: {
                topic: content,
                subject: undefined,
            }
        };

        return memo;
    } catch (error) {
        logger.error('Error generating memo:', error);
        if (error instanceof OpenAIError) {
            throw error;
        }
        throw new OpenAIError('Failed to generate memo', { originalError: error });
    }
}

async function generateObjective(content: string): Promise<string> {
    try {
        const context: MemoContext = {
            topic: content,
            objective: ''
        };

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: objectifPrompt(context) },
                { role: 'user', content }
            ],
            temperature: 0.7
        });

        const objective = response.choices[0]?.message?.content;
        if (!objective) {
            throw new ValidationError('No objective generated');
        }

        const parsed = parseAIResponse(objective);
        return parsed.contenu;
    } catch (error) {
        logger.error('Error generating objective:', error);
        throw new OpenAIError('Failed to generate objective', { originalError: error });
    }
}

async function generatePlan(context: MemoContext): Promise<any> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: memoPlanner(context) },
                { role: 'user', content: context.topic }
            ],
            temperature: 0.7
        });

        const planText = response.choices[0]?.message?.content;
        if (!planText) {
            throw new ValidationError('No plan generated');
        }

        try {
            return JSON.parse(planText);
        } catch (error) {
            throw new ValidationError('Invalid plan format', { planText });
        }
    } catch (error) {
        logger.error('Error generating plan:', error);
        throw new OpenAIError('Failed to generate plan', { originalError: error });
    }
}

async function generateAccroche(context: MemoContext): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: accrochePrompt(context) },
                { role: 'user', content: context.topic }
            ],
            temperature: 0.7
        });

        const accroche = response.choices[0]?.message?.content;
        if (!accroche) {
            throw new ValidationError('No accroche generated');
        }

        const parsed = parseAIResponse(accroche);
        return parsed.contenu;
    } catch (error) {
        logger.error('Error generating accroche:', error);
        throw new OpenAIError('Failed to generate accroche', { originalError: error });
    }
}

async function generateHistoire(context: MemoContext): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: histoirePrompt(context) },
                { role: 'user', content: context.topic }
            ],
            temperature: 0.7
        });

        const histoire = response.choices[0]?.message?.content;
        if (!histoire) {
            throw new ValidationError('No histoire generated');
        }

        const parsed = parseAIResponse(histoire);
        return parsed.contenu;
    } catch (error) {
        logger.error('Error generating histoire:', error);
        throw new OpenAIError('Failed to generate histoire', { originalError: error });
    }
}

async function generateConcept(context: MemoContext): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: `${context.conceptFocus}\n\nGenerate a concept explanation.` },
                { role: 'user', content: context.topic }
            ],
            temperature: 0.7
        });

        const concept = response.choices[0]?.message?.content;
        if (!concept) {
            throw new ValidationError('No concept generated');
        }

        const parsed = parseAIResponse(concept);
        return parsed.contenu;
    } catch (error) {
        logger.error('Error generating concept:', error);
        throw new OpenAIError('Failed to generate concept', { originalError: error });
    }
}

async function generateTechnique(context: MemoContext): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: techniquePrompt(context) },
                { role: 'user', content: context.topic }
            ],
            temperature: 0.7
        });

        const technique = response.choices[0]?.message?.content;
        if (!technique) {
            throw new ValidationError('No technique generated');
        }

        const parsed = parseAIResponse(technique);
        return parsed.contenu;
    } catch (error) {
        logger.error('Error generating technique:', error);
        throw new OpenAIError('Failed to generate technique', { originalError: error });
    }
}

async function generateAtelier(context: MemoContext): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: atelierPrompt(context) },
                { role: 'user', content: context.topic }
            ],
            temperature: 0.7
        });

        const atelier = response.choices[0]?.message?.content;
        if (!atelier) {
            throw new ValidationError('No atelier generated');
        }

        const parsed = parseAIResponse(atelier);
        return parsed.contenu;
    } catch (error) {
        logger.error('Error generating atelier:', error);
        throw new OpenAIError('Failed to generate atelier', { originalError: error });
    }
}

function parseDuration(durationStr: string): { value: number; unit: 'min' | 'h' | 'j' } | undefined {
    try {
        const match = durationStr.match(/(\d+)\s*(min|h|j)/i);
        if (!match) return undefined;

        const [, valueStr, unit] = match;
        const value = parseInt(valueStr, 10);

        if (isNaN(value)) return undefined;

        return {
            value,
            unit: unit.toLowerCase() as 'min' | 'h' | 'j'
        };
    } catch {
        return undefined;
    }
}