import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  User,
  ShieldCheck,
  Archive,
  Radio,
  Star,
  FileCheck2,
  Store,
} from 'lucide-react';

interface TourStepDef {
  step: number;
  role: Role;
  path: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  actionHintBn: string;
  actionHintEn: string;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStepDef[] = [
  {
    step: 0,
    role: 'citizen',
    path: '/citizen/file-gd',
    titleBn: '১. নাগরিক কর্তৃক ভয়েস জিডি দাখিল',
    titleEn: '1. Citizen Files Bangla Voice Complaint',
    descBn:
      'নাগরিক রহিমা খাতুন বাংলায় মুখে বলে মোবাইল ছিনতাইয়ের জিডি দাখিল করছেন। তাৎক্ষণিক SHA-256 হ্যাশ সিল এবং ইউনিক কেস আইডি তৈরি হয়।',
    descEn:
      'Citizen files a voice complaint in Bangla. The system hashes attachments with SHA-256 and issues a Unique Case ID + SMS.',
    actionHintBn: '"ভয়েস সিমুলেট করুন" চাপুন এবং পরবর্তী ধাপে জিডি জমা দিন।',
    actionHintEn: 'Click "Simulate Voice Input" and proceed through the 4-step wizard.',
    icon: <User className="w-5 h-5 text-emerald-600" />,
  },
  {
    step: 1,
    role: 'oc',
    path: '/officer/queue',
    titleBn: '২. থানার ওসির কেস কিউ ও আইও নিয়োগ',
    titleEn: '2. OC Assigns Investigating Officer (IO)',
    descBn:
      'থানার ওসি কিউতে নতুন অভিযোগ দেখতে পাচ্ছেন (এসএলএ টাইমার চালু)। তদন্ত তদারকির স্বার্থে তিনি এসআই মাহমুদুল হাসানকে আইও হিসেবে দায়িত্ব দেন।',
    descEn:
      'Duty Officer reviews the priority queue with running SLA countdown and assigns an Investigating Officer.',
    actionHintBn: 'কেসটি খুলুন এবং "তদন্ত কর্মকর্তা নিয়োগ করুন" বাটনে ক্লিক করুন।',
    actionHintEn: 'Open the case card and assign SI Mahmudul Hasan as IO.',
    icon: <ShieldCheck className="w-5 h-5 text-blue-600" />,
  },
  {
    step: 2,
    role: 'io',
    path: '/officer/io-assistant',
    titleBn: '৩. আইও এআই সহকারী ও কেস ডায়েরি খসড়া',
    titleEn: '3. IO Assistant, Case Diary & Legal Mapping',
    descBn:
      'তদন্ত কর্মকর্তা আইও সহকারীর সাহায্যে বাংলায় স্বয়ংক্রিয় কেস ডায়েরি লিখছেন, দণ্ডবিধির প্রাসঙ্গিক ধারা পর্যালোচনা করছেন এবং পর্যায় আপডেট করছেন।',
    descEn:
      'Investigating Officer uses rule-based assistant to generate formal Bangla Case Diary entries and checklist.',
    actionHintBn: 'খসড়া ডায়েরি সংরক্ষণ করুন এবং স্ট্যাটাস পরিবর্তন করুন। নাগরিকের ট্র্যাকার আপডেট হবে।',
    actionHintEn: 'Review the generated diary and update stage to notify citizen.',
    icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
  },
  {
    step: 3,
    role: 'evidence',
    path: '/officer/evidence-room',
    titleBn: '৪. ডিজিটাল মালখানা ও চেইন অব কাস্টডি জালিয়াতি প্রতিরোধ',
    titleEn: '4. Evidence Vault & Cryptographic Tamper Detection',
    descBn:
      'জব্দকৃত আলামত ডিজিটাল ভল্টে রেজিস্টার করা হয়, প্রিন্ট কিউআর ট্যাগ তৈরি হয় এবং হস্তান্তর চেইন যাচাই করা হয়। জালিয়াতি চেষ্টা করলে তাৎক্ষণিক অ্যালার্ট ওঠে।',
    descEn:
      'Seized property is tagged with QR codes and linked to an append-only SHA-256 custody chain with fraud detection.',
    actionHintBn: '"চেইন যাচাই" ও "জালিয়াতি ডেমো" বাটনে ক্লিক করে সত্যতা পরীক্ষা করুন।',
    actionHintEn: 'Click "Verify Chain" then "Simulate Tampering" to see detection.',
    icon: <Archive className="w-5 h-5 text-purple-600" />,
  },
  {
    step: 4,
    role: 'citizen',
    path: '/citizen/sos',
    titleBn: '৫. সাইলেন্ট এসওএস ও ৯৯৯ স্মার্ট ডিসপ্যাচ',
    titleEn: '5. Silent SOS Trigger & CAD Patrol Dispatch',
    descBn:
      'বিপদের মুহূর্তে নাগরিক এক ক্লিকে এসওএস পাঠান। এটি মুহূর্তেই ৯৯৯ ডিসপ্যাচ কনসোলে চলে যায় এবং নিকটতম টহল টিমকে অটো-অ্যাসাইন করে।',
    descEn:
      'Citizen triggers Silent SOS. 999 CAD instantly detects coordinates, auto-assigns nearest patrol unit.',
    actionHintBn: 'এসওএস সিমুলেট করুন; এরপর ডিসপ্যাচ কনসোলে গিয়ে টহল ট্যাবলেটে এক্সেপ্ট করুন।',
    actionHintEn: 'Trigger SOS and observe real-time sync with 999 Dispatch.',
    icon: <Radio className="w-5 h-5 text-red-600" />,
  },
  {
    step: 5,
    role: 'citizen',
    path: '/citizen/rate-station',
    titleBn: '৬. নাগরিকের সেবা মূল্যায়ন ও স্বচ্ছতা ফিডব্যাক',
    titleEn: '6. Citizen Rates Station Service',
    descBn:
      'সেবা গ্রহণের পর নাগরিক সততা ও দক্ষতার ভিত্তিতে থানাকে ৫-স্টার রেটিং ও ট্যাগ প্রদান করেন। এটি থানার স্কোরকার্ডে রিয়েল-টাইমে প্রভাব ফেলে।',
    descEn:
      'Citizen rates police station service quality (Fast, Corruption-free, Polite) updating precinct public score.',
    actionHintBn: 'রেটিং জমা দিন এবং থানা ড্যাশবোর্ডে গিয়ে ফলাফল দেখুন।',
    actionHintEn: 'Submit 5 stars with tags and inspect Station Dashboard.',
    icon: <Star className="w-5 h-5 text-amber-500" />,
  },
  {
    step: 6,
    role: 'auditor',
    path: '/audit',
    titleBn: '৭. ক্রিপ্টোগ্রাফিক অডিট লগ ও গোপন হুইসেলব্লোয়ার প্ল্যাটফর্ম',
    titleEn: '7. Immutable Audit Chain & Whistleblower Tips',
    descBn:
      'সংস্কার পর্যবেক্ষক সমগ্র সিস্টেমের ক্রিপ্টোগ্রাফিক হ্যাশ চেইন যাচাই করছেন এবং বেনামি পুলিশ অসদাচরণ রিপোর্টের তদন্ত তদারকি করছেন।',
    descEn:
      'Oversight Auditor verifies append-only SHA-256 ledger and reviews anonymous police misconduct tips.',
    actionHintBn: '"সমগ্র অডিট চেইন যাচাই" বাটনে ক্লিক করে ব্লকের অখণ্ডতা পরীক্ষা করুন।',
    actionHintEn: 'Verify immutable audit logs and review anonymous tip queue.',
    icon: <FileCheck2 className="w-5 h-5 text-teal-600" />,
  },
  {
    step: 7,
    role: 'operator',
    path: '/kiosk',
    titleBn: '৮. ইউনিয়ন ডিজিটাল সেন্টার কিয়স্ক ও এসএমএস ট্র্যাকিং',
    titleEn: '8. Rural Kiosk & Feature Phone SMS Tracking',
    descBn:
      'স্মার্টফোনবিহীন গ্রামীণ নাগরিকদের জন্য কিয়স্কে সহায়তা প্রদান এবং কিউআর রসিদ প্রিন্ট। যেকোনো সাধারণ ফোনে SMS STATUS পাঠিয়ে ট্র্যাকিং সম্ভব।',
    descEn:
      'Assisted filing at Rural Digital Centres with physical print receipts and offline SMS keyword tracking.',
    actionHintBn: 'কিয়স্ক রসিদ প্রিন্ট করুন এবং উপরে "এসএমএস সিমুলেটর" খুলে ট্র্যাকিং পরীক্ষা করুন।',
    actionHintEn: 'Print physical kiosk receipt and send SMS STATUS query.',
    icon: <Store className="w-5 h-5 text-indigo-600" />,
  },
];

export const GuidedTour: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tourStep = useAppStore((s) => s.tourStep);
  const setTourStep = useAppStore((s) => s.setTourStep);
  const setRole = useAuthStore((s) => s.setRole);
  const language = useAuthStore((s) => s.language);

