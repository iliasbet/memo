import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff, RefreshCcw } from 'lucide-react';
import { LoadingCard } from './LoadingCard';

interface CoverCardProps {
    // imageUrl?: string;
    topic: string;
    subject?: string;
    isLoading?: boolean;
    onRetry?: () => void;
}

export const CoverCard: React.FC<CoverCardProps> = ({
    // imageUrl,
    topic,
    subject,
    //isLoading,
    // onRetry
}) => {
    // const [imageError, setImageError] = useState(false);
    // const [isImageLoading, setIsImageLoading] = useState(true);

    // if (isLoading) {
    //     return <LoadingCard />;
    // }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-[#545454]"
        >
            {/* Temporairement désactivé
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
                            className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
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
                        className="absolute inset-0 flex items-center justify-center bg-[#545454]"
                    >
                        <ImageOff className="w-8 h-8 opacity-50 text-gray-300" />
                    </motion.div>
                )}
            </AnimatePresence>
            */}

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center text-white text-6xl font-medium text-center px-6"
            >
                {subject || topic}
            </motion.h2>
        </motion.div>
    );
};