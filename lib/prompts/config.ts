import { MemoContext } from '@/types';

// Response format configuration
export const createResponseFormat = (fields: string[]) => `FORMAT DE RÉPONSE:
Un objet JSON valide contenant les champs suivants:
{
  ${fields.map(field => `"${field}": "[${field}]"`).join(',\n  ')}
}`;

export const STANDARD_RESPONSE_FORMAT = {
    BASIC: createResponseFormat(['contenu']),
    WITH_TITLE: createResponseFormat(['titre', 'contenu']),
    WITH_DURATION: createResponseFormat(['titre', 'duree', 'contenu']),
    WITH_SUBJECT: createResponseFormat(['sujet'])
} as const;

// Base system prompt that all other prompts extend
export const BASE_SYSTEM_PROMPT = `Tu es un expert en pédagogie, comme Richard Feynman.

RÈGLES ABSOLUES ET NON NÉGOCIABLES :
1. PAS D'ÉNUMÉRATION NI DE LISTES
2. RÉPONDRE UNIQUEMENT AVEC UN OBJET JSON VALIDE

CONTRAINTES:
- Répondre avec uniquement l'objet JSON valide
- Pas de commentaires ou texte additionnel
- **La réponse doit être un objet JSON valide avec des clés et des valeurs correctement formatées.**

SYNTAXE:
- Utiliser des mots aux lettres courantes: e / a / s / i / t / n / u
- Utiliser des mots de 4 à 8 lettres`;

// Story structure configuration
export const STORY_STRUCTURE = {
    ACTS: 3,
    MAX_CHARS: 400,
    STRUCTURE: {
        SETUP: "Présentation et incident déclencheur",
        CONFRONTATION: "Obstacles et évolution",
        RESOLUTION: "Climax et conclusion"
    },
    REQUIREMENTS: {
        SETUP: "Personnage + Défi",
        CONFRONTATION: "Lutte + Évolution",
        RESOLUTION: "Solution + Apprentissage"
    }
} as const;

// Content length constraints
export const CONTENT_CONSTRAINTS = {
    MAX_OBJECTIVE_LENGTH: 15, // words
    MAX_ACCROCHE_LENGTH: 50, // characters
    MAX_CONCEPT_LENGTH: 220, // characters
    MAX_TITLE_LENGTH: 4 // words
} as const;

// Types for prompt responses
export interface BasePromptResponse {
    contenu: string;
}

export interface TitledPromptResponse extends BasePromptResponse {
    titre: string;
}

export interface DurationPromptResponse extends TitledPromptResponse {
    duree: string;
}

export interface SubjectPromptResponse {
    sujet: string;
}

// Type guard functions
export function isTitledResponse(response: unknown): response is TitledPromptResponse {
    return typeof response === 'object' && response !== null &&
        'titre' in response && 'contenu' in response &&
        typeof (response as any).titre === 'string' &&
        typeof (response as any).contenu === 'string';
}

export function isDurationResponse(response: unknown): response is DurationPromptResponse {
    return isTitledResponse(response) && 'duree' in response &&
        typeof (response as any).duree === 'string';
}

export function isSubjectResponse(response: unknown): response is SubjectPromptResponse {
    return typeof response === 'object' && response !== null &&
        'sujet' in response && typeof (response as any).sujet === 'string';
}

// Helper function to create a prompt with context
export function createContextualPrompt(
    basePrompt: string,
    context: MemoContext,
    additionalContext?: Record<string, unknown>
): string {
    let prompt = `${basePrompt}\n\n<contexte>\nObjectif: ${context.objective}`;

    if (additionalContext) {
        Object.entries(additionalContext).forEach(([key, value]) => {
            prompt += `\n${key}: ${value}`;
        });
    }

    prompt += '\n</contexte>\n';
    return prompt;
} 