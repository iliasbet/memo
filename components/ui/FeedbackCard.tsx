import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/contexts/AuthContext';

interface FeedbackCardProps {
    onSubmit: (feedback: string) => Promise<void>;
    memoRequest?: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ onSubmit, memoRequest }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { user } = useAuthContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim() || isLoading) return;

        setIsLoading(true);
        setIsError(false);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedback: feedback.trim(),
                    memoRequest
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'envoi du feedback');
            }

            setIsSuccess(true);
            setFeedback('');
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (error) {
            setIsError(true);
            setTimeout(() => setIsError(false), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
                Votre avis nous intéresse
            </h3>

            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Votre feedback..."
                    className={cn(
                        "w-full min-h-[100px] p-4 pr-14 rounded-xl",
                        "bg-[#1A1A1A] text-gray-200 placeholder-gray-500",
                        "resize-none focus:outline-none",
                        "focus:ring-2",
                        isError ? "focus:ring-red-500/20 ring-2 ring-red-500/20" : "focus:ring-blue-500/20",
                        "transition-all duration-200"
                    )}
                />
                <motion.button
                    type="submit"
                    disabled={isLoading || !feedback.trim()}
                    initial="idle"
                    animate={
                        isLoading
                            ? "loading"
                            : isSuccess
                                ? "success"
                                : isError
                                    ? "error"
                                    : isHovered
                                        ? "hover"
                                        : "idle"
                    }
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    className={cn(
                        "absolute right-3 bottom-4",
                        "w-9 h-9",
                        "rounded-full",
                        "flex items-center justify-center",
                        "text-gray-300",
                        "disabled:opacity-50",
                        "select-none touch-none",
                        "bg-[#2A2A2A]",
                        "hover:bg-[#3A3A3A]",
                        "transition-colors duration-200"
                    )}
                >
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isSuccess ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : isError ? (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </AnimatePresence>
                </motion.button>
                {isError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -bottom-8 left-0 text-sm text-red-400"
                    >
                        Erreur lors de l'envoi. Veuillez réessayer.
                    </motion.div>
                )}
            </form>
        </div>
    );
};
