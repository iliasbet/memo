import OpenAI from 'openai';
import { saveMemoToDatabase } from './saveMemoDb';
import Anthropic from '@anthropic-ai/sdk';
import { MemoSection, SectionType, Memo, Duration, MemoContext } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import {
    objectifPrompt,
    accrochePrompt,
    conceptPrompt,
    histoirePrompt,
    techniquePrompt,
    atelierPrompt,
    sujetPrompt,
    // coverImagePrompt
} from '@/lib/prompts';
import { ErrorHandler } from '@/lib/errorHandling';
import { AI_MODELS, MODEL_CONFIG, DEFAULT_MODEL } from '@/constants/ai';
import { Logger, LogLevel } from '@/lib/logger';
import { MemoError, ErrorCode } from '@/types/errors';
import { encode } from 'base64-arraybuffer';
import { v4 as uuidv4 } from 'uuid';

// Types et interfaces
export interface AIResponse {
    titre?: string;
    contenu: string;
    duree?: string;
}

export interface ParsedResponse {
    titre?: string;
    contenu: string;
    duree?: Duration;
}

type OpenAIMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

type AnthropicMessage = {
    role: 'user' | 'assistant';
    content: string;
}

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

export const generateCompletion = async (
    messages: OpenAIMessage[],
    modelType: "GPT" | "CLAUDE" | undefined = DEFAULT_MODEL,
    options?: {
        maxRetries?: number;
        baseDelay?: number;
        context?: { type: string; content: string; }
    }
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
            return anthropicCompletion.content?.[0]?.text || '';

        default:
            throw new Error(`Provider non supporté: ${config.provider}`);
    }
};

// Fonctions utilitaires exportées
export const isValidAIResponse = (obj: any, type?: SectionType): obj is AIResponse => {
    // Validation de base
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.contenu !== 'string' || obj.contenu.length === 0) return false;
    if (obj.titre !== undefined && typeof obj.titre !== 'string') return false;
    if (obj.duree !== undefined && typeof obj.duree !== 'string') return false;

    // Commentons les validations de longueur pour ne pas bloquer
    /*
    const maxLengths: Record<string, number> = {
        [SectionType.Histoire]: 1000,
        [SectionType.Atelier]: 800,
        default: 400
    };

    const maxLength = type ? (maxLengths[type] || maxLengths.default) : maxLengths.default;

    if (obj.contenu.length > maxLength) return false;
    if (obj.titre && obj.titre.length > 50) return false;
    */

    return true;
};

export const parseDuration = (dureeStr?: string): Duration | undefined => {
    if (!dureeStr) return undefined;
    const value = parseInt(dureeStr);
    if (isNaN(value)) return undefined;

    if (dureeStr.includes('heure')) return { value, unit: 'h' };
    if (dureeStr.includes('minute')) return { value, unit: 'min' };
    if (dureeStr.includes('jour')) return { value, unit: 'j' };

    return { value, unit: 'min' };
};

