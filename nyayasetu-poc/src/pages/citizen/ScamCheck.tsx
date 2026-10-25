import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SEED_SCAM_DATABASE } from '../../store/seed';
import { ScamReport } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Flag,
  Sparkles,
} from 'lucide-react';

export const ScamCheck: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ScamReport | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [reportedFeedback, setReportedFeedback] = useState(false);
  const appendAuditEntry = useAppStore((s) => s.appendAuditEntry);

  const handleSearch = (searchTerm: string) => {
    const clean = searchTerm.trim().replace(/[-\s]/g, '');
    setHasSearched(true);
    setReportedFeedback(false);

    // Look up in seeded crowd scam database
    const found = SEED_SCAM_DATABASE.find(
      (item) => item.query.includes(clean) || clean.includes(item.query)
    );

    if (found) {
      setResult(found);
    } else {
      // Return a simulated Safe verdict for unknown numbers
      setResult({
        id: 'scam-unknown-' + Date.now(),
        query: searchTerm,
        type: clean.startsWith('http') ? 'link' : 'phone',
        riskScore: 'safe',
        reportCount: 0,
        reasons: ['এই নম্বর বা লিংকের বিরুদ্ধে পূর্ববর্তী কোনো প্রতারণার অভিযোগ নেই।'],
        lastReportedAt: new Date().toISOString(),
      });
    }
  };

  const handleReport = async () => {
    if (!result) return;
    setReportedFeedback(true);
    await appendAuditEntry(
      'citizen',
      'SCAM_REPORT_CROWD',
      result.query,
      `Citizen reported potential cyber scam entity: ${result.query}`
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-5 pb-12 animate-in fade-in duration-150">
      <div>
        <h1 className="text-xl font-black text-slate-900 font-bengali">
          {t('citizen.scamCheck')}
        </h1>
        <p className="text-xs text-slate-500 font-bengali">
          সন্দেহভাজন মোবাইল নম্বর, বিকাশ/নগদ এজেন্ট বা ফিশিং লিংক যাচাই করুন
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="নম্বর বা লিংক লিখুন (যেমন: 01799881234)..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-brand-500 rounded-2xl py-3 pl-4 pr-12 text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <button
            type="button"
            onClick={() => handleSearch(query)}
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white p-2 rounded-xl transition-colors"
            aria-label="Search scam database"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Quick test buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
          <span className="font-bold flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-500" />
            ডেমো টেস্ট:
          </span>
          <button
            type="button"
            onClick={() => {
              setQuery('01799881234');
              handleSearch('01799881234');
            }}
            className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 px-2 py-0.5 rounded-lg text-[11px] font-mono"
          >
            01799881234 (Scam)
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('01712345678');
              handleSearch('01712345678');
            }}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px] font-mono"
          >
            01712345678 (Safe)
          </button>
        </div>
      </div>

      {/* Result Card */}
      {hasSearched && result && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4 animate-in zoom-in-95 duration-150">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl text-center space-y-1 ${
              result.riskScore === 'reported_scam'
                ? 'bg-red-50 text-red-900 border border-red-200'
                : result.riskScore === 'suspicious'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-1">
              {result.riskScore === 'reported_scam' ? (
                <XCircle className="w-10 h-10 text-red-600" />
              ) : result.riskScore === 'suspicious' ? (
                <AlertTriangle className="w-10 h-10 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              )}
            </div>

            <h3 className="text-base font-bold font-bengali">
              {result.riskScore === 'reported_scam'
                ? 'সতর্কতা: চিহ্নিত প্রতারক নম্বর (Scam Alert)'
                : result.riskScore === 'suspicious'
                ? 'সন্দেহভাজন কার্যকলাপ (Suspicious)'
                : 'নিরাপদ (কোনো অভিযোগ পাওয়া যায়নি)'}
            </h3>

            <p className="text-xs font-mono">
              {result.query} ({result.reportCount} টি নাগরিক অভিযোগ)
            </p>
          </div>

          {/* Details / Reasons */}
          <div className="space-y-1.5 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block font-bengali">
              সিস্টেম ও ক্রাউড রিপোর্ট সারাংশ:
            </span>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 font-bengali">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Report This button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              আপনি কি এই নম্বরে প্রতারণার শিকার হয়েছেন?
            </span>

            <button
              onClick={handleReport}
              disabled={reportedFeedback}
              className="inline-flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-red-600" />
              <span>{reportedFeedback ? 'অভিযোগ জমা হয়েছে' : 'রিপোর্ট করুন'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
