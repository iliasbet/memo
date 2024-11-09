import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';
import { Memo, MemoSection as MemoSectionType } from '@/types';
import { MEMO_COLORS } from '@/constants/colors';
import { MemoSection } from './MemoSection';

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
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentMemo = memos[memos.length - 1];
    let currentSection: MemoSectionType | null = null;

    if (currentStreamingContent) {
        try {
            const data = JSON.parse(currentStreamingContent);
            if (data.type === 'update') {
                currentSection = data.section;
            }
        } catch (error) {
            console.error('Erreur parsing streaming content:', error);
        }
    }

    if (!currentSection && currentMemo?.sections.length > 0) {
        currentSection = currentMemo.sections[currentIndex];
    }

    const totalSections = currentMemo?.sections.length || 0;
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === totalSections - 1;

    const handlePrevious = () => {
        if (!isFirstSection) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleNext = () => {
        if (!isLastSection) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
    };

    const isCurrentSectionLoading = (section: MemoSectionType | null) => {
        if (!currentStreamingContent || !section) return false;
        try {
            const data = JSON.parse(currentStreamingContent);
            return data.type === 'update' && data.section.type === section.type;
        } catch {
            return false;
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative w-full aspect-[16/9]">
                {!currentSection && !memos.length ? (
                    <div className="absolute w-full h-full rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
                        <p className="text-lg text-gray-400">
                            Entrez un sujet pour générer un mémo
                        </p>
                    </div>
                ) : (
                    <>
                        {totalSections > 0 && (
                            <button
                                className={`absolute -left-16 top-1/2 -translate-y-1/2 w-10 h-10 
                                    ${isFirstSection
                                        ? 'bg-black/10 cursor-not-allowed'
                                        : 'bg-black/20 hover:bg-black/40 cursor-pointer'} 
                                    rounded-full flex items-center justify-center transition-colors`}
                                onClick={handlePrevious}
                                disabled={isFirstSection}
                                title={isFirstSection ? "Début du mémo" : "Section précédente"}
                            >
                                <ChevronLeft className={`w-6 h-6 ${isFirstSection ? 'text-white/50' : 'text-white'}`} />
                            </button>
                        )}

                        {currentSection && (
                            <MemoSection
                                type={currentSection.type}
                                content={currentSection.contenu}
                                color={MEMO_COLORS[currentSection.type as keyof typeof MEMO_COLORS]}
                                isActive={true}
                                isLoading={isCurrentSectionLoading(currentSection)}
                            />
                        )}

                        {totalSections > 0 && (
                            <button
                                className="absolute -right-16 top-1/2 -translate-y-1/2 w-10 h-10 
                                    bg-black/20 hover:bg-black/40 cursor-pointer
                                    rounded-full flex items-center justify-center transition-colors"
                                onClick={isLastSection ? handleRestart : handleNext}
                                title={isLastSection ? "Recommencer le mémo" : "Section suivante"}
                            >
                                {isLastSection ? (
                                    <RotateCw className="w-6 h-6 text-white" />
                                ) : (
                                    <ChevronRight className="w-6 h-6 text-white" />
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};