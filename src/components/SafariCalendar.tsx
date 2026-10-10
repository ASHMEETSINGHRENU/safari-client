import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const isoOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const SafariCalendar: React.FC<{ value: string; onSelect: (iso: string) => void; nights?: number }> = ({ value, onSelect, nights = 0 }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = value ? new Date(value + 'T00:00:00') : null;
  // The trip runs from the picked start day through `nights` nights later (inclusive).
  const rangeEnd = picked ? new Date(picked) : null;
  if (rangeEnd) rangeEnd.setDate(rangeEnd.getDate() + nights);
  const [view, setView] = useState(() => ({ y: (picked ?? today).getFullYear(), m: (picked ?? today).getMonth() }));

  const firstWeekday = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const canGoPrev = view.y > today.getFullYear() || (view.y === today.getFullYear() && view.m > today.getMonth());

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const shiftMonth = (delta: number) => {
    setView(v => {
      const m = v.m + delta;
      return m < 0 ? { y: v.y - 1, m: 11 } : m > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m };
    });
  };

  return (
    <div className="w-full max-w-sm bg-sand rounded-xl border border-forest/20 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-lg border border-forest/20 text-forest hover:bg-forest hover:text-sand transition-colors flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-serif font-bold text-forest text-sm">{monthLabel}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="w-8 h-8 rounded-lg border border-forest/20 text-forest hover:bg-forest hover:text-sand transition-colors flex items-center justify-center"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-forest/60 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <span key={i} />;
          const disabled = day < today;
          const isSelected = picked && isSameDay(day, picked);
          const isRangeEnd = picked && rangeEnd && nights > 0 && isSameDay(day, rangeEnd);
          const inRange = picked && rangeEnd && nights > 0 && day > picked && day < rangeEnd;
          const isToday = isSameDay(day, today);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(isoOf(day))}
              className={`h-9 rounded-lg text-sm font-medium transition-all ${
                isSelected || isRangeEnd
                  ? 'bg-forest text-sand font-bold shadow-md'
                  : inRange
                    ? 'bg-gold/25 text-forest font-semibold'
                    : isToday
                      ? 'border border-gold text-forest'
                      : disabled
                        ? 'text-forest/25 cursor-not-allowed'
                        : 'text-forest hover:bg-gold/20'
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-forest/60 mt-3 text-center">Core zones in MP close Wednesday afternoons.</p>
    </div>
  );
};

export default SafariCalendar;