export const parseFormattedResponse = (completion: string, type: SectionType): ParsedResponse => {
    try {
        Logger.log(LogLevel.INFO, `Début du parsing pour la section ${type}`, {
            completion,
            timestamp: new Date().toISOString()
        });

        // Nettoyage et extraction du JSON
        const cleanedCompletion = completion.trim();
        let jsonStr = cleanedCompletion;

        // Si le JSON est entouré de backticks ou quotes, on les retire
        if (cleanedCompletion.match(/^(`{3}|'{3}|"{3})/)) {
            jsonStr = cleanedCompletion.replace(/^(`{3}|'{3}|"{3})/, '').replace(/(`{3}|'{3}|"{3})$/, '');
        }

        // Essayer de trouver un objet JSON valide
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // Au lieu de throw, on retourne un objet par défaut
            return {
                contenu: completion.substring(0, 400), // Limite arbitraire pour éviter les contenus trop longs
                titre: undefined,
                duree: undefined
            };
        }

        let parsed: unknown;
        try {
            parsed = JSON.parse(jsonMatch[0]);
        } catch (e) {
            // En cas d'erreur de parsing, on retourne un objet par défaut
            return {
                contenu: completion.substring(0, 400),
                titre: undefined,
                duree: undefined
            };
        }

        // Validation plus souple
        if (!isValidAIResponse(parsed, type)) {
            // Au lieu de throw, on essaie de récupérer ce qu'on peut
            return {
                contenu: typeof parsed === 'object' && parsed !== null && 'contenu' in parsed
                    ? String(parsed.contenu).substring(0, 400)
                    : completion.substring(0, 400),
                titre: typeof parsed === 'object' && parsed !== null && 'titre' in parsed
                    ? String(parsed.titre)
                    : undefined,
                duree: undefined
            };
        }

        // Nettoyage du contenu multi-lignes si nécessaire
        if (parsed.contenu.split('\n').length > 1) {
            Logger.log(LogLevel.WARN, 'Contenu multi-lignes détecté, nettoyage...', {
                original: parsed.contenu
            });
            parsed.contenu = parsed.contenu.replace(/\n/g, ' ').trim();
        }

        return {
            titre: parsed.titre,
            contenu: parsed.contenu,
            duree: parsed.duree ? parseDuration(parsed.duree) : undefined
        };
    } catch (error) {
        // En cas d'erreur, on retourne un objet par défaut
        Logger.log(LogLevel.ERROR, 'Erreur lors du parsing', {
            error,
            type,
            completion,
            timestamp: new Date().toISOString()
        });

        return {
            contenu: completion.substring(0, 400),
            titre: undefined,
            duree: undefined
        };
    }
};

// Génère une section spécifique du mémo
export const generateSection = async (
    content: string,
    prompt: (context: MemoContext) => string,
    type: SectionType,
    context: MemoContext
): Promise<MemoSection> => {
    const color = MEMO_COLORS[type as keyof typeof MEMO_COLORS] || '#000000';

    try {
        const messages = [
            { role: 'system' as const, content: prompt(context) },
            { role: 'user' as const, content }
        ];

        const completion = await ErrorHandler.withRetry(
            () => generateCompletion(messages),
            {
                maxRetries: MAX_RETRIES,
                baseDelay: RETRY_DELAY,
                context: { type, content }
            }
        );

        const { titre, contenu, duree } = parseFormattedResponse(completion, type);

        return {
            type,
            titre,
            contenu,
            couleur: color,
            duree
        };
    } catch (error) {
        console.error(`Erreur lors de la génération de la section ${type}:`, error);
        throw error;
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
export const generateMemo = async (topic: string): Promise<Memo> => {
    try {
        const memoId = uuidv4();
        const context: MemoContext = {
            topic,
            objective: topic,
        };

        // Extraire d'abord le sujet raffiné
        const subjectSection = await generateSection(topic, sujetPrompt, SectionType.Sujet, context);
        let parsedSubject: string | undefined;

        try {
            // Parser la réponse JSON du sujet
            const subjectResponse = JSON.parse(subjectSection.contenu);
            parsedSubject = subjectResponse.sujet;
        } catch (error) {
            Logger.log(LogLevel.WARN, 'Erreur lors du parsing du sujet', {
                error,
                content: subjectSection.contenu
            });
            parsedSubject = undefined;
        }

        // Mettre à jour le contexte avec le sujet raffiné parsé
        const updatedContext: MemoContext = {
            ...context,
            subject: parsedSubject // Utiliser le sujet parsé
        };

        // Générer l'image et les sections en parallèle
        // Commentons la génération d'image
        // const coverImage = await generateImage(topic, updatedContext).catch(error => {
        //     Logger.log(LogLevel.ERROR, 'Error generating cover image', {
        //         error: error instanceof Error ? error.message : 'Unknown error',
        //         errorObject: error,
        //         topic,
        //         context: updatedContext
        //     });
        //     return undefined;
        // });
        const coverImage = undefined; // Forcer undefined pour l'instant

        const [objectifSection, accrocheSection, conceptSection, histoireSection, techniqueSection, atelierSection] = await Promise.all([
            generateSection(topic, objectifPrompt, SectionType.Objectif, updatedContext),
            generateSection(topic, accrochePrompt, SectionType.Accroche, updatedContext),
            generateSection(topic, conceptPrompt, SectionType.Concept, updatedContext),
            generateSection(topic, histoirePrompt, SectionType.Histoire, updatedContext),
            generateSection(topic, techniquePrompt, SectionType.Technique, updatedContext),
            generateSection(topic, atelierPrompt, SectionType.Atelier, updatedContext)
        ]);

        const sections = [
            objectifSection,
            accrocheSection,
            conceptSection,
            histoireSection,
            techniqueSection,
            atelierSection,
            {
                type: SectionType.Feedback,
                contenu: '',
                couleur: MEMO_COLORS.feedback
            }
        ].filter(Boolean);

        // Inclure le sujet raffiné dans la metadata
        const memo: Memo = {
            id: memoId,
            sections,
            metadata: {
                createdAt: new Date().toISOString(),
                topic,
                subject: parsedSubject, // Utiliser le sujet parsé
                coverImage
            }
        };

        const insertedId = await saveMemoToDatabase(memo);
        console.log(`Mémo enregistré avec l'ID : ${insertedId}`);

        return memo;
    } catch (error) {
        console.error('Erreur lors de la génération du mémo:', error);
        throw error;
    }
}; 