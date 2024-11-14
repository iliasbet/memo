// memo/components/ui/Input.tsx
"use client";

import React, { memo, FormEvent, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  onNewLine?: () => void;
}

const Input: React.FC<InputProps> = memo(({ value, onChange, onSubmit, isLoading = false, placeholder, onNewLine }) => {
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value || value.trim() === '') {
      triggerShake();
      return;
    }
    onSubmit?.();
  };

  const triggerShake = () => {
    if (textareaRef.current) {
      textareaRef.current.classList.remove('shake-error');
      void textareaRef.current.offsetWidth;
      textareaRef.current.classList.add('shake-error');
    }
    setIsError(true);
    setTimeout(() => setIsError(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.preventDefault();
        const cursorPosition = e.currentTarget.selectionStart;
        const newValue = value.slice(0, cursorPosition) + '\n' + value.slice(cursorPosition);
        onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>);
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  // Animation variants pour l'input
  const inputVariants = {
    idle: {
      scale: 1,
      width: "420px",
    },
    focused: {
      scale: 1.02,
      width: "440px",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Animation variants pour le bouton
  const buttonVariants = {
    idle: {
      scale: 1,
      backgroundColor: "#2A2A2A"
    },
    hover: {
      scale: 1.1,
      backgroundColor: "#3A3A3A",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    loading: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full flex justify-center items-center">
      <motion.div
        className="relative inline-flex items-start"
        initial="idle"
        animate={isFocused ? "focused" : "idle"}
        variants={inputVariants}
      >
        <motion.textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
          onKeyDown={handleKeyDown}
          className={cn(
            "block",
            "w-full",
            "px-5 py-3 pr-14",
            "bg-[#1E1E1E]",
            "rounded-[20px]",
            "text-white placeholder-gray-400",
            "focus:outline-none disabled:opacity-50",
            "font-lexend font-light text-base",
            "transition-all duration-200",
            "resize-none",
            "min-h-[48px]",
            "leading-relaxed",
            "overflow-hidden",
          )}
          style={{
            display: 'block',
            height: 'auto',
            overflowY: value.includes('\n') ? 'auto' : 'hidden',
            maxHeight: '200px',
          }}
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          initial="idle"
          animate={isLoading ? "loading" : isHovered ? "hover" : "idle"}
          variants={buttonVariants}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className={cn(
            "absolute right-2 top-1.5",
            "w-9 h-9",
            "rounded-full",
            "flex items-center justify-center",
            "text-gray-300",
            "disabled:opacity-50",
            "select-none touch-none",
            "bg-[#2A2A2A]",
            "hover:bg-[#3A3A3A]",
            "transition-colors duration-200"
          )}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent"
              />
            ) : (
              <motion.svg
                key="send"
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <path
                  d="M7.5 1L7.5 14M7.5 1L1.5 7M7.5 1L13.5 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </form>
  );
});

Input.displayName = 'Input';

export { Input };
