import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Tip } from '../../types';
import { formatDhakaDateTime } from '../../lib/time';
import {
  Megaphone,
  Shield,
  EyeOff,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Plus,
  Send,
} from 'lucide-react';

export const MisconductReports: React.FC = () => {
  const { t } = useTranslation();
  const tips = useAppStore((s) => s.tips);
  const addTip = useAppStore((s) => s.addTip);
  const updateTipStatus = useAppStore((s) => s.updateTipStatus);
  const currentRole = useAuthStore((s) => s.currentRole);
  const language = useAuthStore((s) => s.language);

  // Tab: Public tip submission vs Auditor Review
  const isAuditor = currentRole === 'auditor';
  const [activeTab, setActiveTab] = useState<'submit' | 'track' | 'review'>(
    isAuditor ? 'review' : 'submit'
  );

  // Submit form state
  const [category, setCategory] = useState<Tip['category']>('police_misconduct');
  const [tipText, setTipText] = useState('');
  const [submittedTipId, setSubmittedTipId] = useState<string | null>(null);

  // Track tip state
  const [trackId, setTrackId] = useState('');
  const [trackedTip, setTrackedTip] = useState<Tip | null>(null);

  const handleSubmitTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipText.trim()) return;

    const newTipId = 'TIP-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    const newTip: Tip = {
      tipId: newTipId,
      category,
      text: tipText.trim(),
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    addTip(newTip);
    setSubmittedTipId(newTipId);
    setTipText('');
  };

  const handleTrackTip = () => {
    const found = tips.find(
      (t) => t.tipId.toLowerCase() === trackId.trim().toLowerCase()
    );
    setTrackedTip(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
            <EyeOff className="w-3.5 h-3.5" />
            CONFIDENTIAL REFORM & WHISTLEBLOWER HOTLINE
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-bengali mt-0.5">
            {t('dashboards.misconductTitle')}
          </h1>
          <p className="text-xs text-slate-300 max-w-lg mt-1 font-bengali">
            নাম-পরিচয় গোপন রেখে পুলিশ দুর্নীতি, অনিয়ম বা সংঘবদ্ধ অপরাধের বিরুদ্ধে গোপন অভিযোগ দাখিল
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'submit'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('dashboards.fileTip')}
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'track'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t('dashboards.trackTip')}
          </button>

          {isAuditor && (
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'review'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              তদারকি রিভিউ ({tips.length})
            </button>
          )}
        </div>
      </div>

      {/* Mode 1: Submit Anonymous Tip */}
      {activeTab === 'submit' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-card space-y-5">
          {submittedTipId ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 font-bengali">
                  আপনার তথ্য সম্পূর্ণ নিরাপদে ও বেনামে সংরক্ষিত হয়েছে!
                </h3>
                <p className="text-xs text-slate-500 font-bengali max-w-sm mx-auto mt-1">
                  আপনার আইপি এড্রেস বা পরিচয় কোনো সিস্টেমে রাখা হয়নি। অগ্রগতি জানতে নিচের ট্র্যাকিং আইডি সংরক্ষণ করুন।
                </p>
              </div>

              <div className="bg-slate-100 border border-slate-300 p-4 rounded-2xl max-w-xs mx-auto">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  গোপন টিপ ট্র্যাকিং আইডি:
                </span>
                <span className="font-mono text-lg font-black text-slate-900 select-all block mt-0.5">
                  {submittedTipId}
                </span>
              </div>

              <button
                onClick={() => setSubmittedTipId(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors"
              >
                আরেকটি তথ্য প্রদান করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTip} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-bengali leading-relaxed">
                  <strong>শতভাগ গোপনীয়তার নিশ্চয়তা:</strong> এই ফর্মের মাধ্যমে তথ্য প্রদানের ক্ষেত্রে কোনো লগইন, মোবাইল নম্বর বা পরিচয় বাধ্যতামূলক নয়।
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  তথ্য ও অভিযোগের ধরন:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali font-semibold"
                >
                  <option value="police_misconduct">পুলিশের দায়িত্বে অবহেলা বা অশোভন আচরণ</option>
                  <option value="corruption">ঘুষ দাবি বা আর্থিক অনিয়ম</option>
                  <option value="narcotics">মাদক বেচাকেনা বা চোরাচালান</option>
                  <option value="gambling">অবৈধ জুয়া বা গ্যাং তৎপরতা</option>
                  <option value="trafficking">মানব পাচার বা নারী নির্যাতন</option>
                  <option value="other">অন্যান্য গুরুতর অপরাধ তথ্য</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  ঘটনার সুনির্দিষ্ট বিবরণ ও সংশ্লিষ্ট ব্যক্তি/স্থান:
                </label>
                <textarea
                  rows={5}
                  value={tipText}
                  onChange={(e) => setTipText(e.target.value)}
                  placeholder="স্থান, সময়, সংশ্লিষ্ট কর্মকর্তা বা অপরাধীর বিবরণ বিস্তারিত লিখুন..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>বেনামে তথ্য দাখিল করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Mode 2: Track Tip with Tip ID */}
      {activeTab === 'track' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-bengali">
            {t('dashboards.trackTip')}
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="টিপ আইডি লিখুন (যেমন: TIP-2026-8812)..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-800"
            />
            <button
              onClick={handleTrackTip}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 rounded-xl text-xs transition-colors"
            >
              অনুসন্ধান
            </button>
          </div>

          {trackedTip ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {trackedTip.tipId}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    trackedTip.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : trackedTip.status === 'reviewing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {trackedTip.status === 'resolved'
                    ? 'তদন্ত সম্পন্ন ও নিষ্পত্তি'
                    : trackedTip.status === 'reviewing'
                    ? 'পর্যবেক্ষক সেল কর্তৃক তদন্তাধীন'
                    : 'প্রাপ্ত'}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-bengali leading-relaxed">
                {trackedTip.text}
              </p>

              {trackedTip.updateNotes && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
                  <strong className="text-brand-700 block font-bengali">তদন্ত পর্যবেক্ষণ মন্তব্য:</strong>
                  <p className="font-bengali text-slate-600">{trackedTip.updateNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              যেকোনো ৩টি প্রাক-সংরক্ষিত টিপ আইডি দিয়ে পরীক্ষা করুন: TIP-2026-8812, TIP-2026-9041, TIP-2026-7619
            </div>
          )}
        </div>
      )}

      {/* Mode 3: Auditor Review View */}
      {activeTab === 'review' && isAuditor && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-bengali border-b border-slate-100 pb-3">
            সংস্কার তদারকি রিভিউ কিউ (Auditor Whistleblower Queue)
          </h2>

          <div className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.tipId}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-slate-900">{tip.tipId}</span>
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase font-bold text-[10px]">
                    {tip.category}
                  </span>
                </div>

                <p className="text-slate-800 font-bengali leading-relaxed">{tip.text}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] text-slate-400">
                    তারিখ: {formatDhakaDateTime(tip.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        updateTipStatus(
                          tip.tipId,
                          'reviewing',
                          'অভ্যন্তরীণ তদারকি কর্মকর্তা নিয়োগ করা হয়েছে।'
                        )
                      }
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[10px] font-bold"
                    >
                      তদন্তাধীন চিহ্নিত করুন
                    </button>
                    <button
                      onClick={() =>
                        updateTipStatus(
                          tip.tipId,
                          'resolved',
                          'তদন্ত শেষে শাস্তিমূলক ব্যবস্থা গৃহীত হয়েছে।'
                        )
                      }
                      className="px-2 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold"
                    >
                      নিষ্পত্তি করুন
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
