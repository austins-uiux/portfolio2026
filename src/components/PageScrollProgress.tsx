import { useEffect, useRef, useState } from 'react';

/** Measures the document, including lazy content, and hides on non-scroll pages. */
export function PageScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    let frame = 0;
    let disposed = false;
    let previous: boolean | undefined;
    const measure = () => {
      frame = 0;
      if (disposed) return;
      const documentElement = document.documentElement;
      const scroller = document.scrollingElement ?? documentElement;
      const distance = scroller.scrollHeight - documentElement.clientHeight;
      const hasScroll = distance > 1;
      if (previous !== hasScroll) { setScrollable(hasScroll); previous = hasScroll; }
      const progress = hasScroll ? Math.min(1, Math.max(0, scroller.scrollTop / distance)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!disposed && !frame) frame = requestAnimationFrame(measure); };
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    observer?.observe(document.documentElement);
    observer?.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('load', schedule, true);
    void document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('load', schedule, true);
    };
  }, []);
  return <div className="page-scroll-progress" hidden={!scrollable} aria-hidden="true">
    <div ref={bar} className="page-scroll-progress-fill" />
  </div>;
}
