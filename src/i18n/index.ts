import { useSyncExternalStore } from 'react';
import english from './en.json';
export type Locale = 'ko' | 'en';
const dictionary: Record<string, string> = english;
let locale: Locale = 'ko';
const listeners = new Set<() => void>();
const subscribe = (callback: () => void) => { listeners.add(callback); return () => { listeners.delete(callback); }; };
const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();
const exact = new Map(Object.entries(dictionary).map(([key, value]) => [normalize(key), value]));
const patterns = Object.entries(dictionary).filter(([key]) => /\{\d+\}/.test(key)).map(([key, value]) => {
  const parts = normalize(key).split(/(\{\d+\})/);
  const slots: string[] = [];
  const source = parts.map(part => /^\{\d+\}$/.test(part) ? (slots.push(part), '(.+?)') : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
  return { regex: new RegExp(`^${source}$`), slots, value };
});
const fragments = Object.keys(dictionary).filter(key => key.length > 1 && key.length < 240 && !key.includes('{')).sort((a, b) => b.length - a.length);
const fragmentPattern = new RegExp(fragments.map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
export function getLocale(): Locale { return locale; }
export function setLocale(next: Locale) {
  if (next === locale) return;
  locale = next;
  try { localStorage.setItem('aplus:language', next); } catch { /* Storage is optional. */ }
  if (typeof document !== 'undefined') document.documentElement.lang = next;
  for (const listener of listeners) listener();
}
export function restoreLocale() {
  try { if (localStorage.getItem('aplus:language') === 'en') setLocale('en'); } catch { /* Default to Korean. */ }
}
export function useLocale() {
  const current = useSyncExternalStore(subscribe, getLocale, getLocale);
  return { locale: current, toggleLocale: () => setLocale(current === 'ko' ? 'en' : 'ko') };
}
export function translate(value: string, target: Locale = locale): string {
  if (target === 'ko' || !/[가-힣]/.test(value)) return value;
  const key = normalize(value);
  const direct = exact.get(key);
  if (direct !== undefined) return (/^[.,;:!?]/.test(direct) ? '' : value.match(/^\s+/)?.[0] ?? '') + direct + (value.match(/\s+$/)?.[0] ?? '');
  for (const pattern of patterns) {
    const match = key.match(pattern.regex);
    if (match) return pattern.value.replace(/\{\d+\}/g, slot => translate(match[pattern.slots.indexOf(slot) + 1], target));
  }
  return key.replace(fragmentPattern, part => dictionary[part]);
}
/** Localize display values without changing data, route IDs, or selection state. */
export function translateText<T>(value: T): T { return (typeof value === 'string' ? translate(value) : value) as T; }
export function localize<T>(value: T): T { return (Array.isArray(value) ? value.map(localize) : translateText(value)) as T; }
