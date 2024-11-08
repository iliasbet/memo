import React from 'react';
import { MemoError, ErrorCode } from '@/types/errors';

interface ErrorDisplayProps {
  error: MemoError;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => {
  const getErrorMessage = (error: MemoError): string => {
    switch (error.code) {
      case ErrorCode.API_ERROR:
        return "Une erreur est survenue lors de la communication avec l'API. Veuillez réessayer.";
      case ErrorCode.OPENAI_ERROR:
        return "Le service de génération est temporairement indisponible. Veuillez réessayer plus tard.";
      case ErrorCode.PARSING_ERROR:
        return "Le format des données reçues est invalide. Notre équipe a été notifiée.";
      case ErrorCode.NETWORK_ERROR:
        return "Problème de connexion réseau. Vérifiez votre connexion internet.";
      case ErrorCode.VALIDATION_ERROR:
        return "Les données générées ne respectent pas le format attendu. Veuillez réessayer.";
      default:
        return "Une erreur inattendue s'est produite. Veuillez réessayer.";
    }
  };

  return (
    <div className="rounded-lg bg-red-50 p-4 my-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {getErrorMessage(error)}
          </h3>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
