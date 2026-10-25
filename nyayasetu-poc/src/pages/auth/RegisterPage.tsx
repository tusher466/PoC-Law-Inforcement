import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import {
  Shield,
  User,
  Smartphone,
  CreditCard,
  MapPin,
  Calendar,
  Users,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LogIn,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAuthStore((s) => s.language);
  const register = useAuthStore((s) => s.register);
  const simulatedOtp = useAuthStore((s) => s.simulatedOtp);
  const addToast = useAppStore((s) => s.addToast);
  const addSms = useAppStore((s) => s.addSms);

  const [fullName, setFullName] = useState('তানজিলা বেগম');
  const [nidNumber, setNidNumber] = useState('১৯৯২২৬৯২৬১২৩৪৫৯৯৯');
  const [phone, setPhone] = useState('01812-998877');
  const [stationId, setStationId] = useState('dhanmondi');
  const [emergencyName, setEmergencyName] = useState('মো. তারেক (ভাই)');
  const [emergencyPhone, setEmergencyPhone] = useState('01711-223344');
  const [otpCode, setOtpCode] = useState('123456');

  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendRegistrationOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    addSms({
      to: phone,
      type: 'otp',
      text: `[NyayaSetu] নতুন নাগরিক নিবন্ধনের ওটিপি কোড: ${simulatedOtp}। এটি ৫ মিনিট কার্যকর থাকবে।`,
      caseId: 'REG-OTP',
    });
    addToast(
      language === 'bn'
        ? `নিবন্ধন ওটিপি এসএমএস পাঠানো হয়েছে (${simulatedOtp})`
        : `Registration OTP SMS dispatched (${simulatedOtp})`,
      'info'
    );
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      register(
        {
          name: fullName,
          nidFake: nidNumber,
          phone: phone,
          stationId: stationId,
          trustedContacts: [
            { name: emergencyName, phone: emergencyPhone, relation: 'জরুরি অভিভাবক' },
          ],
        },
        'citizen'
      );

      addSms({
        to: phone,
        type: 'general',
        text: `[NyayaSetu] অভিনন্দন ${fullName}! আপনার নাগরিক অ্যাকাউন্ট সফলভাবে সক্রিয় হয়েছে।`,
        caseId: 'REG-WELCOME',
      });

      setIsSubmitting(false);
      addToast(
        language === 'bn'
          ? 'অভিনন্দন! আপনার নাগরিক অ্যাকাউন্ট সফলভাবে নিবন্ধিত হয়েছে।'
          : 'Congratulations! Your citizen account has been registered successfully.',
        'success'
      );
      navigate('/citizen');
    }, 450);
  };

  const handleAutoFillSample = () => {
    setFullName('তানজিলা বেগম');
    setNidNumber('১৯৯২২৬৯২৬১২৩৪৫৯৯৯');
    setPhone('01812-998877');
    setStationId('dhanmondi');
    setEmergencyName('মো. তারেক (ভাই)');
    setEmergencyPhone('01711-223344');
    setOtpCode('123456');
  };

  return (
    <div className="min-h-screen bg-surface-bg py-10 px-4 sm:px-6 lg:px-8 font-bengali flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 mx-auto flex items-center justify-center shadow-card text-white">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'নতুন নাগরিক নিবন্ধন' : 'Citizen Account Registration'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'bn'
              ? 'ডিজিটাল জিডি ও ন্যায়সেতু নাগরিক সেবা প্ল্যাটফর্মে যুক্ত হোন'
              : 'Join NyayaSetu for instant digital GDs, case tracking, and emergency SOS'}
          </p>
        </div>

        {/* Demo Switcher Callout */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400/50 rounded-2xl p-4 shadow-sm text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>{language === 'bn' ? 'ডেমো মূল্যায়ন করছেন?' : 'Testing Demo Roles?'}</span>
          </div>
          <p className="text-xs text-slate-700 leading-snug">
            {language === 'bn'
              ? 'নিবন্ধন না করেই পুলিশ কর্মকর্তা, ৯৯৯ ডিসপ্যাচার ও অন্যান্য ভূমিকার ফিচার দেখতে চান?'
              : 'Want to view police dashboards and test workflows without registration?'}
          </p>
          <Link
            to="/demo-roles"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-soft transition-all hover:scale-105"
          >
            <span>{language === 'bn' ? 'ডেমো ভূমিকা পরিবর্তন করুন →' : 'Switch Demo Roles →'}</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === 1 ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                ১
              </span>
              <span className="text-xs font-bold text-slate-800">
                {language === 'bn' ? 'নাগরিক তথ্য' : 'Citizen Info'}
              </span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-slate-200" />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}
              >
                ২
              </span>
              <span className="text-xs font-bold text-slate-800">
                {language === 'bn' ? 'ওটিপি যাচাই' : 'OTP Verification'}
              </span>
            </div>
          </div>

          {/* STEP 1: Citizen Details */}
          {step === 1 && (
            <form onSubmit={handleSendRegistrationOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'পূর্ণ নাম (জাতীয় পরিচয়পত্র অনুযায়ী)' : 'Full Legal Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="তানজিলা বেগম"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID) নম্বর' : 'NID Number'}
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={nidNumber}
                      onChange={(e) => setNidNumber(e.target.value)}
                      placeholder="১৯৯২২৬৯২৬১২৩৪৫৯৯৯"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01812-998877"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {language === 'bn' ? 'নিজ থানা / উপজেলা' : 'Home Station / Upazila'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="dhanmondi">ধানমন্ডি মডেল থানা, ঢাকা</option>
                    <option value="gulshan">গুলশান মডেল থানা, ঢাকা</option>
                    <option value="mirpur">মিরপুর মডেল থানা, ঢাকা</option>
                    <option value="uttara">উত্তরা পশ্চিম থানা, ঢাকা</option>
                    <option value="motijheel">মতিঝিল মডেল থানা, ঢাকা</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'bn' ? 'জরুরি অভিভাবকের নাম' : 'Emergency Contact Name'}
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={emergencyName}
                      onChange={(e) => setEmergencyName(e.target.value)}
                      placeholder="মো. তারেক (ভাই)"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    {language === 'bn' ? 'জরুরি যোগাযোগের ফোন' : 'Emergency Contact Phone'}
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      placeholder="01711-223344"
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAutoFillSample}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  {language === 'bn' ? 'নমুনা তথ্য পূরণ করুন' : 'Auto-fill Sample Info'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-soft"
              >
                <span>{language === 'bn' ? 'পরবর্তী ধাপ: ওটিপি কোড পাঠান' : 'Next: Send OTP Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                <p className="text-xs text-emerald-800 font-medium">
                  {language === 'bn'
                    ? `আপনার মোবাইল নম্বর ${phone} এ একটি ৬ ডিজিটের ওটিপি পাঠানো হয়েছে।`
                    : `A 6-digit verification code was sent to ${phone}.`}
                </p>
                <p className="text-[11px] text-emerald-700">
                  <span>💡 ডেমো ওটিপি কোড:</span>{' '}
                  <strong className="font-mono">{simulatedOtp}</strong>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block text-center">
                  {language === 'bn' ? '৬-ডিজিটের ওটিপি লিখুন' : 'Enter 6-digit OTP'}
                </label>
                <div className="relative max-w-xs mx-auto">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  {language === 'bn' ? 'পূর্ববর্তী' : 'Back'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-soft"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? language === 'bn'
                        ? 'নিবন্ধন সম্পন্ন হচ্ছে...'
                        : 'Registering...'
                      : language === 'bn'
                      ? 'নিবন্ধন সম্পন্ন ও প্রবেশ করুন'
                      : 'Complete & Enter Portal'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Already have an account */}
          <div className="pt-2 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
              <Link
                to="/login"
                className="font-bold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
