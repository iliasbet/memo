import { useState } from 'react';
import { Menu as MenuIcon, UserPlus, LogIn, Home, Sparkles } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MenuBase } from '@/components/ui/MenuBase';
import { RoundedButton } from './RoundedButton';

interface MenuProps {
    onOpenAuthModal?: (mode: 'signin' | 'signup') => void;
    onOpenProModal?: () => void;
}

const Menu = ({ onOpenAuthModal, onOpenProModal }: MenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuthContext();
    const router = useRouter();

    const menuItems = [
        {
            icon: <Home className="w-4 h-4" />,
            label: 'Accueil',
            onClick: () => {
                router.push('/');
                setIsOpen(false);
            }
        },
        ...(!user ? [
            {
                icon: <LogIn className="w-4 h-4" />,
                label: 'Se connecter',
                onClick: () => {
                    onOpenAuthModal?.('signin');
                    setIsOpen(false);
                }
            },
            {
                icon: <UserPlus className="w-4 h-4" />,
                label: "S'inscrire",
                onClick: () => {
                    onOpenAuthModal?.('signup');
                    setIsOpen(false);
                }
            }
        ] : []),
        {
            icon: <Sparkles className="w-4 h-4" />,
            label: 'Passer à pro',
            onClick: () => {
                onOpenProModal?.();
                setIsOpen(false);
            },
            className: 'text-yellow-500'
        }
    ];

    return (
        <div className="fixed top-4 right-4 z-50">
            <RoundedButton
                variant="menu"
                onMouseDown={() => setIsOpen(!isOpen)}
                aria-label="Menu"
                icon={<MenuIcon className="w-6 h-6" />}
            />

            {isOpen && <MenuBase items={menuItems} />}
        </div>
    );
};

export default Menu; 