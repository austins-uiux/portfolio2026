import { createChatHandler } from '../server/chat-handler.ts';

// Vercel Node.js Web Standard handler. No API credentials are bundled into Vite.
export default { fetch: createChatHandler() };
