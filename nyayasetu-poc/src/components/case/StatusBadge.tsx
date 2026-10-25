import React from 'react';
import { useTranslation } from 'react-i18next';
import { CaseStage } from '../../types';
import {
  FileText,
  Building,
  UserCheck,
  Search,
  Scale,
  Gavel,
  CheckCircle2,
} from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStage;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const { t } = useTranslation();

  const config: Record<
    CaseStage,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    filed: {
      label: t('stages.filed'),
      icon: <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />,
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-300',
    },
    received: {
      label: t('stages.received'),
      icon: <Building className="w-3.5 h-3.5 shrink-0 text-blue-600" aria-hidden="true" />,
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      border: 'border-blue-200',
    },
    assigned: {
      label: t('stages.assigned'),
      icon: <UserCheck className="w-3.5 h-3.5 shrink-0 text-teal-600" aria-hidden="true" />,
      bg: 'bg-teal-50',
      text: 'text-teal-900',
      border: 'border-teal-200',
    },
    investigation: {
      label: t('stages.investigation'),
      icon: <Search className="w-3.5 h-3.5 shrink-0 text-amber-600" aria-hidden="true" />,
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      border: 'border-amber-200',
    },
    chargesheet: {
      label: t('stages.chargesheet'),
      icon: <Scale className="w-3.5 h-3.5 shrink-0 text-purple-600" aria-hidden="true" />,
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      border: 'border-purple-200',
    },
    court: {
      label: t('stages.court'),
      icon: <Gavel className="w-3.5 h-3.5 shrink-0 text-indigo-600" aria-hidden="true" />,
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-200',
    },
    closed: {
      label: t('stages.closed'),
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" aria-hidden="true" />,
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      border: 'border-emerald-200',
    },
  };

  const item = config[status] || config.filed;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.bg} ${item.text} ${item.border} ${className}`}
    >
      {item.icon}
      <span className="font-bengali leading-none">{item.label}</span>
    </span>
  );
};
