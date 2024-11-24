import OpenAI from 'openai';
import { Document, WithId } from 'mongodb';
import { MongoClient } from 'mongodb';
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
    exemplePrompt,
    memoPlanner as memoPlannerPrompt,
} from '@/lib/prompts';
import { ErrorHandler } from '@/lib/errorHandling';
import { AI_MODELS, MODEL_CONFIG, DEFAULT_MODEL } from '@/constants/ai';
import { Logger, LogLevel } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';

// Types et interfaces
export interface AIResponse {
    titre?: string;
    contenu: string;
    duree?: string;
}

export function convertToMemo(document: WithId<Document>): Memo {
    return {
        id: document.id,
        sections: document.sections,
        metadata: document.metadata,
    };
}

type OpenAIMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

type AnthropicMessage = {
    role: 'user' | 'assistant';
    content: string;
}

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
const RETRY_DELAY = 1000;

class AIService {
    constructor(private openai: OpenAI, private anthropic: Anthropic | null) { }

    async generateCompletion(
        messages: OpenAIMessage[],
        modelType: "GPT" | "CLAUDE" | undefined = DEFAULT_MODEL,
        options?: {
            maxRetries?: number;
            baseDelay?: number;
            context?: { type: string; content: string; }
        }
    ): Promise<string> {
        const config = MODEL_CONFIG[modelType];

        switch (config.provider) {
            case 'openai':
                const openAICompletion = await this.openai.chat.completions.create({
                    model: AI_MODELS[modelType],
                    messages: messages,
                    temperature: config.temperature,
                    max_tokens: config.max_tokens,
                    stream: false
                });
                return openAICompletion.choices[0].message.content || '';

            case 'anthropic':
                if (!this.anthropic) {
                    throw new Error('ANTHROPIC_API_KEY is not defined');
                }
                const anthropicMessages = messages.map(m => ({
                    role: m.role === 'system' ? 'assistant' : m.role,
                    content: m.content
                })) as AnthropicMessage[];

                const anthropicCompletion = await this.anthropic.messages.create({
                    model: AI_MODELS[modelType],
                    messages: anthropicMessages,
                    temperature: config.temperature,
                    max_tokens: config.max_tokens
                });
                return anthropicCompletion.content?.[0]?.text || '';

            default:
                throw new Error(`Provider non supporté: ${config.provider}`);
        }
    }
}

const aiService = new AIService(openai, anthropic);

export const generateCompletion = (
    messages: OpenAIMessage[],
    modelType: "GPT" | "CLAUDE" | undefined = DEFAULT_MODEL,
    options?: {
        maxRetries?: number;
        baseDelay?: number;
        context?: { type: string; content: string; }
    }
) => {
    return aiService.generateCompletion(messages, modelType, options);
};

// Fonctions utilitaires exportées
export const isValidAIResponse = (obj: any, type?: SectionType): obj is AIResponse => {
    // Validation de base
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.contenu !== 'string' || obj.contenu.length === 0) return false;
    if (obj.titre !== undefined && typeof obj.titre !== 'string') return false;
    if (obj.duree !== undefined && typeof obj.duree !== 'string') return false;
    return true;
};

