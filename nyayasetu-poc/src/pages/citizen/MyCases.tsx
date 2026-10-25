import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CaseCard } from '../../components/case/CaseCard';
import { CaseStage } from '../../types';
import { Search, Filter, FolderLock, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyCases: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cases = useAppStore((s) => s.cases);
  const language = useAuthStore((s) => s.language);

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<'all' | 'active' | 'closed'>('all');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === 'all'
        ? true
        : stageFilter === 'active'
        ? c.status !== 'closed'
        : c.status === 'closed';

    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 font-bengali">
            {t('nav.myCases')} ({filteredCases.length})
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            আপনার দাখিলকৃত সকল অভিযোগ ও রিয়েল-টাইম তদন্ত অগ্রগতি
          </p>
        </div>

        <button
          onClick={() => navigate('/citizen/file-gd')}
          className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-card transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('citizen.fileNewGd')}</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-soft flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কেস আইডি বা বিষয় দিয়ে খুঁজুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStageFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              stageFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সকল ({cases.length})
          </button>
          <button
            onClick={() => setStageFilter('active')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              stageFilter === 'active'
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            চলমান
          </button>
          <button
            onClick={() => setStageFilter('closed')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              stageFilter === 'closed'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            নিষ্পত্তি
          </button>
        </div>
      </div>

      {/* Case cards list */}
      {filteredCases.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-8 text-center text-slate-500">
          <FolderLock className="w-10 h-10 mx-auto text-slate-400 mb-2 opacity-50" />
          <p className="text-sm font-bold font-bengali">কোনো কেস খুঁজে পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400 mt-1">অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCases.map((item) => (
            <CaseCard key={item.id} item={item} mode="citizen" />
          ))}
        </div>
      )}
    </div>
  );
};
