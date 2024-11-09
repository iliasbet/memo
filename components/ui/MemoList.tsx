// memo/components/ui/MemoList.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MemoSection } from './MemoSection';
import type { Memo } from '@/types';

interface MemoListProps {
    memos: Memo[];
    isLoading: boolean;
    currentStreamingContent?: string;
}

export const MemoList: React.FC<MemoListProps> = ({
    memos,
    isLoading,
    currentStreamingContent
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [textIndex, setTextIndex] = useState(0);
    const currentMemo = memos[memos.length - 1];

    useEffect(() => {
        setCurrentIndex(0);
    }, [memos.length]);

    const loadingTexts = useMemo(() => [
        "Je réfléchis à votre demande...",
        "Mon cerveau artificiel fait des pompes...",
        "Je consulte ma boule de cristal numérique...",
        "Mes neurones en silicium chauffent...",
        "Je demande l'avis de mon ami ChatGPT...",
        "Je médite profondément sur votre question...",
        "Je fais travailler mes 0 et mes 1...",
        "Je charge ma créativité.exe...",
        "Je m'inspire en regardant des memes...",
        "Je bois un café virtuel pour me booster..."
    ], []);

    useEffect(() => {
        if (!isLoading) return;

        const speed = isDeleting ? 50 : 100;
        let timeout: NodeJS.Timeout;

        if (isDeleting) {
            if (displayedText.length === 0) {
                setIsDeleting(false);
                setTextIndex(prev => (prev + 1) % loadingTexts.length);
            } else {
                timeout = setTimeout(() => {
                    setDisplayedText(prev => prev.slice(0, -1));
                }, speed);
            }
        } else {
            const currentText = loadingTexts[textIndex];
            if (displayedText.length === currentText.length) {
                timeout = setTimeout(() => {
                    setIsDeleting(true);
                }, 1000);
            } else {
                timeout = setTimeout(() => {
                    setDisplayedText(currentText.slice(0, displayedText.length + 1));
                }, speed);
            }
        }

        return () => clearTimeout(timeout);
    }, [isLoading, displayedText, isDeleting, textIndex, loadingTexts]);

    const streamingSection = currentStreamingContent ? JSON.parse(currentStreamingContent) : null;

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            <div className="relative w-full aspect-[16/9]">
                {isLoading && !streamingSection ? (
                    <div className="w-full h-full rounded-2xl bg-[#1A1A1A] flex items-center justify-center">
                        <p className="font-medium text-lg text-[#808080]">
                            {displayedText}
                            <span className="opacity-50 animate-pulse">|</span>
                        </p>
                    </div>
                ) : streamingSection ? (
                    <MemoSection
                        type={streamingSection.type}
                        content={streamingSection.contenu}
                        color={streamingSection.couleur}
                        isActive={true}
                        direction="right"
                    />
                ) : currentMemo ? (
                    <>
                        <MemoSection
                            type={currentMemo.sections[currentIndex]?.type || ''}
                            content={currentMemo.sections[currentIndex]?.contenu || ''}
                            color={currentMemo.sections[currentIndex]?.couleur || '#1A1A1A'}
                            isActive={true}
                            direction="right"
                        />

                        <button
                            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                            disabled={!currentMemo || currentIndex === 0}
                            className="absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-transparent text-white disabled:opacity-30 hover:bg-[#2A2A2A] transition-all"
                            aria-label="Section précédente"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <button
                            onClick={() => setCurrentIndex(prev => Math.min(prev + 1, (currentMemo?.sections.length || 1) - 1))}
                            disabled={!currentMemo || currentIndex === (currentMemo?.sections.length || 1) - 1}
                            className="absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-transparent text-white disabled:opacity-30 hover:bg-[#2A2A2A] transition-all"
                            aria-label="Section suivante"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                ) : (
                    <div className="w-full h-full rounded-2xl bg-[#1A1A1A]" />
                )}
            </div>
        </div>
    );
};
