import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { MEMO_COLORS } from '@/constants/colors';

const EXAMPLE_PROMPTS = [
    '"Comment fonctionne la photosynthèse ?"',
    '"Expliquez-moi la théorie de la relativité"',
    '"Qu\'est-ce que l\'intelligence artificielle ?"',
    '"Comment fonctionne la blockchain ?"',
    '"Pourquoi le ciel est-il bleu ?"',
    '"Comment fonctionne notre système immunitaire ?"'
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
            }, 500); // Attendre que le fade out soit terminé
        }, 4000); // Changer toutes les 4 secondes

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="relative w-full h-full" role="status">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#222222] overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute -top-[20%] -left-[20%] w-[600px] h-[600px] rounded-full bg-[#067934]/10 blur-3xl animate-orb-float-1" />
                    <div className="absolute -top-[10%] -right-[30%] w-[800px] h-[800px] rounded-full bg-[#8b0909]/10 blur-3xl animate-orb-float-2" />
                    <div className="absolute -bottom-[30%] -left-[10%] w-[700px] h-[700px] rounded-full bg-[#08489d]/10 blur-3xl animate-orb-float-3" />
                    <div className="absolute top-[20%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#9f770d]/10 blur-3xl animate-orb-float-4" />
                    <div className="absolute -bottom-[20%] -right-[20%] w-[900px] h-[900px] rounded-full bg-[#6A0DAD]/10 blur-3xl animate-orb-float-5" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center backdrop-blur-[1px]">
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative mb-10">
                            <Sparkles className="w-12 h-12 text-gray-400 animate-pulse-slow" />
                            <div className="absolute inset-0 blur-sm opacity-50 animate-pulse-slow" />
                        </div>

                        <h3 className="text-2xl font-light text-gray-200 mb-4 tracking-wide">
                            Créez votre memo
                        </h3>

                        <div className="h-[60px] flex items-center justify-center">
                            <p
                                className={`text-gray-400 text-lg font-light max-w-md leading-relaxed transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'
                                    }`}
                            >
                                {EXAMPLE_PROMPTS[currentPromptIndex]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 