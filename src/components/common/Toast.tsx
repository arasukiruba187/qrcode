import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-bounce-short ${
            t.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40 dark:bg-emerald-950/90'
              : t.type === 'error'
              ? 'bg-rose-950/90 text-rose-100 border-rose-500/40'
              : 'bg-navy-900/90 text-slate-100 border-electric-500/40 dark:bg-navy-900/90 dark:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-electric-400 shrink-0" />}
            <p className="text-sm font-medium leading-tight">{t.message}</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
