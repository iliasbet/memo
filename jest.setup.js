// Mock des variables d'environnement
process.env.OPENAI_API_KEY = 'test_key';
process.env.ANTHROPIC_API_KEY = 'test_key';

// Mock du client OpenAI
jest.mock('openai', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn()
            }
        }
    }))
}));

// Mock du client Anthropic avec typage Jest
jest.mock('@anthropic-ai/sdk', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        messages: {
            create: jest.fn()
        }
    }))
}));