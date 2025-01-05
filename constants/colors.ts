// Color definitions for memo sections
export const MEMO_COLORS = {
    objectif: '#067934',
    accroche: '#8b0909',
    concept: '#0a418b',
    histoire: 'rgba(203, 108, 230, 0.9)',
    technique: '#545454',
    atelier: '#5d331a',
    feedback: '#2A2A2A',
    exemple: '#99590f'
} as const;

export type MemoColorKey = keyof typeof MEMO_COLORS;

// Types et variantes de thème pour l'application
export const MEMO_VARIANTS = {
    default: {
        background: '#1E1E1E',
        text: '#FFFFFF',
        border: '#2A2A2A'
    }
} as const;