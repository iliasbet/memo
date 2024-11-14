// memo/app/layout.tsx
import React from 'react';
import './globals.css';
import { Lexend } from 'next/font/google';

// Layout principal de l'application Memo
// Configure la structure HTML de base, les polices et les styles globaux

// Configuration de la police Lexend Deca avec chargement optimisé
const lexend = Lexend({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-lexend',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="fr">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <meta name="theme-color" content="#121212" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </head>
    <body className={`${lexend.variable} font-lexend font-semibold bg-[#121212] text-white`}>
      {children}
    </body>
  </html>
);

export default RootLayout;