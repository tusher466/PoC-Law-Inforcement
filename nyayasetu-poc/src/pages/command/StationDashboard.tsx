import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { SlaChart } from '../../components/charts/SlaChart';
import { StationScoreChart } from '../../components/charts/StationScoreChart';
import {
  Building2,
  Star,
  Clock,
  ShieldCheck,
  TrendingUp,
  Users,
  Award,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

export const StationDashboard: React.FC = () => {
  const { t } = useTranslation();
  const stations = useAppStore((s) => s.stations);
  const ratings = useAppStore((s) => s.ratings);
  const cases = useAppStore((s) => s.cases);
  const language = useAuthStore((s) => s.language);

  const [selectedStationId, setSelectedStationId] = useState('dhanmondi');
  const activeStation =
    stations.find((s) => s.id === selectedStationId) || stations[0];

  const stationRatings = ratings.filter((r) => r.stationId === activeStation.id);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 block flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            STATION PRECINCT GOVERNANCE & INTEGRITY SCORECARD
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('dashboards.stationScore')}: {activeStation.nameBn}
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            নাগরিক সন্তুষ্টি সূচক, এসএলএ প্রতিপালন হার ও জবাবদিহিতা পরিসংখ্যান
          </p>
        </div>

        {/* Station Selector */}
        <select
          value={selectedStationId}
          onChange={(e) => setSelectedStationId(e.target.value)}
          className="bg-white border border-slate-300 rounded-2xl px-3.5 py-2 text-xs font-bold text-slate-800 shadow-soft font-bengali"
        >
          {stations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameBn} ({s.district})
            </option>
          ))}
        </select>
      </div>

      {/* KPI Highlight Scorecards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Scorecard 1: Public Rating */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>নাগরিক রেটিং</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {activeStation.rating} <span className="text-sm font-normal text-slate-400">/ ৫.০</span>
          </p>
          <span className="text-[11px] text-emerald-600 font-bold block font-bengali">
            {stationRatings.length} টি যাচাইকৃত নাগরিক রিভিউ
          </span>
        </div>

        {/* Scorecard 2: SLA Compliance % */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>{t('dashboards.slaCompliance')}</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-700 font-mono">
            {activeStation.slaCompliance}%
          </p>
          <span className="text-[11px] text-slate-500 font-medium block font-bengali">
            ৪৮ ঘণ্টার প্রাথমিক তদন্ত মানদণ্ড
          </span>
        </div>

        {/* Scorecard 3: Active Cases */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>চলমান তদন্তভার</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {activeStation.activeCases}
          </p>
          <span className="text-[11px] text-blue-700 font-semibold block font-bengali">
            গড় আইও লোড: ২.৮ টি কেস/অফিসার
          </span>
        </div>

        {/* Scorecard 4: Corruption Free Tag */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>সততা ও সেবা স্বীকৃতি</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-teal-700 font-mono">
            ৯৮.৪%
          </p>
          <span className="text-[11px] text-teal-800 font-bold block font-bengali">
            &quot;দুর্নীতিমুক্ত&quot; ট্যাগ প্রাপ্ত
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-bengali">
            থানাভিত্তিক নাগরিক সন্তুষ্টির তুলনামূলক চার্ট
          </h2>
          <StationScoreChart />
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
          <h2 className="text-sm font-bold text-slate-900 font-bengali">
            থানাসমূহের এসএলএ প্রতিপালন হার (%)
          </h2>
          <SlaChart />
        </div>
      </div>

      {/* Citizen Feedback Feed */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>নাগরিকদের সরাসরি মন্তব্য ও রেটিং অভিজ্ঞতা ({activeStation.nameBn})</span>
          </h2>
          <span className="text-xs text-slate-500 font-bengali">
            গড় সন্তুষ্টি: {activeStation.rating} ★
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stationRatings.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  {r.caseId}
                </span>
              </div>

              <p className="text-slate-700 font-bengali leading-relaxed">
                &quot;{r.comment || 'সেবা প্রক্রিয়া অত্যন্ত দ্রুত ও সহযোগিতাপূর্ণ ছিল।'}&quot;
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {r.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 capitalize font-bengali"
                  >
                    {t === 'polite' ? 'ভদ্র ব্যবহার' : t === 'fast' ? 'দ্রুত সেবা' : t === 'corruption_free' ? 'দুর্নীতিমুক্ত' : t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
