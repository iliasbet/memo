'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/Input";
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { AuthModal } from '@/components/ui/AuthModal';
import UserMenu from '@/components/ui/UserMenu';
import { ProModal } from '@/components/ui/ProModal';
import { Card } from '@/components/ui/Card';
import { LibrarySection } from '@/components/LibrarySection';
import { useMagneticScroll } from '@/hooks/useMagneticScroll';
import type { Memo } from '@/types';
import { testSupabaseConnection } from '@/lib/supabase/client';
import { SectionType } from '@/types';
import { useTranslation } from 'react-i18next';
import { LanguageModal } from '@/components/ui/LanguageModal';
import { ParametersModal } from '@/components/ui/ParametersModal';

const useMemoState = () => {
    const [content, setContent] = useState('');
    const [currentMemo, setCurrentMemo] = useState<Memo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return {
        content,
        setContent,
        currentMemo,
        setCurrentMemo,
        isLoading,
        setIsLoading,
        error,
        setError,
    };
};

export default function PageAccueil() {
    const {
        content,
        setContent,
        currentMemo,
        setCurrentMemo,
        isLoading,
        setIsLoading,
        error,
        setError,
    } = useMemoState();

    const [savedMemos, setSavedMemos] = useState<Memo[]>([]);
    const sections = ['main', 'library'];
    const containerRef = useMagneticScroll(sections);
    const { t, i18n } = useTranslation();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Auth modal state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    // Pro modal state
    const [isProModalOpen, setIsProModalOpen] = useState(false);

    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

    const [isParametersModalOpen, setIsParametersModalOpen] = useState(false);

    const handleOpenAuthModal = (mode: 'signin' | 'signup') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleOpenProModal = () => {
        setIsProModalOpen(true);
    };

    useEffect(() => {
        const testConnection = async () => {
            const isConnected = await testSupabaseConnection();
            if (!isConnected) {
                setError('Failed to connect to the database');
            }
        };
        testConnection();
    }, [setError]);

    const handleSubmit = useCallback(async () => {
        if (!content.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setCurrentMemo(null);

        try {
            const response = await fetch('/api/memos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content.trim(),
                    userId: 'anonymous',
                    language: i18n.language
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('API Error:', data);
                throw new Error(data.details || data.error || 'Error generating memo');
            }

            const memo: Memo = {
                id: data.memo.id || `memo-${Date.now()}`,
                content: data.memo.content || content.trim(),
                sections: data.memo.sections || []
            };

            setContent('');
            setCurrentMemo(memo);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            console.error('Error submitting memo:', {
                error,
                message: errorMessage,
                content: content.trim(),
                language: i18n.language
            });
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [content, isLoading, setContent, setCurrentMemo, setError, setIsLoading, i18n.language]);

    const defaultMemo: Memo = {
        id: 'default',
        content: '',
        sections: [
            {
                type: SectionType.Title,
                content: isMounted ? t('defaultMemo.title') : ''
            },
            {
                type: SectionType.Content,
                content: isMounted ? [
                    t('defaultMemo.point1'),
                    t('defaultMemo.point2'),
                    t('defaultMemo.point3'),
                    t('defaultMemo.point4')
                ].join('\n') : ''
            },
            {
                type: SectionType.Heuristic,
                content: isMounted ? t('defaultMemo.heuristic') : ''
            }
        ]
    };

    return (
        <div ref={containerRef} className="bg-[#121212] text-white">
            <section id="main" className="min-h-screen flex flex-col">
                <header className="pt-4 relative">
                    <div className="absolute right-4 top-4">
                        <UserMenu
                            onSettingsClick={() => setIsParametersModalOpen(true)}
                            onProClick={handleOpenProModal}
                            onAuthClick={() => handleOpenAuthModal('signin')}
                            onLanguageClick={() => setIsLanguageModalOpen(true)}
                        />
                    </div>
                    <Image
                        src="/memo.svg"
                        alt="Logo Memo"
                        width={200}
                        height={100}
                        priority
                        draggable={false}
                        className="select-none mx-auto"
                    />
                </header>

                <main className="flex flex-col items-center px-4 mt-6">
                    <div className="w-full max-w-3xl">
                        <Card 
                            sections={currentMemo ? currentMemo.sections : defaultMemo.sections} 
                            isDefault={!currentMemo}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="relative w-full max-w-3xl mt-12 mb-8">
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            currentMemo={currentMemo}
                        />
                        {error && (
                            <div className="mt-4">
                                <ErrorDisplay
                                    error={error}
                                    onRetry={() => {
                                        setError(null);
                                        handleSubmit();
                                    }}
                                    onClose={() => setError(null)}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </section>

            <section id="library" className="min-h-screen">
                <LibrarySection memos={savedMemos} />
            </section>

            <AuthModal
                isOpen={isAuthModalOpen}
                onCloseAction={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onModeChangeAction={setAuthMode}
            />

            <ProModal
                isOpen={isProModalOpen}
                onCloseAction={() => setIsProModalOpen(false)}
            />

            <LanguageModal
                isOpen={isLanguageModalOpen}
                onCloseAction={() => setIsLanguageModalOpen(false)}
            />

            <ParametersModal
                isOpen={isParametersModalOpen}
                onCloseAction={() => setIsParametersModalOpen(false)}
            />
        </div>
    );
}