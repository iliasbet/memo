// memo/app/layout.tsx
import React from 'react';
import './globals.css';
import { Lexend_Deca } from 'next/font/google';

// Layout principal de l'application Memo
// Configure la structure HTML de base, les polices et les styles globaux

// Configuration de la police Lexend Deca avec chargement optimisé
const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend-deca',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  // Structure HTML de base avec configuration de la langue et des styles
  <html lang="fr">
    <body className={`${lexendDeca.variable} font-sans bg-[#121212] text-white`}>
      {children}
    </body>
  </html>
);

export default RootLayout;