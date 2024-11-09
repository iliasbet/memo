export const AI_MODELS = {
    GPT: 'gpt-4-turbo-preview',
    CLAUDE: 'claude-3-haiku-20240307',
} as const;

export type AIModelType = keyof typeof AI_MODELS;
export type AIModelName = typeof AI_MODELS[AIModelType];

export type AIProvider = 'openai' | 'anthropic';

export interface ModelConfig {
    provider: AIProvider;
    temperature: number;
    max_tokens: number;
}

export const MODEL_CONFIG: Record<AIModelType, ModelConfig> = {
    GPT: {
        provider: 'openai',
        temperature: 0.7,
        max_tokens: 1000,
    },
    CLAUDE: {
        provider: 'anthropic',
        temperature: 0.7,
        max_tokens: 1000,
    },
};

export const DEFAULT_MODEL: AIModelType = 'CLAUDE';