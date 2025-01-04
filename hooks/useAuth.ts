'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
        } catch (err) {
            console.error('Error signing in:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during sign in');
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
        } catch (err) {
            console.error('Error signing up:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during sign up');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (err) {
            console.error('Error signing out:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during sign out');
        } finally {
            setIsLoading(false);
        }
    };

    return { user, loading, isLoading, error, signIn, signUp, logout };
}; 