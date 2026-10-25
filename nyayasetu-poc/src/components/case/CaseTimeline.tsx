import React from 'react';
import { useTranslation } from 'react-i18next';
import { Case, CaseStage, TimelineEvent } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDhakaDateTime } from '../../lib/time';
import {
  CheckCircle2,
  Circle,
  Clock,
  UserCheck,
  Building,
  Search,
  Scale,
  Gavel,
  ShieldCheck,
} from 'lucide-react';

interface CaseTimelineProps {
  currentStage: CaseStage;
  timeline: TimelineEvent[];
  courtDate?: string;
}

const ORDERED_STAGES: { stage: CaseStage; key: string }[] = [
  { stage: 'filed', key: 'stages.filed' },
  { stage: 'received', key: 'stages.received' },
  { stage: 'assigned', key: 'stages.assigned' },
  { stage: 'investigation', key: 'stages.investigation' },
  { stage: 'chargesheet', key: 'stages.chargesheet' },
  { stage: 'court', key: 'stages.court' },
  { stage: 'closed', key: 'stages.closed' },
];

export const CaseTimeline: React.FC<CaseTimelineProps> = ({
  currentStage,
  timeline,
  courtDate,
}) => {
  const { t } = useTranslation();
  const language = useAuthStore((s) => s.language);
  const useBanglaNumerals = useAuthStore((s) => s.useBanglaNumerals);

  const currentIndex = ORDERED_STAGES.findIndex((s) => s.stage === currentStage);

  return (
    <div className="py-2">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-brand-600" />
        <span>{language === 'bn' ? 'কেস অগ্রগতির লাইভ টাইমলাইন (পার্সেল ট্র্যাকিং স্টাইল)' : 'Live Parcel-Style Case Timeline'}</span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {ORDERED_STAGES.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          // Find matching event from historical timeline
          const event = timeline.find((e) => e.stage === step.stage);

          return (
            <div key={step.stage} className="relative group">
              {/* Node Icon */}
              <div
                className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : isCurrent
                    ? 'bg-brand-500 text-white ring-4 ring-brand-100 animate-pulse'
                    : 'bg-white border-2 border-slate-300 text-slate-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isCurrent ? (
                  <Clock className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Content Card */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-white border-brand-400 shadow-card ring-1 ring-brand-100'
                    : isCompleted
                    ? 'bg-white/80 border-slate-200'
                    : 'bg-slate-50/60 border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-xs font-bold font-bengali ${
                      isCurrent
                        ? 'text-brand-700'
                        : isCompleted
                        ? 'text-slate-900'
                        : 'text-slate-500'
                    }`}
                  >
                    {t(step.key)}
                  </span>

                  {event && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {formatDhakaDateTime(event.at, useBanglaNumerals, 'dd MMM, hh:mm a')}
                    </span>
                  )}
                </div>

                {event ? (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-700 leading-relaxed font-bengali">
                      {event.note}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      <span>{event.actorName}</span>
                    </p>
                  </div>
                ) : isPending ? (
                  <p className="text-[11px] text-slate-400 italic">
                    {language === 'bn' ? 'পরবর্তী প্রক্রিয়া - অপেক্ষমান' : 'Pending subsequent investigation steps'}
                  </p>
                ) : null}

                {step.stage === 'court' && courtDate && (
                  <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
                    <Gavel className="w-4 h-4 text-indigo-600" />
                    <span>
                      {language === 'bn' ? `পরবর্তী শুনানির তারিখ: ${courtDate}` : `Scheduled Court Date: ${courtDate}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
