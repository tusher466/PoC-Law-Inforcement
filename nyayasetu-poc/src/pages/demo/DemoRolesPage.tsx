import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLE_CONFIGS } from '../../lib/rbac';
import { Role } from '../../types';
import {
  User,
  Store,
  BadgeAlert,
  ShieldCheck,
  Archive,
  Radio,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  LogIn,
  UserPlus,
  Home,
  Check,
  Layers,
} from 'lucide-react';

const ROLE_META: Record<
  Role,
  {
    icon: React.ReactNode;
    color: string;
    bgLight: string;
    borderLight: string;
    category: 'citizen' | 'police' | 'oversight';
    categoryLabelBn: string;
    categoryLabelEn: string;
    featuresBn: string[];
    featuresEn: string[];
  }
> = {
  citizen: {
    icon: <User className="w-6 h-6 text-emerald-600" />,
    color: 'emerald',
    bgLight: 'bg-emerald-50/70',
    borderLight: 'border-emerald-200',
    category: 'citizen',
    categoryLabelBn: 'নাগরিক সেবা',
    categoryLabelEn: 'Citizen Service',
    featuresBn: ['বাংলা ভয়েস জিডি', 'অনলাইন কেস ট্র্যাকিং', 'ডিজিটাল আলামত আপলোড', 'জরুরি ৯৯৯ এসওএস', 'থানা রেটিং'],
    featuresEn: ['Bangla Voice GD', 'Online Case Tracking', 'Digital Evidence Vault', 'Emergency 999 SOS', 'Station Feedback'],
  },
  operator: {
    icon: <Store className="w-6 h-6 text-teal-600" />,
    color: 'teal',
    bgLight: 'bg-teal-50/70',
    borderLight: 'border-teal-200',
    category: 'citizen',
    categoryLabelBn: 'গ্রামীণ ও প্রান্তিক সেবা',
    categoryLabelEn: 'Rural Assisted Kiosk',
    featuresBn: ['স্মার্টফোনবিহীন নাগরিক সেবা', 'সহায়তাপ্রাপ্ত জিডি ইনটেক', 'মুদ্রণযোগ্য কিউআর রসিদ', 'সরাসরি এসএমএস প্রেরণ'],
    featuresEn: ['Smartphone-free support', 'Assisted GD Intake', 'Printable QR Receipts', 'Instant SMS Dispatch'],
  },
  oc: {
    icon: <BadgeAlert className="w-6 h-6 text-blue-600" />,
    color: 'blue',
    bgLight: 'bg-blue-50/70',
    borderLight: 'border-blue-200',
    category: 'police',
    categoryLabelBn: 'থানা কমান্ড ও তদারকি',
    categoryLabelEn: 'Station Command',
    featuresBn: ['থানার সার্বিক জিডি ও কেস ওভারভিউ', 'এসএলএ ও তদন্ত বিলম্ব অ্যালার্ট', 'দ্রুত তদন্ত কর্মকর্তা (আইও) নিয়োগ', 'থানা পারফরম্যান্স স্কোর'],
    featuresEn: ['Precinct Case Overview', 'SLA Delay Alerts', 'Fast IO Assignment', 'Station Performance Score'],
  },
  io: {
    icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    color: 'indigo',
    bgLight: 'bg-indigo-50/70',
    borderLight: 'border-indigo-200',
    category: 'police',
    categoryLabelBn: 'তদন্ত ও মামলা পরিচালনা',
    categoryLabelEn: 'Investigation & Court',
    featuresBn: ['ডিজিটাল কেস ডায়েরি (সিডি)', 'স্মার্ট আইনি ধারা শনাক্তকরণ', 'তদন্ত চেকলিস্ট', 'স্বয়ংক্রিয় খসড়া চার্জশিট'],
    featuresEn: ['Digital Case Diary (CD)', 'Smart Penal Code Mapping', 'Investigation Checklist', 'Draft Chargesheet Generator'],
  },
  evidence: {
    icon: <Archive className="w-6 h-6 text-purple-600" />,
    color: 'purple',
    bgLight: 'bg-purple-50/70',
    borderLight: 'border-purple-200',
    category: 'police',
    categoryLabelBn: 'মালখানা ও প্রমাণ সংরক্ষণ',
    categoryLabelEn: 'Malkhana & Evidence Vault',
    featuresBn: ['জব্দকৃত বস্তু ইনভেন্টরি', 'নিরাপদ কিউআর কোড লেবেল', 'SHA-256 ক্রিপ্টোগ্রাফিক চেইন', 'আদালত হস্তান্তর অডিট লগ'],
    featuresEn: ['Seized Item Inventory', 'Tamper-evident QR Labels', 'SHA-256 Hash Chain', 'Court Transfer Audit Log'],
  },
  dispatcher: {
    icon: <Radio className="w-6 h-6 text-rose-600" />,
    color: 'rose',
    bgLight: 'bg-rose-50/70',
    borderLight: 'border-rose-200',
    category: 'oversight',
    categoryLabelBn: 'জরুরি সাড়াদান ও সিএডি',
    categoryLabelEn: 'Emergency CAD Dispatch',
    featuresBn: ['৯৯৯ লাইভ কল ও এসওএস গ্রহণ', 'জিপিএস ভিত্তিক নিকটতম প্যাট্রোল নির্বাচন', 'লাইভ ম্যাপে ইউনিট ট্র্যাকিং', 'টহল টিম ডিজিটাল মেসেজিং'],
    featuresEn: ['999 Call & SOS Intake', 'Nearest Unit GPS Algorithm', 'Live Map Unit Tracking', 'Patrol Mobile Terminal'],
  },
  auditor: {
    icon: <FileCheck2 className="w-6 h-6 text-amber-600" />,
    color: 'amber',
    bgLight: 'bg-amber-50/70',
    borderLight: 'border-amber-200',
    category: 'oversight',
    categoryLabelBn: 'স্বচ্ছতা ও পুলিশ সংস্কার',
    categoryLabelEn: 'Oversight & Reform',
    featuresBn: ['অপরিবর্তনীয় ক্রিপ্টো অডিট ট্রেইল', 'হ্যাশ-চেইন বিকৃতি শনাক্তকরণ', 'গোপনীয় অসদাচরণ অভিযোগ রিভিউ', 'জাতীয় ওপেন ডেটা এনালিটিক্স'],
    featuresEn: ['Immutable Crypto Audit Ledger', 'Hash Chain Tamper Detection', 'Whistleblower Case Review', 'National Open Data Analytics'],
  },
};

