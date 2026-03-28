"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "success" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastItem extends ToastInput {
  id: string;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toneClasses: Record<ToastTone, string> = {
  success: "border-primary/30 bg-surface-container-lowest text-on-surface",
  error: "border-error/20 bg-error-container text-on-error-container",
  info: "border-outline-variant/40 bg-surface-container-lowest text-on-surface",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, tone = "info" }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current, { id, title, description, tone }]);

      window.setTimeout(() => removeToast(id), 4500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-6 top-24 z-[100] flex w-[min(28rem,calc(100vw-3rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto border px-5 py-4 shadow-[0_20px_60px_rgba(26,28,28,0.08)] backdrop-blur-sm ${toneClasses[toast.tone || "info"]}`}
            role="status"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.25em]">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="mt-2 font-body text-sm leading-relaxed opacity-80">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="font-label text-[10px] uppercase tracking-[0.2em] opacity-60 transition-opacity hover:opacity-100"
              >
                Închide
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
