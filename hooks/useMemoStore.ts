import { useState, useCallback } from 'react';
import { Memo, MemoSection } from '@/types';
import { ErrorHandler } from '@/lib/errorHandling';
import { MemoError } from '@/types/errors';

export function useMemoStore() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<MemoError | null>(null);

  const addMemo = useCallback(async (topic: string) => {
    const tempId = Date.now();
    
    setMemos(prev => [...prev, {
      id: tempId,
      sections: [],
      metadata: { topic, createdAt: new Date().toISOString() }
    }]);
    
    setIsLoading(true);
    setError(null);
    
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
      setError(error instanceof MemoError ? error : ErrorHandler.handle(error, { topic }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { memos, isLoading, error, addMemo };
} 