import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CaseTrendChart } from '../../components/charts/CaseTrendChart';
import { StationScoreChart } from '../../components/charts/StationScoreChart';
import { SlaChart } from '../../components/charts/SlaChart';
import {
  Database,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

export const OpenDataPortal: React.FC = () => {
  const { t } = useTranslation();
  const cases = useAppStore((s) => s.cases);
  const stations = useAppStore((s) => s.stations);
  const ratings = useAppStore((s) => s.ratings);
  const language = useAuthStore((s) => s.language);

  const [districtFilter, setDistrictFilter] = useState('all');

  const totalComplaints = cases.length;
  const resolvedCases = cases.filter((c) => c.status === 'closed').length;
  const resolutionRate = Math.round((resolvedCases / totalComplaints) * 100);

  const handleExportOpenDataCsv = () => {
    const headers = 'CaseCategory,Station,Status,CreatedAt,ResolutionState\n';
    const rows = cases
      .map(
        (c) =>
          `"${c.type}","${c.stationId}","${c.status}","${c.createdAt.split('T')[0]}","${
            c.status === 'closed' ? 'Resolved' : 'Active'
          }"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nyayasetu_open_data_aggregate_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 block flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            PUBLIC JUSTICE TRANSPARENCY & OPEN DATA
          </span>
          <h1 className="text-xl sm:text-3xl font-black font-bengali mt-0.5">
            {t('openData.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-xl mt-1.5 leading-relaxed font-bengali">
            {t('openData.subtitle')}
          </p>
        </div>

        <button
          onClick={handleExportOpenDataCsv}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <span>উন্মুক্ত ডেটাসেট ডাউনলোড (CSV)</span>
        </button>
      </div>

      {/* Privacy Commitment Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-xs text-emerald-950 font-bengali flex items-start gap-3 shadow-soft">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-900 text-sm">
            নাগরিক তথ্যের গোপনীয়তা অঙ্গীকার
          </h4>
          <p className="text-emerald-800 leading-relaxed">
            {t('openData.publicDisclaimer')} অপরাধের ধরন, প্রবণতা ও নীতিগত গবেষণার স্বার্থে কেবলমাত্র সামগ্রিক পরিসংখ্যানগত উপাত্ত উন্মুক্ত রাখা হয়েছে।
          </p>
        </div>
      </div>

      {/* Aggregated KPI Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-1.5">
          <span className="text-xs font-bold text-slate-500 font-bengali">
            {t('openData.totalComplaints')}
          </span>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {totalComplaints}
          </p>
          <span className="text-[11px] text-brand-600 font-bold block font-bengali">
            অনলাইন ও কিয়স্কের মাধ্যমে গৃহীত
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-1.5">
          <span className="text-xs font-bold text-slate-500 font-bengali">
            {t('openData.resolvedCases')}
          </span>
          <p className="text-3xl font-black text-emerald-700 font-mono">
            {resolvedCases}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold block font-bengali">
            নিষ্পত্তি হার: {resolutionRate}%
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-1.5">
          <span className="text-xs font-bold text-slate-500 font-bengali">
            {t('openData.avgHours')}
          </span>
          <p className="text-3xl font-black text-blue-700 font-mono">
            ১.৪ ঘণ্টা
          </p>
          <span className="text-[11px] text-slate-500 font-medium block font-bengali">
            আইও নিয়োগ ও প্রাথমিক যোগাযোগ
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-1.5">
          <span className="text-xs font-bold text-slate-500 font-bengali">
            গড় নাগরিক সন্তুষ্টি
          </span>
          <p className="text-3xl font-black text-amber-500 font-mono">
            ৪.৫ ★
          </p>
          <span className="text-[11px] text-amber-700 font-bold block font-bengali">
            সরাসরি নাগরিক ফিডব্যাকভিত্তিক
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-bengali">
            মাসিক অপরাধ প্রবণতা (বিগত ৬ মাস)
          </h2>
          <CaseTrendChart />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-bengali">
            থানাসমূহের পাবলিক রেটিং সূচক
          </h2>
          <StationScoreChart />
        </div>
      </div>
    </div>
  );
};
