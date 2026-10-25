import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

function signatureMatches(name, bytes) {
  const extension = path.extname(name).toLowerCase();
  if (extension === '.webp') return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
  if (extension === '.gif') return /GIF8[79]a/.test(bytes.toString('ascii', 0, 6));
  if (extension === '.png') return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (['.jpg', '.jpeg'].includes(extension)) return bytes[0] === 255 && bytes[1] === 216;
  if (extension === '.svg') return bytes.toString('utf8').includes('<svg') && bytes.toString('utf8').includes('</svg>');
  if (extension === '.mp4') return bytes.toString('ascii', 4, 8) === 'ftyp';
  return true;
}

export async function checkAssets() {
  let count = 0;
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(target);
      else if (/\.(svg|png|webp|jpe?g|gif|mp4)$/i.test(entry.name)) {
        const bytes = await readFile(target);
        if (!bytes.length || !signatureMatches(entry.name, bytes)) throw new Error(`Empty or invalid media: ${path.relative(root, target)}`);
        count++;
      }
    }
  }
  await walk(path.join(root, 'public/assets'));
  const manifest = JSON.parse(await readFile(path.join(root, 'vendor/portfolio-legacy/manifest.json'), 'utf8'));
  for (const asset of manifest.assets) {
    const bytes = await readFile(path.join(root, 'public', asset.localPath.replace(/^\//, '')));
    const digest = createHash('sha256').update(bytes).digest('hex');
    if (bytes.length !== asset.bytes || digest !== asset.sha256) throw new Error(`Portfolio media differs from its verified copy: ${asset.localPath}`);
  }
  const brands = JSON.parse(await readFile(path.join(root, 'vendor/workflow-brands/manifest.json'), 'utf8'));
  for (const asset of brands.assets) {
    const bytes = await readFile(path.join(root, 'public', asset.path.replace(/^\//, '')));
    if (bytes.length !== asset.bytes || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`Workflow logo differs from verified copy: ${asset.path}`);
    if (!signatureMatches(asset.path, bytes) || bytes.readUInt32BE(16) !== 30 || bytes.readUInt32BE(20) !== 30 || bytes[25] !== 6) throw new Error(`Workflow logo must be a 30×30 RGBA PNG: ${asset.path}`);
  }
  console.log(`Media verified: ${count} files; ${manifest.assets.length} portfolio and ${brands.assets.length} workflow logo hashes match.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await checkAssets();
