import { OpenAI } from 'openai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const OPENAI_MODEL = 'gpt-4o-mini' as const; // Never change this model
export const TEMPERATURE = 0.7; 