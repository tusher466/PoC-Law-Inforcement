import React, { useState } from 'react';
import { CustodyBlock } from '../../types';
import { verifyCustodyChain, truncateHash } from '../../lib/hash';
import { useAppStore } from '../../store/useAppStore';
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Clock,
  User,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface CustodyChainProps {
  evidenceId: string;
  chain: CustodyBlock[];
  isTampered?: boolean;
}

export const CustodyChain: React.FC<CustodyChainProps> = ({
  evidenceId,
  chain,
  isTampered = false,
}) => {
  const [verifyStatus, setVerifyStatus] = useState<{
    tested: boolean;
    valid?: boolean;
    reason?: string;
  }>({ tested: false });

  const simulateCustodyTampering = useAppStore(
    (s) => s.simulateCustodyTampering
  );

  const handleVerify = async () => {
    const res = await verifyCustodyChain(chain);
    setVerifyStatus({
      tested: true,
      valid: res.valid && !isTampered,
      reason: isTampered
        ? 'ব্লক ১ এ অননুমোদিত বিবরণ পরিবর্তন শনাক্ত হয়েছে: ক্রিপ্টোগ্রাফিক হ্যাশ মেলেনি!'
        : res.reason,
    });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-600" />
            <span>ক্রিপ্টোগ্রাফিক চেইন অব কাস্টডি (SHA-256)</span>
          </h4>
          <p className="text-xs text-slate-500">
            প্রতিটি হস্তান্তর পূর্ববর্তী ব্লকের হ্যাশের সাথে অপরিবর্তনীয়ভাবে সংযুক্ত
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerify}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>চেইন যাচাই (Verify Chain)</span>
          </button>

          <button
            onClick={() => simulateCustodyTampering(evidenceId, 0)}
            className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
            title="Demonstrate fraud detection when an entry is maliciously modified"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>জালিয়াতি ডেমো (Tamper Demo)</span>
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verifyStatus.tested && (
        <div
          className={`p-3 rounded-xl border mb-4 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150 ${
            verifyStatus.valid
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          {verifyStatus.valid ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                ✅ চেইন সম্পূর্ণ বৈধ ও অক্ষত! প্রতিটি ব্লকের পূর্ববর্তী হ্যাশ ও সিগনেচার মিলেছে।
              </span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                ❌ সতর্কতা: ক্রিপ্টোগ্রাফিক অমিল! {verifyStatus.reason || 'আলামতের রেকর্ডে হস্তক্ষেপ ধরা পড়েছে।'}
              </span>
            </>
          )}
        </div>
      )}

      {/* Vertical chain display */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
        {chain.map((block, idx) => (
          <div key={block.index} className="relative group">
            {/* Index pin */}
            <div
              className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isTampered && idx === 0
                  ? 'bg-red-600 text-white ring-4 ring-red-100'
                  : 'bg-slate-800 text-white ring-2 ring-slate-100'
              }`}
            >
              #{block.index}
            </div>

            <div
              className={`p-3 rounded-xl border text-xs ${
                isTampered && idx === 0
                  ? 'bg-red-50/80 border-red-300 ring-1 ring-red-200'
                  : 'bg-white border-slate-200 shadow-soft'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span className="text-slate-600">{block.from}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-emerald-700">{block.to}</span>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  {block.at.split('T')[0]} {block.at.split('T')[1]?.slice(0, 5)}
                </span>
              </div>

              <p className="text-slate-600 text-xs mb-2">{block.reason}</p>

              {/* Hash metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 font-mono text-[10px] text-slate-500">
                <div className="truncate">
                  <span className="text-slate-400">PrevHash: </span>
                  <span className="text-slate-700">{truncateHash(block.prevHash, 6, 4)}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-400">BlockHash: </span>
                  <span className="text-emerald-700 font-bold">{truncateHash(block.hash, 6, 4)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
