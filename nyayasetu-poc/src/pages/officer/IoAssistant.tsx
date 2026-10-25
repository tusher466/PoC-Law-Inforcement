import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Case } from '../../types';
import { CaseIdChip } from '../../components/case/CaseIdChip';
import { StatusBadge } from '../../components/case/StatusBadge';
import {
  Sparkles,
  BookOpen,
  Scale,
  CheckSquare,
  Square,
  Clock,
  FileText,
  Copy,
  Check,
  Save,
  AlertCircle,
  HelpCircle,
  Wand2,
} from 'lucide-react';

export const IoAssistant: React.FC = () => {
  const { t } = useTranslation();
  const cases = useAppStore((s) => s.cases);
  const addCaseDiary = useAppStore((s) => s.addCaseDiary);
  const language = useAuthStore((s) => s.language);

  // Selected case for AI investigation assistance
  const [selectedCaseId, setSelectedCaseId] = useState(
    cases[0] ? cases[0].id : 'NS-2026-DHK-000101'
  );
  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Auto-generated Bangla Case Diary draft
  const defaultDraft = activeCase
    ? `বাংলাদেশ ফরম নং ৫৩ (পুলিশ ডায়েরি)
মামলা নং: ${activeCase.id}
বাদী: ${activeCase.citizenName} | থানা: ${activeCase.stationId.toUpperCase()}
স্থান: ${activeCase.location.address}
ঘটনা: ${activeCase.description}

[তদন্ত কর্মকর্তার পর্যবেক্ষণ]
আজ ঘটনাস্থল সরেজমিনে পরিদর্শনকালে বাদী ও স্থানীয় সাক্ষীদের সাথে কথা বলি। প্রাথমিক আলামত বিশ্লেষণ ও ঘটনাস্থলের সিসিটিভি ফুটেজ পর্যবেক্ষণ করে দেখা যায় যে, অভিযুক্তরা সুনির্দিষ্ট পরিকল্পনা অনুযায়ী অপরাধ সংঘটন করেছে। জব্দকৃত প্রমাণাদি ফরেনসিক ল্যাবে প্রেরণের ব্যবস্থা গ্রহণ করা হয়েছে।`
    : '';

  const [diaryText, setDiaryText] = useState(defaultDraft);
  const [copied, setCopied] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [docSummary, setDocSummary] = useState<string | null>(null);

  // Chargesheet Preparation Checklist
  const [checklist, setChecklist] = useState<{ id: string; label: string; done: boolean }[]>([
    { id: 'c1', label: 'ঘটনাস্থল পরিদর্শন ও খসড়া মানচিত্র (Sketch Map) প্রস্তুত', done: true },
    { id: 'c2', label: 'বাদী ও প্রত্যক্ষদর্শী সাক্ষীদের ১৬১ ধারায় জবানবন্দি লিপিবদ্ধ', done: true },
    { id: 'c3', label: 'ডিজিটাল আলামতের ক্রিপ্টোগ্রাফিক হ্যাশ ভেরিফিকেশন ও জব্দতালিকা', done: true },
    { id: 'c4', label: 'টেলিকম সিডিআর (CDR) ও আইপি ফরেনসিক রিপোর্ট সংগ্রহ', done: false },
    { id: 'c5', label: 'অভিযুক্তের পূর্ববর্তী অপরাধের রেকর্ড (CDMS Warrants) যাচাই', done: false },
    { id: 'c6', label: 'চূড়ান্ত অভিযোগপত্র (Chargesheet Form-39) আদালতে দাখিল', done: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = checklist.filter((c) => c.done).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  // Legal section suggestions by taxonomy
  const legalSections =
    activeCase?.type === 'theft'
      ? [
          { sec: 'দণ্ডবিধি ৩৭৯ ধারা', desc: 'চুরি সংঘটনের জন্য অনধিক ৩ বছর পর্যন্ত কারাদণ্ড বা অর্থদণ্ড।' },
          { sec: 'দণ্ডবিধি ৩৯২ ধারা', desc: 'ছিনতাই বা দস্যুতার শাস্তি: অনধিক ১০ বছর সশ্রম কারাদণ্ড।' },
          { sec: 'দণ্ডবিধি ৪১১ ধারা', desc: 'চোরাই মাল অসাধুভাবে গ্রহণ বা দখলে রাখার শাস্তি।' },
        ]
      : activeCase?.type === 'cyber_fraud'
      ? [
          { sec: 'সাইবার নিরাপত্তা আইন ২০২৩ ধারা ২৬', desc: 'অনুমতি ব্যতীত পরিচিতি তথ্য সংগ্রহ বা ব্যবহারের শাস্তি।' },
          { sec: 'দণ্ডবিধি ৪২০ ধারা', desc: 'প্রতারণা এবং অসাধুভাবে সম্পত্তি সমর্পণ করানোর শাস্তি (অনধিক ৭ বছর কারাদণ্ড)।' },
          { sec: 'ডিজিটাল নিরাপত্তা আইন ধারা ২৩', desc: 'কম্পিউটার বা ডিজিটাল ডিভাইসে অনধিকার প্রবেশ ও তহবিল স্থানান্তর।' },
        ]
      : [
          { sec: 'দণ্ডবিধি ৫০৬ ধারা', desc: 'অপরাধমূলক ভীতি প্রদর্শনের শাস্তি।' },
          { sec: 'দণ্ডবিধি ৩৫৪ ধারা', desc: 'নারীর শ্লীলতাহানির উদ্দেশ্যে আক্রমণ বা বলপ্রয়োগ।' },
        ];

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(diaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToDiary = async () => {
    if (!activeCase) return;
    await addCaseDiary(
      activeCase.id,
      diaryText.slice(0, 100) + '...',
      'আইও এআই সহকারী কর্তৃক স্বয়ংক্রিয় খসড়া হতে অনুমোদিত',
      'চার্জশিট প্রস্তুতকরণ চলমান',
      'এসআই মাহমুদুল হাসান'
    );
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleSummarizeDoc = () => {
    setDocSummary(
      `[এআই ডকুমেন্ট সারসংক্ষেপ - ${activeCase?.id}]
১. মূল ঘটনা: সকাল ১১:৩০ মিনিটে ধানমন্ডি ২৭ রোডে রিকশায় থাকা অবস্থায় বাইক আরোহী ছিনতাইকারী গ্যাং দ্বারা মোবাইল ছিনতাই।
২. জব্দকৃত প্রমাণ: সিসিটিভি স্টিল ফ্রেম ক্যামেরার নম্বর ৪ এবং ডিজিটাল লেনদেন ট্র্যাক।
৩. প্রধান তদন্ত সূত্র: বাইকের অস্পষ্ট নম্বর প্লেট 'ঢাকা মেট্রো-হ-১২...' এর ডিজিটাল বর্ধন ও টেলিকম আইএমইআই আইডেন্টিফিকেশন সক্রিয় রয়েছে।`
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 block flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI-POWERED ASSISTANT FOR INVESTIGATING OFFICERS
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('officer.ioAssistantTitle')}
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            আইনি ধারা ম্যাপিং, কেস ডায়েরি খসড়া ও চার্জশিট প্রস্তুতি চেকলিস্ট
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-700 font-bengali">মামলা নির্বাচন:</label>
          <select
            value={selectedCaseId}
            onChange={(e) => {
              setSelectedCaseId(e.target.value);
              setDocSummary(null);
            }}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-900 shadow-soft"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title.slice(0, 25)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Case Facts | Right Assistant Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Case Facts & Statutory Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-500 uppercase font-bengali">
                মামলার মূল বিবরণ
              </span>
              <StatusBadge status={activeCase.status} />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-bengali leading-snug">
                {activeCase.title}
              </h3>
              <p className="text-xs text-slate-600 font-bengali leading-relaxed mt-1">
                {activeCase.description}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <p>
                <strong className="text-slate-800">বাদী:</strong> {activeCase.citizenName}
              </p>
              <p>
                <strong className="text-slate-800">ঘটনাস্থল:</strong> {activeCase.location.address}
              </p>
              <p>
                <strong className="text-slate-800">থানা:</strong> {activeCase.stationId.toUpperCase()} Thana
              </p>
              <p>
                <strong className="text-slate-800">সংযুক্ত আলামত:</strong> {activeCase.evidenceIds.length} টি
              </p>
            </div>

            {/* Document Summarizer CTA */}
            <div className="pt-2">
              <button
                onClick={handleSummarizeDoc}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 font-bold py-2 px-3 rounded-xl text-xs transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5 text-brand-600" />
                <span>{t('officer.summarizeDoc')} (এক-ক্লিক সারাংশ)</span>
              </button>
            </div>

            {docSummary && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 font-bengali leading-relaxed space-y-1 animate-in fade-in duration-150">
                <span className="font-bold text-brand-700 block">নথি সারসংক্ষেপ প্রস্তুত:</span>
                <p className="whitespace-pre-line text-slate-600 text-[11px]">{docSummary}</p>
              </div>
            )}
          </div>

          {/* Statutory Milestone & Deadline Reminders */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
            <h4 className="text-xs font-bold text-slate-700 font-bengali flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>আইনগত সময়সীমা ও এসএলএ অনুস্মারক</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-bengali">প্রাথমিক এসআইভি / ঘটনাস্থল পরিদর্শন:</span>
                <span className="font-bold text-emerald-700">সম্পন্ন (২৪ ঘণ্টার মধ্যে)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-amber-900 font-bengali">ফরেনসিক প্রমাণ ও সিডিআর তলব:</span>
                <span className="font-bold text-amber-800">বাকি: ১৮ ঘণ্টা</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-bengali">আদালতে অভিযোগপত্র (চার্জশিট) জমার লক্ষ্য:</span>
                <span className="font-bold text-slate-800">১৫ দিন</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): AI Case Diary Draft & Legal Sections & Checklist */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Suggested Legal Sections (Rule-based taxonomy mapping) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 font-bengali">
                  {t('officer.suggestedSections')}
                </h3>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t('officer.suggestionOnlyNotice')}</span>
            </div>

            <div className="space-y-2">
              {legalSections.map((sec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <strong className="text-slate-900 font-bengali block font-bold text-xs">
                      {sec.sec}
                    </strong>
                    <p className="text-slate-600 font-bengali text-[11px] mt-0.5">
                      {sec.desc}
                    </p>
                  </div>
                  <span className="bg-white border border-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded font-mono shrink-0">
                    Penal Match
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Automated Bangla Case Diary Draft */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 font-bengali">
                  {t('officer.caseDiaryDraft')}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-xl transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>

                <button
                  onClick={handleSaveToDiary}
                  className="inline-flex items-center gap-1 bg-brand-500 hover:bg-brand-600 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedFeedback ? 'সংরক্ষিত!' : 'ডায়েরিতে সেভ করুন'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={8}
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-bengali focus:outline-none focus:ring-2 focus:ring-brand-200 shadow-inner font-mono"
            />
          </div>

          {/* Section 3: Chargesheet Readiness Checklist */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-bengali">
                {t('officer.chargesheetChecklist')}
              </h3>
              <span className="text-xs font-bold text-brand-600 font-mono">
                {progressPercent}% প্রস্তুত
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2 pt-1">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bengali transition-colors flex items-center gap-2.5 ${
                    item.done
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 shrink-0" />
                  )}
                  <span className={item.done ? 'line-through text-slate-500' : ''}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
