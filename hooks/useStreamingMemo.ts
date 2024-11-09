import { useState, useEffect } from 'react';
import { Memo } from '@/types';

// Nouveau hook personnalisé
export const useStreamingMemo = () => {
    const [memo, setMemo] = useState<Memo | null>(null);
    const [streamingContent, setStreamingContent] = useState<string>('');

    const updateMemo = (section: any) => {
        setMemo(prev => {
            if (!prev) {
                return {
                    sections: [section],
                    metadata: {
                        createdAt: new Date().toISOString(),
                        topic: section.topic || ''
                    }
                };
            }

            return {
                ...prev,
                sections: [...prev.sections, section]
            };
        });
    };

    const resetMemo = () => {
        setMemo(null);
        setStreamingContent('');
    };

    return {
        memo,
        streamingContent,
        setStreamingContent,
        updateMemo,
        resetMemo
    };
}; 