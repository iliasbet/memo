// memo/components/ui/Input.tsx
"use client";

import React, { memo, FormEvent } from "react";
import { cn } from "@/lib/utils";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const Input: React.FC<InputProps> = memo(({ value, onChange, onSubmit, isLoading = false, placeholder }) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex justify-center items-center">
      <label htmlFor="memo-input" className="sr-only">
        {placeholder}
      </label>
      <input
        id="memo-input"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          "w-[420px] px-5 py-3 pr-14 bg-[#1E1E1E] rounded-full text-white placeholder-gray-400 focus:outline-none disabled:opacity-50 font-lexend"
        )}
      />
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "absolute right-2 w-9 h-9 rounded-full bg-[#2A2A2A] hover:bg-[#3A3A3A] disabled:opacity-50 transition-colors flex items-center justify-center text-gray-300 hover:text-white"
        )}
        aria-label="Soumettre"
      >
        {isLoading ? (
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform"
          >
            <path
              d="M12 20L12 4M12 4L6 10M12 4L18 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </form>
  );
});

Input.displayName = 'Input';

export { Input };
