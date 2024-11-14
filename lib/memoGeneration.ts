import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { MemoSection, SectionType, Memo } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import {
    objectifPrompt,
    accrochePrompt,
    ideePrompt,
    argumentPrompt,
    exemplePrompt,
    titrePrompt,
    resumePrompt,
    acquisPrompt,
    ouverturePrompt
} from '@/lib/prompts';
import { ErrorHandler } from '@/lib/errorHandling';
import { MemoContext } from '@/types';
import { AI_MODELS, MODEL_CONFIG, DEFAULT_MODEL } from '@/constants/ai';

// Service de génération de mémos utilisant OpenAI et Anthropic
// Gère la création de sections de mémo de manière séquentielle

// Initialisation des clients IA
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

// Fonction utilitaire pour réessayer les appels API en cas d'échec
const withRetry = async <T>(
    fn: () => Promise<T>,
    options: {
        maxRetries?: number,
        baseDelay?: number,
        context?: Record<string, unknown>,
        onRetry?: (attempt: number, error: Error) => void
    } = {}
): Promise<T> => {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        context = {},
        onRetry
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, attempt);
                onRetry?.(attempt, lastError);
                await new Promise(resolve => setTimeout(resolve, delay));
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
            const openAICompletion = await openai.chat.completions.create({
                model: AI_MODELS[modelType],
                messages: messages,
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

// Génère une section spécifique du mémo
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
            () => generateCompletion(messages),
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

// Génère un mémo complet avec toutes ses sections
export const generateMemo = async (
    content: string,
    onProgress?: (section: MemoSection) => void
): Promise<Memo> => {
    console.log('Starting memo generation for:', content);
    const sections: MemoSection[] = [];
    const context: MemoContext = {
        topic: content,
        objective: '',
        ideaGroups: [],
        currentSections: sections,
        currentPartIndex: 0
    };

    try {
        // Générer Objectif et Accroche en parallèle
        const [objectifSection, accrocheSection] = await Promise.all([
            generateSection(content, objectifPrompt, SectionType.Objectif, context),
            generateSection(content, accrochePrompt, SectionType.Accroche, context)
        ]);

        sections.push(objectifSection, accrocheSection);
        onProgress?.(objectifSection);
        onProgress?.(accrocheSection);
        context.objective = objectifSection.contenu;

        // Génération séquentielle des parties pour assurer la cohérence des titres
        for (let partIndex = 0; partIndex < 3; partIndex++) {
            context.currentPartIndex = partIndex;

            // Générer d'abord le titre pour avoir le contexte
            const titreSection = await generateSection(content, titrePrompt, SectionType.Titre, context);
            sections.push(titreSection);
            onProgress?.(titreSection);

            // Générer le reste des sections en parallèle
            const [ideeSection, argumentSection, exempleSection] = await Promise.all([
                generateSection(content, ideePrompt, SectionType.Idee, context),
                generateSection(content, argumentPrompt, SectionType.Argument, context),
                generateSection(content, exemplePrompt, SectionType.Exemple, context)
            ]);

            sections.push(ideeSection, argumentSection, exempleSection);
            onProgress?.(ideeSection);
            onProgress?.(argumentSection);
            onProgress?.(exempleSection);

            context.ideaGroups.push({
                mainIdea: ideeSection.contenu,
                followUpIdeas: []
            });
        }

        // Générer les sections finales
        const [resumeSection, acquisSection, ouvertureSection] = await Promise.all([
            generateSection(content, resumePrompt, SectionType.Resume, context),
            generateSection(content, acquisPrompt, SectionType.Acquis, context),
            generateSection(content, ouverturePrompt, SectionType.Ouverture, context)
        ]);

        sections.push(resumeSection, acquisSection, ouvertureSection);
        onProgress?.(resumeSection);
        onProgress?.(acquisSection);
        onProgress?.(ouvertureSection);

        return {
            sections,
            metadata: {
                createdAt: new Date().toISOString(),
                topic: content
            }
        };
    } catch (error) {
        console.error('Error in generateMemo:', error);
        throw ErrorHandler.handle(error as Error, { content });
    }
}; 