export interface ParsedResponse {
    titre?: string;
    contenu: string;
    duree?: Duration;
}

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
    if (!completion) {
        return { contenu: '' };
    }

    try {
        // Nettoyer la réponse avant le parsing
        const cleanedCompletion = completion
            .trim()
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\\"/g, '"')
            .replace(/"{2,}/g, '"');  // Remplace les doubles guillemets consécutifs

        // S'assurer que la chaîne commence et finit par des accolades
        const jsonString = cleanedCompletion.startsWith('{') ? cleanedCompletion : `{${cleanedCompletion}}`;

        const parsed = JSON.parse(jsonString);

        // Vérification et nettoyage du contenu
        if (typeof parsed.contenu !== 'string') {
            throw new Error('Le contenu n\'est pas une chaîne de caractères');
        }

        const contenu = parsed.contenu.trim();
        const formattedContent = contenu
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_]+)__/g, '<em>$1</em>');

        return {
            contenu: formattedContent,
            titre: parsed?.titre?.trim() || undefined,
            duree: parsed?.duree ? parseDuration(parsed.duree) : undefined
        };
    } catch (error) {
        console.error('Erreur lors du parsing du contenu:', error);
        console.log('Réponse brute:', completion);
        // Fallback : retourner le texte brut nettoyé
        return {
            contenu: completion
                .trim()
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/__([^_]+)__/g, '<em>$1</em>')
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

// Ajouter après la classe AIService
class MemoPlanner {
    async createPlan(topic: string, context: MemoContext): Promise<any> {
        const planningMessages = [
            { role: 'system' as const, content: memoPlannerPrompt(context) },
            { role: 'user' as const, content: topic }
        ];
        const planCompletion = await generateCompletion(planningMessages);
        return JSON.parse(planCompletion);
    }
}

// Créer une instance unique du planificateur
const plannerInstance = new MemoPlanner();

// Génère un mémo complet avec toutes ses sections
export const generateMemo = async (topic: string): Promise<Memo> => {
    try {
        const uri = process.env.MONGODB_URI || "mongodb+srv://joshua87000:Joshua87@gene.uxnovlm.mongodb.net/Memo?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        const db = client.db('Memo'); // Nom de la base de données
        const collection = db.collection('MemoCreated'); // Nom de la collection

        // Étape 1 : Vérifier si un mémo existe déjà pour cet ID (où id == topic)
        const existingMemo = await collection.findOne({ id: topic });

        if (existingMemo) {
            console.log(`Mémo existant trouvé pour l'ID : ${topic}`);
            return convertToMemo(existingMemo);
        }

        // Étape 2 : Si aucun mémo existant, générer un nouveau mémo
        console.log(`Aucun mémo trouvé pour l'ID : ${topic}, génération d'un nouveau mémo...`);

        const memoId = uuidv4();
        const baseContext: MemoContext = {
            topic,
            objective: topic
        };

        // 1. Obtenir le sujet raffiné
        const subjectSection = await generateSection(topic, sujetPrompt, SectionType.Sujet, baseContext);
        const parsedSubject = parseSubject(subjectSection.contenu);

        // 2. Générer le plan du mémo
        const memoPlan = await plannerInstance.createPlan(topic, baseContext);

        // 3. Générer toutes les sections en parallèle avec le contexte enrichi
        const enrichedContext = {
            ...baseContext,
            subject: parsedSubject,
            plan: memoPlan.progression
        };

        const [
            objectifSection,
            accrocheSection,
            histoireSection,
            ...conceptSections
        ] = await Promise.all([
            generateSection(topic, objectifPrompt, SectionType.Objectif, {
                ...enrichedContext
            }),
            generateSection(topic, accrochePrompt, SectionType.Accroche, {
                ...enrichedContext,
                accrocheAngle: memoPlan.progression.accroche
            }),
            generateSection(topic, histoirePrompt, SectionType.Histoire, {
                ...enrichedContext,
                histoireType: memoPlan.progression.histoire
            }),
            ...memoPlan.progression.concepts.flatMap((concept: any, index: number) => [
                generateSection(topic, conceptPrompt, SectionType.Concept, {
                    ...enrichedContext,
                    conceptFocus: concept.focus,
                    conceptIndex: index + 1,
                    totalConcepts: memoPlan.progression.concepts.length
                }),
                generateSection(topic, exemplePrompt, SectionType.Exemple, {
                    ...enrichedContext,
                    exempleFocus: concept.exemple,
                    conceptIndex: index + 1
                })
            ])
        ]);

        // Générer la technique et l'atelier après les concepts
        const [techniqueSection, atelierSection] = await Promise.all([
            generateSection(topic, techniquePrompt, SectionType.Technique, {
                ...enrichedContext,
                techniqueApproche: memoPlan.progression.technique
            }),
            generateSection(topic, atelierPrompt, SectionType.Atelier, {
                ...enrichedContext,
                atelierType: memoPlan.progression.atelier
            })
        ]);

        // Assembler les sections dans un ordre optimal
        const sections = [
            objectifSection,
            accrocheSection,
            histoireSection,
            ...conceptSections,
            techniqueSection,
            atelierSection,
            {
                type: SectionType.Feedback,
                contenu: '',
                couleur: MEMO_COLORS.feedback,
            },
        ].filter(Boolean);

        // Création du mémo
        const memo: Memo = {
            id: memoId,
            sections,
            metadata: {
                createdAt: new Date().toISOString(),
                topic,
                subject: parsedSubject,
            },
        };

        // Sauvegarder le mémo dans la base
        const insertedId = await saveMemoToDatabase(memo);
        console.log(`Nouveau mémo enregistré avec l'ID : ${insertedId}`);

        return memo;
    } catch (error) {
        console.error('Erreur lors de la génération du mémo:', error);
        throw error;
    }
};

const parseSubject = (content: string): string => {
    try {
        const parsed = JSON.parse(content);
        return parsed.sujet || content;
    } catch (error) {
        console.error('Erreur lors du parsing du sujet:', error);
        return content;
    }
};
