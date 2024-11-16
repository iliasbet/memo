import React, { memo, useMemo } from 'react';
import { MemoSectionProps, Duration } from '@/types';
import { LoadingCard } from './LoadingCard';

interface ExtendedMemoSectionProps extends Omit<MemoSectionProps, 'duration'> {
    duration?: Duration;
}

export const MemoSection: React.FC<ExtendedMemoSectionProps> = memo(({ type, content, color, isActive, isLoading = false, title, duration }) => {
    if (!isActive) return null;
    if (isLoading) return <LoadingCard />;

    const formatDuration = (duration?: Duration | number): string => {
        if (!duration) return '';

        if (typeof duration === 'number') {
            return `${duration} min`; // Rétrocompatibilité
        }

        return `${duration.value} ${duration.unit}`;
    };

    return (
        <div className="relative w-full h-full">
            <div
                className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center px-20 text-center overflow-hidden"
                style={{ backgroundColor: color }}
            >
                <div className="absolute inset-0 opacity-[0.15] noise-bg" />

                <h3 className="absolute top-10 left-0 right-0 font-medium text-memo-title-mobile sm:text-memo-title-tablet md:text-memo-title-desktop uppercase tracking-wider opacity-40 w-full">
                    {type}
                </h3>

                <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl my-auto">
                    {title ? (
                        <>
                            <h4 className="text-5xl font-medium mb-8 tracking-wide">
                                {title}
                            </h4>
                            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                                {content}
                            </p>
                        </>
                    ) : (
                        <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                            {content}
                        </p>
                    )}
                </div>

                {duration && (
                    <div className="absolute bottom-10 left-0 right-0 text-sm opacity-40">
                        Durée : {formatDuration(duration)}
                    </div>
                )}
            </div>
        </div>
    );
});

MemoSection.displayName = 'MemoSection';