import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl font-black">
        ৪০৪
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-slate-900 font-bengali">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি (Page Not Found)
        </h1>
        <p className="text-xs text-slate-500 max-w-sm">
          আপনার অনুরোধকৃত ইউআরএলটি বিদ্যমান নেই বা সরানো হয়েছে।
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পেছনে ফিরুন</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
        >
          <Home className="w-4 h-4" />
          <span>মূল পাতায় যান</span>
        </button>
      </div>
    </div>
  );
};
