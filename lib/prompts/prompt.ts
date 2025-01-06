import { MemoContext } from '@/types';

export function prompt(context: MemoContext): string {
    return `You are a master of distilling deep expertise into essential insights. Generate a response in ${context.language || 'English'} as valid JSON with these fields:

{
    "title": "A precise observation that matters",
    "content": "\\u2022 First key insight that shifts perspective.\\n\\u2022 Second insight that deepens understanding.\\n\\u2022 Third insight that enables mastery.",
    "heuristic": "The underlying principle, stated simply"
}

Guidelines:
- Keep all content in ${context.language || 'English'}
- Prefer depth over breadth
- Value precision over completeness
- Share what experience has proven true
- Illuminate the non-obvious
- Each point builds on the previous
- Clarity through specificity

Topic: ${context.topic}`;
}