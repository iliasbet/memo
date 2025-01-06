'use client';

import { X, Sparkles, Check } from 'lucide-react';
import { RoundedButton } from './RoundedButton';
import { useTranslation } from 'react-i18next';

interface ProModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export const ProModal = ({ isOpen, onCloseAction }: ProModalProps) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const features = [
        t('pro.features.unlimited'),
        t('pro.features.styles'),
        t('pro.features.support'),
        t('pro.features.preview'),
    ];

    const handleSubscribe = () => {
        // TODO: Implement subscription logic
        onCloseAction();
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
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-white">{t('menu.goPro')}</h2>
                </div>

                <p className="text-gray-400 mb-6">
                    {t('pro.description')}
                </p>

                <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <Check className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-white">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="text-center">
                        <span className="text-3xl font-bold text-white">{t('pro.price.amount')}</span>
                        <span className="text-gray-400 ml-2">{t('pro.price.period')}</span>
                    </div>

                    <button
                        onClick={handleSubscribe}
                        className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {t('pro.subscribe')}
                    </button>
                </div>
            </div>
        </div>
    );
}; 