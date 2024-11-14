'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogIn, UserPlus, X, LogOut, User as UserIcon, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from './AuthModal';
import { UserInfo } from './UserInfo';
import { useAuthContext } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { useStripe } from '@/hooks/useStripe';
import { ProModal } from './ProModal';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [showProModal, setShowProModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthContext();
    const { redirectToCheckout, isLoading } = useStripe();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAuthClick = (mode: 'signin' | 'signup') => {
        setAuthMode(mode);
        setShowAuthModal(true);
        setIsOpen(false);
    };

    const handleLogout = async () => {
        try {
            await auth.signOut();
            setIsOpen(false);
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const handleModeChangeAction = (newMode: 'signin' | 'signup') => {
        setAuthMode(newMode);
    };

    return (
        <>
            <div className="fixed top-4 right-4 z-50" ref={menuRef}>
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#252525] transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={false}
                    animate={{
                        rotate: isOpen ? 90 : 0,
                        scale: 1
                    }}
                    transition={{
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -45 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 45 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-5 h-5 text-gray-300" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, rotate: 45 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -45 }}
                                transition={{ duration: 0.2 }}
                            >
                                {user ? <UserIcon className="w-5 h-5 text-gray-300" /> : <Menu className="w-5 h-5 text-gray-300" />}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 py-2 bg-[#1A1A1A] rounded-2xl shadow-xl"
                        >
                            {user ? (
                                <>
                                    <UserInfo />
                                    <button
                                        onClick={() => setShowProModal(true)}
                                        disabled={isLoading}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Sparkles className="w-4 h-4 mr-3 text-yellow-500" />
                                        {isLoading ? (
                                            <span className="flex items-center font-normal">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Chargement...
                                            </span>
                                        ) : (
                                            'Passer à pro'
                                        )}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-medium border-t border-[#252525]"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Se déconnecter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleAuthClick('signin')}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-blue-600/20 transition-all duration-200 font-medium"
                                    >
                                        <LogIn className="w-4 h-4 mr-3" />
                                        Se connecter
                                    </button>
                                    <button
                                        onClick={() => handleAuthClick('signup')}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-blue-600/20 transition-all duration-200 font-medium"
                                    >
                                        <UserPlus className="w-4 h-4 mr-3" />
                                        S'inscrire
                                    </button>
                                    <button
                                        onClick={() => setShowProModal(true)}
                                        disabled={isLoading}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Sparkles className="w-4 h-4 mr-3 text-yellow-500" />
                                        {isLoading ? (
                                            <span className="flex items-center font-normal">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Chargement...
                                            </span>
                                        ) : (
                                            'Passer à pro'
                                        )}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onCloseAction={() => setShowAuthModal(false)}
                mode={authMode}
                onModeChangeAction={handleModeChangeAction}
            />

            <ProModal
                isOpen={showProModal}
                onCloseAction={() => setShowProModal(false)}
            />
        </>
    );
};

export default UserMenu; 