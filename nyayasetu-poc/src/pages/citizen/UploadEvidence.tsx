import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { EvidenceUploader, PendingEvidenceFile } from '../../components/evidence/EvidenceUploader';
import { ArrowLeft, Check, ShieldCheck } from 'lucide-react';

export const UploadEvidence: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cases = useAppStore((s) => s.cases);
  const user = useAuthStore((s) => s.user);

  const preselectedCaseId = searchParams.get('caseId') || (cases[0] ? cases[0].id : '');
  const [selectedCaseId, setSelectedCaseId] = useState(preselectedCaseId);
  const [files, setFiles] = useState<PendingEvidenceFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || files.length === 0) return;

    setIsSubmitting(true);
    try {
      for (const f of files) {
        await useAppStore.getState().addEvidence({
          id: f.id,
          caseId: selectedCaseId,
          fileName: f.name,
          mime: f.mime,
          sizeBytes: f.sizeBytes,
          sha256: f.sha256,
          capturedAt: f.capturedAt,
          gps: f.gps,
          uploadedBy: user.name,
          previewUrl: f.previewUrl,
          itemDescription: `পরবর্তী পর্যায়ে নাগরিক কর্তৃক অতিরিক্ত আলামত জমা (${f.name})`,
          custodyChain: [
            {
              index: 0,
              from: `${user.name} (নাগরিক)`,
              to: 'সেন্ট্রাল ডিজিটাল ভল্ট',
              reason: 'পরবর্তী তদন্তের জন্য নাগরিক পোর্টাল থেকে নতুন ডিজিটাল প্রমাণ সংযোজন',
              at: new Date().toISOString(),
              prevHash: 'GENESIS_CUSTODY_BLOCK',
              hash: f.sha256,
            },
          ],
        });
      }
      setSuccess(true);
      setTimeout(() => {
        navigate(`/citizen/case/${selectedCaseId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-12 animate-in fade-in duration-150">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-bengali">
            {t('citizen.uploadEvidence')}
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            বিদ্যমান মামলার সাথে নতুন ছবি, ভিডিও বা নথি যোগ করুন
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        {/* Case selector */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
            সংশ্লিষ্ট কেস নির্বাচন করুন:
          </label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm text-slate-800 font-bengali font-semibold"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Uploader with instant SHA-256 */}
        <EvidenceUploader onFilesChanged={(f) => setFiles(f)} />

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs text-center font-bold font-bengali flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>আলামত সফলভাবে ভল্টে সংরক্ষিত হয়েছে! কেস ফাইলে নেওয়া হচ্ছে...</span>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={files.length === 0 || isSubmitting}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'আপলোড হচ্ছে...' : 'ভল্টে সংরক্ষণ করুন'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
