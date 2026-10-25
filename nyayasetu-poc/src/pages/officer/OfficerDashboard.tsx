import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CaseCard } from '../../components/case/CaseCard';
import { SlaCountdown } from '../../components/case/SlaCountdown';
import { StatusBadge } from '../../components/case/StatusBadge';
import { IncidentMap } from '../../components/map/IncidentMap';
import {
  Inbox,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Activity,
  Plus,
  Search,
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cases = useAppStore((s) => s.cases);
  const stations = useAppStore((s) => s.stations);
  const auditLog = useAppStore((s) => s.auditLog);
  const currentRole = useAuthStore((s) => s.currentRole);
  const language = useAuthStore((s) => s.language);

  // Compute KPIs
  const todayCases = cases.filter(
    (c) => new Date(c.createdAt).toDateString() === new Date().toDateString()
  );
  const slaRiskCases = cases.filter(
    (c) => c.priority === 'urgent' || c.status === 'filed'
  );
  const assignedToMe = cases.filter(
    (c) => c.ioId?.includes('io-001') || c.stationId === 'dhanmondi'
  );
  const closedThisWeek = cases.filter((c) => c.status === 'closed');

  const recentAudits = auditLog.slice(-5).reverse();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 block">
            ধানমন্ডি মডেল থানা ও মেট্রোপলিটন জোন
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('officer.kpiNew')}: {todayCases.length} টি নতুন অভিযোগ
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/officer/queue')}
            className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-card transition-all"
          >
            <Inbox className="w-4 h-4" />
            <span>কেস কিউ দেখুন</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: New Today */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-bengali">
              {t('officer.kpiNew')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {todayCases.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold block font-bengali">
            +১২% পূর্ববর্তী দিনের তুলনায়
          </span>
        </div>

        {/* KPI 2: SLA At Risk */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-bengali">
              {t('officer.kpiSlaRisk')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {slaRiskCases.length}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block font-bengali">
            তাত্ক্ষণিক আইও এসাইন আবশ্যক
          </span>
        </div>

        {/* KPI 3: Assigned to Me */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-bengali">
              {t('officer.kpiAssignedMe')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-brand-600 font-mono">
            {assignedToMe.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium block font-bengali">
            তদন্ত ও ডায়েরি হালনাগাদ চলমান
          </span>
        </div>

        {/* KPI 4: Closed This Week */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 font-bengali">
              {t('officer.kpiClosedWeek')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {closedThisWeek.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-bold block font-bengali">
            গড় নিষ্পত্তি সময়: ১.৮ দিন
          </span>
        </div>
      </div>

      {/* Main Grid: Priority Cases & Map / Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-bengali flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>এসএলএ ঝুঁকিপূর্ণ ও জরুরি অভিযোগসমূহ</span>
            </h2>

            <button
              onClick={() => navigate('/officer/queue')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>সকল দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {slaRiskCases.slice(0, 4).map((c) => (
              <CaseCard key={c.id} item={c} mode="officer" />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Mini Map & Recent Activity Feed */}
        <div className="space-y-6">
          {/* Mini Precinct Map */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 font-bengali">
              <span>থানা এলাকা ও ঘটনাস্থল ম্যাপ</span>
              <span className="text-brand-600 font-mono text-[11px]">DHANMONDI</span>
            </div>
            <IncidentMap interactive={false} className="h-48" />
          </div>

          {/* Append-only Audit Activity Stream */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 font-bengali flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-brand-600" />
                <span>লাইভ অডিট অ্যাক্টিভিটি ফিড</span>
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-bold">
                APPEND-ONLY
              </span>
            </div>

            <div className="space-y-2.5">
              {recentAudits.map((entry) => (
                <div
                  key={entry.index}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono font-bold text-slate-700">
                      #{entry.index} {entry.action}
                    </span>
                    <span>{entry.at.split('T')[1]?.slice(0, 5)}</span>
                  </div>
                  <p className="text-slate-700 line-clamp-1 font-bengali">{entry.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
