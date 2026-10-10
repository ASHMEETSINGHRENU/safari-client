import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

// ponytail: promise-based confirm() so call sites read like window.confirm but render
// our own themed, accessible dialog instead of the unstyled browser popup.

interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | undefined>(undefined);

interface Pending {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<Pending | null>(null);
  const pendingRef = useRef<Pending | null>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const confirm = useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        pendingRef.current = { options, resolve };
        setPending({ options, resolve });
      }),
    [],
  );

  const close = useCallback((result: boolean) => {
    const current = pendingRef.current;
    pendingRef.current = null;
    if (current) current.resolve(result);
    setPending(null);
  }, []);

  useEffect(() => {
    if (!pending) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending, close]);

  const options = pending?.options;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && options && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-forest/50 backdrop-blur-sm"
          onClick={() => close(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-forest/15 bg-sand p-6 shadow-2xl space-y-4 toast-enter"
          >
            <div className="flex items-start gap-3">
              {options.danger && (
                <span className="shrink-0 w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-700" />
                </span>
              )}
              <div className="space-y-1.5">
                <h2 id="confirm-title" className="font-serif text-lg font-bold text-forest">
                  {options.title}
                </h2>
                <div className="text-xs text-forest/75 leading-relaxed">{options.message}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => close(false)}
                className="px-4 py-2.5 rounded-xl border border-forest/20 text-xs font-bold uppercase tracking-wider text-forest hover:bg-forest/5 transition-colors"
              >
                {options.cancelText ?? 'Cancel'}
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={() => close(true)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-sand transition-colors ${
                  options.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-forest hover:bg-forest/90'
                }`}
              >
                {options.confirmText ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within a ConfirmProvider');
  return ctx;
};
