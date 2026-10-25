import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import {
  User,
  Shield,
  Phone,
  Eye,
  Type,
  Lock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const language = useAuthStore((s) => s.language);
  const isHighContrast = useAuthStore((s) => s.isHighContrast);
  const setHighContrast = useAuthStore((s) => s.setHighContrast);
  const isLargeText = useAuthStore((s) => s.isLargeText);
  const setLargeText = useAuthStore((s) => s.setLargeText);

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-12 animate-in fade-in duration-150">
      <div>
        <h1 className="text-xl font-black text-slate-900 font-bengali">
          নাগরিক প্রোফাইল ও সেটিংস
        </h1>
        <p className="text-xs text-slate-500 font-bengali">
          ব্যক্তিগত তথ্য, জরুরি পরিচিতি ও তথ্য সুরক্ষা নীতিমালা
        </p>
      </div>

      {/* Citizen Personal Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-bengali">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone}</p>
            <span className="inline-block mt-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
              এনআইডি যাচাইকৃত প্রোফাইল
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">এনআইডি নম্বর (ডামি):</span>
            <span className="font-mono text-slate-800 font-bold">{user.nidFake}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">আওতাধীন থানা:</span>
            <span className="text-slate-800 font-bold font-bengali">ধানমন্ডি মডেল থানা</span>
          </div>
        </div>
      </div>

      {/* Trusted Emergency Contacts */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
            <Phone className="w-4 h-4 text-alertRed" />
            <span>জরুরি বিশ্বস্ত পরিচিতি (Trusted Contacts - ৩ জন)</span>
          </h3>
        </div>

        <p className="text-xs text-slate-500 font-bengali">
          সাইলেন্ট এসওএস চাপলে এই নম্বরগুলোতে তাৎক্ষণিক লোকেশন ও সতর্কবার্তা চলে যায়।
        </p>

        <div className="space-y-2 pt-1">
          {user.trustedContacts.map((contact, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-800 font-bengali block">
                  {contact.name}
                </span>
                <span className="text-[11px] text-slate-500 font-bengali">
                  সম্পর্ক: {contact.relation}
                </span>
              </div>
              <span className="font-mono text-slate-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                {contact.phone}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Accessibility Preferences */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
          <Eye className="w-4 h-4 text-brand-600" />
          <span>অ্যাক্সেসিবিলিটি ও ভিজ্যুয়াল সুবিধা (WCAG AA)</span>
        </h3>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 font-bengali block">
                উচ্চ কনট্রাস্ট মোড (High Contrast)
              </span>
              <span className="text-[11px] text-slate-500 font-bengali">
                দৃষ্টিসীমা সহায়তায় টেক্সটের উজ্জ্বলতা ও স্পষ্টতা বৃদ্ধি করে
              </span>
            </div>
            <button
              onClick={() => setHighContrast(!isHighContrast)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isHighContrast ? 'bg-brand-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isHighContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div>
              <span className="text-xs font-bold text-slate-800 font-bengali block">
                বড় ফন্ট মোড (Large Text)
              </span>
              <span className="text-[11px] text-slate-500 font-bengali">
                পঠনযোগ্যতার সুবিধার জন্য সামগ্রিক ফন্টের আকার বৃদ্ধি করে
              </span>
            </div>
            <button
              onClick={() => setLargeText(!isLargeText)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isLargeText ? 'bg-brand-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isLargeText ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Transparent Data Privacy Disclosure */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-5 space-y-2 text-xs text-emerald-950 font-bengali">
        <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>তথ্য সুরক্ষা ও গোপনীয়তার প্রতিশ্রুতি (Data Privacy Statement)</span>
        </h4>
        <p className="leading-relaxed text-emerald-900">
          <strong>আমরা কী সংরক্ষণ করি:</strong> আপনার অভিযোগের বিবরণ, সংযুক্ত ডিজিটাল আলামত (হ্যাশ সিলসহ), জিডি ট্র্যাকিং স্ট্যাটাস ও এসওএস লোকেশন।
        </p>
        <p className="leading-relaxed text-emerald-900">
          <strong>আমরা কী সংরক্ষণ করি না:</strong> কোনো বায়োমেট্রিক ফেস ডেটা, অপ্রয়োজনীয় ব্রাউজিং ইতিহাস বা তৃতীয় পক্ষের বাণিজ্যিক ট্র্যাকার। সকল অডিট হিস্টোরি এনক্রিপ্টেড।
        </p>
      </div>
    </div>
  );
};
