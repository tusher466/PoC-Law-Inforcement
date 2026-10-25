import React, { useState } from 'react';
import { Evidence } from '../../types';
import { HashBadge } from './HashBadge';
import { CustodyChain } from './CustodyChain';
import { QrTag } from './QrTag';
import { formatDhakaDateTime } from '../../lib/time';
import {
  FileText,
  MapPin,
  Clock,
  Link2,
  QrCode,
  User,
  ShieldCheck,
} from 'lucide-react';

interface EvidenceCardProps {
  item: Evidence;
  allowTransfer?: boolean;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  allowTransfer = false,
}) => {
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft hover:shadow-card transition-all flex flex-col justify-between">
        <div>
          {/* Header thumbnail & title */}
          <div className="flex items-start gap-3 mb-3">
            {item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt={item.fileName}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <FileText className="w-8 h-8" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {item.itemDescription || item.fileName}
              </h5>
              <p className="text-[11px] text-slate-500 font-mono">
                {item.fileName} ({(item.sizeBytes / 1024).toFixed(0)} KB)
              </p>
              {item.seizureListNo && (
                <span className="inline-block mt-1 bg-slate-100 text-slate-700 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                  জব্দতালিকা: {item.seizureListNo}
                </span>
              )}
            </div>
          </div>

          {/* Cryptographic Hash Seal */}
          <div className="mb-3">
            <HashBadge sha256={item.sha256} isTampered={item.isTampered} />
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
            {item.gps && (
              <p className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.gps.address}</span>
              </p>
            )}
            <p className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formatDhakaDateTime(item.capturedAt)}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>জমা প্রদানকারী: {item.uploadedBy}</span>
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowCustodyModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Link2 className="w-3.5 h-3.5 text-brand-600" />
            <span>চেইন অব কাস্টডি ({item.custodyChain.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Generate Physical Malkhana QR Tag"
            aria-label="Generate QR Tag"
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custody Chain Modal */}
      {showCustodyModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  আলামত হস্তান্তর ও সংরক্ষণ রেজিস্টার
                </h3>
                <p className="text-xs text-slate-500 font-mono">ID: {item.id} | {item.fileName}</p>
              </div>
              <button
                onClick={() => setShowCustodyModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <CustodyChain
              evidenceId={item.id}
              chain={item.custodyChain}
              isTampered={item.isTampered}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowCustodyModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable QR Tag Modal */}
      {showQrModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <QrTag evidence={item} onClose={() => setShowQrModal(false)} />
        </div>
      )}
    </>
  );
};
