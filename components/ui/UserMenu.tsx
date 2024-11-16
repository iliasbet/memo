'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, LogIn, UserPlus, X, LogOut, User as UserIcon, Sparkles, Loader2, Folder, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthModal } from './AuthModal';
import { UserInfo } from './UserInfo';
import { useAuthContext } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { useStripe } from '@/hooks/useStripe';
import { ProModal } from './ProModal';
import { useRouter } from 'next/navigation';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
    const [showProModal, setShowProModal] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthContext();
    const { redirectToCheckout, isLoading } = useStripe();
    const router = useRouter();

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

    const handleCollectionsClick = () => {
        const collectionsSection = document.querySelector('.snap-start:nth-child(2)');
        collectionsSection?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    const handleHomeClick = () => {
        const homeSection = document.querySelector('.snap-start:first-child');
        homeSection?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 right-4 p-2 rounded-full bg-[#1A1A1A] hover:bg-[#252525] transition-colors duration-200"
            >
                <Menu className="w-6 h-6 text-gray-300" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-16 right-4 w-64 bg-[#1A1A1A] rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="py-2">
                            {user ? (
                                <>
                                    <UserInfo />
                                    <div className="border-t border-[#252525] my-2" />
                                    <button
                                        onClick={handleHomeClick}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Home className="w-4 h-4 mr-3" />
                                        Accueil
                                    </button>
                                    <button
                                        onClick={handleCollectionsClick}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Folder className="w-4 h-4 mr-3" />
                                        Collections
                                    </button>
                                    <div className="border-t border-[#252525] my-2" />
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Se déconnecter
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleHomeClick}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Home className="w-4 h-4 mr-3" />
                                        Accueil
                                    </button>
                                    <button
                                        onClick={() => handleAuthClick('signin')}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <LogIn className="w-4 h-4 mr-3" />
                                        Se connecter
                                    </button>
                                    <button
                                        onClick={() => handleAuthClick('signup')}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <UserPlus className="w-4 h-4 mr-3" />
                                        S'inscrire
                                    </button>
                                    <button
                                        onClick={handleCollectionsClick}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Folder className="w-4 h-4 mr-3" />
                                        Collections
                                    </button>
                                    <button
                                        onClick={() => setShowProModal(true)}
                                        className="flex items-center w-full px-4 py-2.5 text-sm text-yellow-500 hover:bg-[#252525] transition-all duration-200 font-normal"
                                    >
                                        <Sparkles className="w-4 h-4 mr-3" />
                                        Passer à pro
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
        </div>
    );
};

export default UserMenu; 