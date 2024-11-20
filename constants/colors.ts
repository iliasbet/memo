// Définition des couleurs pour chaque type de section de mémo
// Utilisé pour la cohérence visuelle à travers l'application

export const MEMO_COLORS = {
    objectif: 'rgba(0, 191, 99, 0.9)',
    accroche: 'rgba(255, 49, 49, 0.9)',
    concept: 'rgba(82, 113, 255, 0.9)',
    histoire: 'rgba(203, 108, 230, 0.9)',
    technique: 'rgba(140, 82, 255, 0.9)',
    atelier: 'rgba(255, 145, 77, 0.9)',
    feedback: 'rgba(42, 42, 42, 0.9)'
} as const;

export const MEMO_TEXT_COLORS = {
    objectif: 'rgba(255, 255, 255, 0.9)',
    accroche: 'rgba(255, 255, 255, 0.9)',
    concept: 'rgba(255, 255, 255, 0.9)',
    histoire: 'rgba(255, 255, 255, 0.9)',
    technique: 'rgba(255, 255, 255, 0.9)',
    atelier: 'rgba(255, 255, 255, 0.9)',
    feedback: 'rgba(255, 255, 255, 0.9)'
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