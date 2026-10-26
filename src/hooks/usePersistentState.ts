import { useEffect, useState, useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function usePersistentState<T>(key: string, initial: T, isValid?: (value: unknown) => boolean) {
  // Hydrate the default server markup before restoring this visitor's preference.
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const [value, setValue] = useState<T>(() => {
    try { const saved = localStorage.getItem(key); if (saved === null) return initial; const parsed: unknown = JSON.parse(saved); return !isValid || isValid(parsed) ? parsed as T : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ } }, [key, value]);
  return [hydrated ? value : initial, setValue] as const;
}
