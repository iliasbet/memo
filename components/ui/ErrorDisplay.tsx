import React from 'react';
import { MemoError, ErrorCode } from '@/types/errors';

interface ErrorDisplayProps {
  error: MemoError;
  onRetry?: () => void;
}

const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.API_ERROR]: "Une erreur est survenue lors de la communication avec l'API. Veuillez réessayer.",
  [ErrorCode.OPENAI_ERROR]: "Le service de génération est temporairement indisponible. Veuillez réessayer plus tard.",
  [ErrorCode.PARSING_ERROR]: "Le format des données reçues est invalide. Notre équipe a été notifiée.",
  [ErrorCode.NETWORK_ERROR]: "Problème de connexion réseau. Vérifiez votre connexion internet.",
  [ErrorCode.VALIDATION_ERROR]: "Les données générées ne respectent pas le format attendu. Veuillez réessayer.",
  [ErrorCode.TIMEOUT_ERROR]: "La requête a expiré. Veuillez réessayer plus tard."
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ error, onRetry }) => {
  const message = errorMessages[error.code] || "Une erreur inattendue est survenue. Veuillez réessayer.";

  return (
    <div className="rounded-lg bg-red-50 p-4 my-4" role="alert" aria-live="assertive">
      <div className="flex items-start">
        <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message}</h3>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              aria-label="Réessayer"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
