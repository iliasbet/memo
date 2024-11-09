import React, { memo } from 'react';
import { MemoSectionProps } from '@/types';
import { LoadingCard } from './LoadingCard';

export const MemoSection = memo(function MemoSection({
    type,
    content,
    color,
    isActive,
    isLoading = false,
    direction = 'right'
}: MemoSectionProps) {
    if (!isActive) return null;
    if (isLoading) return <LoadingCard />;

    return (
        <div className="relative w-full h-full">
            <div
                className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center px-16 text-center"
                style={{ backgroundColor: color }}
            >
                <h3 className="font-semibold text-xs uppercase tracking-wider mb-6 opacity-80">
                    {type}
                </h3>
                <p className="text-lg font-semibold leading-relaxed">
                    {content}
                </p>
            </div>
        </div>
    );
});