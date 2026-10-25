import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { searchService, SearchResultItem } from '../../lib/services';
import {
  Search,
  ShieldAlert,
  Database,
  Building,
  Car,
  Scale,
  Users,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const IntegratedSearch: React.FC = () => {
  const { t } = useTranslation();
  const currentRole = useAuthStore((s) => s.currentRole);
  const language = useAuthStore((s) => s.language);

  const [query, setQuery] = useState('');
  const [justificationModal, setJustificationModal] = useState(false);
  const [justificationText, setJustificationText] = useState(
    'কেস নং NS-2026-DHK-000101 ছিনতাই মামলার তদন্তের স্বার্থে সন্দেহভাজন ব্যক্তি ও ব্যবহৃত মোটরবাইকের মালিকানা যাচাই।'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[] | null>(null);

  const handleOpenJustification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setJustificationModal(true);
  };

  const handleExecuteSearch = async () => {
    setIsSearching(true);
    setJustificationModal(false);
    try {
      const data = await searchService.performIntegratedSearch(
        query,
        justificationText,
        currentRole
      );
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const getSourceIcon = (source: SearchResultItem['source']) => {
    switch (source) {
      case 'CDMS':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'CIMS':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'BRTA':
        return <Car className="w-5 h-5 text-emerald-600" />;
      case 'COURT':
        return <Scale className="w-5 h-5 text-indigo-600" />;
      default:
        return <Database className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 block flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          FEDERATED POLICE & LEGAL INTELLIGENCE QUERY
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
          {t('officer.integratedSearchTitle')}
        </h1>
        <p className="text-xs text-slate-500 font-bengali">
          জাতীয় ডাটাবেজ (CDMS, CIMS, BRTA, আদালত) হতে সরাসরি তথ্য অনুসন্ধান (অডিট লগ সংরক্ষিত)
        </p>
      </div>

      {/* Main Search Input */}
      <form
        onSubmit={handleOpenJustification}
        className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-3"
      >
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('officer.searchPrompt')}
            className="w-full bg-slate-50 border border-slate-300 focus:border-brand-500 rounded-2xl py-3 pl-12 pr-4 text-xs sm:text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              ডেমো নমুনা:
            </span>
            <button
              type="button"
              onClick={() => setQuery('01799881234')}
              className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700"
            >
              01799881234 (Phone)
            </button>
            <button
              type="button"
              onClick={() => setQuery('ঢাকা মেট্রো-হ-১২-৩৪৫৬')}
              className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700"
            >
              ঢাকা মেট্রো-হ-১২-৩৪৫৬ (Plate)
            </button>
            <button
              type="button"
              onClick={() => setQuery('মো. রফিকুল ইসলাম')}
              className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700"
            >
              মো. রফিকুল ইসলাম (Name)
            </button>
          </div>

          <button
            type="submit"
            disabled={!query.trim()}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-card transition-all"
          >
            অনুসন্ধান চালান
          </button>
        </div>
      </form>

      {/* Mandatory Justification Modal */}
      {justificationModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900 font-bengali">
                {t('officer.justificationRequired')}
              </h3>
            </div>

            <p className="text-xs text-slate-600 font-bengali leading-relaxed">
              নাগরিকদের ব্যক্তিগত তথ্যের সুরক্ষার খাতিরে ডাটাবেজ অনুসন্ধানের পূর্বে সংশ্লিষ্ট মামলার রেফারেন্স ও সুনির্দিষ্ট কারণ উল্লেখ বাধ্যতামূলক।
              <strong> এই অনুসন্ধানটি অপরিবর্তনীয় অডিট লগে কর্মকর্তার আইডি সহ লিপিবদ্ধ থাকবে।</strong>
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1 font-bengali">
                অনুসন্ধানের আইনগত কারণ (Justification):
              </label>
              <textarea
                rows={3}
                value={justificationText}
                onChange={(e) => setJustificationText(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJustificationModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleExecuteSearch}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
              >
                {t('officer.executeSearch')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results View Grouped by Source */}
      {isSearching && (
        <div className="text-center py-8 text-xs text-slate-500 space-y-2">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p>জাতীয় সিডিএমএস, সিআইএমএস ও বিআরটিএ ডাটাবেজ অনুসন্ধান চলছে...</p>
        </div>
      )}

      {results && !isSearching && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="font-bold">
              অনুসন্ধান ফলাফল: {results.length} টি উৎস হতে তথ্য প্রাপ্ত
            </span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              যৌক্তিকতা অডিট লগে সিলগালা হয়েছে
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3"
              >
                {/* Header with Source & Phase 3 Badge */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100">
                      {getSourceIcon(res.source)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-bengali">{res.subtitle}</p>
                    </div>
                  </div>

                  <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0">
                    {res.adapterStatus}
                  </span>
                </div>

                {/* Details Table */}
                <div className="space-y-1.5 text-xs">
                  {Object.entries(res.details).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500 font-bengali">{key}:</span>
                      <span className="font-bold text-slate-800 font-bengali text-right max-w-[60%]">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
