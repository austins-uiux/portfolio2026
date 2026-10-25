import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { checkAssets } from './check-assets.mjs';

// One-file review copy: the exact app, with hash routes and embedded static assets.
const root = fileURLToPath(new URL('..', import.meta.url));
await checkAssets();
process.env.VITE_STANDALONE_PREVIEW = 'true';
const { build } = await import('vite');
await build({ root, build: { outDir: '.preview-build', emptyOutDir: true, rollupOptions: { output: { inlineDynamicImports: true } } } });
const output = path.join(root, '.preview-build');
const html = await readFile(path.join(output, 'index.html'), 'utf8');
const scriptPath = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/)?.[1];
const stylePath = html.match(/<link[^>]+href="(\/assets\/[^" ]+\.css)"[^>]*>/)?.[1];
if (!scriptPath || !stylePath) throw new Error('Could not resolve the preview build outputs.');
let javascript = await readFile(path.join(output, scriptPath), 'utf8');
const css = await readFile(path.join(output, stylePath), 'utf8');
const assetDirectory = path.join(root, 'public/assets');
const assetUrls = new Map();
async function assetFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await assetFiles(path.join(directory, entry.name), name + '/'));
    else if (entry.isFile()) files.push(name);
  }
  return files;
}
for (const name of await assetFiles(assetDirectory)) {
  if (!/\.(svg|png|webp|jpe?g|gif|mp4)$/.test(name)) continue;
  const type = name.endsWith('.mp4') ? 'video/mp4' : name.endsWith('.svg') ? 'image/svg+xml' : name.endsWith('.png') ? 'image/png' : name.endsWith('.webp') ? 'image/webp' : name.endsWith('.gif') ? 'image/gif' : 'image/jpeg';
  const bytes = await readFile(path.join(assetDirectory, name));
  if (!bytes.length) throw new Error(`Cannot embed empty asset: ${name}`);
  assetUrls.set(`/assets/${name}`, `data:${type};base64,${bytes.toString('base64')}`);
}
for (const [url, data] of assetUrls) javascript = javascript.replaceAll(JSON.stringify(url), JSON.stringify(data));
if (javascript.includes('"/assets/')) throw new Error('A static asset has not been embedded in the preview.');
let preview = html.replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/, () => `<script type="module">${javascript.replaceAll('</script', '<\\/script')}</script>`)
  .replace(/<link[^>]+href="\/assets\/[^" ]+\.css"[^>]*>/, () => `<style>${css}</style>`);
for (const [url, data] of assetUrls) preview = preview.replaceAll(`href="${url}"`, `href="${data}"`);
preview = preview.replace(/<title>[^<]*<\/title>/, '<title>A+studio — 인터랙티브 미리보기</title>');
await writeFile(path.join(root, 'preview.html'), preview);
console.log(`One-file preview created (${Buffer.byteLength(preview).toLocaleString()} bytes).`);
