'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export const UserInfo = () => {
    const { user } = useAuthContext();

    if (!user) return null;

    return (
        <div className="px-4 py-2 border-b border-[#252525]">
            <p className="text-sm text-gray-400 truncate">
                {user.email}
            </p>
        </div>
    );
}; 