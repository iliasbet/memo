'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';
import { RoundedButton } from './RoundedButton';

type AuthMode = 'signin' | 'signup';

interface AuthModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    mode: AuthMode;
    onModeChangeAction: (mode: AuthMode) => void;
}

export const AuthModal = ({ isOpen, onCloseAction, mode, onModeChangeAction }: AuthModalProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, signUp, error: authError, isLoading } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (mode === 'signin') {
            await signIn(email, password);
        } else {
            await signUp(email, password);
        }
        if (!authError) {
            onCloseAction();
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    if (!isOpen) return null;

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
                <h2 className="text-2xl font-bold mb-6 text-white">
                    {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            className="w-full px-4 py-3 rounded-xl bg-[#1E1E1E] text-white border border-gray-800 focus:border-blue-500 focus:outline-none placeholder-gray-500"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            type="email"
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full px-4 py-3 rounded-xl bg-[#1E1E1E] text-white border border-gray-800 focus:border-blue-500 focus:outline-none placeholder-gray-500"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Mot de passe"
                            required
                        />
                    </div>
                    {authError && (
                        <div className="text-red-500 text-sm mt-2">
                            {authError}
                        </div>
                    )}
                    <div className="flex flex-col space-y-4 mt-6">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                        >
                            {isLoading ? 'Chargement...' : mode === 'signin' ? 'Se connecter' : "S'inscrire"}
                        </button>
                        <button
                            type="button"
                            onClick={() => onModeChangeAction(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-gray-400 hover:text-white text-sm text-center transition-colors"
                        >
                            {mode === 'signin' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
