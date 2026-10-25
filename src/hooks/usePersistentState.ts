import { useEffect, useState } from 'react';

export function usePersistentState<T>(key: string, initial: T, isValid?: (value: unknown) => boolean) {
  const [value, setValue] = useState<T>(() => {
    try { const saved = localStorage.getItem(key); if (saved === null) return initial; const parsed: unknown = JSON.parse(saved); return !isValid || isValid(parsed) ? parsed as T : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ } }, [key, value]);
  return [value, setValue] as const;
}
