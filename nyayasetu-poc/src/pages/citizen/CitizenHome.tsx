import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CaseCard } from '../../components/case/CaseCard';
import { SlaCountdown } from '../../components/case/SlaCountdown';
import { StatusBadge } from '../../components/case/StatusBadge';
import { CaseIdChip } from '../../components/case/CaseIdChip';
import {
  FileText,
  AlertOctagon,
  Paperclip,
  ShieldAlert,
  Building,
  Phone,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Star,
  Search,
} from 'lucide-react';

export const CitizenHome: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cases = useAppStore((s) => s.cases);
  const stations = useAppStore((s) => s.stations);
  const smsList = useAppStore((s) => s.smsList);
  const user = useAuthStore((s) => s.user);
  const language = useAuthStore((s) => s.language);

  // Find active case for current citizen
  const activeCase = cases.find((c) => c.status !== 'closed') || cases[0];
  const nearbyStation = stations.find((s) => s.id === user.stationId) || stations[0];
  const latestSms = smsList.find((s) => s.direction === 'out');

  return (
    <div className="space-y-5 pb-6">
      {/* Citizen Greeting Header */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 text-white rounded-3xl p-5 sm:p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
            {language === 'bn' ? 'সুরক্ষিত নাগরিক ড্যাশবোর্ড' : 'CITIZEN SECURE DASHBOARD'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-bengali mt-0.5">
            {t('citizen.greeting', { name: user.name })}
          </h1>
          <p className="text-xs text-slate-200 mt-1 flex items-center gap-1.5 font-bengali">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('app.privacyGuaranteed')}</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/citizen/file-gd')}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-elevated transition-transform hover:scale-105"
        >
          {t('citizen.fileNewGd')}
        </button>
      </div>

      {/* Quick Action Grid (Big thumb-friendly buttons) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/citizen/file-gd')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-300 rounded-3xl p-4 text-left shadow-soft hover:shadow-card transition-all flex flex-col justify-between h-28 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali leading-snug">
              {t('citizen.fileNewGd')}
            </h2>
            <p className="text-[10px] text-slate-500 font-bengali">ভয়েস ও অনলাইন জিডি</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/citizen/sos')}
          className="bg-red-50 hover:bg-red-100/80 border border-red-200 hover:border-red-300 rounded-3xl p-4 text-left shadow-soft hover:shadow-card transition-all flex flex-col justify-between h-28 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-alertRed text-white flex items-center justify-center group-hover:scale-105 transition-transform animate-pulse">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-alertRed-dark font-bengali leading-snug">
              {t('citizen.triggerSos')}
            </h2>
            <p className="text-[10px] text-red-600 font-bengali">তাৎক্ষণিক পুলিশ রেসপন্স</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/citizen/scam-check')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-3xl p-4 text-left shadow-soft hover:shadow-card transition-all flex flex-col justify-between h-28 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali leading-snug">
              {t('citizen.scamCheck')}
            </h2>
            <p className="text-[10px] text-slate-500 font-bengali">প্রতারক নম্বর ও লিংক যাচাই</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/citizen/rate-station')}
          className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal-300 rounded-3xl p-4 text-left shadow-soft hover:shadow-card transition-all flex flex-col justify-between h-28 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali leading-snug">
              {t('citizen.rateStation')}
            </h2>
            <p className="text-[10px] text-slate-500 font-bengali">সেবার মান মূল্যায়ন</p>
          </div>
        </button>
      </div>

      {/* Active Case Summary Card with Progress Bar */}
      {activeCase ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <h2 className="text-sm font-bold text-slate-900 font-bengali">
                {t('citizen.activeCase')}
              </h2>
            </div>
            <CaseIdChip caseId={activeCase.id} />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-base font-bold text-slate-900 font-bengali line-clamp-1">
                {activeCase.title}
              </h3>
              <StatusBadge status={activeCase.status} />
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-bengali">
              {activeCase.description}
            </p>
          </div>

          <SlaCountdown
            createdAt={activeCase.createdAt}
            slaDueAt={activeCase.slaDueAt}
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="text-xs text-slate-600 font-bengali">
              {activeCase.ioName ? (
                <span>
                  <strong>আইও:</strong> {activeCase.ioName}
                </span>
              ) : (
                <span className="text-slate-400">তদন্ত কর্মকর্তা দ্রুত নিয়োগ দেওয়া হচ্ছে</span>
              )}
            </div>

            <button
              onClick={() => navigate(`/citizen/case/${activeCase.id}`)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3.5 py-1.5 rounded-xl transition-colors"
            >
              <span>বিস্তারিত ট্র্যাকিং ও টাইমলাইন</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-slate-500 text-xs">
          {t('citizen.noActiveCase')}
        </div>
      )}

      {/* Nearby Station Card & Latest SMS Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nearby Station Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Building className="w-4 h-4 text-brand-600" />
            <span>{t('citizen.nearbyStation')}</span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 font-bengali">
              {nearbyStation.nameBn}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{nearbyStation.district}</p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{nearbyStation.phone}</span>
            </span>
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-lg border border-emerald-200">
              রেটিং: {nearbyStation.rating} ★
            </span>
          </div>
        </div>

        {/* Latest SMS Preview */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700">
            <span className="font-bold flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{t('citizen.latestSms')}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">106 (NyayaSetu)</span>
          </div>

          {latestSms ? (
            <p className="text-xs text-slate-700 leading-relaxed font-bengali line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {latestSms.body}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic">কোনো বার্তা নেই</p>
          )}

          <p className="text-[10px] text-slate-400 text-right">
            ফিচার ফোনেও রিয়েল-টাইম এসএমএস ট্র্যাকিং সক্রিয়
          </p>
        </div>
      </div>
    </div>
  );
};
