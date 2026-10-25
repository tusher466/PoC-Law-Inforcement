import React from 'react';

interface StepWizardProps {
  steps: string[];
  currentStep: number;
}

export const StepWizard: React.FC<StepWizardProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 font-bengali">
        {steps.map((label, idx) => (
          <span
            key={idx}
            className={idx + 1 <= currentStep ? 'text-brand-600 font-extrabold' : ''}
          >
            {idx + 1}. {label}
          </span>
        ))}
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className="bg-brand-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
