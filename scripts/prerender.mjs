import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
// Preserve the clean Vite template so a failed render can be retried safely.
const templateFile = path.join(dist, '.prerender-template.html');
const template = await readFile(templateFile, 'utf8').catch(async () => {
  const html = await readFile(path.join(dist, 'index.html'), 'utf8');
  await writeFile(templateFile, html);
  return html;
});
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const server = await createServer({ root, configFile: false, resolve: { alias: { '@': path.join(root, 'src') } }, ssr: { noExternal: ['react-tweet'] }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: 'custom' });

function head(metadata, textPath) {
  const tags = [
    ['name', 'description', metadata.description], ['name', 'robots', 'noindex,nofollow,noarchive'],
    ['property', 'og:title', metadata.title], ['property', 'og:description', metadata.description],
    ['property', 'og:url', metadata.canonical], ['property', 'og:type', metadata.type],
    ['property', 'og:site_name', 'A+studio'], ['property', 'og:locale', 'ko_KR'],
    ['property', 'og:image', metadata.image], ['property', 'og:image:secure_url', metadata.image],
    ['property', 'og:image:width', '1200'], ['property', 'og:image:height', '630'], ['property', 'og:image:alt', metadata.imageAlt],
  ];
  return `<title>${escape(metadata.title)}</title>\n${tags.map(([kind, name, value]) => `<meta ${kind}="${name}" content="${escape(value)}" />`).join('\n')}\n<link rel="canonical" href="${escape(metadata.canonical)}" />${textPath ? `\n<link rel="alternate" type="text/markdown" href="${textPath}" title="본문 텍스트" />` : ''}`;
}

function decode(text) {
  return text.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n))).replace(/&(amp|lt|gt|quot|apos);/g, (_, n) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[n]));
}
function markdown(html, metadata) {
  let body = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  body = body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<!--[^]*?-->/g, '');
  body = body.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, label) => `[${label.replace(/<[^>]+>/g, '')}](${new URL(decode(href), metadata.canonical).href})`);
  body = body.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1], alt = decode(tag.match(/\balt="([^"]*)"/)?.[1] ?? '');
    return src && alt && !src.startsWith('data:') ? `\n![${alt}](${new URL(decode(src), metadata.canonical).href})\n` : '';
  });
  body = body.replace(/<h([1-6])\b[^>]*>/g, (_, level) => '\n\n' + '#'.repeat(Number(level)) + ' ')
    .replace(/<\/(h[1-6]|p|div|section|article|nav|header|footer|ul|ol|dl|tr|pre)>/g, '\n\n')
    .replace(/<li\b[^>]*>/g, '\n- ').replace(/<br\s*\/?>/g, '\n').replace(/<\/(td|th|dt|dd)>/g, ' | ')
    .replace(/<[^>]+>/g, '');
  return `<!-- Public page text; interactive previews and images are not visual analysis. -->\nSource: ${metadata.canonical}\n\n${decode(body).replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

try {
  const { publicRoutes, render, getPageMetadata, siteOrigin } = await server.ssrLoadModule('/src/entry-server.tsx');
  const manifest = [];
  for (const route of [...new Set(publicRoutes), '/search', '/__not-found']) {
    const metadata = getPageMetadata(route);
    const name = route === '/' ? 'index' : route === '/__not-found' ? '404' : route.slice(1);
    const textPath = metadata.indexable ? `/content/${name}.md` : undefined;
    // Search depends on the visitor's query and remains client-rendered/noindex.
    const body = route === '/search' ? '' : await render(route);
    const html = template.replace(/\s*<meta name="robots" content="[^"]*"\s*\/>/, '')
      .replace(/<title>[\s\S]*?<\/title>/, head(metadata, textPath))
      .replace(/\s*<meta name="description" content="[^"]*"\s*\/>/, '')
      .replace('<div id="root"></div>', `<div id="root" data-initial-location="${escape(route)}">${body}</div>`);
    const file = path.join(dist, `${name}.html`);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
    if (textPath) {
      const textFile = path.join(dist, textPath.slice(1));
      await mkdir(path.dirname(textFile), { recursive: true });
      await writeFile(textFile, markdown(body, metadata));
      manifest.push({ route, file: `${name}.html`, textPath, title: metadata.title, image: metadata.image });
    }
  }
  // Crawlers must be able to read the noindex directive; Disallow would hide it.
  await writeFile(path.join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  await writeFile(path.join(dist, 'llms.txt'), `# A+studio\n\nAustin의 AI 네이티브 프로덕트 디자인 포트폴리오. 아래 문서는 실제 공개 페이지에서 생성한 본문입니다. 이미지의 내용과 움직임을 텍스트만으로 관찰했다고 주장하지 마세요. shadcn/ui와 Magic UI 예시는 외부 라이브러리 기반이며 UT Lab의 합성 페르소나는 실제 사용자 조사가 아닙니다.\n\n## Pages\n\n${manifest.map(page => `- [${page.title}](${siteOrigin}${page.textPath}): ${siteOrigin}${page.route}`).join('\n')}\n`);
  await writeFile(path.join(dist, 'prerender-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Prerendered ${manifest.length} unindexed pages, their Markdown documents, robots guidance, and a real 404 page.`);
} finally { await server.close(); }
