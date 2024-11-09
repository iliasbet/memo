import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { MemoSection, SectionType, Memo } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import {
    objectifPrompt,
    accrochePrompt,
    ideePrompt,
    followUpIdeaPrompt,
    argumentPrompt,
    exemplePrompt,
    transitionPrompt,
    resumePrompt,
    acquisPrompt,
    ouverturePrompt
} from '@/lib/prompts';
import { ErrorHandler } from '@/lib/errorHandling';
import { MemoContext } from '@/types';
import { AI_MODELS, MODEL_CONFIG, DEFAULT_MODEL } from '@/constants/ai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined');
}

if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not defined');
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
    })
    : null;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

const withRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
    let lastError: Error;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
            }
        }
    }

    throw lastError!;
};

// Définir les types pour les messages
type OpenAIMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

type AnthropicMessage = {
    role: 'user' | 'assistant';
    content: string;
}

const generateCompletion = async (
    messages: OpenAIMessage[],
    modelType = DEFAULT_MODEL
) => {
    const config = MODEL_CONFIG[modelType];

    switch (config.provider) {
        case 'openai':
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY is not defined');
            }
            const openAICompletion = await openai.chat.completions.create({
                model: AI_MODELS[modelType],
                messages: messages as OpenAIMessage[],
                temperature: config.temperature,
                max_tokens: config.max_tokens,
                stream: false
            });
            return openAICompletion.choices[0].message.content || '';

        case 'anthropic':
            if (!anthropic) {
                throw new Error('ANTHROPIC_API_KEY is not defined');
            }
            const anthropicMessages = messages.map(m => ({
                role: m.role === 'system' ? 'assistant' : m.role,
                content: m.content
            })) as AnthropicMessage[];

            const anthropicCompletion = await anthropic.messages.create({
                model: AI_MODELS[modelType],
                messages: anthropicMessages,
                temperature: config.temperature,
                max_tokens: config.max_tokens
            });
            return anthropicCompletion.content[0].text;

        default:
            throw new Error(`Provider non supporté: ${config.provider}`);
    }
};

export const generateSection = async (
    content: string,
    prompt: (context: MemoContext) => string,
    type: SectionType,
    context: MemoContext
): Promise<MemoSection> => {
    const color = MEMO_COLORS[type] || '#000000';

    try {
        const messages: OpenAIMessage[] = [
            { role: 'system', content: prompt(context) },
            { role: 'user', content }
        ];

        const completion = await ErrorHandler.withRetry(
            async () => generateCompletion(messages),
            {
                context: { type, content }
            }
        );

        return {
            type,
            contenu: completion,
            couleur: color
        };
    } catch (error) {
        throw await ErrorHandler.withRetry(
            () => Promise.reject(error),
            { context: { type, content } }
        );
    }
};

export const animateSection = async (
    section: MemoSection,
    onProgress: (section: MemoSection) => void,
    duration: number = 1500
): Promise<void> => {
    const startTime = Date.now();
    const content = section.contenu;

    return new Promise((resolve) => {
        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const charsToShow = Math.floor(content.length * easeProgress);

            onProgress({
                ...section,
                contenu: content.slice(0, charsToShow)
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                onProgress(section);
                resolve();
            }
        };

        requestAnimationFrame(animate);
    });
};

export const generateMemo = async (
    content: string,
    onProgress?: (section: MemoSection) => void
): Promise<Memo> => {
    const sections: MemoSection[] = [];
    const context: MemoContext = {
        topic: content,
        objective: '',
        ideaGroups: [],
        currentSections: sections,
        currentPartIndex: 0
    };

    try {
        // 1. Objectif (toujours en premier)
        const objectifSection = await generateSection(content, objectifPrompt, 'objectif', context);
        sections.push(objectifSection);
        if (onProgress) onProgress(objectifSection);
        context.objective = objectifSection.contenu;

        // 2. Accroche
        const accrocheSection = await generateSection(content, accrochePrompt, 'accroche', context);
        sections.push(accrocheSection);
        if (onProgress) onProgress(accrocheSection);

        // 3. Parties principales (3 itérations)
        for (let partIndex = 0; partIndex < 3; partIndex++) {
            context.currentPartIndex = partIndex;

            // Idée principale
            const ideeSection = await generateSection(content, ideePrompt, 'idee', context);
            sections.push(ideeSection);
            if (onProgress) onProgress(ideeSection);

            // Argument
            const argumentSection = await generateSection(content, argumentPrompt, 'argument', context);
            sections.push(argumentSection);
            if (onProgress) onProgress(argumentSection);

            // Exemple
            const exempleSection = await generateSection(content, exemplePrompt, 'exemple', context);
            sections.push(exempleSection);
            if (onProgress) onProgress(exempleSection);

            // Transition (sauf pour la dernière partie)
            if (partIndex < 2) {
                const transitionSection = await generateSection(content, transitionPrompt, 'transition', context);
                sections.push(transitionSection);
                if (onProgress) onProgress(transitionSection);
            }

            // Mise à jour du contexte
            context.ideaGroups.push({
                mainIdea: ideeSection.contenu,
                followUpIdeas: []
            });
        }

        // 4. Sections finales
        const resumeSection = await generateSection(content, resumePrompt, 'resume', context);
        sections.push(resumeSection);
        if (onProgress) onProgress(resumeSection);

        const acquisSection = await generateSection(content, acquisPrompt, 'acquis', context);
        sections.push(acquisSection);
        if (onProgress) onProgress(acquisSection);

        const ouvertureSection = await generateSection(content, ouverturePrompt, 'ouverture', context);
        sections.push(ouvertureSection);
        if (onProgress) onProgress(ouvertureSection);

        return {
            sections,
            metadata: {
                createdAt: new Date().toISOString(),
                topic: content
            }
        };
    } catch (error) {
        // Correction de l'erreur TypeScript
        ErrorHandler.withRetry(() => Promise.reject(error), {
            context: { content }
        });
        throw error; // Pour s'assurer que l'erreur est propagée
    }
}; 