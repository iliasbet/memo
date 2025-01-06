"use client";

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type BaseButtonProps = {
    variant?: 'menu' | 'send' | 'action';
    icon?: React.ReactNode;
    isLoading?: boolean;
    animate?: boolean;
};

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;
type MotionButtonProps = Omit<HTMLMotionProps<"button">, keyof BaseButtonProps>;

type RoundedButtonProps = BaseButtonProps & (BaseButtonProps['animate'] extends true ? MotionButtonProps : ButtonProps);

const variantStyles = {
    menu: "p-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300",
    send: "w-9 h-9 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300",
    action: "p-3 bg-[#252525] hover:bg-[#303030] text-gray-300"
} as const;

const motionConfig = {
    initial: { opacity: 0.9, scale: 0.95 },
    whileHover: { opacity: 1, scale: 1 },
    whileTap: { scale: 0.95 }
} as const;

const loadingAnimation = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 }
} as const;

const RoundedButton = React.forwardRef<HTMLButtonElement, RoundedButtonProps>(
    ({ className, variant = 'action', icon, isLoading = false, animate = true, children, ...props }, ref) => {
        const baseClassName = cn(
            "rounded-full",
            "flex items-center justify-center",
            "transition-colors duration-200",
            "disabled:opacity-50",
            "select-none touch-none",
            variantStyles[variant],
            className
        );

        const renderContent = () => (
            isLoading ? (
                animate ? (
                    <motion.div {...loadingAnimation} className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
                )
            ) : (
                icon || children
            )
        );

        if (!animate) {
            return (
                <button
                    ref={ref}
                    className={baseClassName}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    {...(props as ButtonProps)}
                >
                    {renderContent()}
                </button>
            );
        }

        return (
            <motion.button
                ref={ref}
                className={baseClassName}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                {...motionConfig}
                {...(props as MotionButtonProps)}
            >
                {renderContent()}
            </motion.button>
        );
    }
);

RoundedButton.displayName = "RoundedButton";

export { RoundedButton }; 