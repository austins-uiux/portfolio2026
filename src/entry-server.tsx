import { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { Root } from './Root';
import { categories, entries } from './data/portfolio';
export { getPageMetadata, siteOrigin } from './lib/page-metadata';

export const publicRoutes = ['/', ...categories.map(category => `/work/${category.id}`), ...entries.filter(entry => entry.listed !== false).map(entry => `/project/${entry.id}`)];

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = '';
    let failure: unknown;
    const timer = setTimeout(() => { stream.abort(); reject(new Error(`Prerender timed out: ${url}`)); }, 30000);
    output.setEncoding('utf8');
    output.on('data', chunk => { html += chunk; });
    output.on('error', error => { clearTimeout(timer); reject(error); });
    output.on('end', () => { clearTimeout(timer); failure ? reject(failure) : resolve(html); });
    const stream = renderToPipeableStream(createElement(Root, { initialLocation: url }), {
      onAllReady() { stream.pipe(output); },
      onShellError(error) { clearTimeout(timer); reject(error); },
      onError(error) { failure = error; },
    });
  });
}
