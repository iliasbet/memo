// memo/app/page.tsx
'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { MemoList } from '@/components/ui/MemoList';
import { Input } from "@/components/ui/Input";
import type { Memo } from '@/types';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { MemoError, ErrorCode } from '@/types/errors';

export default function PageAccueil() {
    const [content, setContent] = useState('');
    const [currentMemo, setCurrentMemo] = useState<Memo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState<string | null>('');
    const [showConfetti, setShowConfetti] = useState(false);
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

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!content.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setStreamingContent('');
        setCurrentMemo(null);

        try {
            console.log('Sending request...');
            const response = await fetch('/api/memos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: content.trim() })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erreur serveur: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Response body is null');

            let streamBuffer = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                streamBuffer += new TextDecoder().decode(value);
                const lines = streamBuffer.split('\n\n');

                // Garder le dernier fragment incomplet pour le prochain cycle
                streamBuffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            console.log('Received data:', data);

                            if (data.type === 'error') {
                                throw new Error(data.message);
                            } else if (data.type === 'update') {
                                setStreamingContent(JSON.stringify(data));
                            } else if (data.type === 'complete') {
                                setStreamingContent('');
                                setCurrentMemo(data.memo);
                                setShowConfetti(true);
                                setTimeout(() => setShowConfetti(false), 5000);
                                setContent('');
                            }
                        } catch (parseError) {
                            console.error('Parse error:', parseError);
                            throw new Error('Erreur de traitement des données');
                        }
                    }
                }
            }
        } catch (err) {
            console.error('Request error:', err);
            const errorMessage = err instanceof Error
                ? err.message
                : 'Une erreur inattendue est survenue';
            setError(errorMessage);
            setCurrentMemo(null);
        } finally {
            setIsLoading(false);
        }
    };

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
                        '#FF0000', // Rouge vif
                        '#00FF00', // Vert vif
                        '#0000FF', // Bleu vif
                        '#FFFF00', // Jaune vif
                        '#FF00FF', // Magenta
                        '#00FFFF', // Cyan
                        '#FF8C00', // Orange vif
                        '#FF1493', // Rose vif
                        '#7FFF00', // Vert chartreuse
                        '#FF69B4', // Rose chaud
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

                    <div className="w-full max-w-[640px]">
                        <MemoList
                            memos={currentMemo ? [currentMemo] : []}
                            isLoading={isLoading}
                            currentStreamingContent={streamingContent}
                        />
                    </div>

                    <div className="mt-12 mb-8">
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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