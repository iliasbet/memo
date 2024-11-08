// Types de base pour les sections
export type SectionType =
    | 'objectif'
    | 'accroche'
    | 'idee'
    | 'argument'
    | 'exemple'
    | 'transition'
    | 'resume'
    | 'acquis'
    | 'ouverture';

// Interface pour une section de mémo
export interface MemoSection {
    type: SectionType;
    contenu: string;
    couleur: string;
}

// Interface pour un mémo complet
export interface Memo {
    id?: number;
    sections: MemoSection[];
    metadata: {
        createdAt: string;
        topic: string;
    };
}

// Type pour la réponse de l'API de génération de section
export type SectionResponse = MemoSection | MemoSection[];

export interface IdeaGroup {
    mainIdea: string;
    followUpIdeas: string[];
}

export interface MemoContext {
    topic: string;
    objective: string;
    ideaGroups: IdeaGroup[];
    currentSections: MemoSection[];
    currentPartIndex: number;
}