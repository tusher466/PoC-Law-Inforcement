import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBadge } from '../../components/case/StatusBadge';
import { SlaCountdown } from '../../components/case/SlaCountdown';
import { CaseIdChip } from '../../components/case/CaseIdChip';
import { CaseTimeline } from '../../components/case/CaseTimeline';
import { EvidenceCard } from '../../components/evidence/EvidenceCard';
import { formatDhakaDateTime } from '../../lib/time';
import {
  ArrowLeft,
  Building,
  UserCheck,
  Phone,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  ShieldCheck,
  MapPin,
  Clock,
  Gavel,
} from 'lucide-react';

export const CaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cases = useAppStore((s) => s.cases);
  const allEvidence = useAppStore((s) => s.evidence);
  const stations = useAppStore((s) => s.stations);
  const user = useAuthStore((s) => s.user);
  const language = useAuthStore((s) => s.language);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTemplate, setMessageTemplate] = useState('তদন্তের সর্বশেষ অগ্রগতি কেমন এসআই স্যার?');
  const [messageSentFeedback, setMessageSentFeedback] = useState(false);

  const targetCase = cases.find((c) => c.id === caseId);

  if (!targetCase) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
        <p className="text-sm font-bold text-slate-800">কেস নম্বর খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('/citizen/my-cases')}
          className="mt-3 text-xs text-brand-600 font-bold hover:underline"
        >
          আমার কেস তালিকায় ফিরুন
        </button>
      </div>
    );
  }

  const linkedEvidence = allEvidence.filter(
    (e) => targetCase.evidenceIds.includes(e.id) || e.caseId === targetCase.id
  );
  const station = stations.find((s) => s.id === targetCase.stationId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSentFeedback(true);
    setTimeout(() => {
      setMessageSentFeedback(false);
      setShowMessageModal(false);
    }, 1800);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-150">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => navigate('/citizen/my-cases')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কেস তালিকা</span>
        </button>

        <StatusBadge status={targetCase.status} />
      </div>

      {/* Main Case Info Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CaseIdChip caseId={targetCase.id} />
          <span className="text-xs text-slate-500 font-medium">
            দাখিলের সময়: {formatDhakaDateTime(targetCase.createdAt)}
          </span>
        </div>

        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 font-bengali leading-snug">
            {targetCase.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed mt-1">
            {targetCase.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <p className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-600 shrink-0" />
            <span>থানা: {station ? station.nameBn : targetCase.stationId}</span>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{targetCase.location.address}</span>
          </p>
        </div>

        <SlaCountdown
          createdAt={targetCase.createdAt}
          slaDueAt={targetCase.slaDueAt}
        />
      </div>

      {/* Investigating Officer (IO) Profile Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-bengali">
          তদন্ত কর্মকর্তা (IO) তথ্য
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-bengali">
                {targetCase.ioName || 'তদন্ত কর্মকর্তা অপেক্ষমান'}
              </h4>
              <p className="text-xs text-slate-500">
                {targetCase.stationId.toUpperCase()} মডেল থানা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMessageModal(true)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
              <span>{t('citizen.messageIo')}</span>
            </button>

            <a
              href="tel:01711234501"
              className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('citizen.callIo')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Vertical Parcel-style Case Progress Timeline */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card">
        <CaseTimeline
          currentStage={targetCase.status}
          timeline={targetCase.timeline}
          courtDate={targetCase.courtDate}
        />
      </div>

      {/* Verified Evidence Vault Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 font-bengali">
              সংযুক্ত ডিজিটাল আলামত ({linkedEvidence.length})
            </h3>
          </div>

          <button
            onClick={() => navigate(`/citizen/upload-evidence?caseId=${targetCase.id}`)}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>আরো আলামত যোগ করুন</span>
          </button>
        </div>

        {linkedEvidence.length === 0 ? (
          <p className="text-xs text-slate-400 italic">এখনো কোনো আলামত আপলোড করা হয়নি।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {linkedEvidence.map((ev) => (
              <EvidenceCard key={ev.id} item={ev} />
            ))}
          </div>
        )}
      </div>

      {/* Message IO Modal (Simulated) */}
      {showMessageModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-bengali">
              তদন্ত কর্মকর্তাকে বার্তা প্রেরণ (Message IO)
            </h3>

            {messageSentFeedback ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs text-center font-bold font-bengali">
                ✓ আপনার বার্তাটি আইও-এর মোবাইল কনসোলে সফলভাবে পৌঁছেছে!
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3">
                <textarea
                  rows={3}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
                />

                <div className="flex flex-wrap gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setMessageTemplate('আমি নতুন একটি সিসিটিভি ফুটেজ পেয়েছি')}
                    className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 hover:bg-slate-200"
                  >
                    নতুন ফুটেজ পেয়েছি
                  </button>
                  <button
                    type="button"
                    onClick={() => setMessageTemplate('পরবর্তী শুনানির ব্যাপারে জানতে চাচ্ছি')}
                    className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 hover:bg-slate-200"
                  >
                    পরবর্তী শুনানি
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>পাঠান</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
