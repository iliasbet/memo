// Définition des types principaux pour l'app
// Énumération des différentes sections possibles d'un mémo
export enum SectionType {
    Objectif = 'objectif',
    Accroche = 'accroche',
    Concept = 'concept',
    Histoire = 'histoire',
    Technique = 'technique',
    Atelier = 'atelier',
    Feedback = 'feedback',
    Sujet = 'sujet',
    Exemple = 'exemple',
    Definition = 'definition',
    Methode = 'methode'
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
    id: string;
    sections: MemoSection[];
    metadata: {
        createdAt: string;
        topic: string;
        subject?: string;
        coverImage?: string;
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
    topic?: string;
    idMemo?: string;
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
    subject?: string;
    plan?: {
        accroche: string;
        histoire: string;
        concepts: Array<{
            focus: string;
            exemple: string;
        }>;
        technique: string;
        atelier: string;
    };
    accrocheAngle?: string;
    histoireType?: string;
    conceptFocus?: string;
    exempleFocus?: string;
    conceptIndex?: number;
    totalConcepts?: number;
    techniqueApproche?: string;
    atelierType?: string;
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

// Ajouter après MemoContext
export interface SectionPlan {
    concept: string;
    histoire: string;
    technique: string;
    atelier: string;
}