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
    const [gradientKey, setGradientKey] = useState(0);

    const handleClick = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setGradientKey(prev => prev + 1); // Force le changement de gradient
            setTimeout(() => setIsAnimating(false), 800); // Durée totale de l'animation
        }
    };

    const variants = {
        initial: {
            scale: 1,
            y: 0,
        },
        animate: {
            scale: [1, 1.05, 0.98, 1.02, 1], // Séquence d'échelles pour l'effet bounce
            y: [0, -10, -5, -8, 0], // Séquence de positions Y pour l'effet bounce
            transition: {
                duration: 0.8,
                times: [0, 0.2, 0.4, 0.6, 1], // Timing de chaque étape
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
            style={{
                transformOrigin: 'center',
                willChange: 'transform'
            }}
        >
            <GradientBackground
                key={gradientKey}
                animate={isAnimating}
            />
            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center text-white text-6xl font-medium text-center px-6 select-none"
            >
                {subject || topic}
            </motion.h2>
        </motion.div>
    );
};