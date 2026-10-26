import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Keep the existing detailed case illustrations unchanged. The card versions
// reuse their two editable SVG phone UIs, on the same centered artboard.
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = join(root, 'public/assets/ux-cases');
const cases = [
  { name: 'naver', background: '#e9f4ed', label: '쇼핑 장바구니' },
  { name: 'tripstore', background: '#fdf0e7', label: '숙소 비교' },
  { name: 'venti', background: '#ece6f8', label: '배달 매장 선택' },
  { name: 'flitto', background: '#f8f1e1', label: '멤버십 등급' },
];

function topLevelGroup(source, fromIndex) {
  const start = source.indexOf('<g transform="translate(', fromIndex);
  if (start < 0) throw new Error('Phone group missing');
  const tags = /<\/?g\b[^>]*>/g;
  tags.lastIndex = start;
  let depth = 0;
  let tag;
  while ((tag = tags.exec(source))) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return { markup: source.slice(start, tags.lastIndex), end: tags.lastIndex };
  }
  throw new Error('Unclosed phone group');
}

for (const { name, background, label } of cases) {
  const source = readFileSync(join(dir, `${name}-concept.svg`), 'utf8');
  const first = topLevelGroup(source, 0);
  const second = topLevelGroup(source, first.end);
  const pattern = source.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? '';
  const phones = [first.markup, second.markup].map((markup, index) => {
    const match = markup.match(/^<g transform="translate\((\d+) (\d+)\)"/);
    if (!match) throw new Error(`Unexpected phone transform in ${name}`);
    const originalWidth = name === 'tripstore' ? 346 : name === 'flitto' ? 312 : 305;
    const originalHeight = name === 'tripstore' ? 623 : 636;
    const x = index === 0 ? 446 : 886;
    const transform = `translate(${x} 131) scale(${(340 / originalWidth).toFixed(6)} ${(680 / originalHeight).toFixed(6)})`;
    return markup.replace(match[0], `<g transform="${transform}"`);
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1672 941" role="img" aria-label="${label}: 기존 화면과 개선 화면 예시"><rect width="1672" height="941" fill="${background}"/>${pattern}${phones.join('')}<path d="M814 463h42m-13-12 13 12-13 12" fill="none" stroke="#87939B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`;
  writeFileSync(join(dir, `${name}-thumbnail.svg`), svg, 'utf8');
}
