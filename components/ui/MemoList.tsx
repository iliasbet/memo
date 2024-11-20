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
        const [currentIndex, setCurrentIndex] = useState(0);
        const [direction, setDirection] = useState(0);
        const [isRewinding, setIsRewinding] = useState(false);
        const [isRetrying, setIsRetrying] = useState(false);
        const [currentMemo, setCurrentMemo] = useState(memos[0]);
        const sections = currentMemo?.sections || [];

        // Créer un tableau combiné avec la carte de couverture et les sections
        const allSections = currentMemo ? [
            { type: 'cover', content: currentMemo.metadata.topic, coverImage: currentMemo.metadata.coverImage },
            ...sections
        ] : [];

        // Calculer isLastSection en prenant en compte toutes les sections
        const isLastSection = currentIndex === sections.length;

        // Mettre à jour currentMemo quand memos change
        useEffect(() => {
            setCurrentMemo(memos[0]);
            setCurrentIndex(0);
            setDirection(0);
            setIsRewinding(false);
        }, [memos]);

        // Fonction pour mettre à jour le mémo dans la base de données
        const updateMemoInDatabase = async (id: string, memo: Memo) => {
            try {
                const response = await fetch(`/api/memos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(memo)
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour du mémo');
                }
            } catch (error) {
                console.error('Erreur mise à jour mémo:', error);
                throw error;
            }
        };

        /*const handleRetryImage = async () => {
            if (!currentMemo?.metadata.topic) return;

            setIsRetrying(true);
            try {
                const response = await fetch('/api/generate-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: currentMemo.metadata.topic })
                });

                if (!response.ok) throw new Error('Erreur de génération');

                const { imageUrl } = await response.json();

                if (imageUrl && currentMemo) {
                    const updatedMemo = {
                        ...currentMemo,
                        metadata: {
                            ...currentMemo.metadata,
                            coverImage: imageUrl
                        }
                    };
                    setCurrentMemo(updatedMemo);

                    if (currentMemo.id) {
                        await updateMemoInDatabase(currentMemo.id, updatedMemo);
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la régénération:', error);
            } finally {
                setIsRetrying(false);
            }
        };*/

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
                setCurrentIndex(prev => prev + 1);
            }
        }, [isLastSection, allSections.length]);

        const handlePrevious = useCallback(() => {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
        }, []);

        // Gérer l'état de chargement
        if (isLoading) {
            return (
                <div className="w-full min-h-[400px] relative">
                    <div className="absolute inset-0">
                        <LoadingCard />
                    </div>
                </div>
            );
        }

        // Afficher la DefaultCard si pas de mémo
        if (!currentMemo) {
            return (
                <div className="w-full h-[400px]">
                    <DefaultCard />
                </div>
            );
        }

        // Afficher le mémo et ses sections
        return (
            <div className="w-full space-y-6">
                <div className="flex justify-center items-center w-full">
                    <div className="relative w-full max-w-[800px] aspect-[16/9]">
                        <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                {currentIndex === 0 ? (
                                    <CoverCard
                                        key="cover"
                                        //imageUrl={currentMemo?.metadata.coverImage}
                                        topic={currentMemo?.metadata.topic || ''}
                                        subject={currentMemo?.metadata.subject}
                                        isLoading={isLoading || isRetrying}
                                    //onRetry={handleRetryImage}
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
                                        />
                                    )
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        {allSections.length > 1 && (
                            <>
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

                                {currentIndex < allSections.length && (
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
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

MemoList.displayName = 'MemoList';