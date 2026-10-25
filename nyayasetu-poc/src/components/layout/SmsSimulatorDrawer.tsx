import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDhakaDateTime } from '../../lib/time';
import {
  Smartphone,
  X,
  Send,
  MessageSquare,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const SmsSimulatorDrawer: React.FC = () => {
  const { t } = useTranslation();
  const isOpen = useAppStore((s) => s.isSmsDrawerOpen);
  const setOpen = useAppStore((s) => s.setSmsDrawerOpen);
  const smsList = useAppStore((s) => s.smsList);
  const sendSmsKeyword = useAppStore((s) => s.sendSmsKeyword);
  const cases = useAppStore((s) => s.cases);
  const useBanglaNumerals = useAuthStore((s) => s.useBanglaNumerals);
  const language = useAuthStore((s) => s.language);

  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendSmsKeyword(inputVal.trim());
    setInputVal('');
  };

  const sampleCase = cases[0];
  const sampleKeyword = sampleCase ? `STATUS ${sampleCase.id}` : 'STATUS NS-2026-DHK-000101';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Simulated mobile phone SMS drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-bengali">
                  {language === 'bn' ? 'এসএমএস সিমুলেটর (অফলাইন চ্যানেল)' : 'SMS Simulator (Offline Channel)'}
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'ফিচার ফোন ও প্রান্তিক নাগরিকদের রিয়েল-টাইম বার্তা' : 'Live push notifications for non-smartphone users'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Close SMS Simulator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Keyword Tips */}
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-4 py-2 text-xs text-emerald-950 flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-emerald-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {language === 'bn' ? 'কুইক টেস্ট:' : 'Quick Test:'}
            </span>
            <button
              type="button"
              onClick={() => sendSmsKeyword(sampleKeyword)}
              className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-[11px] font-mono hover:bg-emerald-100 transition-colors"
            >
              {sampleKeyword}
            </button>
            <button
              type="button"
              onClick={() => sendSmsKeyword('HELP')}
              className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-[11px] font-mono hover:bg-emerald-100 transition-colors"
            >
              HELP
            </button>
            <button
              type="button"
              onClick={() => sendSmsKeyword('SOS')}
              className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-[11px] font-mono hover:bg-emerald-100 transition-colors"
            >
              SOS
            </button>
          </div>

          {/* Messages list (phone screen style) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {smsList.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-6">
                <MessageSquare className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm">এখনো কোন এসএমএস নেই</p>
                <p className="text-xs text-slate-500">কোনো জিডি করলে বা স্ট্যাটাস আপডেট হলে স্বয়ংক্রিয় এসএমএস এখানে দেখা যাবে।</p>
              </div>
            ) : (
              smsList.map((sms) => {
                const isOutbound = sms.direction === 'out';
                return (
                  <div
                    key={sms.id}
                    className={`flex flex-col ${isOutbound ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                      {isOutbound ? (
                        <>
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                          <span>NyayaSetu (106) → {sms.to}</span>
                        </>
                      ) : (
                        <>
                          <span>{sms.to} (Citizen)</span>
                          <ArrowUpRight className="w-3 h-3 text-blue-600" />
                        </>
                      )}
                      <span>•</span>
                      <span>{formatDhakaDateTime(sms.at, useBanglaNumerals, 'hh:mm a')}</span>
                    </div>

                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-soft leading-relaxed ${
                        isOutbound
                          ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                          : 'bg-brand-600 text-white rounded-tr-sm font-medium'
                      }`}
                    >
                      <p className="whitespace-pre-line font-bengali">{sms.body}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Inbound SMS form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'কীওয়ার্ড লিখুন (যেমন: STATUS NS-2026-DHK-...)'
                  : 'Type keyword (e.g., STATUS NS-2026-DHK-...)'
              }
              className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-label="Send simulated SMS message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
