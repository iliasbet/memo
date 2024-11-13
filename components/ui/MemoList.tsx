import React, { useState, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Memo, MemoSection as MemoSectionType } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import { MemoSection } from './MemoSection';
import { LoadingCard } from './LoadingCard';
import { DefaultCard } from './DefaultCard';

// Composant d'affichage de la liste des mémos
// Gère la navigation et l'affichage des sections de mémo

// Props du composant
interface MemoListProps {
    memos: Memo[];
    isLoading: boolean;
    currentStreamingContent: string | null;
}

export const MemoList: React.FC<MemoListProps> = memo(({ memos, isLoading, currentStreamingContent }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 pour gauche, 1 pour droite
    const [isRewinding, setIsRewinding] = useState(false);
    const currentMemo = memos[memos.length - 1];
    const sections = currentMemo?.sections || [];
    const isLastSection = currentIndex === sections.length - 1;

    const handleNext = useCallback(() => {
        if (isLastSection) {
            setIsRewinding(true);
            const rewindDuration = 800; // Durée totale du rewind
            const stepDuration = rewindDuration / sections.length;

            // Animation de rewind rapide
            sections.forEach((_, index) => {
                const reverseIndex = sections.length - 1 - index;
                setTimeout(() => {
                    setCurrentIndex(reverseIndex);
                }, stepDuration * index);
            });

            // Réinitialisation de l'état
            setTimeout(() => {
                setIsRewinding(false);
                setCurrentIndex(0);
            }, rewindDuration);
        } else {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
        }
    }, [isLastSection, sections.length]);

    const handlePrevious = useCallback(() => {
        setDirection(-1);
        setCurrentIndex(prev => prev - 1);
    }, []);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="flex justify-center items-center w-full">
            <div className="relative w-full max-w-[800px] aspect-[16/9]">
                <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        {isLoading ? (
                            <LoadingCard />
                        ) : currentMemo && sections[currentIndex] ? (
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                }}
                                className={`absolute inset-0 ${isRewinding ? 'transition-all duration-200' : ''}`}
                            >
                                <MemoSection
                                    type={sections[currentIndex].type}
                                    content={sections[currentIndex].contenu}
                                    color={sections[currentIndex].couleur}
                                    isActive={true}
                                    isLoading={false}
                                />
                            </motion.div>
                        ) : (
                            <DefaultCard />
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation en dehors de la carte */}
                {!isLoading && sections.length > 1 && (
                    <>
                        {/* Bouton précédent */}
                        {currentIndex > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="absolute left-[-48px] top-1/2 transform -translate-y-1/2"
                                aria-label="Section précédente"
                                disabled={isRewinding}
                            >
                                <ChevronLeft className="w-8 h-8 text-gray-400 hover:text-white transition-colors" />
                            </button>
                        )}

                        {/* Bouton suivant/recommencer */}
                        <button
                            onClick={handleNext}
                            className="absolute right-[-48px] top-1/2 transform -translate-y-1/2"
                            aria-label={isLastSection ? "Recommencer" : "Section suivante"}
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
    );
});

MemoList.displayName = 'MemoList';