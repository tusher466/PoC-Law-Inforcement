import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { caseService } from '../../lib/services';
import { ComplaintType, Case } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import {
  Store,
  Printer,
  Smartphone,
  KeyRound,
  CheckCircle2,
  FileText,
  Search,
  ArrowRight,
  Shield,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const DigitalCentreKiosk: React.FC = () => {
  const { t } = useTranslation();
  const cases = useAppStore((s) => s.cases);
  const stations = useAppStore((s) => s.stations);
  const simulatedOtp = useAuthStore((s) => s.simulatedOtp);
  const language = useAuthStore((s) => s.language);

  const [activeTab, setActiveTab] = useState<'new_gd' | 'track'>('new_gd');

  // New GD assisted workflow
  const [phone, setPhone] = useState('01912887766');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const [citizenName, setCitizenName] = useState('আব্দুল করিম');
  const [complaintType, setComplaintType] = useState<ComplaintType>('lost_item');
  const [title, setTitle] = useState('জাতীয় পরিচয়পত্র ও সার্টিফিকেট হারানো');
  const [description, setDescription] = useState(
    'ফার্মগেট থেকে শাহবাগ যাওয়ার পথে ব্যাগে থাকা মূল এসএসসি সার্টিফিকেট ও জাতীয় পরিচয়পত্রটি হারিয়ে গেছে।'
  );
  const [selectedStation, setSelectedStation] = useState('ramna');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredCase, setRegisteredCase] = useState<Case | null>(null);

  // Tracking workflow
  const [trackQuery, setTrackQuery] = useState('');
  const [trackedCase, setTrackedCase] = useState<Case | null>(null);

  const handleSendOtp = () => {
    setOtpSent(true);
    setEnteredOtp(simulatedOtp); // pre-populate for demo convenience
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === simulatedOtp || enteredOtp.length === 6) {
      setOtpVerified(true);
    }
  };

  const handleSubmitKioskGd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newCase = await caseService.fileComplaint({
        type: complaintType,
        title,
        description,
        channel: 'kiosk',
        citizenName,
        citizenPhone: phone,
        stationId: selectedStation,
        location: {
          lat: 23.738,
          lng: 90.404,
          address: 'রমনা ও ফার্মগেট সংযোগ সড়ক, ঢাকা',
        },
        evidenceIds: [],
      });
      setRegisteredCase(newCase);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = () => {
    const q = trackQuery.trim().toLowerCase();
    const found = cases.find(
      (c) =>
        c.id.toLowerCase() === q ||
        c.citizenPhone.replace(/[-\s]/g, '').includes(q)
    );
    setTrackedCase(found || null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Kiosk Header */}
      <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white rounded-3xl p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300 block">
            স্মার্ট বাংলাদেশ গ্রামীণ সেবা
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-bengali mt-0.5">
            {t('kiosk.title')}
          </h1>
          <p className="text-xs text-teal-100 max-w-lg mt-1 font-bengali">
            {t('kiosk.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new_gd')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'new_gd'
                ? 'bg-white text-teal-950 shadow-card'
                : 'bg-teal-700/60 text-white hover:bg-teal-700'
            }`}
          >
            নতুন জিডি নিবন্ধন
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-white text-teal-950 shadow-card'
                : 'bg-teal-700/60 text-white hover:bg-teal-700'
            }`}
          >
            কেস অনুসন্ধান
          </button>
        </div>
      </div>

      {/* Mode 1: Assisted GD Filing with Phone OTP & Printable Receipt */}
      {activeTab === 'new_gd' && !registeredCase && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-5">
          <h2 className="text-base font-bold text-slate-900 font-bengali border-b border-slate-100 pb-3">
            নাগরিকের পক্ষে সাধারণ ডায়েরি (GD) এন্ট্রি
          </h2>

          {/* Phase 1: Mobile & OTP Simulator */}
          {!otpVerified ? (
            <div className="space-y-4 max-w-md mx-auto py-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  {t('kiosk.enterMobile')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm font-mono text-slate-800"
                    placeholder="017XXXXXXXX"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="bg-brand-500 hover:bg-brand-600 text-white px-4 rounded-2xl text-xs font-bold transition-all shadow-sm"
                  >
                    {t('kiosk.sendOtp')}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-3 bg-teal-50 border border-teal-200 p-4 rounded-2xl animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs text-teal-900 font-bold">
                    <span>{t('kiosk.verifyOtp')}</span>
                    <span className="font-mono text-[11px] bg-teal-200/80 px-2 py-0.5 rounded">
                      ডেমো ওটিপি: {simulatedOtp}
                    </span>
                  </div>

                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full bg-white border border-teal-300 rounded-xl p-2.5 text-center font-mono text-lg font-bold tracking-widest text-teal-950"
                    placeholder="123456"
                    maxLength={6}
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    ওটিপি যাচাই করে আবেদন শুরু করুন
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Phase 2: Form Input by Kiosk Operator */
            <form onSubmit={handleSubmitKioskGd} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  নাগরিক ফোন যাচাইকৃত: {phone}
                </span>
                <button
                  type="button"
                  onClick={() => setOtpVerified(false)}
                  className="text-emerald-700 hover:underline text-[11px]"
                >
                  পরিবর্তন করুন
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                    নাগরিকের পুরো নাম:
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                    সংশ্লিষ্ট থানা:
                  </label>
                  <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  অভিযোগের বিষয়:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  বিস্তারিত বিবরণ:
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
                >
                  {isSubmitting ? 'দাখিল হচ্ছে...' : 'জিডি নিবন্ধন ও রসিদ তৈরি করুন'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Printable Physical Receipt View */}
      {registeredCase && (
        <div className="space-y-4">
          <div className="printable-receipt bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-card text-slate-900 max-w-lg mx-auto">
            {/* Government Seal & Header */}
            <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
              <h2 className="text-base font-black uppercase tracking-wider font-bengali">
                গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
              </h2>
              <h3 className="text-sm font-bold text-slate-700 font-bengali">
                বাংলাদেশ পুলিশ — ডিজিটাল জিডি রসিদ
              </h3>
              <p className="text-[10px] text-slate-500">
                Union Digital Centre Assisted Citizen Receipt
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] text-slate-500 block">অনন্য কেস আইডি:</span>
                <span className="font-mono text-base font-black text-slate-900">
                  {registeredCase.id}
                </span>
              </div>

              <div className="bg-white p-1.5 border border-slate-300 rounded-lg">
                <QRCodeSVG
                  value={`https://nyayasetu.gov.bd/track?case=${registeredCase.id}`}
                  size={80}
                  level="M"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-500">নাগরিকের নাম:</span>
                <span className="font-bold">{registeredCase.citizenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">মোবাইল:</span>
                <span className="font-mono font-bold">{registeredCase.citizenPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">দায়িত্বপ্রাপ্ত থানা:</span>
                <span className="font-bold">{registeredCase.stationId.toUpperCase()} মডেল থানা</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">তারিখ ও সময়:</span>
                <span>{registeredCase.createdAt.split('T')[0]}</span>
              </div>
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block text-[11px]">অভিযোগের সারসংক্ষেপ:</span>
                <p className="font-semibold text-slate-800 mt-0.5 leading-snug">
                  {registeredCase.title}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-dashed border-slate-400 text-center text-[10px] text-slate-500 space-y-1">
              <p>এই রসিদটি যেকোনো সরকারি অফিস বা আদালতে উপস্থাপনযোগ্য প্রমাণ হিসেবে গণ্য হবে।</p>
              <p className="font-mono">এসএমএস ট্র্যাকিং: STATUS {registeredCase.id} লিখে পাঠান ১০৬ এ।</p>
            </div>
          </div>

          <div className="no-print flex items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>{t('kiosk.printReceipt')}</span>
            </button>

            <button
              onClick={() => setRegisteredCase(null)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-2xl text-xs transition-colors"
            >
              আরেকটি নতুন জিডি করুন
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Track Existing Case by ID or Mobile */}
      {activeTab === 'track' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-bengali">
            {t('kiosk.trackByKiosk')}
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="কেস আইডি (যেমন: NS-2026-DHK-000101) বা মোবাইল নম্বর..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 font-mono"
            />
            <button
              onClick={handleTrack}
              className="bg-brand-500 hover:bg-brand-600 text-white px-5 rounded-2xl text-xs font-bold transition-all shadow-sm"
            >
              অনুসন্ধান
            </button>
          </div>

          {trackedCase && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 animate-in fade-in duration-150">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {trackedCase.id}
                </span>
                <span className="bg-brand-50 text-brand-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-brand-200">
                  {trackedCase.status.toUpperCase()}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 font-bengali">
                {trackedCase.title}
              </h4>
              <p className="text-xs text-slate-500">
                নাগরিক: {trackedCase.citizenName} ({trackedCase.citizenPhone})
              </p>
              <p className="text-xs text-slate-500">
                আইও: {trackedCase.ioName || 'অপেক্ষমান'} | থানা: {trackedCase.stationId}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
