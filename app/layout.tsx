// memo/app/layout.tsx
'use client';

import React from 'react';
import './globals.css';
import { Lexend_Deca } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/lib/i18n';

const lexend = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-lexend',
});

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <meta name="theme-color" content="#121212" />
    </head>
    <body className={`${lexend.variable} font-sans`}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;