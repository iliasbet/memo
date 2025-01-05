export enum SectionType {
    Objectif = 'objectif',
    Accroche = 'accroche',
    Concept = 'concept',
    Histoire = 'histoire',
    Technique = 'technique',
    Atelier = 'atelier',
    Sujet = 'sujet',
    Exemple = 'exemple',
    Definition = 'definition',
    Methode = 'methode'
}

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

export interface Memo {
    id: string;
    user_id: string;
    content: string;
    book_id: string;
    chapter_id?: string;
    created_at: string;
    sections: MemoSection[];
    metadata: {
        topic?: string;
        subject?: string;
        coverImage?: string;
        title?: string;
        description?: string;
    };
}

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

export interface Collection {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    memos: Memo[];
    color?: string;
}

export interface ExtendedMemoSectionProps extends MemoSectionProps {
    isLastSection?: boolean;
    direction?: number;
}

export interface SectionPlan {
    concept: string;
    histoire: string;
    technique: string;
    atelier: string;
}

export interface MemoGenerationParams {
    bookId: string;
    chapterId?: string;
    userId: string;
}