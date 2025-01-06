import { OpenAI } from 'openai';
import { Memo, MemoSection, SectionType } from '@/types';
import { prompt } from './prompts/index';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    timeout: 30000, // 30 second timeout
});

async function makeAICall(prompt: string, content: string): Promise<string> {
    try {
        console.log('Making OpenAI API call with prompt:', prompt);
        
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const aiResponse = response.choices[0]?.message?.content;
        if (!aiResponse) {
            console.error('Empty response from OpenAI:', response);
            throw new Error('Empty response from AI');
        }

        console.log('Received AI response:', aiResponse);
        return aiResponse;

    } catch (error) {
        console.error('OpenAI API Error:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
            prompt,
            content
        });
        
        if (error instanceof Error) {
            if (error.message.includes('timeout')) {
                throw new Error('OpenAI API request timed out. Please try again.');
            }
            if (error.message.includes('rate limit')) {
                throw new Error('Too many requests. Please try again in a moment.');
            }
            if (error.message.includes('insufficient_quota')) {
                throw new Error('OpenAI API quota exceeded. Please try again later.');
            }
            throw new Error(`OpenAI API Error: ${error.message}`);
        }
        
        throw new Error('Failed to generate memo content. Please try again.');
    }
}

export async function generateMemo(content: string, language: string = 'en'): Promise<Memo> {
    if (!content.trim()) {
        throw new Error('Content cannot be empty');
    }

    try {
        const promptText = prompt({ topic: content, language });
        const response = await makeAICall(promptText, content);
        let memoContent;
        
        try {
            memoContent = JSON.parse(response.trim());
        } catch (error) {
            console.error('Failed to parse AI response:', {
                response,
                error: error instanceof Error ? error.message : 'Unknown parsing error',
                content,
                language
            });
            throw new Error(`Invalid JSON response from AI: ${error instanceof Error ? error.message : 'Unknown parsing error'}`);
        }

        // Validate required fields
        if (!memoContent || typeof memoContent !== 'object') {
            console.error('Invalid memo structure - not an object:', { memoContent, content, language });
            throw new Error('Invalid response structure from AI: Response is not an object');
        }

        if (!memoContent.title || typeof memoContent.title !== 'string') {
            console.error('Invalid memo title:', { memoContent, content, language });
            throw new Error('Missing or invalid title in AI response');
        }

        if (!memoContent.content || typeof memoContent.content !== 'string') {
            console.error('Invalid memo content:', { memoContent, content, language });
            throw new Error('Missing or invalid content in AI response');
        }

        if (!memoContent.heuristic || typeof memoContent.heuristic !== 'string') {
            console.error('Invalid memo heuristic:', { memoContent, content, language });
            throw new Error('Missing or invalid heuristic in AI response');
        }

        // Clean up the content: normalize newlines and ensure bullet points
        const cleanContent = memoContent.content
            .replace(/\\n/g, '\n') // Replace escaped newlines with actual newlines
            .replace(/\n+/g, '\n') // Replace multiple newlines with single newlines
            .split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0)
            .map((line: string) => line.startsWith('•') ? line : `• ${line}`)
            .join('\n');

        const sections: MemoSection[] = [
            {
                type: SectionType.Title,
                content: memoContent.title.trim()
            },
            {
                type: SectionType.Content,
                content: cleanContent
            },
            {
                type: SectionType.Heuristic,
                content: memoContent.heuristic.trim()
            }
        ];

        return {
            id: `memo-${Date.now()}`,
            content: content.trim(),
            sections
        };
    } catch (error) {
        console.error('Error generating memo:', {
            error,
            content,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
}