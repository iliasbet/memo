import OpenAI from 'openai';
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

const openai = new OpenAI();

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

export const generateSection = async (
    content: string,
    prompt: (context: MemoContext) => string,
    type: SectionType,
    context: MemoContext
): Promise<MemoSection> => {
    const color = MEMO_COLORS[type] || '#000000';

    try {
        const completion = await withRetry(() => openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: prompt(context) },
                { role: "user", content }
            ],
            temperature: 0.7,
            max_tokens: 100,
            stream: false
        }));

        const generatedContent = completion.choices[0].message.content || '';

        return {
            type,
            contenu: generatedContent,
            couleur: color
        };
    } catch (error) {
        ErrorHandler.handle(error, { type, content });
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

    // Générer l'objectif et l'accroche
    const objectifSection = await generateSection(content, objectifPrompt, 'objectif', context);
    sections.push(objectifSection);
    context.objective = objectifSection.contenu;

    const accrocheSection = await generateSection(content, accrochePrompt, 'accroche', context);
    sections.push(accrocheSection);

    // Générer les 3 parties principales avec leurs idées
    for (let partIndex = 0; partIndex < 3; partIndex++) {
        context.currentPartIndex = partIndex;

        // Générer l'idée principale
        const mainIdea = await generateSection(content, ideePrompt, 'idee', context);
        sections.push(mainIdea);

        // Décider aléatoirement si on ajoute des idées de suivi (0-2 idées)
        const followUpCount = Math.floor(Math.random() * 3);
        const followUpIdeas = [];

        for (let i = 0; i < followUpCount; i++) {
            const followUp = await generateSection(content, followUpIdeaPrompt, 'idee', context);
            sections.push(followUp);
            followUpIdeas.push(followUp.contenu);
        }

        // Ajouter le groupe d'idées au contexte
        context.ideaGroups.push({
            mainIdea: mainIdea.contenu,
            followUpIdeas: followUpIdeas
        });

        // Générer argument et exemple
        sections.push(await generateSection(content, argumentPrompt, 'argument', context));
        sections.push(await generateSection(content, exemplePrompt, 'exemple', context));

        // Ajouter une transition si ce n'est pas la dernière partie
        if (partIndex < 2) {
            sections.push(await generateSection(content, transitionPrompt, 'transition', context));
        }

        if (onProgress) {
            sections.forEach(section => onProgress(section));
        }
    }

    // Générer la conclusion
    sections.push(await generateSection(content, resumePrompt, 'resume', context));
    sections.push(await generateSection(content, acquisPrompt, 'acquis', context));
    sections.push(await generateSection(content, ouverturePrompt, 'ouverture', context));

    return {
        sections,
        metadata: {
            createdAt: new Date().toISOString(),
            topic: content
        }
    };
}; 