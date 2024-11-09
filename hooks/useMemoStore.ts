import { useState, useCallback } from 'react';
import { Memo } from '@/types';
import { ErrorHandler, MemoError } from '@/lib/errorHandling';

export const useMemoStore = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<MemoError | null>(null);

  const addMemo = useCallback(async (topic: string) => {
    setIsLoading(true);
    setError(null);
    const tempId = Date.now();

    try {
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: topic })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMemos(prev => prev.map(m =>
        m.id === tempId ? { ...data, id: tempId } : m
      ));
    } catch (error) {
      setMemos(prev => prev.filter(m => m.id !== tempId));
      setError(
        error instanceof MemoError
          ? error
          : ErrorHandler.handle(error as Error, { topic })
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    memos,
    isLoading,
    error,
    addMemo,
  };
}; 