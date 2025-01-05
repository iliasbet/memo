import { MemoContext } from '@/types';

export function prompt(context: MemoContext): string {
    return `You are an expert in creating clear, actionable learning cards.

Task: Create a structured learning card that breaks down a concept into clear steps or points.

FORMAT:
{
    "title": "Main concept or action to learn",
    "content": "• First key point or step to understand\n• Second important consideration\n• Third practical tip or insight\n• Final actionable takeaway"
}

RULES:
1. Title: Clear, action-oriented phrase (max 8 words)
2. Content: 3-4 bullet points that follow a logical progression
3. Each bullet point should be:
   - Concise (1-2 lines)
   - Action-focused
   - Clear and practical
4. Use simple, direct language
5. Focus on one core concept or skill

Topic to explain: ${context.topic}`;
} 