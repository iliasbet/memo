export enum SectionType {
    Title = 'title',
    Subtitle = 'subtitle',
    Content = 'content',
    Mantra = 'mantra'
}

export interface MemoSection {
    type: SectionType;
    content: string;
}

export interface Memo {
    id: string;
    content: string;
    sections: MemoSection[];
}

export interface MemoContext {
    topic: string;
    description?: string;
    language?: string;
}