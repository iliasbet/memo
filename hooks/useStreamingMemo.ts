import { Memo, MemoGenerationParams, MemoSection } from '@/types';
import { useState, useCallback } from 'react';

export const useStreamingMemo = () => {
    const [streamingContent, setStreamingContent] = useState<string>('');
    const [memo, setMemo] = useState<Memo | null>(null);

    const updateMemo = useCallback((section: MemoSection) => {
        setMemo((prev) => {
            if (!prev) {
                return null;
            }
            return {
                ...prev,
                sections: [...prev.sections, section]
            };
        });
    }, []);

    return {
        memo,
        streamingContent,
        setMemo,
        setStreamingContent,
        updateMemo
    };
}; 