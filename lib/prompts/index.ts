// Export configuration
export {
    BASE_SYSTEM_PROMPT,
    STANDARD_RESPONSE_FORMAT,
    STORY_STRUCTURE,
    CONTENT_CONSTRAINTS,
    createContextualPrompt
} from './config';

// Export type guards
export {
    isTitledResponse,
    isDurationResponse,
    isSubjectResponse
} from './config';

// Export core prompts
export {
    sujetPrompt,
    objectifPrompt,
    accrochePrompt,
    conceptPrompt
} from './core';

// Export story-related prompts
export {
    histoirePrompt,
    techniquePrompt,
    atelierPrompt
} from './story';

// Export planner prompts
export { memoPlanner } from './planner'; 