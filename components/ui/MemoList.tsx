import React from 'react';
import { Memo } from '@/types';
import Card from './Card';

interface MemoListProps {
  memos: Memo[];
  isLoading: boolean;
  currentStreamingContent: string | null;
}

export const MemoList: React.FC<MemoListProps> = ({ 
  memos, 
  isLoading, 
  currentStreamingContent 
}) => {
  const currentMemo = memos[0] || null;

  if (!currentMemo && !isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No memos available</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <Card
        topic={currentStreamingContent || 'Loading...'}
        sections={[
          {
            type: 'loading',
            content: currentStreamingContent || '',
          }
        ]}
        isLoading={true}
      />
    );
  }

  const sections = currentMemo.sections || [];
  
  return (
    <Card
      topic={currentMemo.metadata?.topic || currentMemo.content || ''}
      sections={sections.map(section => ({
        type: section.type,
        title: section.titre,
        content: section.contenu,
        color: section.couleur
      }))}
      isLoading={false}
    />
  );
};

MemoList.displayName = 'MemoList';
