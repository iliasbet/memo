import { MemoContext } from '@/types';

export function prompt(context: MemoContext): string {
    return `You are an expert in creating clear, actionable learning cards.

IMPORTANT: You MUST generate the response in ${context.language || 'English'}.
The entire response MUST be in ${context.language || 'English'} - this includes the title, content, and mantra.
DO NOT mix languages or translate to any other language.

Task: Create a structured learning card that breaks down a concept into clear steps or points.
Your response must be a valid JSON object with exactly three fields: "title", "content", and "mantra".

FORMAT:
{
    "title": "Main concept or action to learn",
    "content": "• First key point or step to understand\n• Second important consideration\n• Third practical tip or insight\n• Final actionable takeaway",
    "mantra": "A memorable rule of thumb or mental model that captures the essence"
}

RULES:
1. Response MUST be valid JSON with exactly these fields: "title", "content", and "mantra"
2. Title: Clear, action-oriented phrase (max 8 words)
3. Content: 3-5 bullet points that follow a logical progression
4. Each bullet point must:
   - Start with "• " (bullet point and space)
   - Be concise (1-2 lines)
   - Be action-focused
   - Be clear and practical
5. Mantra: A short, memorable phrase that captures the core principle (max 15 words)
6. Use simple, direct language
7. Focus on one core concept or skill
8. Separate points with "\\n" (newline)
9. Do not include any other formatting or fields
10. MAINTAIN ${context.language || 'English'} throughout the entire response

Topic to explain: ${context.topic}`;
} 