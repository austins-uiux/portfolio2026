import { createServer } from 'vite';
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Read the same content modules as the website, including CSS-backed design tokens.
const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' });
try {
  const { entries, categories } = await server.ssrLoadModule('/src/data/portfolio.ts');
  const docs = entries.filter(e => e.category !== 'archive' && e.listed !== false).map(e => {
    const category = categories.find(c => c.id === e.category);
    const sections = e.sections.flatMap(s => {
      if (s.heading === '본문 타이틀' || s.body === '본문글 텍스트') return [];
      const paragraphs = s.paragraphs?.map(p => p.map(part => part.text).join('')).join('\n') ?? '';
      return [s.heading, s.body, paragraphs].filter(Boolean);
    });
    const text = [e.detailTitle, e.summary, e.facts?.map(f => `${f.label}: ${f.value}`).join('\n'), ...sections].filter(Boolean).join('\n');
    return { id: e.id, title: e.title, category: category?.title ?? '', meta: e.meta,
      text: text.trim() || '현재 공개된 본문은 이미지 위주입니다. 이미지 속 수치·역할·성과를 텍스트만으로 확인할 수 없습니다.',
      draft: e.category === 'ux' };
  });
  await mkdir(new URL('../server', import.meta.url), { recursive: true });
  await writeFile(new URL('../server/chat-knowledge.json', import.meta.url), JSON.stringify(docs, null, 2) + '\n');
  console.log(`Chat knowledge built from ${docs.length} visible entries; archive and placeholder copy excluded.`);
} finally { await server.close(); }
