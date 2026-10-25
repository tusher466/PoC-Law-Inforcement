import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { CaseStage, Priority, ComplaintType } from '../../types';
import { StatusBadge } from '../../components/case/StatusBadge';
import { SlaCountdown } from '../../components/case/SlaCountdown';
import { CaseIdChip } from '../../components/case/CaseIdChip';
import { formatDhakaDateTime } from '../../lib/time';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowUpDown,
  UserCheck,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const CaseQueue: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cases = useAppStore((s) => s.cases);
  const stations = useAppStore((s) => s.stations);
  const assignIo = useAppStore((s) => s.assignIo);
  const user = useAuthStore((s) => s.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkIoModal, setBulkIoModal] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'sla'>('date');

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStation =
      stationFilter === 'all' || c.stationId === stationFilter;
    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'all' || c.priority === priorityFilter;

    return matchesSearch && matchesStation && matchesStatus && matchesPriority;
  });

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCases.map((c) => c.id));
    }
  };

  const handleBulkAssign = async () => {
    for (const cid of selectedIds) {
      await assignIo(
        cid,
        'io-001',
        'এসআই মাহমুদুল হাসান',
        '01711-234501',
        'oc',
        'মোহাম্মদ ইকরাম হোসেন (ওসি)'
      );
    }
    setBulkIoModal(false);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-150">
      {/* Title & Bulk action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('nav.queue')} ({filteredCases.length})
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            থানার সকল আগত ও চলমান মামলার কেন্দ্রীয় কার্যতালিকা
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-2xl animate-in fade-in duration-150">
            <span className="text-xs font-bold text-brand-900 font-bengali">
              {selectedIds.length} টি নির্বাচিত
            </span>
            <button
              onClick={() => setBulkIoModal(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-3 py-1 rounded-xl text-xs shadow-xs"
            >
              একত্রে আইও নিয়োগ করুন
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('officer.searchPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Station Filter */}
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 font-bengali"
          >
            <option value="all">সকল থানা</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameBn}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 font-bengali"
          >
            <option value="all">সকল পর্যায়</option>
            <option value="filed">দাখিলকৃত</option>
            <option value="received">থানায় গৃহীত</option>
            <option value="assigned">আইও নিযুক্ত</option>
            <option value="investigation">তদন্তাধীন</option>
            <option value="chargesheet">চার্জশিট দাখিল</option>
            <option value="court">আদালত</option>
            <option value="closed">নিষ্পত্তি</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 font-bengali"
          >
            <option value="all">সকল অগ্রাধিকার</option>
            <option value="urgent">অতি জরুরি (Urgent)</option>
            <option value="high">জরুরি (High)</option>
            <option value="medium">মাঝারি (Medium)</option>
            <option value="low">সাধারণ (Low)</option>
          </select>
        </div>
      </div>

      {/* Dense Table View for Desk Officers */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">
                  <button onClick={handleSelectAll} className="text-slate-500">
                    {selectedIds.length === filteredCases.length && filteredCases.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-brand-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">কেস আইডি</th>
                <th className="py-3 px-4">অভিযোগের শিরোনাম ও নাগরিক</th>
                <th className="py-3 px-4">থানা</th>
                <th className="py-3 px-4">পর্যায় (Status)</th>
                <th className="py-3 px-4">দায়িত্বপ্রাপ্ত আইও</th>
                <th className="py-3 px-4">এসএলএ অবশিষ্ট</th>
                <th className="py-3 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((item) => {
                const isChecked = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/officer/case/${item.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => toggleSelect(item.id, e)}>
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-brand-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{item.id}</span>
                        {item.urgent && (
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 line-clamp-1 font-bengali group-hover:text-brand-600">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bengali">
                        {item.citizenName} • {formatDhakaDateTime(item.createdAt, false, 'dd MMM')}
                      </span>
                    </td>

                    <td className="py-3 px-4 uppercase font-bold text-[11px] text-slate-600">
                      {item.stationId}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3 px-4 font-bengali">
                      {item.ioName ? (
                        <span className="text-slate-800 font-medium">{item.ioName}</span>
                      ) : (
                        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                          আইও অপেক্ষমান
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <SlaCountdown
                        createdAt={item.createdAt}
                        slaDueAt={item.slaDueAt}
                        compact
                      />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all inline" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk IO Assign Modal */}
      {bulkIoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-bengali">
              একত্রে তদন্ত কর্মকর্তা (IO) নিয়োগ
            </h3>

            <p className="text-xs text-slate-600 font-bengali leading-relaxed">
              নির্বাচিত {selectedIds.length} টি মামলার জন্য তদন্ত কর্মকর্তা হিসেবে এসআই মাহমুদুল হাসানকে নিযুক্ত করতে চান?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBulkIoModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleBulkAssign}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
              >
                নিয়োগ নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
