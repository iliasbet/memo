'use client';

// 1. React et Next.js
import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

// 2. Composants externes
import ReactConfetti from 'react-confetti';

// 3. Composants internes
import { MemoList } from '@/components/ui/MemoList';
import { Input } from "@/components/ui/Input";
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CommandMenu } from '@/components/ui/CommandMenu';

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
        showConfetti,
        setShowConfetti
    } = useMemoState();

    const [showCommandMenu, setShowCommandMenu] = useState(false);
    const [inputRect, setInputRect] = useState<DOMRect | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === '/' && !showCommandMenu && document.activeElement === inputRef.current) {
            e.preventDefault();
            setInputRect(inputRef.current!.getBoundingClientRect());
            setShowCommandMenu(true);
        } else if (e.key === 'Escape' && showCommandMenu) {
            setShowCommandMenu(false);
        }
    }, [showCommandMenu]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (showCommandMenu &&
            inputRef.current &&
            !inputRef.current.contains(e.target as Node)) {
            setShowCommandMenu(false);
        }
    }, [showCommandMenu]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

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
            setShowConfetti(true);
        } catch (error) {
            setError(error instanceof MemoError ? error.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    }, [content, isLoading]);

    return (
        <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden">
            {showConfetti && (
                <ReactConfetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={500}
                    recycle={false}
                    gravity={0.8}
                    initialVelocityX={{ min: -30, max: 30 }}
                    initialVelocityY={{ min: -80, max: -20 }}
                    colors={[
                        '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
                        '#FF00FF', '#00FFFF', '#FF8C00', '#FF1493',
                        '#7FFF00', '#FF69B4',
                    ]}
                    onConfettiComplete={() => setShowConfetti(false)}
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
                            ref={inputRef}
                        />
                    </div>

                    {showCommandMenu && (
                        <CommandMenu
                            onEdit={() => {
                                // Handle edit
                                setShowCommandMenu(false);
                            }}
                            onAddToCollection={() => {
                                // Handle add to collection
                                setShowCommandMenu(false);
                            }}
                            inputRect={inputRect}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}