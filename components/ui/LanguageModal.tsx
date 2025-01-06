'use client';

import { X, Globe } from 'lucide-react';
import { RoundedButton } from './RoundedButton';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

const AVAILABLE_LANGUAGES = [
    { code: 'fr', label: '🇫🇷 Français' },
    { code: 'en', label: '🇬🇧 English' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'de', label: '🇩🇪 Deutsch' },
] as const;

export const LanguageModal = ({ isOpen, onCloseAction }: LanguageModalProps) => {
    const { t, i18n } = useTranslation();

    if (!isOpen) return null;

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onCloseAction();
                }
            }}
        >
            <div className="bg-[#121212] border border-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md relative">
                <div className="absolute right-4 top-4">
                    <RoundedButton
                        variant="menu"
                        onClick={onCloseAction}
                        aria-label="Close"
                        icon={<X className="w-4 h-4" />}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-800"
                    />
                </div>

                <div className="flex items-center space-x-2 mb-6">
                    <Globe className="w-6 h-6 text-gray-400" />
                    <h2 className="text-2xl font-bold text-white">{t('settings.language')}</h2>
                </div>

                <div className="space-y-3">
                    {AVAILABLE_LANGUAGES.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                handleLanguageChange(lang.code);
                                onCloseAction();
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between rounded-xl transition-colors
                                ${i18n.language === lang.code 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-[#1E1E1E] text-gray-300 hover:bg-[#252525]'}`}
                        >
                            <span className="text-lg">{lang.label}</span>
                            {i18n.language === lang.code && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}; 