import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MEMO_COLORS } from '@/constants/colors';
import { SectionType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMemoColor(type: SectionType): string {
    const color = MEMO_COLORS[type as keyof typeof MEMO_COLORS] || '#121212';
    return color;
}
