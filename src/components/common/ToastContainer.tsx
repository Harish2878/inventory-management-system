import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useInventory();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
            case 'error':
              return <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
            default:
              return <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/30 bg-emerald-950/40 text-emerald-100';
            case 'error':
              return 'border-rose-500/30 bg-rose-950/40 text-rose-100';
            case 'warning':
              return 'border-amber-500/30 bg-amber-950/40 text-amber-100';
            default:
              return 'border-sky-500/30 bg-sky-950/40 text-sky-100';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-slide-in ${getBorderColor()}`}
            style={{
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
