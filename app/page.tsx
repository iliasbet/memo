'use client';

// 1. React et Next.js
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

// 3. Composants internes
import { Input } from "@/components/ui/Input";
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { AuthModal } from '@/components/ui/AuthModal';
import UserMenu from '@/components/ui/UserMenu';
import { ProModal } from '@/components/ui/ProModal';
import { Card } from '@/components/ui/Card';
import { LibrarySection } from '@/components/LibrarySection';
import { useMagneticScroll } from '@/hooks/useMagneticScroll';

// 4. Types et constantes
import type { Memo } from '@/types';
import { testSupabaseConnection } from '@/lib/supabase/client';
import { SectionType } from '@/types';

// Page d'accueil de l'application Memo
// Gère l'interface principale et la saisie du sujet du mémo

// Extraire la logique de gestion d'état dans un custom hook
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

const defaultMemo: Memo = {
    id: 'default',
    content: '',
    sections: [
        {
            type: SectionType.Title,
            content: 'Your next memo is coming...'
        },
        {
            type: SectionType.Content,
            content: '• I will help you organize your thoughts\n• Break down complex topics into clear points\n• Create structured summaries\n• Generate actionable insights'
        }
    ]
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

    // Auth modal state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    // Pro modal state
    const [isProModalOpen, setIsProModalOpen] = useState(false);

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

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
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
                    userId: 'anonymous'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error generating memo');
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
            console.error('Error submitting memo:', errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [content, isLoading, setContent, setCurrentMemo, setError, setIsLoading]);

    return (
        <div ref={containerRef} className="bg-[#121212] text-white">
            <section id="main" className="min-h-screen flex flex-col">
                <header className="pt-4 relative">
                    <div className="absolute right-4 top-4">
                        <UserMenu
                            onOpenAuthModal={handleOpenAuthModal}
                            onOpenProModal={handleOpenProModal}
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
                            placeholder="Posez votre question..."
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
        </div>
    );
}