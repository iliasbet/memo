// Définition des couleurs pour chaque type de section de mémo
// Utilisé pour la cohérence visuelle à travers l'application

export const MEMO_COLORS = {
    objectif: '#067934',
    accroche: '#8b0909',
    idee: '#1A1A1A',
    argument: '#08489d',
    exemple: '#9f770d',
    transition: '#545454',
    resume: '#6A0DAD',
    acquis: '#067934',
    ouverture: '#FF69B4'
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