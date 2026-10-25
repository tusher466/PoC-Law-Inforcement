import React from 'react';

interface WaveformPulseProps {
  isListening: boolean;
}

export const WaveformPulse: React.FC<WaveformPulseProps> = ({ isListening }) => {
  if (!isListening) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 py-2" aria-hidden="true">
      <span className="w-1.5 h-4 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="w-1.5 h-8 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="w-1.5 h-6 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
      <span className="w-1.5 h-10 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-1.5 h-7 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
      <span className="w-1.5 h-4 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.35s]"></span>
    </div>
  );
};
