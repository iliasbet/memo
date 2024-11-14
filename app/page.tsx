'use client';

// 1. React et Next.js
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// 2. Composants externes
import ReactConfetti from 'react-confetti';

// 3. Composants internes
import { MemoList } from '@/components/ui/MemoList';
import { Input } from "@/components/ui/Input";
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

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
    const [showConfetti, setShowConfetti] = useState(false);

    return {
        content,
        setContent,
        currentMemo,
        setCurrentMemo,
        isLoading,
        setIsLoading,
        error,
        setError,
        showConfetti,
        setShowConfetti
    };
};

// Extraire la logique de gestion de la fenêtre
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

export default function PageAccueil() {
    const { content, setContent, currentMemo, setCurrentMemo, isLoading, setIsLoading, error, setError, showConfetti, setShowConfetti } = useMemoState();
    const windowSize = useWindowSize();

    const fetchWithRetry = async (url: string, options: RequestInit, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) return response;

                // Si c'est la dernière tentative, on laisse l'erreur se propager
                if (i === retries - 1) return response;

                // Sinon on attend avant de réessayer
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            } catch (error) {
                if (i === retries - 1) throw error;
            }
        }
        throw new Error('Toutes les tentatives ont échoué');
    };

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!content.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setCurrentMemo(null);

        try {
            const response = await fetchWithRetry('/api/memos', {
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

            // On met à jour le mémo une fois qu'on a toutes les données
            setCurrentMemo(data.memo);
            setShowConfetti(true);
        } catch (error) {
            setError(error instanceof MemoError ? error.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    }, [content, isLoading, fetchWithRetry]);

    return (
        <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden">
            {showConfetti && (
                <ReactConfetti
                    width={windowSize.width}
                    height={windowSize.height}
                    numberOfPieces={500}
                    recycle={false}
                    gravity={0.8}
                    initialVelocityX={{
                        min: -30,
                        max: 30
                    }}
                    initialVelocityY={{
                        min: -80,
                        max: -20
                    }}
                    colors={[
                        '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
                        '#FF00FF', '#00FFFF', '#FF8C00', '#FF1493',
                        '#7FFF00', '#FF69B4',
                    ]}
                    onConfettiComplete={() => setShowConfetti(false)}
                    tweenDuration={50}
                    friction={0.97}
                    confettiSource={{
                        x: windowSize.width / 2,
                        y: windowSize.height * 0.6,
                        w: 0,
                        h: 0
                    }}
                    drawShape={ctx => {
                        ctx.beginPath();
                        for (let i = 0; i < 6; i++) {
                            ctx.lineTo(
                                10 * Math.cos(2 * Math.PI * i / 6),
                                10 * Math.sin(2 * Math.PI * i / 6)
                            );
                        }
                        ctx.fill();
                    }}
                />
            )}
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
                        <div className="w-full max-w-xl mb-6">
                            <ErrorDisplay
                                error={new MemoError(
                                    error.includes('connexion')
                                        ? ErrorCode.NETWORK_ERROR
                                        : ErrorCode.API_ERROR,
                                    error
                                )}
                                onRetry={handleSubmit}
                            />
                        </div>
                    )}

                    <div className="w-full max-w-[800px] px-8">
                        <MemoList
                            memos={currentMemo ? [currentMemo] : []}
                            isLoading={isLoading}
                            currentStreamingContent={null}
                        />
                    </div>

                    <div className="mt-12 mb-8">
                        <Input
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            placeholder="Sur quel sujet souhaitez-vous apprendre ?"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}