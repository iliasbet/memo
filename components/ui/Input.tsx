// memo/components/ui/Input.tsx
"use client";

import React, { memo, FormEvent, useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Search, Send } from 'lucide-react';
import type { Memo } from '@/types';
import { RoundedButton } from './RoundedButton';
import { useAuthContext } from '@/contexts/AuthContext';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  currentMemo?: Memo | null;
  onAddToCollection?: (memo: Memo) => void;
  ref?: React.RefObject<HTMLTextAreaElement>;
}

const SendIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 1L7.5 14M7.5 1L1.5 7M7.5 1L13.5 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Input = forwardRef<HTMLTextAreaElement, InputProps>(({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder,
  currentMemo = null,
  onAddToCollection
}, ref) => {
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  const handleSuccess = useCallback(() => {
    setShowSuccessAnimation(true);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setShowSuccessAnimation(false);
    }, 2000);
  }, []);

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

  // Synchroniser les refs
  useEffect(() => {
    if (ref && typeof ref === 'object') {
      ref.current = textareaRef.current;
    }
  }, [ref]);

  return (
    <form
      ref={containerRef}
      onSubmit={handleSubmit}
      className="relative w-full flex justify-center items-center"
    >
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
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={isLoading}
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
            isError ? 'shake-error' : ''
          )}
          style={{
            display: 'block',
            height: 'auto',
            overflowY: value.includes('\n') ? 'auto' : 'hidden',
            maxHeight: '200px',
          }}
        />
        <RoundedButton
          variant="send"
          onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          disabled={isLoading}
          isLoading={isLoading}
          className="absolute right-2 top-1.5"
          icon={<SendIcon />}
        />
      </motion.div>
    </form>
  );
});

Input.displayName = 'Input';
export { Input };
