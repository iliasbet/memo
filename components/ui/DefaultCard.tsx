import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const EXAMPLE_PROMPTS = [
    'Comment gérer efficacement une équipe à distance ?',
    'Quelles sont les bases du management agile ?',
    'Comment structurer une présentation impactante ?',
    'Quelles sont les clés d\'une communication efficace ?',
    'Comment mener un entretien annuel ?',
    'Comment optimiser la gestion du temps ?'
];

export const DefaultCard = () => {
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentPromptIndex((prev) => (prev + 1) % EXAMPLE_PROMPTS.length);
                setIsVisible(true);
            }, 500);
        }, 4000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="w-full h-[400px] relative" role="status">
            <div className="absolute inset-0 rounded-2xl bg-[#1A1A1A] overflow-hidden">
                <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                    <Sparkles className="w-8 h-8 mb-6 text-blue-400/80" />
                    <h2 className="text-xl font-medium mb-4 text-white/90">
                        Créons un memo !
                    </h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-400 max-w-md text-lg"
                    >
                        "{EXAMPLE_PROMPTS[currentPromptIndex]}"
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

DefaultCard.displayName = 'DefaultCard';