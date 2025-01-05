import React, { memo } from 'react';
import { MemoSectionProps, Duration, SectionType } from '@/types';
import { LoadingCard } from './LoadingCard';
import { motion } from 'framer-motion';
import { formatMemoContent } from '@/lib/utils';

interface ExtendedMemoSectionProps extends Omit<MemoSectionProps, 'duration'> {
    duration?: Duration;
    isLastSection?: boolean;
}

export const MemoSection: React.FC<ExtendedMemoSectionProps> = memo(({ type, content, color, isActive, isLoading = false, title, duration, isLastSection, direction = 0, topic, idMemo }) => {
    if (!isActive) return null;
    if (isLoading) return <LoadingCard />;

    const slideAnimation = {
        enter: (direction: number) => ({
            x: direction > 0 ? 500 : -500,
            opacity: 0,
            transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 500 : -500,
            opacity: 0,
            transition: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }
        })
    };

    const formatDuration = (duration?: Duration | number): string => {
        if (!duration) return '';
        if (typeof duration === 'number') {
            return `${duration} min`;
        }
        return `${duration.value} ${duration.unit}`;
    };

    const formattedContent = formatMemoContent(content);

    return (
        <motion.div
            className="absolute inset-0"
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideAnimation}
            custom={direction}
        >
            <div className="relative w-full h-full">
                <div
                    className="relative w-full h-full rounded-2xl flex flex-col items-center justify-center px-20 text-center overflow-hidden"
                    style={{
                        backgroundColor: color,
                        color: 'white'
                    }}
                >
                    <div className="absolute inset-0 opacity-[0.15] noise-bg" />

                    <h3 className="absolute top-10 left-0 right-0 font-medium text-memo-title-mobile sm:text-memo-title-tablet md:text-memo-title-desktop uppercase tracking-wider opacity-40 w-full text-white">
                        {type}
                    </h3>

                    <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl my-auto">
                        {(type === SectionType.Atelier ||
                            type === SectionType.Histoire ||
                            type === SectionType.Technique ||
                            type === SectionType.Concept) && title ? (
                            <>
                                <h4 className="text-5xl font-medium mb-8 tracking-wide">
                                    {title}
                                </h4>
                                <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                                    <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
                                </p>
                            </>
                        ) : (
                            <p className="text-base sm:text-lg md:text-xl font-normal leading-relaxed">
                                <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
                            </p>
                        )}
                    </div>

                    {type === SectionType.Atelier && duration && (
                        <div className="absolute bottom-10 left-0 right-0 text-sm opacity-40">
                            Durée : {formatDuration(duration)}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

MemoSection.displayName = 'MemoSection';