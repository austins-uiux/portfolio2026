import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

const standalone = import.meta.env.VITE_STANDALONE_PREVIEW === 'true';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('app:navigate', callback);
  window.addEventListener('hashchange', callback);
  return () => { window.removeEventListener('popstate', callback); window.removeEventListener('app:navigate', callback); window.removeEventListener('hashchange', callback); };
}
const snapshot = () => standalone ? window.location.hash.slice(1) || '/' : window.location.pathname + window.location.search;

export function navigate(href: string, options?: { replace?: boolean }) {
  if (snapshot() === href) return;
  window.history[options?.replace ? 'replaceState' : 'pushState'](null, '', standalone ? `#${href}` : href);
  window.dispatchEvent(new Event('app:navigate'));
}

export function useLocation() {
  const location = useSyncExternalStore(subscribe, snapshot, () => '/');
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location]);
  return new URL(location, window.location.origin === 'null' ? 'https://preview.local' : window.location.origin);
}

export function AppLink({ href = '/', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  function click(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    if (!href.startsWith('/')) return;
    event.preventDefault();
    navigate(href);
  }
  return <a {...props} href={standalone && href.startsWith('/') ? `#${href}` : href} onClick={click} />;
}
