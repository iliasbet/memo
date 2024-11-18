'use client';

// 1. React et Next.js
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { initClarity } from '@/lib/clarity';

// 3. Composants internes
import { MemoList } from '@/components/ui/MemoList';
import { Input } from "@/components/ui/Input";
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { FeedbackCard } from '@/components/ui/FeedbackCard';

// 4. Types et constantes
import type { Memo } from '@/types';
import { MemoError, ErrorCode } from '@/types/errors';

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

    const [windowDimensions, setWindowDimensions] = useState(() => {
        if (typeof window !== 'undefined') {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
        return {
            width: 1200,
            height: 800
        };
    });

    useEffect(() => {
        const updateDimensions = () => {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Mettre à jour immédiatement au montage
        updateDimensions();

        window.addEventListener('resize', updateDimensions);
        window.addEventListener('orientationchange', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('orientationchange', updateDimensions);
        };
    }, []);

    useEffect(() => {
        initClarity();
    }, []);

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
                body: JSON.stringify({ content: content.trim() }),
            });

            if (!response.ok) {
                throw new MemoError(
                    ErrorCode.API_ERROR,
                    'Erreur lors de la génération du mémo'
                );
            }

            const data = await response.json();
            setCurrentMemo(data.memo);
        } catch (error) {
            setError(error instanceof MemoError ? error.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    }, [content, isLoading]);

    const handleFeedbackSubmit = async (feedback: string) => {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ feedback }),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du feedback');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden">
            <div className="min-h-screen flex flex-col">
                <header className="pt-4">
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
                    {error && (
                        <ErrorDisplay
                            error={new MemoError(
                                ErrorCode.API_ERROR,
                                error.includes('connexion')
                                    ? "Erreur de connexion. Veuillez réessayer."
                                    : error
                            )}
                        />
                    )}

                    <div className="w-full max-w-3xl">
                        <MemoList
                            memos={currentMemo ? [currentMemo] : []}
                            isLoading={isLoading}
                            currentStreamingContent={null}
                        />
                    </div>

                    <div className="mt-12 mb-8">
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onSubmit={handleSubmit}
                            placeholder="Posez votre question..."
                            isLoading={isLoading}
                            currentMemo={currentMemo}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}