import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CaseStage } from '../../types';
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
  Calendar,
  BookOpen,
  Eye,
  ShieldCheck,
  Send,
  Plus,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Scale,
} from 'lucide-react';

export const OfficerCaseDetail: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cases = useAppStore((s) => s.cases);
  const evidence = useAppStore((s) => s.evidence);
  const updateCaseStatus = useAppStore((s) => s.updateCaseStatus);
  const assignIo = useAppStore((s) => s.assignIo);
  const addCaseDiary = useAppStore((s) => s.addCaseDiary);
  const setCourtDate = useAppStore((s) => s.setCourtDate);
  const appendAuditEntry = useAppStore((s) => s.appendAuditEntry);
  const currentRole = useAuthStore((s) => s.currentRole);

  const targetCase = cases.find((c) => c.id === caseId);

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<CaseStage>('investigation');
  const [statusNote, setStatusNote] = useState('');

  const [ioModalOpen, setIoModalOpen] = useState(false);
  const [selectedIo, setSelectedIo] = useState({
    id: 'io-001',
    name: 'এসআই মাহমুদুল হাসান',
    phone: '01711-234501',
  });

  const [diaryModalOpen, setDiaryModalOpen] = useState(false);
  const [diarySummary, setDiarySummary] = useState('');
  const [diaryActions, setDiaryActions] = useState('');
  const [diaryNext, setDiaryNext] = useState('');

  const [courtModalOpen, setCourtModalOpen] = useState(false);
  const [courtDateVal, setCourtDateVal] = useState('2026-11-20');
  const [courtNameVal, setCourtNameVal] = useState('মেট্রোপলিটন ম্যাজিস্ট্রেট কোর্ট ৪, ঢাকা');

  // Masked citizen contact reveal state
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);

  if (!targetCase) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <p className="text-sm font-bold text-slate-800">কেস নম্বর খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('/officer/queue')}
          className="mt-3 text-xs text-brand-600 font-bold hover:underline"
        >
          কেস কিউ-এ ফিরুন
        </button>
      </div>
    );
  }

  const linkedEvidence = evidence.filter(
    (e) => targetCase.evidenceIds.includes(e.id) || e.caseId === targetCase.id
  );

  const handleRevealPhone = async () => {
    setIsPhoneRevealed(true);
    await appendAuditEntry(
      currentRole,
      'CITIZEN_PHONE_REVEALED',
      targetCase.id,
      `Officer revealed masked citizen phone for Case #${targetCase.id}. Purpose: Lawful investigation contact.`
    );
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCaseStatus(
      targetCase.id,
      newStatus,
      statusNote || 'তদন্তের অগ্রগতি সংক্রান্ত পদক্ষেপ গৃহীত হয়েছে।',
      currentRole,
      'এসআই মাহমুদুল হাসান'
    );
    setStatusModalOpen(false);
    setStatusNote('');
  };

  const handleIoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await assignIo(
      targetCase.id,
      selectedIo.id,
      selectedIo.name,
      selectedIo.phone,
      'oc',
      'মোহাম্মদ ইকরাম হোসেন (ওসি)'
    );
    setIoModalOpen(false);
  };

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCaseDiary(
      targetCase.id,
      diarySummary,
      diaryActions,
      diaryNext,
      'এসআই মাহমুদুল হাসান'
    );
    setDiaryModalOpen(false);
    setDiarySummary('');
    setDiaryActions('');
    setDiaryNext('');
  };

  const handleCourtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await setCourtDate(
      targetCase.id,
      courtDateVal,
      courtNameVal,
      'এসআই মাহমুদুল হাসান'
    );
    setCourtModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/officer/queue')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl transition-colors shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কেস কিউ</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Update Status Action */}
          <button
            onClick={() => setStatusModalOpen(true)}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-card transition-all"
          >
            {t('officer.updateStatusModal')}
          </button>

          {/* Assign IO Action */}
          <button
            onClick={() => setIoModalOpen(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-card transition-all"
          >
            আইও পরিবর্তন/নিয়োগ
          </button>

          {/* Add Case Diary */}
          <button
            onClick={() => setDiaryModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-card transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>কেস ডায়েরি এন্ট্রি</span>
          </button>

          {/* Set Court Date */}
          <button
            onClick={() => setCourtModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-card transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>আদালত তারিখ</span>
          </button>
        </div>
      </div>

      {/* Case Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CaseIdChip caseId={targetCase.id} />
            <StatusBadge status={targetCase.status} />
          </div>

          <SlaCountdown
            createdAt={targetCase.createdAt}
            slaDueAt={targetCase.slaDueAt}
            compact
          />
        </div>

        <div>
          <h1 className="text-xl font-black text-slate-900 font-bengali leading-snug">
            {targetCase.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bengali leading-relaxed mt-1">
            {targetCase.description}
          </p>
        </div>

        {/* Citizen Contact Section (Masked with Audit Reveal) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              বাদী / নাগরিকের নাম:
            </span>
            <span className="font-bold text-slate-900 font-bengali block mt-0.5">
              {targetCase.citizenName}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              যোগাযোগ নম্বর (মাস্কড):
            </span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-mono font-bold text-slate-900">
                {isPhoneRevealed
                  ? targetCase.citizenPhone
                  : `${targetCase.citizenPhone.slice(0, 5)}-XXXXXX`}
              </span>

              {!isPhoneRevealed && (
                <button
                  type="button"
                  onClick={handleRevealPhone}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline"
                  title="Reveal phone number (Audit logged)"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>উন্মোচন</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              দায়িত্বপ্রাপ্ত তদন্ত কর্মকর্তা:
            </span>
            <span className="font-bold text-brand-700 font-bengali block mt-0.5">
              {targetCase.ioName || 'অপেক্ষমান'}
            </span>
          </div>
        </div>
      </div>

      {/* Case Diary & Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Case Progress Timeline */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <h2 className="text-sm font-bold text-slate-900 font-bengali">
            মামলার আইনি পর্যায় ও পদক্ষেপ টাইমলাইন
          </h2>
          <CaseTimeline
            currentStage={targetCase.status}
            timeline={targetCase.timeline}
            courtDate={targetCase.courtDate}
          />
        </div>

        {/* Right: Official Case Diary (CD) Register */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>কেস ডায়েরি (Case Diary Entries - {targetCase.diary.length})</span>
            </h2>

            <button
              onClick={() => setDiaryModalOpen(true)}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন এন্ট্রি</span>
            </button>
          </div>

          {targetCase.diary.length === 0 ? (
            <p className="text-xs text-slate-400 italic">এখনো কোনো ডায়েরি এন্ট্রি লিপিবদ্ধ করা হয়নি।</p>
          ) : (
            <div className="space-y-3">
              {targetCase.diary.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-500 font-mono text-[11px] border-b border-slate-200/80 pb-1.5">
                    <span className="font-bold text-slate-700">তারিখ: {entry.date}</span>
                    <span>আইও: {entry.ioName}</span>
                  </div>

                  <div>
                    <strong className="text-slate-800 block font-bengali">সারসংক্ষেপ:</strong>
                    <p className="text-slate-700 font-bengali leading-relaxed mt-0.5">
                      {entry.summary}
                    </p>
                  </div>

                  {entry.actionsTaken && (
                    <div className="text-slate-600 pt-1">
                      <strong className="text-slate-800 block font-bengali">গৃহীত পদক্ষেপ:</strong>
                      <p className="font-bengali leading-relaxed">{entry.actionsTaken}</p>
                    </div>
                  )}

                  {entry.nextSteps && (
                    <div className="text-emerald-800 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200/60 pt-1">
                      <strong className="block font-bengali">পরবর্তী পরিকল্পনা:</strong>
                      <p className="font-bengali leading-relaxed">{entry.nextSteps}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Evidence Panel with Hash Badges & Malkhana Registration */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 font-bengali">
              মামলার আলামত ও ক্রিপ্টোগ্রাফিক রেকর্ড ভল্ট ({linkedEvidence.length})
            </h2>
          </div>

          <button
            onClick={() => navigate('/officer/evidence-room')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            মালখানা ব্যবস্থাপনা খুলুন
          </button>
        </div>

        {linkedEvidence.length === 0 ? (
          <p className="text-xs text-slate-400 italic">কোনো আলামত সংরক্ষিত নেই।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {linkedEvidence.map((ev) => (
              <EvidenceCard key={ev.id} item={ev} allowTransfer />
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Update Case Status */}
      {statusModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-bengali">
              {t('officer.updateStatusModal')}
            </h3>

            <form onSubmit={handleStatusSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  {t('officer.selectNewStatus')}:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as CaseStage)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali font-semibold"
                >
                  <option value="received">থানায় গৃহীত (Received)</option>
                  <option value="assigned">তদন্ত কর্মকর্তা নিযুক্ত (Assigned)</option>
                  <option value="investigation">তদন্তাধীন (Under Investigation)</option>
                  <option value="chargesheet">চার্জশিট দাখিল (Chargesheet)</option>
                  <option value="court">আদালতে বিচারাধীন (Court Trial)</option>
                  <option value="closed">নিষ্পত্তি ও সমাপ্ত (Closed)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  {t('officer.statusNote')}:
                </label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="নাগরিকের মোবাইলে স্বয়ংক্রিয় এসএমএস পাঠানো হবে..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  আপডেট নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Assign IO */}
      {ioModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-bengali">
              তদন্ত কর্মকর্তা (IO) নিয়োগ
            </h3>

            <form onSubmit={handleIoSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  কর্মকর্তা নির্বাচন করুন:
                </label>
                <select
                  value={selectedIo.id}
                  onChange={(e) => {
                    if (e.target.value === 'io-001') {
                      setSelectedIo({
                        id: 'io-001',
                        name: 'এসআই মাহমুদুল হাসান',
                        phone: '01711-234501',
                      });
                    } else {
                      setSelectedIo({
                        id: 'io-002',
                        name: 'এসআই তানভীর হোসেন',
                        phone: '01711-234503',
                      });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                >
                  <option value="io-001">এসআই মাহমুদুল হাসান (ধানমন্ডি থানা)</option>
                  <option value="io-002">এসআই তানভীর হোসেন (সাইবার ক্রাইম সেল)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIoModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  দায়িত্ব প্রদান করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Case Diary Entry */}
      {diaryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-bengali">
              কেস ডায়েরি (CD) নতুন কার্যবিবরণী
            </h3>

            <form onSubmit={handleDiarySubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  তদন্তের অগ্রগতি ও সারসংক্ষেপ:
                </label>
                <textarea
                  rows={2}
                  value={diarySummary}
                  onChange={(e) => setDiarySummary(e.target.value)}
                  placeholder="আজকের ঘটনাস্থল পরিদর্শন বা জিজ্ঞাসাবাদ সংক্রান্ত..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  গৃহীত পদক্ষেপসমূহ:
                </label>
                <textarea
                  rows={2}
                  value={diaryActions}
                  onChange={(e) => setDiaryActions(e.target.value)}
                  placeholder="সিসিটিভি ফুটেজ জব্দ, সাক্ষীর জবানবন্দি..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  পরবর্তী করণীয় ও নির্দেশনা:
                </label>
                <input
                  type="text"
                  value={diaryNext}
                  onChange={(e) => setDiaryNext(e.target.value)}
                  placeholder="সিআইডি রিপোর্ট সংগ্রহ ও অভিযোগপত্র চূড়ান্তকরণ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDiaryModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  ডায়েরিতে নথিভুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Court Date Setting */}
      {courtModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-bengali">
              আদালতের শুনানির তারিখ নির্ধারণ
            </h3>

            <form onSubmit={handleCourtSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  ধার্য্য তারিখ:
                </label>
                <input
                  type="date"
                  value={courtDateVal}
                  onChange={(e) => setCourtDateVal(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  আদালতের নাম:
                </label>
                <input
                  type="text"
                  value={courtNameVal}
                  onChange={(e) => setCourtNameVal(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCourtModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  তারিখ নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
