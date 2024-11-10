// Définition des types principaux pour l'app
// Énumération des différentes sections possibles d'un mémo
export enum SectionType {
    Objectif = 'objectif',
    Accroche = 'accroche',
    Idee = 'idee',
    Argument = 'argument',
    Exemple = 'exemple',
    Transition = 'transition',
    Resume = 'resume',
    Acquis = 'acquis',
    Ouverture = 'ouverture',
}

// Structure d'une section de mémo
export interface MemoSection {
    type: SectionType;
    contenu: string;
    couleur: string;
}

// Structure complète d'un mémo
export interface Memo {
    id?: number;
    sections: MemoSection[];
    metadata: {
        createdAt: string;
        topic: string;
    };
}

// Props pour le composant MemoSection
export interface MemoSectionProps {
    type: SectionType;
    content: string;
    color: string;
    isActive: boolean;
    isLoading?: boolean;
    direction?: 'left' | 'right';
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