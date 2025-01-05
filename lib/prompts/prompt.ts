import { MemoContext } from '@/types';

export function prompt(context: MemoContext): string {
    return `You are an expert in creating clear, actionable learning cards.

Task: Create a structured learning card that breaks down a concept into clear steps or points.
Your response must be a valid JSON object with exactly two fields: "title" and "content".

FORMAT:
{
    "title": "Main concept or action to learn",
    "content": "• First key point or step to understand\n• Second important consideration\n• Third practical tip or insight\n• Final actionable takeaway"
}

RULES:
1. Response MUST be valid JSON with exactly these fields: "title" and "content"
2. Title: Clear, action-oriented phrase (max 8 words)
3. Content: 3-5 bullet points that follow a logical progression
4. Each bullet point must:
   - Start with "• " (bullet point and space)
   - Be concise (1-2 lines)
   - Be action-focused
   - Be clear and practical
5. Use simple, direct language
6. Focus on one core concept or skill
7. Separate points with "\\n" (newline)
8. Do not include any other formatting or fields

Topic to explain: ${context.topic}

Remember: Your entire response must be a single, valid JSON object.`;
} 