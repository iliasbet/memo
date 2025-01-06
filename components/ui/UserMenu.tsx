'use client';

import React, { useState } from 'react';
import { LogOut, Settings, User, Crown, Globe } from 'lucide-react';
import { RoundedButton } from './RoundedButton';
import { MenuBase } from './MenuBase';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface UserMenuProps {
    onSettingsClick: () => void;
    onProClick: () => void;
    onAuthClick: () => void;
    onLanguageClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
    onSettingsClick, 
    onProClick, 
    onAuthClick,
    onLanguageClick 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuthContext();
    const { t } = useTranslation();

    const handleSignOut = async () => {
        await signOut();
        setIsOpen(false);
    };

    const handleSettingsClick = () => {
        onSettingsClick();
        setIsOpen(false);
    };

    const handleProClick = () => {
        onProClick();
        setIsOpen(false);
    };

    const handleAuthClick = () => {
        onAuthClick();
        setIsOpen(false);
    };

    const menuItems = user ? [
        {
            icon: <User className="w-4 h-4" />,
            label: t('menu.logout'),
            onClick: handleSignOut
        },
        {
            icon: <Settings className="w-4 h-4" />,
            label: t('menu.settings'),
            onClick: handleSettingsClick
        },
        {
            icon: <Crown className="w-4 h-4 text-yellow-500" />,
            label: t('menu.goPro'),
            onClick: handleProClick,
            className: "text-yellow-500 hover:text-yellow-400"
        }
    ] : [
        {
            icon: <User className="w-4 h-4" />,
            label: t('menu.login'),
            onClick: handleAuthClick
        },
        {
            icon: <Settings className="w-4 h-4" />,
            label: t('menu.settings'),
            onClick: handleSettingsClick
        },
        {
            icon: <Crown className="w-4 h-4 text-yellow-500" />,
            label: t('menu.goPro'),
            onClick: handleProClick,
            className: "text-yellow-500 hover:text-yellow-400"
        }
    ];

    return (
        <div className="relative">
            <RoundedButton
                variant="menu"
                onClick={() => setIsOpen(!isOpen)}
                icon={<User className="w-4 h-4" />}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-800"
            />
            {isOpen && (
                <MenuBase items={menuItems} />
            )}
        </div>
    );
};

export default UserMenu; 