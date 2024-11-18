// Définition des types principaux pour l'app
// Énumération des différentes sections possibles d'un mémo
export enum SectionType {
    Objectif = 'objectif',
    Accroche = 'accroche',
    Idee = 'idee',
    Concept = 'concept',
    Histoire = 'histoire',
    Technique = 'technique',
    Atelier = 'atelier',
    Resume = 'resume',
    Acquis = 'acquis',
    Ouverture = 'ouverture',
    Feedback = 'feedback'
}

// Structure d'une section de mémo
export interface Duration {
    value: number;
    unit: 'min' | 'h' | 'j';
}

export interface MemoSection {
    readonly type: SectionType;
    readonly titre?: string;
    readonly contenu: string;
    readonly couleur: string;
    readonly duree?: Duration;
}

// Structure complète d'un mémo
export interface Memo {
    readonly id?: number;
    readonly sections: readonly MemoSection[];
    readonly metadata: {
        readonly createdAt: string;
        readonly topic: string;
    };
}

// Props pour le composant MemoSection
export interface MemoSectionProps {
    type: SectionType;
    content: string;
    color: string;
    isActive: boolean;
    isLoading?: boolean;
    direction?: number;
    title?: string;
    duration?: Duration | number;
}

// Structure pour grouper les idées
export interface IdeaGroup {
    mainIdea: string;
    followUpIdeas: string[];
}

// Contexte global pour la génération de mémo
export interface MemoContext {
    topic: string;
    objective: string;
    ideaGroups: IdeaGroup[];
    currentSections: MemoSection[];
    currentPartIndex: number;
}

// Ajouter après les types existants

export interface Collection {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    memos: Memo[];
    color?: string;
}

export interface CollectionFolder {
    id: string;
    name: string;
    collections: Collection[];
    createdAt: string;
}

export interface Feedback {
    id: string;
    content: string;
    userId?: string;
    createdAt: Date;
    userAgent?: string;
}

export interface ExtendedMemoSectionProps extends MemoSectionProps {
    isLastSection?: boolean;
    direction?: number;
}