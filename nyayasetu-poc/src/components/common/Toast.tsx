import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
}) => {
  const bgStyles =
    type === 'success'
      ? 'bg-emerald-900 text-white border-emerald-700'
      : type === 'warning'
      ? 'bg-amber-900 text-white border-amber-700'
      : 'bg-red-900 text-white border-red-700';

  return (
    <div
      role="status"
      className={`fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl p-4 shadow-elevated border flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-4 duration-150 ${bgStyles}`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
        )}
        <span className="font-bengali leading-snug">{message}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
