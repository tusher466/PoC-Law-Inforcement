import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Case } from '../../types';
import { StatusBadge } from './StatusBadge';
import { SlaCountdown } from './SlaCountdown';
import { CaseIdChip } from './CaseIdChip';
import { useAuthStore } from '../../store/useAuthStore';
import { formatRelativeTime } from '../../lib/time';
import { MapPin, User, ChevronRight, Paperclip } from 'lucide-react';

interface CaseCardProps {
  item: Case;
  mode?: 'citizen' | 'officer';
}

export const CaseCard: React.FC<CaseCardProps> = ({ item, mode = 'citizen' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const language = useAuthStore((s) => s.language);
  const useBanglaNumerals = useAuthStore((s) => s.useBanglaNumerals);

  const handleClick = () => {
    if (mode === 'officer') {
      navigate(`/officer/case/${item.id}`);
    } else {
      navigate(`/citizen/case/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className="bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-brand-300 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-elevated transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={`View details for Case ${item.id}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <CaseIdChip caseId={item.id} showQrModal={false} />
          {item.urgent && (
            <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
              {language === 'bn' ? 'জরুরি' : 'URGENT'}
            </span>
          )}
        </div>

        <StatusBadge status={item.status} />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1.5 font-bengali">
        {item.title}
      </h4>

      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 font-bengali">
        {item.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.stationId.toUpperCase()} Thana</span>
          </span>

          {item.evidenceIds.length > 0 && (
            <span className="flex items-center gap-1 font-medium text-emerald-700">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{item.evidenceIds.length}</span>
            </span>
          )}

          {mode === 'officer' && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.citizenName}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <SlaCountdown
            createdAt={item.createdAt}
            slaDueAt={item.slaDueAt}
            compact
          />
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
};
