'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MemoSection, SectionType } from '@/types';

interface CardProps {
    sections: MemoSection[];
    isDefault?: boolean;
    isLoading?: boolean;
}

interface CardTemplateProps {
    isDefault: boolean;
    title: string;
    points: string[];
    heuristic?: string;
    isLoading?: boolean;
}

const LoadingTemplate: React.FC<{ isDefault: boolean }> = ({ isDefault }) => (
    <>
        <div className="p-8 flex-grow">
            {/* Title Section */}
            <div className="pb-4 mb-6">
                <div className={`h-8 w-3/4 rounded-lg ${isDefault ? 'bg-[#252525]' : 'bg-gray-200'} animate-pulse`} />
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500 opacity-50" />
                        <div className={`h-5 flex-1 rounded-lg ${isDefault ? 'bg-[#252525]' : 'bg-gray-200'} animate-pulse`} />
                    </div>
                ))}
            </div>
        </div>
        
        {/* Footer */}
        <div className={`${isDefault ? 'bg-[#252525] text-gray-400' : 'bg-gray-50 text-gray-500'} px-8 py-4 text-sm text-right lowercase opacity-50`}>
            memo
        </div>
    </>
);

const CardTemplate: React.FC<CardTemplateProps> = ({ isDefault, title, points, heuristic, isLoading }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (isLoading) {
        return <LoadingTemplate isDefault={isDefault} />;
    }

    return (
        <>
            <div className="p-8 flex-grow">
                {/* Title Section */}
                <div className="pb-2 mb-3">
                    <h1 
                        className={`text-2xl font-bold ${isDefault ? 'text-white' : 'text-gray-800'}`}
                        suppressHydrationWarning
                    >
                        {isMounted ? title : ''}
                    </h1>
                </div>

                {/* Heuristic Section */}
                {heuristic && (
                    <div className="mb-4">
                        <p 
                            className={`text-sm italic ${isDefault ? 'text-gray-400' : 'text-gray-600'}`}
                            suppressHydrationWarning
                        >
                            {isMounted ? heuristic : ''}
                        </p>
                    </div>
                )}

                {/* Main Content */}
                <div className="space-y-2">
                    {isMounted && points.map((point, i) => (
                        <p 
                            key={i} 
                            className={`${isDefault ? 'text-gray-300' : 'text-gray-700'} leading-snug pl-4 relative`}
                            suppressHydrationWarning
                        >
                            <span className="absolute left-0 text-pink-500">•</span>
                            {point.replace(/^[•\s]+/, '')}
                        </p>
                    ))}
                </div>
            </div>
            
            {/* Footer */}
            <div className={`${isDefault ? 'bg-[#252525]' : 'bg-gray-50'} px-8 py-4 text-right`}>
                <span className={`text-sm ${isDefault ? 'text-gray-400' : 'text-gray-500'} lowercase`}>
                    memo
                </span>
            </div>
        </>
    );
};

export const Card: React.FC<CardProps> = ({ sections, isDefault = false, isLoading = false }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        let frameId: number;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let currentScale = 1;
        
        let targetRotateX = 0;
        let targetRotateY = 0;
        
        const smoothing = 0.10;
        const maxRotation = 10;

        const updateCardPosition = () => {
            currentRotateX += (targetRotateX - currentRotateX) * smoothing;
            currentRotateY += (targetRotateY - currentRotateY) * smoothing;
            currentScale += (1.05 - currentScale) * smoothing;

            const shadowX = currentRotateY * 2;
            const shadowY = currentRotateX * 2;
            const shadowBlur = 20 + Math.abs(currentRotateX + currentRotateY);
            const shadowOpacity = 0.25 + (Math.abs(currentRotateX + currentRotateY) / maxRotation) * 0.15;

            card.style.transform = `
                perspective(1000px)
                rotateX(${currentRotateX}deg)
                rotateY(${currentRotateY}deg)
                scale(${currentScale})
            `;

            card.style.boxShadow = `
                ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity}),
                0 10px 20px -10px rgba(0,0,0,0.2)
            `;

            frameId = requestAnimationFrame(updateCardPosition);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            const distanceX = e.clientX - cardCenterX;
            const distanceY = e.clientY - cardCenterY;
            
            const normalizedX = distanceX / (window.innerWidth / 2);
            const normalizedY = distanceY / (window.innerHeight / 2);
            
            targetRotateY = normalizedX * maxRotation;
            targetRotateX = -normalizedY * maxRotation;
        };

        const handleMouseLeave = () => {
            targetRotateX = 0;
            targetRotateY = 0;
        };

        frameId = requestAnimationFrame(updateCardPosition);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(frameId);
        };
    }, []);

    // Extract title, points, and heuristic from sections
    const title = sections.find(s => s.type === SectionType.Title)?.content || '';
    const contentSection = sections.find(s => s.type === SectionType.Content);
    const heuristicSection = sections.find(s => s.type === SectionType.Heuristic);
    const points = contentSection ? contentSection.content.split('\n').filter(Boolean) : [];
    const heuristic = heuristicSection?.content;

    return (
        <div 
            ref={cardRef}
            className={`w-full max-w-[400px] aspect-[7/10] mx-auto rounded-3xl overflow-hidden flex flex-col will-change-transform ${
                isDefault ? 'bg-[#1E1E1E] text-white' : 'bg-white'
            }`}
            style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2), 0 5px 15px -5px rgba(0,0,0,0.1)'
            }}
        >
            <CardTemplate
                isDefault={isDefault}
                title={title}
                points={points}
                heuristic={heuristic}
                isLoading={isLoading}
            />
        </div>
    );
}; 