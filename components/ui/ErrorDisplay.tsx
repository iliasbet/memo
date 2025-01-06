import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { MemoError } from '@/types/errors';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  error: MemoError | string;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ error, onRetry, onClose }) => {
  const { t } = useTranslation();
  
  // Message utilisateur simplifié et rassurant
  const message = typeof error === 'string'
    ? error
    : t('error.default');

  // Log l'erreur réelle dans la console de manière sécurisée
  if (error instanceof Error) {
    console.error('Error details:', error);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      className="relative w-full flex justify-center"
    >
      <div className="w-full max-w-[500px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden">
        <div className="py-1">
          <div className="flex items-center px-4 py-2.5 text-sm text-gray-300">
            <AlertCircle className="w-4 h-4 mr-3 text-yellow-500" />
            {message}
            <div className="flex items-center gap-2 ml-auto">
              {onRetry && (
                <button
                  onMouseDown={onRetry}
                  className="text-blue-500 hover:text-blue-400 transition-all duration-200"
                >
                  {t('error.retry')}
                </button>
              )}
              <button
                onMouseDown={onClose}
                className="text-gray-400 hover:text-gray-300 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ErrorDisplay.displayName = 'ErrorDisplay';
