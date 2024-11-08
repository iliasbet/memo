// memo/components/ui/Button.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                    variant === "default" && "bg-memoUser text-white hover:bg-memoUser-dark",
                    variant === "destructive" && "bg-red-500 text-white hover:bg-red-600",
                    variant === "outline" && "border border-gray-700 text-white hover:bg-gray-700",
                    variant === "secondary" && "bg-gray-600 text-white hover:bg-gray-700",
                    variant === "ghost" && "text-white hover:bg-gray-800",
                    variant === "link" && "underline-offset-4 hover:underline text-white",
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
