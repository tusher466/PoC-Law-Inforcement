import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { calculateSla } from '../../lib/time';
import { Clock, AlertTriangle } from 'lucide-react';

interface SlaCountdownProps {
  createdAt: string;
  slaDueAt: string;
  compact?: boolean;
}

export const SlaCountdown: React.FC<SlaCountdownProps> = ({
  createdAt,
  slaDueAt,
  compact = false,
}) => {
  const language = useAuthStore((s) => s.language);
  const useBanglaNumerals = useAuthStore((s) => s.useBanglaNumerals);

  const sla = calculateSla(createdAt, slaDueAt, useBanglaNumerals, language);

  const colorStyles = {
    green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse',
    red: 'bg-red-50 text-alertRed-dark border-red-300',
  }[sla.badgeColor];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${colorStyles}`}
        title={`SLA: ${sla.displayText}`}
      >
        {sla.isOverdue ? (
          <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
        ) : (
          <Clock className="w-3 h-3 shrink-0" />
        )}
        <span>{sla.displayText}</span>
      </span>
    );
  }

  return (
    <div className={`p-3 rounded-xl border ${colorStyles} space-y-1.5`}>
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1.5">
          {sla.isOverdue ? (
            <AlertTriangle className="w-4 h-4 text-alertRed" />
          ) : (
            <Clock className="w-4 h-4 text-emerald-700" />
          )}
          <span>{language === 'bn' ? 'এসএলএ সময়সীমা' : 'SLA Target'}</span>
        </span>
        <span>{sla.displayText}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            sla.isOverdue
              ? 'bg-alertRed'
              : sla.badgeColor === 'amber'
              ? 'bg-amber-500'
              : 'bg-emerald-600'
          }`}
          style={{ width: `${sla.percentageElapsed}%` }}
        />
      </div>
    </div>
  );
};
