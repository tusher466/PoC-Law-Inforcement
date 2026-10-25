import React, { useState } from 'react';
import { Copy, Check, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CaseIdChipProps {
  caseId: string;
  showQrModal?: boolean;
}

export const CaseIdChip: React.FC<CaseIdChipProps> = ({ caseId, showQrModal = true }) => {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(caseId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <span className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-800 transition-colors">
        <span>{caseId}</span>

        <button
          onClick={handleCopy}
          className="p-0.5 text-slate-500 hover:text-slate-800 rounded focus-visible:ring-1 focus-visible:ring-brand-500"
          title="Copy Case ID"
          aria-label="Copy Case ID to clipboard"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        {showQrModal && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQrOpen(true);
            }}
            className="p-0.5 text-slate-500 hover:text-brand-600 rounded focus-visible:ring-1 focus-visible:ring-brand-500"
            title="View QR Code"
            aria-label="View QR code for this Case ID"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        )}
      </span>

      {/* QR Code Modal */}
      {qrOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              ডিজিটাল কেস কিউআর কোড
            </h3>
            <p className="text-xs text-slate-500 font-mono mb-4">{caseId}</p>

            <div className="bg-white p-3 rounded-xl border border-slate-200 inline-block shadow-inner mb-4">
              <QRCodeSVG
                value={`https://nyayasetu.gov.bd/track?case=${caseId}`}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <p className="text-[11px] text-slate-500 mb-4">
              পুলিশ কর্মকর্তা বা কিয়স্ক স্ক্যানারের মাধ্যমে দ্রুত ফাইল খুলতে এই কিউআর স্ক্যান করুন।
            </p>

            <button
              onClick={() => setQrOpen(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
