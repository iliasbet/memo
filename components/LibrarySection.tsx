import React from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/Card';
import type { Memo } from '@/types';

interface LibrarySectionProps {
  memos: Memo[];
}

export const LibrarySection: React.FC<LibrarySectionProps> = ({ memos }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {memos.map((memo) => (
          <div key={memo.id} className="w-full">
            <Card sections={memo.sections} />
          </div>
        ))}
      </div>
    </div>
  );
}; 