import { OpenAI } from 'openai';
import { Memo, MemoSection, SectionType } from '@/types';
import { prompt } from './prompts/index';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function makeAICall(prompt: string, content: string): Promise<string> {
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content }
        ],
        temperature: 0.7
    });

    return response.choices[0]?.message?.content || '';
}

export async function generateMemo(content: string): Promise<Memo> {
    try {
        const response = await makeAICall(prompt({ topic: content }), content);
        let memoContent;
        
        try {
            memoContent = JSON.parse(response);
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            throw new Error('Invalid AI response format');
        }

        // Validate required fields
        if (!memoContent.title || !memoContent.subtitle || !memoContent.content) {
            throw new Error('Missing required fields in AI response');
        }

        const sections: MemoSection[] = [
            {
                type: SectionType.Title,
                content: memoContent.title
            },
            {
                type: SectionType.Subtitle,
                content: memoContent.subtitle
            },
            {
                type: SectionType.Content,
                content: memoContent.content
            }
        ];

        return {
            id: `memo-${Date.now()}`,
            content,
            sections
        };
    } catch (error) {
        console.error('Error generating memo:', error);
        throw error;
    }
}