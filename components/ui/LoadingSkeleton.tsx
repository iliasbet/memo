import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoadingSkeleton = () => {
  const { t } = useTranslation();
  
  return (
    <div className="w-full max-w-[400px] aspect-[3/4] mx-auto bg-gray-800 rounded-xl shadow-2xl animate-pulse">
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-600">{t('auth.loading')}</div>
      </div>
    </div>
  );
}; 