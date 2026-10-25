import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { t } = useTranslation();
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const setTourStep = useAppStore((s) => s.setTourStep);

  return (
    <div
      role="banner"
      className="bg-amber-500 text-slate-900 border-b border-amber-600 px-3 py-1.5 text-xs sm:text-sm font-medium flex flex-wrap items-center justify-between gap-2 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" aria-hidden="true" />
        <span className="leading-tight">
          <strong className="font-bold">PoC Demo</strong> – Fake data only. No real NID/personal data. |
          <span className="ml-1 font-bengali">সম্পূর্ণ ডামি ডেটা। কোনো আসল এনআইডি/ব্যক্তিগত তথ্য নেই।</span>
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => setTourStep(0)}
          className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-300 hover:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-950"
          aria-label="Start guided demo tour"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />
          <span>{t('app.tourBtn')}</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('সকল ডেমো তথ্য রিসেট করতে চান? (Reset all mock data?)')) {
              resetDemoData();
            }
          }}
          className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-slate-900 px-2 py-1 rounded-md text-xs font-semibold transition-all border border-amber-300"
          title="Reset to default demo seed data"
          aria-label="Reset demo data"
        >
          <RotateCcw className="w-3 h-3 text-slate-800" aria-hidden="true" />
          <span>{t('app.resetDemo')}</span>
        </button>
      </div>
    </div>
  );
};
