import React, { useState, useCallback, memo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memo, MemoSection as MemoSectionType, SectionType } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import { MemoSection } from './MemoSection';
import { LoadingCard } from './LoadingCard';
import { DefaultCard } from './DefaultCard';
import { CoverCard } from './CoverCard';

// Composant d'affichage de la liste des mémos
// Gère la navigation et l'affichage des sections de mémo

// Props du composant
interface MemoListProps {
    memos: Memo[];
    isLoading: boolean;
    currentStreamingContent: string | null;
}

export const MemoList: React.FC<MemoListProps> = memo(
    ({ memos, isLoading, currentStreamingContent }) => {
        console.log("myMemo", memos);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [direction, setDirection] = useState(0);
        const [isRewinding, setIsRewinding] = useState(false);
        const [isRetrying, setIsRetrying] = useState(false);
        const [currentMemo, setCurrentMemo] = useState<Memo | null>(memos[0] || null);
        const sections = currentMemo?.sections || [];

        const allSections = currentMemo
            ? [
                { type: 'cover' as const, content: currentMemo.metadata?.topic || currentMemo.content || 'No Content', coverImage: currentMemo.metadata?.coverImage },
                ...sections,
            ]
            : [];

        const isLastSection = currentIndex === allSections.length - 1;

        useEffect(() => {
            setCurrentMemo(memos[0] || null);
            setCurrentIndex(0);
            setDirection(0);
            setIsRewinding(false);
        }, [memos]);

        const handleNext = useCallback(() => {
            if (isLastSection) {
                setIsRewinding(true);
                const rewindDuration = 800;
                const stepDuration = rewindDuration / allSections.length;

                allSections.forEach((_, index) => {
                    const reverseIndex = allSections.length - 1 - index;
                    setTimeout(() => {
                        setCurrentIndex(reverseIndex);
                    }, stepDuration * index);
                });

                setTimeout(() => {
                    setIsRewinding(false);
                    setCurrentIndex(0);
                }, rewindDuration);
            } else {
                setDirection(1);
                setCurrentIndex((prev) => prev + 1);
            }
        }, [isLastSection, allSections.length]);

        const handlePrevious = useCallback(() => {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }, []);

        useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'ArrowRight') {
                    handleNext();
                } else if (event.key === 'ArrowLeft') {
                    handlePrevious();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }, [handleNext, handlePrevious]);

        if (isLoading) {
            return (
                <div className="w-full min-h-[400px] relative">
                    <div className="absolute inset-0">
                        <LoadingCard content={currentStreamingContent || undefined} />
                    </div>
                </div>
            );
        }

        if (!currentMemo) {
            return (
                <div className="w-full h-[400px]">
                    <DefaultCard />
                </div>
            );
        }

        return (
            <div className="w-full space-y-6">
                <div className="flex justify-center items-center w-full">
                    <div className="relative w-full max-w-[800px] aspect-[16/9]">
                        <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                {currentIndex === 0 ? (
                                    <CoverCard
                                        key="cover"
                                        topic={currentMemo.metadata?.topic || currentMemo.content || ''}
                                        subject={currentMemo.metadata?.subject}
                                        isLoading={isLoading || isRetrying}
                                    />
                                ) : (
                                    sections[currentIndex - 1] && (
                                        <MemoSection
                                            key={currentIndex}
                                            type={sections[currentIndex - 1].type}
                                            content={sections[currentIndex - 1].contenu}
                                            color={sections[currentIndex - 1].couleur}
                                            title={sections[currentIndex - 1].titre}
                                            duration={sections[currentIndex - 1].duree}
                                            isActive={true}
                                            isLastSection={isLastSection}
                                            direction={direction}
                                            topic={currentMemo.metadata?.topic}
                                            idMemo={currentMemo.id}
                                        />
                                    )
                                )}
                            </AnimatePresence>
                        </div>

                        {allSections.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    className={`absolute left-[-48px] top-1/2 transform -translate-y-1/2 ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                        }`}
                                    aria-label="Section précédente"
                                    disabled={isRewinding || currentIndex === 0}
                                >
                                    <ChevronLeft className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-[-48px] top-1/2 transform -translate-y-1/2"
                                    aria-label={isLastSection ? 'Recommencer' : 'Section suivante'}
                                    disabled={isRewinding}
                                >
                                    {isLastSection ? (
                                        <RotateCw className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
                                    ) : (
                                        <ChevronRight className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

MemoList.displayName = 'MemoList';
