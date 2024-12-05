'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { X, Eye, EyeOff, Chrome, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

interface AuthModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    mode: 'signin' | 'signup';
    onModeChangeAction: (mode: 'signin' | 'signup') => void;
}

export const AuthModal = ({ isOpen, onCloseAction, mode, onModeChangeAction }: AuthModalProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const { signIn, signUp, signInWithGoogle, signInWithMicrosoft, error: authError, isLoading } = useAuth();
    const [errorMessage, setErrorMessage] = useState('');

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setErrorMessage('L\'email est requis');
            return;
        }
        setShowPasswordFields(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (mode === 'signin') {
                await signIn?.(email, password);
            } else {
                await signUp?.(email, password);
            }
            onCloseAction();
        } catch (err) {
            // L'erreur est déjà gérée dans useAuth
        }
    };

    const validateForm = () => {
        if (!email) {
            setErrorMessage('L\'email est requis');
            return false;
        }
        if (!password) {
            setErrorMessage('Le mot de passe est requis');
            return false;
        }
        if (mode === 'signup') {
            if (password.length < 6) {
                setErrorMessage('Le mot de passe doit contenir au moins 6 caractères');
                return false;
            }
            if (password !== confirmPassword) {
                setErrorMessage('Les mots de passe ne correspondent pas');
                return false;
            }
        }
        return true;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCloseAction}>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <DialogOverlay asChild>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            />
                        </DialogOverlay>

                        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[500px] translate-x-[-50%] translate-y-[-50%] border-none bg-transparent p-0 shadow-lg">
                            <DialogTitle className="sr-only">
                                {mode === 'signin' ? 'Se connecter' : 'Créer un compte'}
                            </DialogTitle>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.9,
                                    y: 20,
                                    rotateX: -10,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                    rotateX: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: -20,
                                    rotateX: 10,
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.16, 1, 0.3, 1],
                                    opacity: { duration: 0.25 },
                                    scale: { duration: 0.35 },
                                    y: { duration: 0.35 }
                                }}
                                className="bg-[#1A1A1A] rounded-2xl w-full overflow-hidden perspective-1000"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.15,
                                        duration: 0.35,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                >
                                    <div className="relative h-[180px]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#222222] overflow-hidden rounded-t-2xl">
                                            <div className="absolute inset-0 opacity-[0.15] noise-bg" />

                                            <div className="absolute inset-0">
                                                <div className="absolute -top-[20%] -left-[20%] w-[600px] h-[600px] rounded-full bg-[#067934]/10 blur-3xl animate-orb-float-1" />
                                                <div className="absolute -top-[10%] -right-[30%] w-[800px] h-[800px] rounded-full bg-[#8b0909]/10 blur-3xl animate-orb-float-2" />
                                                <div className="absolute -bottom-[30%] -left-[10%] w-[700px] h-[700px] rounded-full bg-[#08489d]/10 blur-3xl animate-orb-float-3" />
                                                <div className="absolute top-[20%] -left-[15%] w-[500px] h-[500px] rounded-full bg-[#9f770d]/10 blur-3xl animate-orb-float-4" />
                                                <div className="absolute -bottom-[20%] -right-[20%] w-[900px] h-[900px] rounded-full bg-[#6A0DAD]/10 blur-3xl animate-orb-float-5" />
                                            </div>
                                        </div>

                                        <div className="relative z-10 flex justify-center items-center h-full">
                                            <Image
                                                src="/memo.svg"
                                                alt="Logo Memo"
                                                width={140}
                                                height={70}
                                                priority
                                                draggable={false}
                                                className="select-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="px-6 pb-6 space-y-6">
                                        <h3 className="text-xl text-center text-gray-200 font-normal mt-8">
                                            {mode === 'signin' ? 'Se connecter' : 'Créer un compte'}
                                        </h3>

                                        <form onSubmit={showPasswordFields ? handleSubmit : handleContinue} className="space-y-4">
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Adresse e-mail"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full p-3 rounded-2xl bg-[#252525] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-normal"
                                                />
                                            </div>

                                            {!showPasswordFields ? (
                                                <button
                                                    type="submit"
                                                    className="w-full p-3 rounded-2xl bg-blue-600 text-white font-normal hover:bg-blue-500 transition-colors flex items-center justify-center"
                                                >
                                                    Continuer
                                                </button>
                                            ) : (
                                                <>
                                                    <div className="relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Mot de passe"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            className="w-full p-3 rounded-2xl bg-[#252525] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-normal"
                                                        />
                                                        <button
                                                            type="button"
                                                            onMouseDown={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                        >
                                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                        </button>
                                                    </div>

                                                    {mode === 'signup' && (
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Confirmer le mot de passe"
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            className="w-full p-3 rounded-2xl bg-[#252525] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 font-normal"
                                                        />
                                                    )}

                                                    <button
                                                        type="submit"
                                                        className="w-full p-3 rounded-2xl bg-blue-600 text-white font-normal hover:bg-blue-500 transition-colors flex items-center justify-center"
                                                    >
                                                        {mode === 'signin' ? 'Se connecter' : "S'inscrire"}
                                                    </button>
                                                </>
                                            )}
                                        </form>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-700"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-[#1A1A1A] text-gray-500">ou</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onMouseDown={() => signInWithGoogle?.()}
                                                className="w-full p-3 rounded-2xl bg-[#252525] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-3"
                                            >
                                                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                                                <span className="text-gray-200 font-normal">Continuer avec Google</span>
                                            </button>

                                            <button
                                                type="button"
                                                onMouseDown={() => signInWithMicrosoft?.()}
                                                className="w-full p-3 rounded-2xl bg-[#252525] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-3"
                                            >
                                                <img src="/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
                                                <span className="text-gray-200 font-normal">Continuer avec Microsoft</span>
                                            </button>
                                        </div>

                                        <p className="text-center text-sm text-gray-500">
                                            {mode === 'signin' ? (
                                                <>Vous n'avez pas de compte ? <button onMouseDown={() => onModeChangeAction('signup')} className="text-blue-500 hover:text-blue-400">S'inscrire</button></>
                                            ) : (
                                                <>Vous avez djà un compte ? <button onMouseDown={() => onModeChangeAction('signin')} className="text-blue-500 hover:text-blue-400">Connexion</button></>
                                            )}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </DialogContent>
                    </>
                )}
            </AnimatePresence>
        </Dialog>
    );
};
