import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const pages = JSON.parse(await readFile(path.join(dist, 'prerender-manifest.json'), 'utf8'));
const origin = 'https://portfolio2026-six-orcin.vercel.app';
assert(pages.length > 160, 'Public page inventory unexpectedly shrank');
const seen = new Set();
for (const page of pages) {
  assert(!seen.has(page.route), `Duplicate route: ${page.route}`); seen.add(page.route);
  const html = await readFile(path.join(dist, page.file), 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert(main?.includes('<h1'), `No initial HTML heading: ${page.route}`);
  assert(html.includes('data-initial-location='), `No hydration URL: ${page.route}`);
  assert(!html.includes('Switched to client rendering'), `SSR failure: ${page.route}`);
  for (const property of ['og:title','og:description','og:url','og:image','og:image:alt']) {
    assert.equal((html.match(new RegExp(`property="${property}"`, 'g')) ?? []).length, 1, `${property}: ${page.route}`);
  }
  assert.equal((html.match(/name="description"/g) ?? []).length, 1, `Duplicate description: ${page.route}`);
  assert.equal((html.match(/name="robots" content="noindex,nofollow,noarchive"/g) ?? []).length, 1, `Missing noindex: ${page.route}`);
  assert(html.includes(`href="${origin}${page.route}"`), `Wrong canonical: ${page.route}`);
  const image = path.join(dist, new URL(page.image).pathname.slice(1));
  assert((await stat(image)).size > 0, `Missing social image: ${page.image}`);
  const text = await readFile(path.join(dist, page.textPath.slice(1)), 'utf8');
  assert(text.includes(`Source: ${origin}${page.route}`) && text.length > 100, `Missing text document: ${page.route}`);
}
const system = await readFile(path.join(dist, 'work/design-system.html'), 'utf8');
assert(system.includes('Typography') && system.includes('Icons &amp; Brand') && system.includes('Surface &amp; Elevation'));
const color = await readFile(path.join(dist, 'project/foundation-1.html'), 'utf8');
assert(color.includes('--color-accent') && color.includes('#148ddf'), 'Color tokens missing from initial response');
const interaction = await readFile(path.join(dist, 'work/interaction-lab.html'), 'utf8');
assert(!interaction.includes('data-component="video-text"'));
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert(robots.includes('Allow: /') && !robots.includes('Disallow:'), 'Crawlers must see noindex rules');
assert(!robots.includes('Sitemap:'), 'Search sitemap must not be advertised');
await assert.rejects(readFile(path.join(dist, 'sitemap.xml'), 'utf8'), { code: 'ENOENT' });
assert((await readFile(path.join(dist, '404.html'), 'utf8')).includes('noindex,nofollow,noarchive'));
assert((await readFile(path.join(dist, 'search.html'), 'utf8')).includes('noindex,nofollow,noarchive'));
assert((await readFile(path.join(dist, 'llms.txt'), 'utf8')).includes('/content/work/design-system.md'));
console.log(`Static delivery checks passed: ${pages.length} pages contain body HTML, noindex metadata, valid images and text documents; robots and 404 verified.`);
