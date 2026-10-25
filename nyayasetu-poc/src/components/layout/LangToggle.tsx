import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe } from 'lucide-react';

export const LangToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const language = useAuthStore((s) => s.language);
  const setLanguage = useAuthStore((s) => s.setLanguage);
  const useBanglaNumerals = useAuthStore((s) => s.useBanglaNumerals);
  const setUseBanglaNumerals = useAuthStore((s) => s.setUseBanglaNumerals);

  const toggleLanguage = () => {
    const nextLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggleLanguage}
        className="inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-900 border border-brand-200 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[40px] focus-visible:ring-2 focus-visible:ring-brand-500"
        title="Toggle between বাংলা and English"
        aria-label={`Switch language to ${language === 'bn' ? 'English' : 'Bangla'}`}
      >
        <Globe className="w-4 h-4 text-brand-600" aria-hidden="true" />
        <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
      </button>

      {language === 'bn' && (
        <button
          onClick={() => setUseBanglaNumerals(!useBanglaNumerals)}
          className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all min-h-[40px] ${
            useBanglaNumerals
              ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
          title="Toggle Bengali Digits (১২৩ vs 123)"
          aria-pressed={useBanglaNumerals}
        >
          ১২৩
        </button>
      )}
    </div>
  );
};
