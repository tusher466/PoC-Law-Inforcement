import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { ROLE_CONFIGS } from '../../lib/rbac';
import { Role } from '../../types';
import {
  Shield,
  Sparkles,
  ArrowRight,
  Fingerprint,
  Radio,
  FileCheck2,
  Lock,
  Layers,
  ChevronRight,
  Database,
  Smartphone,
  CheckCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);
  const setTourStep = useAppStore((s) => s.setTourStep);
  const language = useAuthStore((s) => s.language);

  const handleSelectRole = (r: Role) => {
    setRole(r);
    const target = ROLE_CONFIGS[r].defaultPath;
    navigate(target);
  };

  const handleStartTour = () => {
    setRole('citizen');
    setTourStep(0);
    navigate('/citizen/file-gd');
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-brand-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 shadow-elevated">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>বাংলাদেশ পুলিশ ও বিচার ব্যবস্থার ডিজিটাল সেতু</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-bengali tracking-tight leading-tight max-w-4xl mx-auto">
            {t('app.name')} : {t('app.tagline')}
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed font-bengali">
            সাধারণ নাগরিকের অভিযোগ, সাইবার অপরাধ, আলামত সংরক্ষণ ও জরুরি ৯৯৯ এসওএস—সবকিছু একটি অপরিবর্তনীয় ক্রিপ্টোগ্রাফিক কেস আইডির মাধ্যমে স্বচ্ছ ও জবাবদিহিতামূলক।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleStartTour}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-sm sm:text-base shadow-elevated transition-transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{t('app.tourBtn')} (৮ ধাপের লাইভ ট্যুর)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/demo-roles"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-3.5 rounded-2xl text-sm sm:text-base shadow-elevated transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ডেমো ভূমিকা নির্বাচন (৭টি প্রোফাইল)</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-3.5 rounded-2xl text-sm sm:text-base backdrop-blur-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন / নিবন্ধন পোর্টাল</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5-Layer Interactive Architecture Diagram */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-brand-600" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-bengali">
              প্ল্যাটফর্ম আর্কিটেকচার (৫-স্তর সমন্বিত মডেল)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Layer 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest block">
                স্তর ১: বহুমুখী ইনটেক
              </span>
              <h3 className="text-xs font-bold text-slate-900">Citizen Multi-Channel</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                বাংলা ভয়েস জিডি, মোবাইল অ্যাপ, গ্রামীণ কিয়স্ক, ফিচার ফোন এসএমএস ও জরুরি ৯৯৯।
              </p>
            </div>

            {/* Layer 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest block">
                স্তর ২: আইডি ও সিকিউরিটি
              </span>
              <h3 className="text-xs font-bold text-slate-900">Identity & Gateway</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                সিমুলেটেড এনআইডি যাচাই, ওটিপি সুরক্ষা এবং সার্বক্ষণিক অডিট লগ ট্র্যাকিং।
              </p>
            </div>

            {/* Layer 3 */}
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-2 shadow-soft">
              <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest block">
                স্তর ৩: কেস ও আলামত কোর
              </span>
              <h3 className="text-xs font-bold text-brand-900">Case Core & Vault</h3>
              <p className="text-[11px] text-brand-800 leading-normal font-medium">
                অনন্য কেস আইডি (NS-YYYY-DHK), লাইভ এসএলএ ট্র্যাকার এবং SHA-256 ডিজিটাল আলামত চেইন।
              </p>
            </div>

            {/* Layer 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">
                স্তর ৪: ডিসপ্যাচ ও অপারেশন
              </span>
              <h3 className="text-xs font-bold text-slate-900">CAD & IO Assistant</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                জিপিএস ভিত্তিক স্মার্ট টহল ডিসপ্যাচ ও তদন্ত কর্মকর্তার জন্য স্বয়ংক্রিয় কেস ডায়েরি।
              </p>
            </div>

            {/* Layer 5 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">
                স্তর ৫: বিচার ও স্বচ্ছতা
              </span>
              <h3 className="text-xs font-bold text-slate-900">Justice & Oversight</h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                আদালত ট্র্যাকিং, অপরিবর্তনীয় অডিট ট্রেইল, ওপেন ডেটা পোর্টাল এবং হুইসেলব্লোয়ার প্ল্যাটফর্ম।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Roles Section */}
      <section className="max-w-5xl mx-auto px-4 mt-14 space-y-6">
        <div className="bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? 'স্টেকহোল্ডার ডেমো হাব' : 'Stakeholder Demo Hub'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-bengali">
              {language === 'bn' ? 'ডেমো ভূমিকা পরিবর্তন করুন' : 'Switch Demo Role'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {language === 'bn'
                ? 'পাসওয়ার্ড ছাড়াই যেকোনো প্রোফাইলে পরিবর্তন করে দেখুন'
                : 'Explore any profile and test full capabilities without passwords'}
            </p>
          </div>

          <Link
            to="/demo-roles"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-elevated transition-transform hover:scale-105 shrink-0"
          >
            <span>{language === 'bn' ? 'সকল ৭টি ডেমো ভূমিকা এক্সপ্লোর করুন' : 'Explore All 7 Demo Roles'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(ROLE_CONFIGS) as Role[]).map((rKey) => {
            const cfg = ROLE_CONFIGS[rKey];
            return (
              <div
                key={rKey}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card hover:shadow-elevated hover:border-brand-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded-md">
                      {cfg.badgeBn}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-bengali group-hover:text-brand-600 transition-colors">
                    {language === 'bn' ? cfg.nameBn : cfg.nameEn}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-bengali bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {language === 'bn' ? cfg.descriptionBn : cfg.descriptionEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectRole(rKey)}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-brand-600 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <span>প্রবেশ করুন ({cfg.badgeBn})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Dedicated Login / Register banner at bottom of Landing Page */}
        <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900">
              {language === 'bn'
                ? 'নাগরিক বা কর্মকর্তা হিসেবে সাধারণ লগইন পোর্টাল ব্যবহার করবেন?'
                : 'Prefer using the standard Citizen or Officer Login Portal?'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'মোবাইল ওটিপি যাচাই বা বিপি ব্যাজ নম্বর দিয়ে প্রবেশ করুন।'
                : 'Sign in using mobile OTP verification or official BP Badge Number.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-soft"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন করুন</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs shadow-soft"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>নিবন্ধন করুন</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
