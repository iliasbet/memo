import React, { memo, useMemo } from 'react';
import { MemoSectionProps } from '@/types';
import { LoadingCard } from './LoadingCard';

export const MemoSection: React.FC<MemoSectionProps> = memo(({ type, content, color, isActive, isLoading = false }) => {
    if (!isActive) return null;
    if (isLoading) return <LoadingCard />;

    const balanceText = (text: string, options = {
        minLength: 45,
        maxLength: 55,
        balanceRatio: 0.8
    }) => {
        if (text.length <= options.minLength) return text;

        const words = text.split(' ');
        const midPoint = Math.floor(words.length / 2);

        let bestSplit = { index: midPoint, score: Infinity };

        for (let i = 1; i < words.length - 1; i++) {
            const firstPart = words.slice(0, i).join(' ');
            const secondPart = words.slice(i).join(' ');

            const score = Math.abs(firstPart.length - secondPart.length) /
                Math.max(firstPart.length, secondPart.length);

            if (score < bestSplit.score) {
                bestSplit = { index: i, score };
            }
        }

        return bestSplit.score > 0.3 ? text :
            `${words.slice(0, bestSplit.index).join(' ')}\n${words.slice(bestSplit.index).join(' ')}`;
    };

    const balancedText = useMemo(() => {
        return balanceText(content);
    }, [content]);

    return (
        <div className="relative w-full h-full">
            <div
                className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center px-20 text-center overflow-hidden"
                style={{ backgroundColor: color }}
            >
                <div className="absolute inset-0 opacity-[0.15] noise-bg" />
                <div className="relative z-10">
                    <h3 className="font-medium text-memo-title-mobile sm:text-memo-title-tablet md:text-memo-title-desktop uppercase tracking-wider mb-4 sm:mb-6 opacity-40">
                        {type}
                    </h3>
                    <p className="text-memo-content-mobile sm:text-memo-content-tablet md:text-memo-content-desktop font-normal leading-relaxed whitespace-pre-line">
                        {balancedText}
                    </p>
                </div>
            </div>
        </div>
    );
});

MemoSection.displayName = 'MemoSection';
MemoSection.displayName = 'MemoSection';