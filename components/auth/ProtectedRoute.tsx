'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { LoadingCard } from '../ui/LoadingCard';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return <LoadingCard />;
    }

    return user ? <>{children}</> : null;
} 