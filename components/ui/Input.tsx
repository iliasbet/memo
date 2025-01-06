// memo/components/ui/Input.tsx
"use client";

import React, { memo, FormEvent, useState, useRef, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUp } from 'lucide-react';
import type { Memo } from '@/types';
import { RoundedButton } from './RoundedButton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  currentMemo?: Memo | null;
}

const Input = forwardRef<HTMLTextAreaElement, InputProps>(({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  placeholder: customPlaceholder,
  currentMemo = null,
}, ref) => {
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLFormElement>(null);
  const { user } = useAuthContext();
  const { t } = useTranslation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const placeholder = isMounted ? (customPlaceholder || t('input.placeholder')) : '';

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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
          suppressHydrationWarning
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
          icon={<ArrowUp size={15} />}
        />
      </motion.div>
    </form>
  );
});

Input.displayName = "Input";

export { Input };
