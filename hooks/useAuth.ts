'use client';

import { useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuthError = (err: any): void => {
        console.log('Code d\'erreur:', err?.code);
        const errorMessage = (() => {
            switch (err?.code) {
                case 'auth/invalid-email':
                    return 'Adresse email invalide';
                case 'auth/user-disabled':
                    return 'Ce compte a été désactivé';
                case 'auth/user-not-found':
                    return 'Aucun compte ne correspond à cet email';
                case 'auth/wrong-password':
                    return 'Mot de passe incorrect';
                case 'auth/email-already-in-use':
                    return 'Cette adresse email est déjà utilisée';
                case 'auth/weak-password':
                    return 'Le mot de passe doit contenir au moins 6 caractères';
                case 'auth/network-request-failed':
                    return 'Problème de connexion réseau';
                case 'auth/too-many-requests':
                    return 'Trop de tentatives, veuillez réessayer plus tard';
                case 'auth/configuration-not-found':
                    console.error('Configuration Firebase invalide:', err);
                    return 'Erreur de configuration. Veuillez contacter l\'administrateur.';
                default:
                    console.error('Erreur détaillée:', err);
                    return `Une erreur est survenue: ${err?.message || 'Erreur inconnue'}`;
            }
        })();
        setError(errorMessage);
    };

    useEffect(() => {
        console.log('Setting up auth listener...');
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user?.email);
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            console.log('Tentative de connexion...', email);
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Connexion réussie !');
        } catch (err) {
            console.error('Erreur de connexion:', err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            console.log('Tentative d\'inscription...', email);
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Inscription réussie !');
        } catch (err) {
            console.error('Erreur d\'inscription:', err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setIsLoading(true);
            console.log('Tentative de déconnexion...');
            await firebaseSignOut(auth);
            console.log('Déconnexion réussie !');
        } catch (err) {
            console.error('Erreur de déconnexion:', err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error('Erreur de connexion Google:', err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithMicrosoft = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const provider = new OAuthProvider('microsoft.com');
            await signInWithPopup(auth, provider);
        } catch (err) {
            console.error('Erreur de connexion Microsoft:', err);
            handleAuthError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        loading,
        isLoading,
        error,
        signIn,
        signUp,
        logout,
        signInWithGoogle,
        signInWithMicrosoft
    };
}; 