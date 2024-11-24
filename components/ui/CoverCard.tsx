import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientBackground from './GradientBackground';

interface CoverCardProps {
    topic: string;
    subject?: string;
    isLoading?: boolean;
    onRetry?: () => void;
}

export const CoverCard: React.FC<CoverCardProps> = ({
    topic,
    subject,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleClick = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 800);
        }
    };

    const variants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate={isAnimating ? "animate" : "initial"}
            onClick={handleClick}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6 cursor-pointer"
        >
            <GradientBackground animate={isAnimating} />
            <motion.h2 className="absolute inset-0 flex items-center justify-center text-white text-6xl font-medium text-center px-6 select-none">
                {subject || topic}
            </motion.h2>
        </motion.div>
    );
};