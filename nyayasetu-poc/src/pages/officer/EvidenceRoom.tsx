import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Evidence, CustodyBlock } from '../../types';
import { EvidenceCard } from '../../components/evidence/EvidenceCard';
import { HashBadge } from '../../components/evidence/HashBadge';
import { CustodyChain } from '../../components/evidence/CustodyChain';
import { QrTag } from '../../components/evidence/QrTag';
import { sha256 } from '../../lib/hash';
import {
  Archive,
  Plus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Printer,
  Link2,
} from 'lucide-react';

export const EvidenceRoom: React.FC = () => {
  const { t } = useTranslation();
  const evidenceList = useAppStore((s) => s.evidence);
  const cases = useAppStore((s) => s.cases);
  const addEvidence = useAppStore((s) => s.addEvidence);
  const transferEvidenceCustody = useAppStore((s) => s.transferEvidenceCustody);
  const currentRole = useAuthStore((s) => s.currentRole);

  const [searchQuery, setSearchQuery] = useState('');
  const [registerModal, setRegisterModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [selectedEvidenceForTransfer, setSelectedEvidenceForTransfer] = useState<Evidence | null>(null);

  // New Seized Property Registration Form
  const [newCaseId, setNewCaseId] = useState(cases[0]?.id || 'NS-2026-DHK-000101');
  const [seizureNo, setSeizureNo] = useState('SZ-2026-DHK-104');
  const [itemName, setItemName] = useState('জব্দকৃত হিরো হাঙ্ক মোটরসাইকেল চাবি ও নম্বর প্লেট');
  const [officerName, setOfficerName] = useState('এসআই মাহমুদুল হাসান');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transfer Custody Form
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('সিআইডি ফরেনসিক ব্যুরো, মালিবাগ');
  const [transferReason, setTransferReason] = useState('রাসায়নিক ও ডিজিটাল ডাটা পরীক্ষাগারে হস্তান্তর');

  const filteredEvidence = evidenceList.filter((e) => {
    return (
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.itemDescription && e.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleRegisterSeizedItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const mockContent = 'SEIZED_EVIDENCE_RECORD_' + Date.now();
      const hash = await sha256(mockContent);
      const newEvidId = 'evid-' + Date.now();

      const newEvidence: Evidence = {
        id: newEvidId,
        caseId: newCaseId,
        fileName: 'seized_vehicle_item.jpg',
        mime: 'image/jpeg',
        sizeBytes: 310240,
        sha256: hash,
        capturedAt: new Date().toISOString(),
        uploadedBy: officerName,
        seizureListNo: seizureNo,
        itemDescription: itemName,
        previewUrl: '/sample-evidence/recovered_phone.svg',
        gps: {
          lat: 23.7461,
          lng: 90.3742,
          address: 'ধানমন্ডি মডেল থানা মালখানা',
        },
        custodyChain: [
          {
            index: 0,
            from: officerName,
            to: 'ধানমন্ডি মডেল থানা মালখানা ইনচার্জ',
            reason: 'জব্দতালিকা নং ' + seizureNo + ' অনুযায়ী মালখানায় প্রাথমিক সংরক্ষণ',
            at: new Date().toISOString(),
            prevHash: 'GENESIS_CUSTODY_BLOCK',
            hash,
          },
        ],
      };

      await addEvidence(newEvidence);
      setRegisterModal(false);
      setItemName('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidenceForTransfer) return;

    await transferEvidenceCustody(
      selectedEvidenceForTransfer.id,
      transferFrom || 'মালখানা ইনচার্জ',
      transferTo,
      transferReason,
      currentRole
    );
    setTransferModal(false);
    setSelectedEvidenceForTransfer(null);
  };

  const openTransferDialog = (item: Evidence) => {
    setSelectedEvidenceForTransfer(item);
    const lastBlock = item.custodyChain[item.custodyChain.length - 1];
    setTransferFrom(lastBlock ? lastBlock.to : 'মালখানা ইনচার্জ');
    setTransferModal(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Title & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block flex items-center gap-1.5">
            <Archive className="w-3.5 h-3.5" />
            SECURE DIGITAL MALKHANA & EVIDENCE VAULT
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('officer.evidenceVault')} ({filteredEvidence.length})
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            জব্দকৃত বস্তু নিবন্ধন, সুরক্ষিত কিউআর ট্যাগিং ও ক্রিপ্টোগ্রাফিক ডিজিটাল চেইন অব কাস্টডি
          </p>
        </div>

        <button
          onClick={() => setRegisterModal(true)}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('officer.registerItem')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="আলামত আইডি, কেস নম্বর বা জব্দের বিবরণ দিয়ে খুঁজুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((item) => (
          <div key={item.id} className="relative group">
            <EvidenceCard item={item} allowTransfer />

            <div className="absolute top-3 right-3 flex items-center gap-1">
              <button
                onClick={() => openTransferDialog(item)}
                className="bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-purple-50 text-purple-700 font-bold p-1.5 rounded-lg text-xs shadow-xs transition-colors"
                title="হস্তান্তর করুন (Transfer Custody)"
              >
                <Link2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Register New Seized Item */}
      {registerModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-bengali">
              {t('officer.registerItem')}
            </h3>

            <form onSubmit={handleRegisterSeizedItem} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  সংশ্লিষ্ট মামলা নম্বর (Case ID):
                </label>
                <select
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.title.slice(0, 30)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  জব্দতালিকা নম্বর (Seizure List No):
                </label>
                <input
                  type="text"
                  value={seizureNo}
                  onChange={(e) => setSeizureNo(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  জব্দকৃত বস্তুর নাম ও বিবরণ:
                </label>
                <textarea
                  rows={2}
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  placeholder="যেমন: ১টি স্যামসাং মোবাইল, আইএমইআই নম্বর..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  জব্দকারী পুলিশ কর্মকর্তা:
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  {isSubmitting ? 'নিবন্ধন হচ্ছে...' : 'মালখানায় জমা ও কিউআর ট্যাগ তৈরি'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Transfer Custody Chain */}
      {transferModal && selectedEvidenceForTransfer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-bengali flex items-center gap-2">
              <Link2 className="w-4 h-4 text-purple-600" />
              <span>{t('officer.transferCustody')}</span>
            </h3>

            <p className="text-xs text-slate-500 font-mono">
              Item: {selectedEvidenceForTransfer.fileName} ({selectedEvidenceForTransfer.id})
            </p>

            <form onSubmit={handleExecuteTransfer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  বর্তমান হেফাজতকারী (From):
                </label>
                <input
                  type="text"
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  required
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  নতুন হেফাজতকারী বা ল্যাব (To):
                </label>
                <input
                  type="text"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  হস্তান্তরের আইনি কারণ ও উদ্দেশ্য:
                </label>
                <input
                  type="text"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTransferModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  চেইনে নতুন ব্লক সংযুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
