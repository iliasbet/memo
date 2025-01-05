import React from 'react';
import { MemoSection, SectionType } from '@/types';

interface CardProps {
    sections: MemoSection[];
}

export const Card: React.FC<CardProps> = ({ sections }) => {
    return (
        <div className="w-full max-w-[400px] aspect-[7/10] mx-auto bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col">
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