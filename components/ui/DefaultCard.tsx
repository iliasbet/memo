import React from 'react';
import { Sparkles } from 'lucide-react';
import { MEMO_COLORS } from '@/constants/colors';

export const DefaultCard = () => {
    return (
        <div className="relative w-full h-full" role="status">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#222222] overflow-hidden">
                {/* Effet de grain */}
                <div className="absolute inset-0 opacity-[0.15] noise-bg" />

                {/* Orbes lumineux */}
                <div className="absolute inset-0">
                    {/* Objectif - Vert */}
                    <div className="absolute -top-[20%] -left-[20%] w-[600px] h-[600px] rounded-full bg-[#067934]/10 blur-3xl animate-orb-float-1" />

                    {/* Accroche - Rouge */}
                    <div className="absolute -top-[10%] -right-[30%] w-[800px] h-[800px] rounded-full bg-[#8b0909]/10 blur-3xl animate-orb-float-2" />

                    {/* Argument - Bleu */}
                    <div className="absolute -bottom-[30%] -left-[10%] w-[700px] h-[700px] rounded-full bg-[#08489d]/10 blur-3xl animate-orb-float-3" />

                    {/* Exemple - Orange */}
                    <div className="absolute top-[20%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#9f770d]/10 blur-3xl animate-orb-float-4" />

                    {/* Resume - Violet */}
                    <div className="absolute -bottom-[20%] -right-[20%] w-[900px] h-[900px] rounded-full bg-[#6A0DAD]/10 blur-3xl animate-orb-float-5" />
                </div>

                {/* Effet de verre */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center backdrop-blur-[1px]">
                    {/* Contenu */}
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="relative">
                            <Sparkles className="w-16 h-16 text-gray-400 animate-pulse-slow" />
                            <div className="absolute inset-0 blur-sm opacity-50 animate-pulse-slow" />
                        </div>

                        <h3 className="text-3xl font-regular text-gray-200 mt-8 mb-6 tracking-wide">
                            Créez votre mémo
                        </h3>

                        <p className="text-gray-400 text-xl font-regular max-w-md leading-relaxed">
                            Saisissez un sujet ci-dessus pour générer un mémo structuré et percutant
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 