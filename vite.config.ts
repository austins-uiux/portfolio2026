import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { chatDevPlugin } from './server/chat-dev-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'GEMINI_');
  return { plugins: [chatDevPlugin(() => process.env.GEMINI_API_KEY || env.GEMINI_API_KEY), react(), tailwindcss()], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, server: { allowedHosts: true } };
});
