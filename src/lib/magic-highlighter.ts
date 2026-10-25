import { createHighlighterCore, type CodeToHastOptions } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import typescript from '@shikijs/langs/typescript';
import javascript from '@shikijs/langs/javascript';
import css from '@shikijs/langs/css';
import json from '@shikijs/langs/json';
import light from '@shikijs/themes/github-light';
import dark from '@shikijs/themes/github-dark';
// Bundle only the gallery's four languages and two themes; no remote loaders.
const highlighter = createHighlighterCore({
  engine: createJavaScriptRegexEngine(),
  themes: [light, dark],
  langs: [typescript, javascript, css, json],
});
export async function codeToHtml(code: string, options: CodeToHastOptions) {
  return (await highlighter).codeToHtml(code, options);
}
