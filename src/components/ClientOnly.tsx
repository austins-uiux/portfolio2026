import { useEffect, useState, type ReactNode } from 'react';

/** Interactive demos mount after hydration; their descriptions and code are static HTML. */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? children : null;
}
