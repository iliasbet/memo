import { useState, useCallback } from 'react';
import { MemoSection, Memo } from '@/types';

export const useStreamingMemo = () => {
    const [memo, setMemo] = useState<Memo | null>(null);
    const [streamingContent, setStreamingContent] = useState<string>('');

    const updateMemo = useCallback((section: MemoSection) => {
        setMemo(prev => prev
            ? { ...prev, sections: [...prev.sections, section] }
            : {
                sections: [section],
                metadata: {
                    createdAt: new Date().toISOString(),
                    topic: section.contenu || ''
                }
            });
    }, []);

    const resetMemo = useCallback(() => {
        setMemo(null);
        setStreamingContent('');
    }, []);

    return {
        memo,
        streamingContent,
        setStreamingContent,
        updateMemo,
        resetMemo
    };
}; 