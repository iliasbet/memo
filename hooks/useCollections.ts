import { useState } from 'react';
import type { Collection, Memo } from '@/types';

export const useCollections = () => {
    const [collections, setCollections] = useState<Collection[]>([]);

    const addMemoToCollection = (memo: Memo, collectionId: string) => {
        setCollections(prevCollections =>
            prevCollections.map(collection => {
                if (collection.id === collectionId) {
                    return {
                        ...collection,
                        memos: [...collection.memos, memo],
                        updatedAt: new Date().toISOString()
                    };
                }
                return collection;
            })
        );
    };

    return {
        collections,
        setCollections,
        addMemoToCollection
    };
}; 