import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Hash } from 'lucide-react';
import { truncateHash } from '../../lib/hash';

interface HashBadgeProps {
  sha256: string;
  label?: string;
  isTampered?: boolean;
}

export const HashBadge: React.FC<HashBadgeProps> = ({
  sha256,
  label = 'SHA-256',
  isTampered = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isTampered) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-100 text-red-900 border border-red-300">
        <span className="text-red-700 font-bold">TAMPERED</span>
        <span>{truncateHash(sha256)}</span>
      </span>
    );
  }

  return (
    <div className="relative inline-block">
      <div className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-colors">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="text-[10px] text-emerald-700 uppercase tracking-wider">{label}:</span>
        <button
          type="button"
          onClick={() => setShowFull(!showFull)}
          className="hover:underline font-bold"
          title="Click to view full cryptographic hash"
        >
          {truncateHash(sha256)}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="p-0.5 text-emerald-700 hover:text-emerald-950 rounded"
          title="Copy full SHA-256 hash"
          aria-label="Copy hash"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-700" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      {showFull && (
        <div className="absolute left-0 mt-1 z-30 bg-slate-900 text-white text-[11px] font-mono p-3 rounded-xl shadow-xl border border-slate-700 max-w-sm break-all">
          <div className="flex items-center justify-between gap-2 mb-1 border-b border-slate-700 pb-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Hash className="w-3 h-3" /> SHA-256 Digest
            </span>
            <button
              onClick={() => setShowFull(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="select-all">{sha256}</p>
        </div>
      )}
    </div>
  );
};
