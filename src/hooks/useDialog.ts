import { useEffect, type RefObject } from 'react';

/** Native DOM focus management shared by the chat dialog and mobile navigation. */
export function useDialog(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>('[data-autofocus],button,a,input,textarea')?.focus());
    function keydown(event: KeyboardEvent) {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); }
      if (event.key !== 'Tab') return;
      const elements = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),[tabindex="0"]') ?? []).filter(el => el.getClientRects().length > 0);
      const first = elements[0], last = elements.at(-1);
      if (!first) { event.preventDefault(); ref.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || !ref.current?.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !ref.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', keydown, true);
    return () => { cancelAnimationFrame(timer); document.removeEventListener('keydown', keydown, true); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, [open, ref, onClose]);
}
