'use client';

import dynamic from 'next/dynamic';

const UserMenu = dynamic(() => import('./UserMenu'), {
    ssr: false
});

export default function MenuWrapper() {
    return <UserMenu />;
} 