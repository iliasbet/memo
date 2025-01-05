import { OpenAI } from 'openai';
import { logger, termcolor } from './logger';
import {
    memoPlanner,
    objectifPrompt,
    accrochePrompt,
    techniquePrompt,
    histoirePrompt,
    atelierPrompt
} from './prompts/index';
import { MemoSection, SectionType, Memo, MemoContext } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import { OpenAIError, ValidationError } from '@/types/errors';

const OPENAI_MODEL = 'gpt-4o-mini' as const;
const MAX_CONTENT_LENGTH = 220;
const TEMPERATURE = 0.7;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface AIResponse {
    titre?: string;
    contenu: string;
}

/**
 * Parses and validates AI response, ensuring content length constraints
 */
function parseAIResponse(response: string): AIResponse {
    try {
        if (response.includes('{') && response.includes('}')) {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                const content = parsed.contenu || parsed.content || '';
                return {
                    titre: parsed.titre,
                    contenu: truncateContent(content)
                };
            }
        }
        return { contenu: truncateContent(response.trim()) };
    } catch (error) {
        logger.warn('Failed to parse AI response as JSON, using raw text', { response });
        return { contenu: truncateContent(response.trim()) };
    }
}

/**
 * Truncates content to maximum allowed length
 */
function truncateContent(content: string): string {
    if (content.length > MAX_CONTENT_LENGTH) {
        logger.warn('Content exceeds maximum length, truncating...', { length: content.length });
        return content.substring(0, MAX_CONTENT_LENGTH).trim();
    }
    return content;
}

/**
 * Makes an OpenAI API call with error handling
 */
async function makeAICall(systemPrompt: string, userContent: string): Promise<string> {
    try {
        const response = await openai.chat.completions.create({
            model: OPENAI_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userContent }
            ],
            temperature: TEMPERATURE
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new ValidationError('No content generated from AI');
        }
        return content;
    } catch (error) {
        logger.error('AI call failed:', error);
        throw new OpenAIError('Failed to generate content', { originalError: error });
    }
}

/**
 * Generates a complete memo based on the provided content
 */
export async function generateMemo(content: string): Promise<Memo> {
    try {
        logger.info('Starting memo generation');

        // Generate objective
        termcolor.blue('🎯 Generating objective...');
        const objective = await generateObjective(content);
        termcolor.green('✓ Objective generated');

        // Generate plan
        termcolor.blue('📋 Planning memo structure...');
        const context: MemoContext = { topic: content, objective };
        const plan = await generatePlan(context);
        termcolor.green('✓ Memo plan generated');

        // Generate sections
        termcolor.blue('📝 Generating sections...');
        const sections = await generateSections(context, plan);
        termcolor.green('✓ All sections generated');

        return createMemoStructure(content, sections);
    } catch (error) {
        logger.error('Error generating memo:', error);
        throw error instanceof OpenAIError ? error : new OpenAIError('Failed to generate memo', { originalError: error });
    }
}

async function generateObjective(content: string): Promise<string> {
    const context: MemoContext = { topic: content, objective: '' };
    const response = await makeAICall(objectifPrompt(context), content);
    return parseAIResponse(response).contenu;
}

async function generatePlan(context: MemoContext): Promise<any> {
    const planText = await makeAICall(memoPlanner(context), context.topic);
    try {
        return JSON.parse(planText);
    } catch (error) {
        throw new ValidationError('Invalid plan format', { planText });
    }
}

async function generateSections(context: MemoContext, plan: any): Promise<MemoSection[]> {
    const sections: MemoSection[] = [];

    // Add objective section
    sections.push({
        type: SectionType.Objectif,
        contenu: context.objective,
        couleur: MEMO_COLORS.objectif
    });

    // Generate accroche
    const accroche = await makeAICall(accrochePrompt(context), context.topic);
    sections.push({
        type: SectionType.Accroche,
        contenu: parseAIResponse(accroche).contenu,
        couleur: MEMO_COLORS.accroche
    });

    // Generate histoire
    termcolor.blue('📖 Generating histoire...');
    const histoire = await makeAICall(histoirePrompt({
        ...context,
        histoireType: plan.progression.histoire.type,
        accrocheAngle: plan.progression.accroche.angle
    }), context.topic);
    sections.push({
        type: SectionType.Histoire,
        titre: plan.progression.histoire.type,
        contenu: parseAIResponse(histoire).contenu,
        couleur: MEMO_COLORS.histoire
    });

    // Generate concepts
    termcolor.blue('💡 Generating concepts...');
    for (const [index, concept] of plan.progression.concepts.entries()) {
        const conceptContent = await makeAICall(
            `${concept.focus}\n\nGenerate a concept explanation.`,
            context.topic
        );
        sections.push({
            type: SectionType.Concept,
            titre: concept.titre,
            contenu: parseAIResponse(conceptContent).contenu,
            couleur: MEMO_COLORS.concept
        });
    }

    // Generate technique
    termcolor.blue('🛠️ Generating technique...');
    const technique = await makeAICall(techniquePrompt({
        ...context,
        techniqueApproche: plan.progression.technique.approche
    }), context.topic);
    sections.push({
        type: SectionType.Technique,
        titre: plan.progression.technique.titre,
        contenu: parseAIResponse(technique).contenu,
        couleur: MEMO_COLORS.technique
    });

    // Generate atelier
    termcolor.blue('🎨 Generating atelier...');
    const atelier = await makeAICall(atelierPrompt({
        ...context,
        atelierType: plan.progression.atelier.type
    }), context.topic);
    sections.push({
        type: SectionType.Atelier,
        titre: plan.progression.atelier.titre,
        contenu: parseAIResponse(atelier).contenu,
        couleur: MEMO_COLORS.atelier,
        duree: parseDuration(plan.progression.atelier.durée)
    });

    return sections;
}

function createMemoStructure(content: string, sections: MemoSection[]): Memo {
    return {
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
}

function parseDuration(durationStr: string): { value: number; unit: 'min' | 'h' | 'j' } | undefined {
    try {
        const match = durationStr.match(/(\d+)\s*(min|h|j)/i);
        if (!match) return undefined;

        const [, valueStr, unit] = match;
        const value = parseInt(valueStr, 10);

        return isNaN(value) ? undefined : {
            value,
            unit: unit.toLowerCase() as 'min' | 'h' | 'j'
        };
    } catch {
        return undefined;
    }
}