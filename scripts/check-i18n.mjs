import assert from 'node:assert/strict';
import { createServer } from 'vite';
import path from 'node:path';
const server = await createServer({ configFile: false, root: process.cwd(), resolve: { alias: { '@': path.join(process.cwd(), 'src') } }, ssr: { noExternal: ['react-tweet'] }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' });
try {
  const i18n = await server.ssrLoadModule('/src/i18n/index.ts');
  const { render, publicRoutes, getPageMetadata } = await server.ssrLoadModule('/src/entry-server.tsx');
  assert.equal(i18n.getLocale(), 'ko');
  assert.equal(i18n.translate('대표 프로젝트'), '대표 프로젝트');
  i18n.setLocale('en');
  assert.equal(i18n.translate('대표 프로젝트'), 'Selected Work');
  assert.equal(i18n.translate('“checkout” 검색 결과 2개'), '2 results for “checkout”');
  const { searchEntries } = await server.ssrLoadModule('/src/data/portfolio.ts');
  assert.ok(searchEntries('shipping').length > 0, 'English search must find translated case studies');
  const missing = new Map();
  for (const route of [...publicRoutes, '/search?q=checkout']) {
    const html = await render(route);
    const text = html.replace(/<(pre|code|script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, '|').replace(/<!--.*?-->/g, '');
    for (const fragment of text.split('|').map(s=>s.trim()).filter(s=>/[가-힣]/.test(s) && s !== '한')) {
      if (!missing.has(fragment)) missing.set(fragment, route);
    }
  }
  if (missing.size) console.log('Untranslated display fragments:', JSON.stringify([...missing], null, 2));
  assert.equal(missing.size, 0, 'English routes must not contain untranslated display text');
  assert.ok(!/[가-힣]/.test(getPageMetadata('/work/featured').title));
  i18n.setLocale('ko');
  assert.match(await render('/'), /대표 프로젝트/);
  console.log(`Language checks passed: ${publicRoutes.length} routes, Korean default and restoration, English copy, dynamic labels, and bilingual search.`);
} finally { await server.close(); }
