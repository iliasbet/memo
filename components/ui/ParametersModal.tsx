'use client';

import { X, Settings } from 'lucide-react';
import { RoundedButton } from './RoundedButton';
import { useTranslation } from 'react-i18next';

interface ParametersModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export const ParametersModal = ({ isOpen, onCloseAction }: ParametersModalProps) => {
    const { t, i18n } = useTranslation();

    if (!isOpen) return null;

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' },
        { code: 'es', name: 'Español' },
        { code: 'de', name: 'Deutsch' }
    ];

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        await i18n.changeLanguage(newLang);
        localStorage.setItem('i18nextLng', newLang);
        // Force a re-render of the entire app
        window.location.reload();
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
                    <Settings className="w-6 h-6 text-gray-400" />
                    <h2 className="text-2xl font-bold text-white">{t('settings.title')}</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">{t('settings.language')}</label>
                        <select
                            className="w-full px-4 py-2 bg-[#1E1E1E] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            value={i18n.language}
                            onChange={handleLanguageChange}
                        >
                            {languages.map(({ code, name }) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">Theme</label>
                        <select
                            className="w-full px-4 py-2 bg-[#1E1E1E] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            defaultValue="dark"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-400">Font Size</label>
                        <select
                            className="w-full px-4 py-2 bg-[#1E1E1E] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            defaultValue="medium"
                        >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}; 