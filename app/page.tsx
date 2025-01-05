'use client';

// 1. React et Next.js
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

// 3. Composants internes
import { MemoList } from '@/components/ui/MemoList';
import { Input } from "@/components/ui/Input";
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { AuthModal } from '@/components/ui/AuthModal';
import UserMenu from '@/components/ui/UserMenu';
import { ProModal } from '@/components/ui/ProModal';

// 4. Types et constantes
import type { Memo } from '@/types';
import { testSupabaseConnection } from '@/lib/supabase/client';

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
                    bookId: 'default'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.error || 'Error generating memo';
                const errorDetails = data.details ? `: ${JSON.stringify(data.details)}` : '';
                throw new Error(`${errorMessage}${errorDetails}`);
            }

            setContent('');
            setCurrentMemo(data.memo);
        } catch (error) {
            console.error('Error submitting memo:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [content, isLoading, setContent, setCurrentMemo, setError, setIsLoading]);

    return (
        <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden">
            <div className="min-h-screen flex flex-col">
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
                        <MemoList
                            memos={currentMemo ? [currentMemo] : []}
                            isLoading={isLoading}
                            currentStreamingContent={null}
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
            </div>

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