import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { MemoError } from '@/types/errors';

interface ErrorDisplayProps {
  error: MemoError;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ error, onRetry }) => {
  // Message utilisateur simplifié et rassurant
  const message = "Oups ! La génération du memo n'a pas fonctionné... Réessayons !";

  // Log l'erreur réelle dans la console
  console.error('Error details:', error);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'fixed',
        zIndex: 1000,
        width: '100%',
        maxWidth: '500px',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '100px'
      }}
    >
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden">
        <div className="py-1">
          <div className="flex items-center px-4 py-2.5 text-sm text-gray-300">
            <AlertCircle className="w-4 h-4 mr-3 text-red-400" />
            {message}
            {onRetry && (
              <button
                onClick={onRetry}
                className="ml-auto text-blue-500 hover:text-blue-400 transition-all duration-200"
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
