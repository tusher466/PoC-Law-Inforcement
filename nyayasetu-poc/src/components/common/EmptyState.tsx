import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-dashed border-slate-300 rounded-3xl">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-7 h-7" />
      </div>

      <h4 className="text-base font-bold text-slate-800 font-bengali mb-1">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed mb-4 font-bengali">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
