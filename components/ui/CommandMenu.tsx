import React from 'react';
import { motion } from 'framer-motion';
import { Edit, FolderPlus } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CommandMenuProps {
    onEdit: () => void;
    onAddToCollection: () => void;
    inputRect: DOMRect | null;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ onEdit, onAddToCollection, inputRect }) => {
    if (!inputRect) return null;

    // Calculate position relative to input, but above it
    const menuStyle = {
        position: 'fixed' as const,
        bottom: `${window.innerHeight - inputRect.top + 8}px`, // Position above the input
        left: `${inputRect.left}px`,
        width: `${inputRect.width}px`,
        zIndex: 1000,
    };

    const menuContent = (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            style={menuStyle}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden"
        >
            <div className="py-1">
                <button
                    onClick={onEdit}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200"
                >
                    <Edit className="w-4 h-4 mr-3" />
                    Modifier le memo
                </button>
                <button
                    onClick={onAddToCollection}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200"
                >
                    <FolderPlus className="w-4 h-4 mr-3" />
                    Ajouter au musée
                </button>
            </div>
        </motion.div>
    );

    return createPortal(menuContent, document.body);
}; 