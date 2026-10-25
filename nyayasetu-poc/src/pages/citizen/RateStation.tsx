import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Star, Check, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

const SERVICE_TAGS = [
  { id: 'polite', labelBn: 'ভদ্র ও সহযোগিতাপূর্ণ আচরণ', labelEn: 'Polite & Courteous' },
  { id: 'fast', labelBn: 'দ্রুত সেবা প্রদান', labelEn: 'Fast Turnaround' },
  { id: 'corruption_free', labelBn: 'সম্পূর্ণ দুর্নীতিমুক্ত ও নিরাসক্ত', labelEn: 'Zero Corruption / Free' },
  { id: 'helpful', labelBn: 'আইনি পরামর্শে সহায়ক', labelEn: 'Helpful Legal Guidance' },
];

export const RateStation: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stations = useAppStore((s) => s.stations);
  const cases = useAppStore((s) => s.cases);
  const addRating = useAppStore((s) => s.addRating);
  const user = useAuthStore((s) => s.user);

  const [stationId, setStationId] = useState(stations[0]?.id || 'dhanmondi');
  const [stars, setStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'polite',
    'fast',
    'corruption_free',
  ]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRating({
      id: 'rate-' + Date.now(),
      stationId,
      caseId: cases[0]?.id || 'NS-2026-DHK-000101',
      stars,
      tags: selectedTags,
      comment: comment.trim() || undefined,
      at: new Date().toISOString(),
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate('/station-dashboard');
    }, 1800);
  };

  return (
    <div className="max-w-md mx-auto space-y-5 pb-12 animate-in fade-in duration-150">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 font-bengali">
            {t('citizen.rateStation')}
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            আপনার সৎ মতামত পুলিশের সেবার মান ও জবাবদিহিতা বৃদ্ধি করবে
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-5"
      >
        {/* Thana selection */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
            কোন থানার সেবা মূল্যায়ন করছেন?
          </label>
          <select
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm font-semibold font-bengali text-slate-800"
          >
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameBn} ({s.district})
              </option>
            ))}
          </select>
        </div>

        {/* 1-5 Star Selection */}
        <div className="text-center py-2 space-y-2">
          <label className="text-xs font-bold text-slate-700 block font-bengali">
            সার্বিক সন্তুষ্টির মাত্রা নির্ধারণ করুন:
          </label>

          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStars(star)}
                className="p-2 hover:scale-125 transition-transform focus-visible:outline-none"
                aria-label={`${star} Stars`}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= stars
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-amber-600 block">
            {stars === 5
              ? 'চমৎকার ও অনুকরণীয় সেবা'
              : stars === 4
              ? 'খুব ভালো'
              : stars === 3
              ? 'সন্তোষজনক'
              : 'উন্নতি প্রয়োজন'}
          </span>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block font-bengali">
            উপযুক্ত বিষয় নির্বাচন করুন (ট্যাগ):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SERVICE_TAGS.map((tag) => {
              const active = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border font-bengali ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tag.labelBn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
            অতিরিক্ত মন্তব্য বা অভিজ্ঞতা (ঐচ্ছিক):
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="পুলিশ কর্মকর্তাদের ব্যবহার কেমন ছিল বা কী উন্নয়ন করা যায় লিখুন..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs text-center font-bold font-bengali flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>আপনার মূল্যবান মতামতের জন্য ধন্যবাদ! থানা ড্যাশবোর্ড আপডেট করা হয়েছে।</span>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
          >
            মূল্যায়ন নিশ্চিত করুন
          </button>
        )}
      </form>
    </div>
  );
};
