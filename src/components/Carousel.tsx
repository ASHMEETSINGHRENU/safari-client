import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode;
  trackClassName?: string;
  label?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ children, trackClassName = '', label }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ canScroll: false, atStart: true, atEnd: false });

  const sync = () => {
    const el = trackRef.current;
    if (!el) return;
    const next = {
      canScroll: el.scrollWidth - el.clientWidth > 2,
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2,
    };
    // Guard: only update when values change, so the every-render sync below can't loop.
    setState(prev =>
      prev.canScroll === next.canScroll && prev.atStart === next.atStart && prev.atEnd === next.atEnd
        ? prev
        : next
    );
  };

  // Re-sync after every render — children (cards) may arrive from an async fetch without
  // resizing the track, which a ResizeObserver alone would miss.
  useEffect(sync);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    el.addEventListener('scroll', sync, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', sync);
    };
  }, []);

  const page = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div ref={trackRef} role="group" aria-label={label} className={trackClassName}>
        {children}
      </div>
      {state.canScroll && (
        <div className="flex justify-end gap-2 mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={state.atStart}
            aria-label="Previous"
            className="p-2.5 rounded-full bg-forest text-sand shadow-md hover:bg-forest-light disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => page(1)}
            disabled={state.atEnd}
            aria-label="Next"
            className="p-2.5 rounded-full bg-forest text-sand shadow-md hover:bg-forest-light disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Carousel;
