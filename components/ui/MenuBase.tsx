import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MenuItemProps {
    icon?: React.ReactNode;
    label: React.ReactNode;
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

interface MenuBaseProps {
    items: MenuItemProps[];
    position?: 'top' | 'bottom';
    align?: 'left' | 'right';
    className?: string;
}

export const MenuItem = ({ icon, label, onClick, className, disabled }: MenuItemProps) => (
    <button
        onMouseDown={onClick}
        disabled={disabled}
        className={cn(
            "flex items-center w-full px-4 py-2.5 text-sm text-gray-300",
            "hover:bg-[#252525] transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
        )}
    >
        {icon && <span className="w-4 h-4 mr-3">{icon}</span>}
        {label}
    </button>
);

export const MenuBase = ({ items, position = 'bottom', align = 'right', className }: MenuBaseProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: position === 'bottom' ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === 'bottom' ? -10 : 10 }}
            transition={{ duration: 0.15 }}
            className={cn(
                "bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg overflow-hidden",
                "min-w-[200px] max-w-[280px]",
                position === 'bottom' ? 'mt-2' : 'mb-2',
                align === 'right' ? 'right-0' : 'left-0',
                className
            )}
        >
            <div className="py-1">
                {items.map((item, index) => (
                    <MenuItem key={index} {...item} />
                ))}
            </div>
        </motion.div>
    );
}; 