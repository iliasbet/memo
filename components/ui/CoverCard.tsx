import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff, RefreshCcw } from 'lucide-react';
import { LoadingCard } from './LoadingCard';

interface CoverCardProps {
    imageUrl?: string;
    topic: string;
    subject?: string;
    isLoading?: boolean;
    onRetry?: () => void;
}

export const CoverCard: React.FC<CoverCardProps> = ({
    imageUrl,
    topic,
    subject,
    isLoading,
    onRetry
}) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    if (isLoading) {
        return <LoadingCard />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-[#1A1A1A]"
        >
            <AnimatePresence mode="wait">
                {imageUrl && !imageError ? (
                    <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={imageUrl}
                            alt={`Illustration pour ${topic}`}
                            fill
                            className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            onLoad={() => setIsImageLoading(false)}
                            onError={() => setImageError(true)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1A1A] text-gray-400"
                    >
                        <ImageOff className="w-8 h-8 mb-4 opacity-50" />
                        <p className="text-sm mb-4">Impossible de charger l'image</p>
                        {onRetry && (
                            <button
                                onClick={onRetry}
                                className="flex items-center px-4 py-2 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Réessayer
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Titre centré */}
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center text-white text-6xl font-medium text-center px-6"
            >
                {subject || topic}
            </motion.h2>

            {/* Indicateur de chargement */}
            {isImageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </motion.div>
    );
};