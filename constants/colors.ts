// Base colors for memo sections
const BASE_COLORS = {
    primary: '#067934',
    secondary: '#8b0909',
    tertiary: '#0a418b',
    accent: 'rgba(203, 108, 230, 0.9)',
    neutral: '#545454',
    warm: '#5d331a',
    dark: '#2A2A2A',
    highlight: '#99590f'
} as const;

// Semantic mapping for memo sections
export const MEMO_COLORS = {
    objectif: BASE_COLORS.primary,
    accroche: BASE_COLORS.secondary,
    concept: BASE_COLORS.tertiary,
    histoire: BASE_COLORS.accent,
    technique: BASE_COLORS.neutral,
    atelier: BASE_COLORS.warm,
    feedback: BASE_COLORS.dark,
    exemple: BASE_COLORS.highlight
} as const;

// Type-safe color access
export type MemoColorKey = keyof typeof MEMO_COLORS;