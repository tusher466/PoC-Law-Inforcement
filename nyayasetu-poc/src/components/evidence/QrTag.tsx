import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Shield, Hash } from 'lucide-react';
import { Evidence } from '../../types';

interface QrTagProps {
  evidence: Evidence;
  onClose?: () => void;
}

export const QrTag: React.FC<QrTagProps> = ({ evidence, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-xl p-6 max-w-sm mx-auto">
      {/* Printable container */}
      <div className="printable-receipt border-2 border-dashed border-slate-400 p-4 rounded-xl bg-white text-slate-900">
        <div className="text-center border-b border-slate-300 pb-2 mb-3">
          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
            <Shield className="w-4 h-4 text-emerald-700" />
            <span>বাংলাদেশ পুলিশ – আলামত ট্যাগ</span>
          </div>
          <p className="text-[10px] text-slate-500">Malkhana Evidence Custody Label</p>
        </div>

        <div className="flex items-center justify-center my-3 bg-white p-2">
          <QRCodeSVG
            value={`https://nyayasetu.gov.bd/evidence/${evidence.id}?hash=${evidence.sha256}`}
            size={120}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Evidence ID:</span>
            <span className="font-bold">{evidence.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-1">
            <span className="text-slate-500">Case ID:</span>
            <span className="font-bold">{evidence.caseId}</span>
          </div>
          {evidence.seizureListNo && (
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Seizure No:</span>
              <span className="font-bold">{evidence.seizureListNo}</span>
            </div>
          )}
          <div className="border-b border-slate-100 pb-1">
            <span className="text-slate-500 text-[10px] block">Item:</span>
            <span className="font-sans font-semibold text-slate-800 text-xs">
              {evidence.itemDescription || evidence.fileName}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">SHA-256 Digest:</span>
            <span className="text-[10px] font-mono break-all text-emerald-800 font-bold block">
              {evidence.sha256.substring(0, 32)}...
            </span>
          </div>
        </div>

        <div className="mt-3 text-center border-t border-slate-300 pt-2 text-[10px] text-slate-500">
          সিকিউর ডিজিটাল চেইনে সংরক্ষিত | সিলগালা মালখানা
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="no-print mt-4 flex items-center justify-end gap-2">
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        )}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট ট্যাগ (Print Label)</span>
        </button>
      </div>
    </div>
  );
};
