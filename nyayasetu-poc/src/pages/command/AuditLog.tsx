import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { verifyAuditChain, truncateHash } from '../../lib/hash';
import { formatDhakaDateTime } from '../../lib/time';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Download,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  FileSpreadsheet,
} from 'lucide-react';

export const AuditLog: React.FC = () => {
  const { t } = useTranslation();
  const auditLog = useAppStore((s) => s.auditLog);
  const simulateAuditTampering = useAppStore((s) => s.simulateAuditTampering);
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const language = useAuthStore((s) => s.language);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    valid?: boolean;
    brokenIndex?: number;
    reason?: string;
  }>({ tested: false });

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || entry.actorRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleVerifyChain = async () => {
    const res = await verifyAuditChain(auditLog);
    setVerificationResult({
      tested: true,
      valid: res.valid,
      brokenIndex: res.brokenIndex,
      reason: res.reason,
    });
  };

  const handleSimulateTamper = () => {
    // Tamper entry #1 to prove immediate detection
    simulateAuditTampering(1);
    setVerificationResult({ tested: false });
  };

  const handleExportCsv = () => {
    const headers = 'Index,Timestamp,Role,Action,Target,Detail,PrevHash,Hash,IsTampered\n';
    const rows = auditLog
      .map(
        (e) =>
          `"${e.index}","${e.at}","${e.actorRole}","${e.action}","${e.target}","${e.detail.replace(/"/g, '""')}","${e.prevHash}","${e.hash}","${e.isTampered ? 'YES' : 'NO'}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nyayasetu_audit_ledger_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-600 block flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            APPEND-ONLY CRYPTOGRAPHIC AUDIT LEDGER
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('dashboards.auditLogTitle')} ({auditLog.length})
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            সিস্টেমের প্রতিটি অ্যাকশন SHA-256 হ্যাশ-চেইনের মাধ্যমে অপরিবর্তনীয়ভাবে সিলগালা
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Verify Integrity Button */}
          <button
            onClick={handleVerifyChain}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-card transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('dashboards.verifyAuditBtn')}</span>
          </button>

          {/* Tamper Simulation Demo Button */}
          <button
            onClick={handleSimulateTamper}
            className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold px-3 py-2 rounded-2xl text-xs transition-colors"
            title="Demonstrate fraudulent record modification and detection"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>জালিয়াতি ডেমো (Simulate Tampering)</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-2xl text-xs shadow-soft transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('dashboards.exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Verification Feedback Banner */}
      {verificationResult.tested && (
        <div
          className={`p-4 rounded-3xl border shadow-card flex items-start gap-3 animate-in zoom-in-95 duration-150 ${
            verificationResult.valid
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-red-50 text-red-950 border-red-300'
          }`}
        >
          {verificationResult.valid ? (
            <>
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h2 className="text-sm font-bold font-bengali">
                  ক্রিপ্টোগ্রাফিক চেইন সম্পূর্ণ বৈধ ও সংরক্ষিত (Integrity Verified 100%)
                </h2>
                <p className="text-xs text-emerald-800 font-bengali leading-relaxed">
                  রুট জেনেসিস ব্লক হতে সর্বশেষ এন্ট্রি পর্যন্ত মোট {auditLog.length} টি ব্লকের হ্যাশ সফলভাবে মিলেছে। কোনো অননুমোদিত হস্তক্ষেপ বা রেকর্ড মুছে ফেলার প্রমাণ পাওয়া যায়নি।
                </p>
              </div>
            </>
          ) : (
            <>
              <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h2 className="text-sm font-bold text-red-900 font-bengali">
                  সতর্কতা: ক্রিপ্টোগ্রাফিক অসঙ্গতি ও তথ্য জালিয়াতি ধরা পড়েছে! (Tampering Detected)
                </h2>
                <p className="text-xs text-red-800 font-bengali leading-relaxed">
                  ব্লক নম্বর #{verificationResult.brokenIndex}-এর বিষয়বস্তুর সাথে হ্যাশ মান মিলছে না।
                  {verificationResult.reason}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setVerificationResult({ tested: false });
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-900 underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>অরিজিনাল চেইন রিস্টোর করুন (Reset)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অ্যাকশন, টার্গেট বা বিবরণ দিয়ে অনুসন্ধান..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 font-bengali"
        >
          <option value="all">সকল ভূমিকা (All Roles)</option>
          <option value="citizen">নাগরিক (Citizen)</option>
          <option value="oc">থানার ওসি (OC)</option>
          <option value="io">তদন্ত কর্মকর্তা (IO)</option>
          <option value="evidence">মালখানা ইনচার্জ (Evidence)</option>
          <option value="dispatcher">৯৯৯ ডিসপ্যাচ (CAD)</option>
          <option value="auditor">অডিটর (Auditor)</option>
        </select>
      </div>

      {/* Dense Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">সময় (Dhaka BST)</th>
                <th className="py-3 px-4">ভূমিকা</th>
                <th className="py-3 px-4">অ্যাকশন ও লক্ষ্য</th>
                <th className="py-3 px-4">বিস্তারিত অডিট লগ</th>
                <th className="py-3 px-4">পূর্ববর্তী হ্যাশ (PrevHash)</th>
                <th className="py-3 px-4">ব্লক হ্যাশ (Hash)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLog.map((entry) => (
                <tr
                  key={entry.index}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    entry.isTampered ? 'bg-red-50/70 border-l-4 border-red-600' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {entry.index}
                  </td>

                  <td className="py-3 px-4 text-slate-500 font-sans text-[11px] whitespace-nowrap">
                    {formatDhakaDateTime(entry.at, false, 'dd MMM, hh:mm:ss a')}
                  </td>

                  <td className="py-3 px-4 font-sans font-bold uppercase text-[10px] text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">
                      {entry.actorRole}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block font-mono">
                      {entry.action}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      Target: {entry.target}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-sans max-w-xs">
                    <span
                      className={`font-bengali text-xs ${
                        entry.isTampered ? 'text-red-700 font-bold font-mono' : 'text-slate-700'
                      }`}
                    >
                      {entry.detail}
                    </span>
                    {entry.isTampered && (
                      <span className="block text-[9px] text-red-600 font-bold uppercase mt-0.5">
                        [TAMPERED ARTIFACT]
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[10px] text-slate-400 font-mono truncate max-w-[100px]">
                    {truncateHash(entry.prevHash, 6, 4)}
                  </td>

                  <td className="py-3 px-4 text-[10px] text-emerald-800 font-mono font-bold truncate max-w-[100px]">
                    {truncateHash(entry.hash, 6, 4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
