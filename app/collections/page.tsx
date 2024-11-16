'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CollectionsView } from '@/components/ui/CollectionsView';
import { Collection, CollectionFolder } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext';

export default function CollectionsPage() {
    const [folders, setFolders] = useState<CollectionFolder[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        console.log('Collections page mounted');

        // Données de test
        setCollections([
            {
                id: '1',
                name: 'Sciences',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                memos: [],
                color: '#067934'
            }
        ]);

        setFolders([
            {
                id: '1',
                name: 'Histoire',
                collections: [],
                createdAt: new Date().toISOString()
            }
        ]);
    }, []);

    const handleCollectionClick = (collection: Collection) => {
        console.log('Collection clicked:', collection);
    };

    const handleFolderClick = (folder: CollectionFolder) => {
        console.log('Folder clicked:', folder);
    };

    return (
        <main className="min-h-screen bg-[#121212]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <h1 className="text-2xl font-semibold text-white mb-8 px-6">Collections</h1>
                <CollectionsView
                    folders={folders}
                    collections={collections}
                    onCollectionClick={handleCollectionClick}
                    onFolderClick={handleFolderClick}
                />
            </div>
        </main>
    );
}
