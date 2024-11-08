// memo/app/layout.tsx
import React from 'react';
import './globals.css';
import { Lexend_Deca } from 'next/font/google';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend-deca',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${lexendDeca.variable} font-sans bg-[#121212] text-white`}>
        {children}
      </body>
    </html>
  );
}