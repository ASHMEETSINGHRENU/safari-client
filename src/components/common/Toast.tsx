import React, { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

// ponytail: one in-house toast stack replaces every alert() on the site. No dep — a
// library buys us animations we already have in CSS and a theme we'd have to override anyway.

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | undefined>(undefined);

const DURATION: Record<ToastType, number> = { success: 4000, error: 6000, info: 4500 };

const STYLES: Record<ToastType, { icon: React.ReactNode; ring: string; tint: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
    ring: 'border-l-emerald-600',
    tint: 'bg-emerald-50',
  },
  error: {
    icon: <AlertTriangle className="w-5 h-5 text-red-700" />,
    ring: 'border-l-red-600',
    tint: 'bg-red-50',
  },
  info: {
    icon: <Info className="w-5 h-5 text-earth" />,
    ring: 'border-l-earth',
    tint: 'bg-earth/10',
  },
};

const ToastCard: React.FC<{ item: ToastItem; onClose: (id: number) => void }> = ({ item, onClose }) => {
  const style = STYLES[item.type];
  useEffect(() => {
    const t = setTimeout(() => onClose(item.id), DURATION[item.type]);
    return () => clearTimeout(t);
  }, [item.id, item.type, onClose]);

  return (
    <div
      role={item.type === 'error' ? 'alert' : 'status'}
      className={`toast-enter pointer-events-auto flex items-start gap-3 rounded-xl border border-forest/15 border-l-4 ${style.ring} bg-white shadow-xl p-4`}
    >
      <span className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg ${style.tint} flex items-center justify-center`}>
        {style.icon}
      </span>
      <p className="flex-1 text-xs font-medium text-forest leading-relaxed pt-1.5">{item.message}</p>
      <button
        type="button"
        onClick={() => onClose(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 p-1 -m-1 text-forest/40 hover:text-forest transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type: ToastType, message: string) => {
    const id = ++idRef.current;
    setToasts((list) => [...list, { id, type, message }]);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="fixed z-[100] top-20 right-4 left-4 sm:left-auto sm:w-[380px] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastApi => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};
