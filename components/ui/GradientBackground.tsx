import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GradientBackgroundProps {
    animate?: boolean;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ animate }) => {
    const [gradients, setGradients] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const generateRandomGradient = () => {
        function getRandomInt(max: number): number {
            return Math.floor(Math.random() * max);
        }

        // Uniquement des couleurs vives, pas de noir ni blanc
        const colors = [
            '#ff6b6b', '#f7c548', '#5f6caf', '#6bf7c5', '#f76b8a',
            '#4834d4', '#686de0', '#eb4d4b', '#6ab04c', '#22a6b3',
            '#be2edd', '#4834d4', '#30336b', '#badc58', '#7ed6df'
        ];
        const positions = ['left top', 'right top', 'left bottom', 'right bottom', 'center'];

        return `
            radial-gradient(circle at ${positions[getRandomInt(positions.length)]}, ${colors[getRandomInt(colors.length)]}, transparent 60%),
            radial-gradient(circle at ${positions[getRandomInt(positions.length)]}, ${colors[getRandomInt(colors.length)]}, transparent 60%),
            radial-gradient(circle at ${positions[getRandomInt(positions.length)]}, ${colors[getRandomInt(colors.length)]}, transparent 60%),
            rgba(0, 0, 0, 0.2)
        `;
    };

    useEffect(() => {
        // Générer un pool initial de gradients
        const initialGradients = Array(5).fill(null).map(() => generateRandomGradient());
        setGradients(initialGradients);
    }, []);

    useEffect(() => {
        if (animate && gradients.length > 0) {
            const nextIndex = (currentIndex + 1) % gradients.length;
            setCurrentIndex(nextIndex);

            // Préparer le prochain gradient
            setGradients(prev => {
                const newGradients = [...prev];
                const futureIndex = (nextIndex + 2) % gradients.length;
                newGradients[futureIndex] = generateRandomGradient();
                return newGradients;
            });
        }
    }, [animate]);

    if (gradients.length === 0) return null;

    return (
        <div className="absolute inset-0 bg-gray-900 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: gradients[currentIndex],
                        backgroundBlendMode: 'screen',
                    }}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                    }}
                />
            </AnimatePresence>
        </div>
    );
};

export default GradientBackground;