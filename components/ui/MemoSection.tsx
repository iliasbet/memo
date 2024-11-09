import React, { memo } from 'react';

interface MemoSectionProps {
    type: string;
    content: string;
    color: string;
    isActive: boolean;
    direction?: 'left' | 'right';
}

export const MemoSection = memo(function MemoSection({
    type,
    content,
    color,
    isActive,
    direction = 'right'
}: MemoSectionProps) {
    if (!isActive) return null;

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