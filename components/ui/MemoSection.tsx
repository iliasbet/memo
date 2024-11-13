import React, { memo } from 'react';
import { MemoSectionProps } from '@/types';
import { LoadingCard } from './LoadingCard';

export const MemoSection: React.FC<MemoSectionProps> = memo(({ type, content, color, isActive, isLoading = false }) => {
    if (!isActive) return null;
    if (isLoading) return <LoadingCard />;

    return (
        <div className="relative w-full h-full">
            <div
                className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center px-20 text-center"
                style={{ backgroundColor: color }}
            >
                <h3 className="font-medium text-xs uppercase tracking-wider mb-6 opacity-80">{type}</h3>
                <p className="text-2xl font-medium leading-relaxed">{content}</p>
            </div>
        </div>
    );
});