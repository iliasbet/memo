import React from 'react';
import { Sparkles } from 'lucide-react';

export const DefaultCard = () => {
    return (
        <div className="relative w-full h-full" role="status">
            <div className="absolute inset-0 rounded-2xl bg-[#1A1A1A] overflow-hidden flex flex-col items-center justify-center px-8 text-center">
                <Sparkles className="w-8 h-8 mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">
                    Créez votre mémo
                </h3>
                <p className="text-gray-400 text-sm">
                    Saisissez un sujet ci-dessus pour générer un mémo structuré et percutant
                </p>
            </div>
        </div>
    );
}; 