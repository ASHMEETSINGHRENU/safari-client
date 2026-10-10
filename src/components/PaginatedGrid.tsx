import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatedGridProps {
  items: React.ReactNode[];
  rows?: number;
  baseCols: number;
  smCols?: number;
  lgCols?: number;
  gridClassName?: string;
  label?: string;
}

// Columns per breakpoint, matched to the Tailwind grid classes passed in gridClassName.
const useCols = (base: number, sm?: number, lg?: number) => {
  const calc = () => {
    if (typeof window === 'undefined') return base;
    if (lg && window.matchMedia('(min-width: 1024px)').matches) return lg;
    if (sm && window.matchMedia('(min-width: 640px)').matches) return sm;
    return base;
  };
  const [cols, setCols] = useState(calc);
  useEffect(() => {
    const onResize = () => setCols(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return cols;
};

// Windowed page numbers: 1 … 4 5 6 … 12
const pageList = (current: number, total: number): (number | '...')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | '...')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('...');
  for (let p = start; p <= end; p++) out.push(p);
  if (end < total - 1) out.push('...');
  out.push(total);
  return out;
};

export const PaginatedGrid: React.FC<PaginatedGridProps> = ({
  items,
  rows = 1,
  baseCols,
  smCols,
  lgCols,
  gridClassName = '',
  label,
}) => {
  const cols = useCols(baseCols, smCols, lgCols);
  const perPage = Math.max(1, rows * cols);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const [page, setPage] = useState(1);
  const current = Math.min(page, pages);
  const visible = items.slice((current - 1) * perPage, current * perPage);

  const btn =
    'h-9 min-w-[2.5rem] px-3 rounded-lg text-xs font-bold transition flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div>
      <div className={gridClassName} aria-label={label} role="group">
        {visible}
      </div>

      {pages > 1 && (
        <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
          <button
            type="button"
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
            aria-label="Previous page"
            className={`${btn} border border-forest/15 text-forest/70 hover:border-forest/40 hover:text-forest`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageList(current, pages).map((p, i) =>
            p === '...' ? (
              <span key={`gap-${i}`} className="px-1.5 text-forest/40 text-xs">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === current ? 'page' : undefined}
                className={`${btn} ${
                  p === current
                    ? 'bg-forest text-sand shadow-sm'
                    : 'border border-forest/15 text-forest/70 hover:border-forest/40 hover:text-forest'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => setPage(current + 1)}
            disabled={current === pages}
            aria-label="Next page"
            className={`${btn} border border-forest/15 text-forest/70 hover:border-forest/40 hover:text-forest`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
};

export default PaginatedGrid;
