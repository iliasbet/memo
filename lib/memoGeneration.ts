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
import { createOpenAIError, createValidationError } from '@/types/errors';

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
        const jsonMatch = response.match(/\{[\s\S]*\}/)?.[0];
        const parsed = jsonMatch ? JSON.parse(jsonMatch) : {};
        return {
            titre: parsed.titre,
            contenu: truncateContent(parsed.contenu ?? parsed.content ?? response.trim())
        };
    } catch {
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
            throw createValidationError('No content generated from AI');
        }
        return content;
    } catch (error) {
        logger.error('AI call failed:', error);
        throw createOpenAIError('Failed to generate content', { originalError: error });
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
        throw error instanceof Error && 'code' in error ? error : createOpenAIError('Failed to generate memo', { originalError: error });
    }
}

async function generateObjective(content: string): Promise<string> {
    const context: MemoContext = { topic: content, objective: '' };
    const response = await makeAICall(objectifPrompt(context), content);
    return parseAIResponse(response).contenu;
}

interface BaseProgressionItem {
    type: string;
    titre: string;
}

interface ProgressionItem extends BaseProgressionItem {
    focus?: string;
    angle?: string;
    approche?: string;
    durée?: string;
}

interface ConceptItem extends BaseProgressionItem {
    focus: string;
}

interface MemoPlan {
    progression: {
        histoire: ProgressionItem;
        accroche: ProgressionItem;
        concepts: ConceptItem[];
        technique: ProgressionItem;
        atelier: ProgressionItem & { durée: string };
    };
}

interface SectionGenerator {
    type: SectionType;
    color: string;
    generate: (context: MemoContext, plan: MemoPlan) => Promise<Omit<MemoSection, 'type' | 'couleur'>>;
}

const sectionGenerators: SectionGenerator[] = [
    {
        type: SectionType.Objectif,
        color: MEMO_COLORS.objectif,
        generate: async (context) => ({
            contenu: context.objective
        })
    },
    {
        type: SectionType.Accroche,
        color: MEMO_COLORS.accroche,
        generate: async (context) => {
            const response = await makeAICall(accrochePrompt(context), context.topic);
            return { contenu: parseAIResponse(response).contenu };
        }
    },
    {
        type: SectionType.Histoire,
        color: MEMO_COLORS.histoire,
        generate: async (context, plan) => {
            termcolor.blue('📖 Generating histoire...');
            const response = await makeAICall(histoirePrompt({
                ...context,
                histoireType: plan.progression.histoire.type,
                accrocheAngle: plan.progression.accroche.angle
            }), context.topic);
            const parsed = parseAIResponse(response);
            return {
                titre: plan.progression.histoire.type,
                contenu: parsed.contenu
            };
        }
    },
    {
        type: SectionType.Concept,
        color: MEMO_COLORS.concept,
        generate: async (context, plan) => {
            termcolor.blue('💡 Generating concepts...');
            const sections: Omit<MemoSection, 'type' | 'couleur'>[] = [];
            
            for (const concept of plan.progression.concepts) {
                const conceptContent = await makeAICall(
                    `${concept.focus}\n\nGenerate a concept explanation.`,
                    context.topic
                );
                sections.push({
                    titre: concept.titre,
                    contenu: parseAIResponse(conceptContent).contenu
                });
            }
            
            return sections[0]; // Return first concept, others will be added separately
        }
    },
    {
        type: SectionType.Technique,
        color: MEMO_COLORS.technique,
        generate: async (context, plan) => {
            termcolor.blue('🛠️ Generating technique...');
            const response = await makeAICall(techniquePrompt({
                ...context,
                techniqueApproche: plan.progression.technique.approche
            }), context.topic);
            const parsed = parseAIResponse(response);
            return {
                titre: plan.progression.technique.titre,
                contenu: parsed.contenu
            };
        }
    },
    {
        type: SectionType.Atelier,
        color: MEMO_COLORS.atelier,
        generate: async (context, plan) => {
            termcolor.blue('🎨 Generating atelier...');
            const response = await makeAICall(atelierPrompt({
                ...context,
                atelierType: plan.progression.atelier.type
            }), context.topic);
            const parsed = parseAIResponse(response);
            return {
                titre: plan.progression.atelier.titre,
                contenu: parsed.contenu,
                duree: parseDuration(plan.progression.atelier.durée)
            };
        }
    }
];

function validatePlan(plan: unknown): asserts plan is MemoPlan {
    if (!plan || typeof plan !== 'object') {
        throw createValidationError('Invalid plan structure');
    }
    
    const p = plan as any;
    if (!p.progression) {
        throw createValidationError('Missing progression in plan');
    }

    // Validate required sections
    const sections = ['histoire', 'accroche', 'concepts', 'technique', 'atelier'] as const;
    for (const section of sections) {
        if (!p.progression[section]) {
            throw createValidationError(`Missing ${section} section in plan`);
        }
    }

    // Validate concepts array
    if (!Array.isArray(p.progression.concepts)) {
        throw createValidationError('Concepts must be an array');
    }

    // Validate each concept has required fields
    for (const concept of p.progression.concepts) {
        if (!concept.focus || typeof concept.focus !== 'string') {
            throw createValidationError('Each concept must have a focus string');
        }
        if (!concept.titre || typeof concept.titre !== 'string') {
            throw createValidationError('Each concept must have a titre string');
        }
        if (!concept.type || typeof concept.type !== 'string') {
            throw createValidationError('Each concept must have a type string');
        }
    }

    // Validate required fields in other sections
    for (const section of sections) {
        const item = p.progression[section];
        if (!item.titre || typeof item.titre !== 'string') {
            throw createValidationError(`Missing titre in ${section} section`);
        }
        if (!item.type || typeof item.type !== 'string') {
            throw createValidationError(`Missing type in ${section} section`);
        }
    }

    // Validate atelier duration
    if (!p.progression.atelier.durée || typeof p.progression.atelier.durée !== 'string') {
        throw createValidationError('Missing durée in atelier section');
    }
}

async function generatePlan(context: MemoContext): Promise<MemoPlan> {
    const planText = await makeAICall(memoPlanner(context), context.topic);
    try {
        const plan = JSON.parse(planText);
        validatePlan(plan);
        return plan;
    } catch (error) {
        throw createValidationError('Invalid plan format', { planText, error });
    }
}

async function generateSections(context: MemoContext, plan: MemoPlan): Promise<MemoSection[]> {
    const sections: MemoSection[] = [];

    // Generate all sections
    for (const generator of sectionGenerators) {
        const sectionData = await generator.generate(context, plan);
        sections.push({
            type: generator.type,
            couleur: generator.color,
            ...sectionData
        });

        // Handle additional concepts after the first one
        if (generator.type === SectionType.Concept && plan.progression.concepts.length > 1) {
            for (let i = 1; i < plan.progression.concepts.length; i++) {
                const concept = plan.progression.concepts[i];
                const conceptContent = await makeAICall(
                    `${concept.focus}\n\nGenerate a concept explanation.`,
                    context.topic
                );
                sections.push({
                    type: SectionType.Concept,
                    titre: concept.titre,
                    contenu: parseAIResponse(conceptContent).contenu,
                    couleur: generator.color
                });
            }
        }
    }

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
    const match = durationStr.match(/^(\d+)\s*(min|h|j)$/i);
    if (!match) return undefined;

    const value = parseInt(match[1], 10);
    if (isNaN(value)) return undefined;

    return {
        value,
        unit: match[2].toLowerCase() as 'min' | 'h' | 'j'
    };
}