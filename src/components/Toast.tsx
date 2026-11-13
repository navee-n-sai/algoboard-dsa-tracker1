import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { CheckCircle2, X, XCircle, Info } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const KIND_ICONS: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const KIND_STYLES: Record<ToastKind, string> = {
  success: 'text-emerald-400',
  error: 'text-rose-400',
  info: 'text-blue-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, kind, message }]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3200),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100vw-2.5rem)] max-w-sm">
        {toasts.map((t) => {
          const Icon = KIND_ICONS[t.kind];
          return (
            <div
              key={t.id}
              role="status"
              className="flex items-center gap-3 rounded-xl border border-line-bright bg-surface-850/95 backdrop-blur px-4 py-3 shadow-elevated animate-slide-in-right"
            >
              <Icon size={18} className={`shrink-0 ${KIND_STYLES[t.kind]}`} />
              <p className="text-sm text-slate-200 flex-1">{t.message}</p>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Dismiss"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
