import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { Role } from '../../types';
import { ROLE_CONFIGS } from '../../lib/rbac';
import {
  Shield,
  User,
  BadgeAlert,
  Smartphone,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserPlus,
  Layers,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAuthStore((s) => s.language);
  const login = useAuthStore((s) => s.login);
  const simulatedOtp = useAuthStore((s) => s.simulatedOtp);
  const addToast = useAppStore((s) => s.addToast);
  const addSms = useAppStore((s) => s.addSms);

  const [activeTab, setActiveTab] = useState<'citizen' | 'officer'>('citizen');

  // Citizen login state
  const [citizenId, setCitizenId] = useState('01712-345678');
  const [citizenOtp, setCitizenOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);

  // Officer login state
  const [badgeNumber, setBadgeNumber] = useState('BP-982140');
  const [officerRole, setOfficerRole] = useState<Role>('oc');
  const [officerThana, setOfficerThana] = useState('dhanmondi');
  const [officerPin, setOfficerPin] = useState('••••••');

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send simulated OTP
  const handleSendOtp = () => {
    setOtpSent(true);
    addSms({
      to: citizenId || '01712-345678',
      type: 'otp',
      text: `[NyayaSetu] আপনার লগইন ওটিপি কোড হলো: ${simulatedOtp}। কারো সাথে শেয়ার করবেন না।`,
      caseId: 'AUTH-OTP',
    });
    addToast(
      language === 'bn'
        ? `সিমুলেটেড ওটিপি এসএমএস পাঠানো হয়েছে (${simulatedOtp})`
        : `Simulated OTP SMS dispatched (${simulatedOtp})`,
      'info'
    );
  };

  // Auto-fill demo credentials
  const handleAutoFillCitizen = () => {
    setCitizenId('01712-345678');
    setCitizenOtp('123456');
    setOtpSent(true);
  };

  const handleAutoFillOfficer = (role: Role) => {
    setOfficerRole(role);
    if (role === 'oc') {
      setBadgeNumber('BP-982140');
    } else if (role === 'io') {
      setBadgeNumber('BP-874521');
    } else if (role === 'evidence') {
      setBadgeNumber('BP-665201');
    } else if (role === 'dispatcher') {
      setBadgeNumber('CAD-999-12');
    } else {
      setBadgeNumber('AUD-0091');
    }
    setOfficerPin('123456');
  };

  // Citizen Login Submission
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login('citizen', {
        name: 'রহিমা খাতুন',
        phone: citizenId,
        stationId: 'dhanmondi',
      });
      setIsSubmitting(false);
      addToast(
        language === 'bn'
          ? 'স্বাগতম রহিমা খাতুন! নাগরিক পোর্টালে সফলভাবে লগইন হয়েছে।'
          : 'Welcome Rahima Khatun! Successfully logged into Citizen Portal.',
        'success'
      );
      navigate('/citizen');
    }, 400);
  };

  // Officer Login Submission
  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const cfg = ROLE_CONFIGS[officerRole];
      login(officerRole, {
        badgeNumber,
        stationId: officerThana,
        name:
          officerRole === 'oc'
            ? 'ইন্সপেক্টর মো. রফিকুল ইসলাম (ওসি)'
            : officerRole === 'io'
            ? 'এসআই মাহমুদুল হাসান'
            : officerRole === 'evidence'
            ? 'এএসআই নাজমুল হক'
            : officerRole === 'dispatcher'
            ? 'ডিসপ্যাচার ফাহমিদা'
            : 'অডিটর ড. আসিফ জামান',
      });
      setIsSubmitting(false);
      addToast(
        language === 'bn'
          ? `${cfg.badgeBn} হিসেবে সফলভাবে লগইন হয়েছে।`
          : `Logged in successfully as ${cfg.badgeEn}.`,
        'success'
      );
      navigate(cfg.defaultPath);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-surface-bg py-10 px-4 sm:px-6 lg:px-8 font-bengali flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-500 mx-auto flex items-center justify-center shadow-card text-white">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'ন্যায়সেতু লগইন পোর্টাল' : 'NyayaSetu Access Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'আইনশৃঙ্খলা ও নাগরিক বিচার সেবার সমন্বিত প্ল্যাটফর্ম'
              : 'Unified Portal for Bangladesh Law Enforcement & Citizens'}
          </p>
        </div>

        {/* Prominent Demo Role Switcher Callout */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400/50 rounded-2xl p-4 shadow-sm text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{language === 'bn' ? 'ডেমো পরীক্ষা করছেন?' : 'Evaluating the PoC?'}</span>
          </div>
          <p className="text-xs text-slate-700 leading-snug">
            {language === 'bn'
              ? 'কোনো পাসওয়ার্ড বা ফর্ম পূরণ ছাড়াই যেকোনো ৭টি স্টেকহোল্ডার প্রোফাইলে প্রবেশ করতে আমাদের ডেডিকেটেড ডেমো হাবে যান।'
              : 'Explore all 7 role perspectives instantly with zero passwords in our dedicated demo hub.'}
          </p>
          <Link
            to="/demo-roles"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-soft transition-all hover:scale-105"
          >
            <span>{language === 'bn' ? 'ডেমো ভূমিকা পরিবর্তন করুন →' : 'Switch Demo Roles →'}</span>
          </Link>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
          {/* Tab Selector: Citizen vs Officer */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('citizen')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'citizen'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>{language === 'bn' ? 'নাগরিক লগইন' : 'Citizen Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('officer')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'officer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BadgeAlert className="w-4 h-4 text-blue-600" />
              <span>{language === 'bn' ? 'কর্মকর্তা লগইন' : 'Officer Login'}</span>
            </button>
          </div>

          {/* CITIZEN LOGIN FORM */}
          {activeTab === 'citizen' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'মোবাইল নম্বর / জাতীয় পরিচয়পত্র' : 'Mobile Number or NID'}
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder="01712-345678"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    {language === 'bn' ? 'ওটিপি কোড (৬ ডিজিট)' : 'OTP Code (6 digits)'}
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    {otpSent
                      ? language === 'bn'
                        ? 'পুনরায় ওটিপি পাঠান'
                        : 'Resend OTP'
                      : language === 'bn'
                      ? 'ওটিপি পাঠান'
                      : 'Send OTP'}
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={citizenOtp}
                    onChange={(e) => setCitizenOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono tracking-widest focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>💡 ডেমো ওটিপি কোড:</span>
                  <span className="font-mono font-bold text-slate-900">{simulatedOtp}</span>
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAutoFillCitizen}
                  className="text-xs text-brand-600 hover:text-brand-700 font-bold hover:underline"
                >
                  {language === 'bn' ? 'ডেমো তথ্য স্বয়ংক্রিয় পূরণ' : 'Auto-fill Demo Citizen'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-soft"
              >
                <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'নাগরিক পোর্টালে প্রবেশ করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* OFFICER LOGIN FORM */}
          {activeTab === 'officer' && (
            <form onSubmit={handleOfficerSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'বিপি ব্যাজ / আইডি নম্বর' : 'BP Badge / ID Number'}
                </label>
                <div className="relative">
                  <BadgeAlert className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    placeholder="BP-982140"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'পদবী ও ভূমিকা' : 'Designation & Role'}
                </label>
                <select
                  value={officerRole}
                  onChange={(e) => {
                    const r = e.target.value as Role;
                    setOfficerRole(r);
                    handleAutoFillOfficer(r);
                  }}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="oc">ভারপ্রাপ্ত কর্মকর্তা / ওসি (ধানমন্ডি মডেল থানা)</option>
                  <option value="io">তদন্ত কর্মকর্তা - আইও (এসআই মাহমুদুল হাসান)</option>
                  <option value="evidence">আলামত কর্মকর্তা / মালখানা ইনচার্জ</option>
                  <option value="dispatcher">৯৯৯ জাতীয় জরুরি সেবা ডিসপ্যাচার</option>
                  <option value="auditor">সংস্কার পর্যবেক্ষক / অভ্যন্তরীণ নিরীক্ষক</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'থানা / কমান্ড সেন্টার' : 'Station / Command Centre'}
                </label>
                <select
                  value={officerThana}
                  onChange={(e) => setOfficerThana(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="dhanmondi">ধানমন্ডি মডেল থানা, ঢাকা</option>
                  <option value="gulshan">গুলশান মডেল থানা, ঢাকা</option>
                  <option value="mirpur">মিরপুর মডেল থানা, ঢাকা</option>
                  <option value="motijheel">মতিঝিল থানা, ঢাকা</option>
                  <option value="hq">পুলিশ হেডকোয়ার্টার্স / এনএএইচকিউ</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'সিকিউরিটি পিন বা পাসওয়ার্ড' : 'Security PIN or Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={officerPin}
                    onChange={(e) => setOfficerPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-soft mt-2"
              >
                <span>{isSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'কর্মকর্তা পোর্টালে প্রবেশ করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Register Link */}
          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'আপনার কোনো অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
              <Link
                to="/register"
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                <span>{language === 'bn' ? 'নতুন নাগরিক নিবন্ধন করুন' : 'Register as Citizen'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom Auxiliary Links */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <Link to="/transparency" className="hover:text-slate-900 underline">
            {language === 'bn' ? 'ওপেন ডেটা পোর্টাল' : 'Open Data Portal'}
          </Link>
          <span>•</span>
          <Link to="/citizen/sos" className="hover:text-rose-600 font-bold underline">
            {language === 'bn' ? 'জরুরি ৯৯৯ এসওএস' : 'Emergency 999 SOS'}
          </Link>
          <span>•</span>
          <Link to="/" className="hover:text-slate-900 underline">
            {language === 'bn' ? 'মূল পাতা' : 'Home'}
          </Link>
        </div>
      </div>
    </div>
  );
};
