import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BanglaSpeechRecognizer,
  isSpeechRecognitionSupported,
  SAMPLE_BANGLA_VOICE_COMPLAINTS,
} from '../../lib/speech';
import { WaveformPulse } from './WaveformPulse';
import { Mic, MicOff, Sparkles, Edit3, Volume2, RotateCcw } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscriptReady: (text: string, title?: string, type?: string) => void;
  initialText?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptReady,
  initialText = '',
}) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mode, setMode] = useState<'voice' | 'typed'>('voice');

  const recognizerRef = useRef<BanglaSpeechRecognizer | null>(null);
  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    recognizerRef.current = new BanglaSpeechRecognizer();
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    if (!recognizerRef.current) return;

    setIsListening(true);
    recognizerRef.current.start({
      onResult: (text, isFinal) => {
        setTranscript(text);
        onTranscriptReady(text);
      },
      onError: (err) => {
        setIsListening(false);
        setErrorMessage(
          'মাইক্রোফোনে সমস্যা হয়েছে বা অনুমতি নেই। আপনি চাইলে টাইপ করতে পারেন অথবা নিচের "সিমুলেট" বোতাম চাপুন।'
        );
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSimulatePreset = (index: number = 0) => {
    const sample = SAMPLE_BANGLA_VOICE_COMPLAINTS[index];
    setTranscript(sample.text);
    onTranscriptReady(sample.text, sample.titleBn, sample.type);
    setErrorMessage(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
    onTranscriptReady(e.target.value);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
      {/* Tab switch between Voice and Keyboard */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('voice')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'voice'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{t('fileGd.voiceInput')} (বাংলা)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('typed')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'typed'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{t('fileGd.typeManually')}</span>
          </button>
        </div>

        {/* 1-click Preset Simulator */}
        <div className="relative group">
          <button
            type="button"
            onClick={() => handleSimulatePreset(0)}
            className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs"
            title="Simulate speech with pre-recorded realistic statement"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('fileGd.simulateVoice')}</span>
          </button>
        </div>
      </div>

      {mode === 'voice' && (
        <div className="flex flex-col items-center justify-center py-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          {/* Main animated Mic Button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-elevated focus-visible:ring-4 focus-visible:ring-brand-300 ${
              isListening
                ? 'bg-red-500 text-white scale-110 ring-8 ring-red-100 animate-pulse'
                : 'bg-brand-500 hover:bg-brand-600 text-white hover:scale-105'
            }`}
            aria-label={isListening ? t('fileGd.stopListening') : t('fileGd.voiceInput')}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </button>

          <div className="mt-3 text-center">
            <p className="text-sm font-bold text-slate-800 font-bengali">
              {isListening ? t('fileGd.listening') : 'বাংলায় কথা বলতে মাইকে চাপ দিন'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isListening
                ? 'কথা বলা শেষ হলে আবার মাইকে চাপ দিন'
                : 'স্পিচ-টু-টেক্সট স্বয়ংক্রিয়ভাবে বাংলায় রূপান্তর হবে'}
            </p>
          </div>

          <WaveformPulse isListening={isListening} />
        </div>
      )}

      {/* Error notification if mic blocked or unsupported */}
      {errorMessage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-xl text-xs font-medium flex items-start gap-2">
          <Volume2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Editable live transcript */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
          <span>অভিযোগের বিবরণ (সম্পাদনাযোগ্য):</span>
          {transcript && (
            <button
              type="button"
              onClick={() => {
                setTranscript('');
                onTranscriptReady('');
              }}
              className="text-slate-400 hover:text-red-600 text-[11px] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>মুছে ফেলুন</span>
            </button>
          )}
        </div>

        <textarea
          rows={4}
          value={transcript}
          onChange={handleTextChange}
          placeholder="এখানে আপনার অভিযোগ স্পষ্ট ভাষায় বলুন বা কীবোর্ডে টাইপ করুন..."
          className="w-full bg-white border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-bengali placeholder:text-slate-400 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Quick preset chips */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          ডেমো নমুনা বিবরণ (ক্লিক করুন):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_BANGLA_VOICE_COMPLAINTS.map((sample, idx) => (
            <button
              key={sample.type}
              type="button"
              onClick={() => handleSimulatePreset(idx)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors font-bengali"
            >
              {sample.titleBn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
