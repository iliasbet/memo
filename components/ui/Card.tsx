import React, { useEffect, useRef } from 'react';
import { MemoSection, SectionType } from '@/types';

interface CardProps {
    sections: MemoSection[];
}

export const Card: React.FC<CardProps> = ({ sections }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        let frameId: number;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let currentScale = 1;
        
        // Track the target rotation
        let targetRotateX = 0;
        let targetRotateY = 0;
        
        const smoothing = 0.10; // Increased for more noticeable movement
        const maxRotation = 10; // Increased maximum rotation angle

        const updateCardPosition = () => {
            // Smooth interpolation towards target rotation
            currentRotateX += (targetRotateX - currentRotateX) * smoothing;
            currentRotateY += (targetRotateY - currentRotateY) * smoothing;
            currentScale += (1.05 - currentScale) * smoothing;

            // Calculate shadow based on rotation
            const shadowX = currentRotateY * 2;
            const shadowY = currentRotateX * 2;
            const shadowBlur = 20 + Math.abs(currentRotateX + currentRotateY);
            const shadowOpacity = 0.25 + (Math.abs(currentRotateX + currentRotateY) / maxRotation) * 0.15;

            // Apply transforms
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
            
            // Calculate the distance from the mouse to the center of the card
            const distanceX = e.clientX - cardCenterX;
            const distanceY = e.clientY - cardCenterY;
            
            // Calculate rotation based on distance from card center
            // Normalize the rotation to create a spherical effect
            const normalizedX = distanceX / (window.innerWidth / 2);
            const normalizedY = distanceY / (window.innerHeight / 2);
            
            targetRotateY = normalizedX * maxRotation;
            targetRotateX = -normalizedY * maxRotation;
        };

        const handleMouseLeave = () => {
            // Smoothly return to center
            targetRotateX = 0;
            targetRotateY = 0;
        };

        // Start the animation loop
        frameId = requestAnimationFrame(updateCardPosition);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(frameId);
        };
    }, []);

    return (
        <div 
            ref={cardRef}
            className="w-full max-w-[400px] aspect-[7/10] mx-auto bg-white rounded-3xl overflow-hidden flex flex-col will-change-transform"
            style={{ 
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2), 0 5px 15px -5px rgba(0,0,0,0.1)'
            }}
        >
            <div className="p-8 flex-grow">
                {/* Title Section */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                    {sections.map((section, index) => {
                        if (section.type === SectionType.Title) {
                            return (
                                <h1 key={index} className="text-2xl font-bold text-gray-800">
                                    {section.content}
                                </h1>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    {sections.map((section, index) => {
                        if (section.type === SectionType.Content) {
                            // Split content into lines and remove empty ones
                            const points = section.content.split('\n').filter(Boolean);
                            return (
                                <div key={index} className="space-y-4">
                                    {points.map((point, i) => (
                                        <p key={i} className="text-gray-700 leading-relaxed pl-4 relative">
                                            <span className="absolute left-0 text-pink-500">•</span>
                                            {point.replace(/^[•\s]+/, '')} {/* Remove any bullet points from the AI response */}
                                        </p>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 text-sm text-gray-500 text-right lowercase">
                memo
            </div>
        </div>
    );
}; 