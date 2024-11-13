// Configuration Tailwind CSS pour l'application Memo
// Définit les styles, thèmes et extensions personnalisés

import type { Config } from "tailwindcss";
import { MEMO_COLORS } from "./constants/colors";

const config: Config = {
  // Mode sombre activé
  darkMode: 'class',

  // Fichiers à scanner pour les classes Tailwind
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Classes à toujours inclure
  safelist: ['animate-light-bounce'],

  // Extension du thème par défaut
  theme: {
    extend: {
      // Configuration des rayons de bordure
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Palette de couleurs personnalisée
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        memo: MEMO_COLORS,
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
      },
      fontFamily: {
        lexend: ['var(--font-lexend)'],
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
};

export default config;