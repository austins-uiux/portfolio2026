/** Public metadata only. Credentials belong exclusively to the server. */
export const chatModel = { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite' } as const;
export const CHAT_MAX_MESSAGES = 12;
export const CHAT_MAX_INPUT = 2000;
export const CHAT_MAX_REPLY = 4000;
export interface ChatTurn { role: 'user' | 'assistant'; content: string }
export interface ChatStatus { configured: boolean; model: typeof chatModel }