export const DemoRolesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentRole = useAuthStore((s) => s.currentRole);
  const setRole = useAuthStore((s) => s.setRole);
  const language = useAuthStore((s) => s.language);

  const [activeFilter, setActiveFilter] = useState<'all' | 'citizen' | 'police' | 'oversight'>('all');

  const handleSelectRole = (roleKey: Role) => {
    setRole(roleKey);
    const targetPath = ROLE_CONFIGS[roleKey].defaultPath;
    navigate(targetPath);
  };

  const filteredRoles = (Object.keys(ROLE_CONFIGS) as Role[]).filter((rKey) => {
    if (activeFilter === 'all') return true;
    return ROLE_META[rKey].category === activeFilter;
  });

  return (
    <div className="min-h-screen bg-surface-bg pb-20 font-bengali">
      {/* Top Banner / Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-elevated">
        <div className="max-w-6xl mx-auto space-y-4 relative z-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors bg-white/10 px-2.5 py-1 rounded-lg"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
              </Link>
              <span>/</span>
              <span className="text-amber-300 font-semibold">
                {language === 'bn' ? 'ডেমো ভূমিকা নির্বাচন' : 'Demo Role Switcher'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-brand-400" />
                <span>{language === 'bn' ? 'লগইন পোর্টাল' : 'Login Portal'}</span>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-3 py-1.5 rounded-xl font-medium transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'নাগরিক নিবন্ধন' : 'Citizen Registration'}</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'পাসওয়ার্ডবিহীন ডেমো হাব' : 'Passwordless Demo Sandbox'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {language === 'bn' ? 'ডেমো ভূমিকা পরিবর্তন করুন' : 'Switch Demo Role'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium mt-1">
              {language === 'bn'
                ? 'পাসওয়ার্ড ছাড়াই যেকোনো প্রোফাইলে পরিবর্তন করে দেখুন'
                : 'Explore any profile and test full capabilities without entering passwords'}
            </p>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {language === 'bn'
                ? 'ন্যায়সেতু (NyayaSetu) একটি বহুমুখী সমন্বিত প্ল্যাটফর্ম। সাধারণ নাগরিক থেকে শুরু করে তদন্ত কর্মকর্তা, ৯৯৯ ডিসপ্যাচার ও সংস্কার পর্যবেক্ষক—সবার দৃষ্টিকোণ থেকে সিস্টেমটি পরখ করতে নিচের যেকোনো প্রোফাইলে সরাসরি প্রবেশ করুন।'
                : 'Experience how NyayaSetu seamlessly connects ordinary citizens, field officers, Malkhana evidence custodians, 999 CAD dispatchers, and oversight auditors in a unified tamper-proof system.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Category Filters */}
        <div className="bg-white rounded-2xl p-2.5 shadow-card border border-slate-200 flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'সকল ভূমিকা (৭টি)' : 'All Roles (7)'}
          </button>
          <button
            onClick={() => setActiveFilter('citizen')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'citizen'
                ? 'bg-emerald-700 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'নাগরিক ও গ্রামীণ সেবা' : 'Citizen & Rural Kiosk'}
          </button>
          <button
            onClick={() => setActiveFilter('police')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'police'
                ? 'bg-blue-700 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'থানা ও তদন্ত' : 'Police & Investigation'}
          </button>
          <button
            onClick={() => setActiveFilter('oversight')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeFilter === 'oversight'
                ? 'bg-purple-700 text-white shadow-soft'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {language === 'bn' ? 'জরুরি সেবা ও তদারকি' : 'Emergency & Oversight'}
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((roleKey) => {
            const cfg = ROLE_CONFIGS[roleKey];
            const meta = ROLE_META[roleKey];
            const isSelected = currentRole === roleKey;

            return (
              <div
                key={roleKey}
                className={`bg-white rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-brand-500 shadow-elevated ring-2 ring-brand-500/20'
                    : 'border-slate-200 shadow-card hover:border-brand-300 hover:shadow-elevated'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute -top-3 right-6 bg-brand-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'বর্তমান সক্রিয়' : 'Currently Active'}</span>
                  </div>
                )}

                <div>
                  {/* Top Bar with Icon and Category */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${meta.bgLight} border ${meta.borderLight}`}>
                      {meta.icon}
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {language === 'bn' ? meta.categoryLabelBn : meta.categoryLabelEn}
                    </span>
                  </div>

                  {/* Title and Designation */}
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {language === 'bn' ? cfg.nameBn : cfg.nameEn}
                  </h2>

                  {/* Description Quoted By User */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-150">
                    {language === 'bn' ? cfg.descriptionBn : cfg.descriptionEn}
                  </p>

                  {/* Capability Tags */}
                  <div className="mt-4 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {language === 'bn' ? 'প্রধান বৈশিষ্ট্য ও মডিউল:' : 'Key Capabilities:'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(language === 'bn' ? meta.featuresBn : meta.featuresEn).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          • {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Switch Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectRole(roleKey)}
                    className={`w-full inline-flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all min-h-[44px] shadow-sm ${
                      isSelected
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-slate-900 hover:bg-brand-600 text-white'
                    }`}
                  >
                    <span>
                      {isSelected
                        ? language === 'bn'
                          ? 'এই ড্যাশবোর্ডে প্রবেশ করুন'
                          : 'Go to Active Dashboard'
                        : language === 'bn'
                        ? 'এই ভূমিকায় পরিবর্তন করুন'
                        : 'Switch to this Role'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternative Auth Callout Section */}
        <section className="mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-slate-100 text-slate-700">
            <Shield className="w-6 h-6 text-brand-600" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            {language === 'bn'
              ? 'বাস্তবসম্মত লগইন বা নতুন নাগরিক অ্যাকাউন্ট চান?'
              : 'Looking for the standard Login or Citizen Registration?'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আপনি যদি সাধারণ ব্যবহারকারীর অভিজ্ঞতা যাচাই করতে চান, তবে মোবাইল নম্বর/এনআইডি দিয়ে লগইন করতে পারেন অথবা নতুন নাগরিক হিসেবে সাইন-আপ করতে পারেন।'
              : 'If you want to experience the authentic flow with simulated NID verification and OTP confirmation, visit our dedicated login and registration portals.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-soft transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'bn' ? 'লগইন পৃষ্ঠায় যান' : 'Go to Login Portal'}</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'bn' ? 'নতুন নাগরিক নিবন্ধন' : 'Register Citizen Account'}</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
