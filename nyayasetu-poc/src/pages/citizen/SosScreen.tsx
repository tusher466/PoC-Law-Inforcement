import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  AlertOctagon,
  Vibrate,
  Power,
  RotateCcw,
  CheckCircle2,
  Radio,
  MapPin,
  ShieldCheck,
  Smartphone,
  PhoneCall,
} from 'lucide-react';

export const SosScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const triggerSos = useAppStore((s) => s.triggerSos);
  const language = useAuthStore((s) => s.language);

  const [state, setState] = useState<'idle' | 'countdown' | 'dispatched'>('idle');
  const [countdown, setCountdown] = useState(5);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [createdIncidentId, setCreatedIncidentId] = useState<string | null>(null);

  // 5-second cancel countdown loop
  useEffect(() => {
    let timer: any = null;
    if (state === 'countdown') {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        // Trigger actual SOS dispatch
        handleExecuteSos();
      }
    }
    return () => clearTimeout(timer);
  }, [state, countdown]);

  const handleStartCountdown = () => {
    setCountdown(5);
    setState('countdown');
  };

  const handleCancel = () => {
    setState('idle');
    setCountdown(5);
  };

  const handleExecuteSos = async () => {
    try {
      const incidentId = await triggerSos(
        user.name,
        user.phone,
        23.7512,
        90.3738,
        'রোড নং ৮/এ, ধানমন্ডি আ/এ (আবাহনী মাঠ সংলগ্ন)'
      );
      setCreatedIncidentId(incidentId);
      setState('dispatched');
    } catch (err) {
      console.error('SOS trigger error', err);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Offline Mode Switcher */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-soft">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 font-bengali">
            অফলাইন এসএমএস মোড সিমুলেটর
          </span>
        </div>

        <button
          onClick={() => setIsOfflineMode(!isOfflineMode)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
            isOfflineMode
              ? 'bg-amber-500 text-slate-950 border-amber-600'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {isOfflineMode ? 'সক্রিয় (Offline SMS)' : 'নিষ্ক্রিয় (Online CAD)'}
        </button>
      </div>

      {/* Main SOS Trigger View */}
      {state === 'idle' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-6 shadow-card">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-alertRed font-bengali">
              {t('sos.title')}
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-bengali">
              {t('sos.instruction')}
            </p>
          </div>

          {/* Huge Red Push Button */}
          <div className="py-4">
            <button
              onClick={handleStartCountdown}
              className="w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-alertRed hover:bg-alertRed-dark text-white font-black text-2xl sm:text-3xl tracking-wider shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ring-8 ring-red-100 animate-pulse flex flex-col items-center justify-center mx-auto focus-visible:ring-4 focus-visible:ring-red-400"
              aria-label="Send emergency silent SOS"
            >
              <AlertOctagon className="w-12 h-12 mb-1" />
              <span>SOS</span>
              <span className="text-[10px] font-sans font-normal opacity-90">
                HOLD TO TRIGGER
              </span>
            </button>
          </div>

          {/* Hardware Simulations (Shake / Power 3x) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              হার্ডওয়্যার শর্টকাট সিমুলেশন:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleStartCountdown}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-2xl text-xs font-semibold transition-colors"
              >
                <Power className="w-4 h-4 text-red-500" />
                <span>পাওয়ার ৩ বার চাপুন</span>
              </button>

              <button
                onClick={handleStartCountdown}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-2xl text-xs font-semibold transition-colors"
              >
                <Vibrate className="w-4 h-4 text-emerald-600" />
                <span>ফোন ঝাঁকুনি (Shake)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Countdown State (5 seconds to cancel false alarm) */}
      {state === 'countdown' && (
        <div className="bg-alertRed text-white rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
          <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center mx-auto text-4xl font-black">
            {countdown}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-bengali">
              জরুরি অ্যালার্ট প্রেরণ হচ্ছে...
            </h3>
            <p className="text-xs text-red-100 font-bengali">
              {t('sos.cancellingIn', { seconds: countdown })}
            </p>
          </div>

          <button
            onClick={handleCancel}
            className="w-full bg-white text-alertRed font-extrabold py-3.5 px-6 rounded-2xl text-sm shadow-card hover:bg-red-50 transition-colors"
          >
            {t('sos.cancelBtn')}
          </button>
        </div>
      )}

      {/* Dispatched Confirmation State */}
      {state === 'dispatched' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 text-center space-y-5 shadow-card animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-bengali">
              {t('sos.alertDispatched')}
            </h3>
            <p className="text-xs text-slate-500 font-bengali leading-relaxed">
              ধানমন্ডি মডেল থানা ও ৯৯৯ ন্যাশনাল কন্ট্রোল রুমে আপনার জরুরি অবস্থান সরাসরি পৌঁছেছে।
            </p>
          </div>

          {/* Location & Unit Status Card */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-left text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>রোড নং ৮/এ, ধানমন্ডি আ/এ (আবাহনী মাঠ সংলগ্ন)</span>
            </div>
            <p className="text-slate-600 text-[11px]">
              নিকটতম ৩টি টহল টিমকে স্বয়ংক্রিয় জিপিএস রুট প্রেরণ করা হয়েছে।
            </p>
          </div>

          {/* Trusted contacts notified */}
          <div className="border border-slate-200 rounded-2xl p-3 text-left space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              জরুরি পরিচিতদের মোবাইলে এসএমএস পাঠানো হয়েছে:
            </span>
            {user.trustedContacts.map((c) => (
              <div
                key={c.phone}
                className="flex items-center justify-between text-xs text-slate-700 font-bengali"
              >
                <span>{c.name} ({c.relation})</span>
                <span className="font-mono text-[11px] text-slate-500">{c.phone}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/dispatch')}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-colors"
            >
              <Radio className="w-4 h-4 text-red-400" />
              <span>৯৯৯ ডিসপ্যাচ কন্ট্রোল রুমে লাইভ দেখুন</span>
            </button>

            <button
              onClick={() => setState('idle')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1"
            >
              মূল স্ক্রিনে ফিরুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
