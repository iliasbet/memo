import React from 'react';
import { motion } from 'framer-motion';
import { Collection, CollectionFolder } from '@/types';
import { Folder, File } from 'lucide-react';

interface CollectionsViewProps {
    folders: CollectionFolder[];
    collections: Collection[];
    onCollectionClick: (collection: Collection) => void;
    onFolderClick: (folder: CollectionFolder) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
    folders,
    collections,
    onCollectionClick,
    onFolderClick,
}) => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {folders.map((folder) => (
                    <motion.div
                        key={folder.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                        onClick={() => onFolderClick(folder)}
                    >
                        <div className="bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] rounded-2xl p-4 aspect-square flex flex-col items-center justify-center gap-3 shadow-lg border border-[#303030]">
                            <div className="bg-gradient-to-br from-[#404040] to-[#303030] p-3 rounded-xl">
                                <Folder className="w-10 h-10 text-gray-200" />
                            </div>
                            <span className="text-sm font-medium text-gray-200 text-center line-clamp-2">
                                {folder.name}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {collections.map((collection) => (
                    <motion.div
                        key={collection.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="cursor-pointer"
                        onClick={() => onCollectionClick(collection)}
                    >
                        <div
                            className="rounded-2xl p-4 aspect-square flex flex-col items-center justify-center gap-3 shadow-lg border border-opacity-20"
                            style={{
                                backgroundColor: collection.color || '#1A1A1A',
                                borderColor: collection.color || '#303030'
                            }}
                        >
                            <div className="bg-white bg-opacity-10 p-3 rounded-xl">
                                <File className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-sm font-medium text-white text-center line-clamp-2">
                                {collection.name}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