  if (tourStep === null || tourStep < 0 || tourStep >= TOUR_STEPS.length) {
    return null;
  }

  const currentStepDef = TOUR_STEPS[tourStep];

  const handleNext = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextStepIndex = tourStep + 1;
      const nextStepDef = TOUR_STEPS[nextStepIndex];
      setRole(nextStepDef.role);
      navigate(nextStepDef.path);
      setTourStep(nextStepIndex);
    } else {
      setTourStep(null);
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      const prevStepIndex = tourStep - 1;
      const prevStepDef = TOUR_STEPS[prevStepIndex];
      setRole(prevStepDef.role);
      navigate(prevStepDef.path);
      setTourStep(prevStepIndex);
    }
  };

  const handleClose = () => {
    setTourStep(null);
  };

  return (
    <div
      role="region"
      aria-label="Guided Tour Walkthrough"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-slate-700 ring-1 ring-white/10">
        {/* Top bar with step counter */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-brand-500/20 text-brand-400">
              {currentStepDef.icon}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              {language === 'bn' ? `ধাপ ${tourStep + 1} / ৮` : `Step ${tourStep + 1} of 8`}
            </span>
          </div>

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close guided tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm sm:text-base font-extrabold text-white font-bengali leading-snug">
            {language === 'bn' ? currentStepDef.titleBn : currentStepDef.titleEn}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-bengali">
            {language === 'bn' ? currentStepDef.descBn : currentStepDef.descEn}
          </p>

          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700 text-xs text-emerald-300 font-medium">
            <span className="font-bold text-emerald-400">
              {language === 'bn' ? 'কীভাবে দেখবেন: ' : 'Try this: '}
            </span>
            {language === 'bn'
              ? currentStepDef.actionHintBn
              : currentStepDef.actionHintEn}
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1">
            {TOUR_STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === tourStep
                    ? 'w-5 bg-amber-400'
                    : idx < tourStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {tourStep > 0 && (
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পূর্ববর্তী</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <span>{tourStep === TOUR_STEPS.length - 1 ? 'সমাপ্ত' : 'পরবর্তী ধাপ'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
