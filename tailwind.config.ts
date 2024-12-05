import type { Config } from "tailwindcss";
import { MEMO_COLORS } from "./constants/colors";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ['animate-light-bounce'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
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
        sans: ['var(--font-lexend)', 'Helvetica', 'Arial', 'sans-serif'],
        lexend: ['var(--font-lexend)', 'Helvetica', 'Arial', 'sans-serif'],
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
      fontSize: {
        'memo-title-mobile': ['0.65rem', { lineHeight: '0.9rem' }],
        'memo-title-tablet': ['0.7rem', { lineHeight: '1rem' }],
        'memo-title-desktop': ['0.75rem', { lineHeight: '1.1rem' }],
        'memo-content-mobile': ['0.875rem', { lineHeight: '1.25rem' }],
        'memo-content-tablet': ['1rem', { lineHeight: '1.5rem' }],
        'memo-content-desktop': ['1.5rem', { lineHeight: '2rem' }],
      },
    },
  },
};

export default config;