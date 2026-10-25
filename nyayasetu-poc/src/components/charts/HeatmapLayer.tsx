import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface HotspotArea {
  id: string;
  areaBn: string;
  areaEn: string;
  peakHours: string;
  commonTypeBn: string;
  riskLevel: 'high' | 'medium' | 'low';
  incidentCount: number;
  preventiveActionBn: string;
}

const DHAKA_HOTSPOTS: HotspotArea[] = [
  {
    id: 'hs-1',
    areaBn: 'ধানমন্ডি ২৭ ও সাতমসজিদ রোড সংলগ্ন এলাকা',
    areaEn: 'Dhanmondi Rd 27 & Satmasjid Rd',
    peakHours: '১১:০০ - ১৪:০০ এবং ২০:০০ - ২২:০০',
    commonTypeBn: 'মোবাইল ছিনতাই ও রিকশা আরোহী টার্গেট',
    riskLevel: 'high',
    incidentCount: 18,
    preventiveActionBn: 'অতিরিক্ত মোটরসাইকেল কুইক রেসপন্স টিম মোতায়েন ও এটিএম সিসিটিভি সিঙ্ক।',
  },
  {
    id: 'hs-2',
    areaBn: 'মিরপুর ১০ গোলচত্বর ও রোকেয়া সরণি',
    areaEn: 'Mirpur 10 Circle & Rokeya Sarani',
    peakHours: '১৮:০০ - ২১:০০ (সন্ধ্যা পিক আওয়ার)',
    commonTypeBn: 'পকেটমার ও ভিড়ের সুযোগে মোবাইল চুরি',
    riskLevel: 'medium',
    incidentCount: 14,
    preventiveActionBn: 'মেট্রোরেল স্টেশন সংলগ্ন এলাকায় সাদা পোশাকে নজরদারি বৃদ্ধি।',
  },
  {
    id: 'hs-3',
    areaBn: 'বনানী ব্রিজ ও গুলশান লিংক রোড চেকপোস্ট',
    areaEn: 'Banani Bridge & Gulshan Link Road',
    peakHours: '২২:০০ - ০১:০০ (মধ্যরাত)',
    commonTypeBn: 'বেপরোয়া গতি ও প্রাইভেট কারে অপরাধের চেষ্টা',
    riskLevel: 'medium',
    incidentCount: 9,
    preventiveActionBn: 'অটোমেটেড নম্বর প্লেট রিডার (ANPR) ক্যামেরা ও ব্যারিকেড সক্রিয়করণ।',
  },
  {
    id: 'hs-4',
    areaBn: 'সাভার বাসস্ট্যান্ড ও বাজার সংলগ্ন টার্মিনাল',
    areaEn: 'Savar Bus Stand & Market Terminal',
    peakHours: '১৯:০০ - ২৩:০০',
    commonTypeBn: 'চাঁদাবাজি ও আন্তঃজেলা বাস যাত্রী প্রতারণা',
    riskLevel: 'high',
    incidentCount: 22,
    preventiveActionBn: 'স্ট্যান্ডে অস্থায়ী পুলিশ হেল্প ডেস্ক ও নিয়মিত ট্রাফিক সাড়াদান।',
  },
  {
    id: 'hs-5',
    areaBn: 'উত্তরা সেক্টর ৩ ও ৪ পার্ক এলাকা',
    areaEn: 'Uttara Sector 3 & 4 Park Zone',
    peakHours: '১৫:০০ - ১৮:০০',
    commonTypeBn: 'কিশোরদের বিশৃঙ্খলা ও উত্যক্তকরণ',
    riskLevel: 'low',
    incidentCount: 6,
    preventiveActionBn: 'কমিউনিটি পুলিশিং ও বিট অফিসার কর্তৃক অভিভাবকদের সাথে সচেতনতা বৈঠক।',
  },
];

export const HeatmapLayer: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Ethical AI Principle Callout */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-950 shadow-soft">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-emerald-900 font-bengali">
            নৈতিক ডেটা ও অপরাধ বিশ্লেষণ নীতিমালা (Responsible AI Charter)
          </h4>
          <p className="mt-1 leading-relaxed text-emerald-800 font-bengali">
            এই মানচিত্রটি কেবলমাত্র স্থান ও সময়ের সমন্বিত ঘনত্বের (Geospatial & Temporal Aggregation) ভিত্তিতে প্রস্তুত করা হয়েছে।
            <strong> কোনো ব্যক্তি, নির্দিষ্ট জনগোষ্ঠী, পেশা বা জাতিগোষ্ঠীর ওপর প্রোফাইলিং সম্পূর্ণ নিষিদ্ধ এবং অ্যালগরিদমে এর কোনো সুযোগ রাখা হয়নি।</strong>
          </p>
        </div>
      </div>

      {/* Hotspots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {DHAKA_HOTSPOTS.map((hs) => {
          const badgeStyles =
            hs.riskLevel === 'high'
              ? 'bg-red-100 text-red-800 border-red-200'
              : hs.riskLevel === 'medium'
              ? 'bg-amber-100 text-amber-900 border-amber-200'
              : 'bg-emerald-100 text-emerald-800 border-emerald-200';

          return (
            <div
              key={hs.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-soft hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-sm font-bold text-slate-900 font-bengali leading-snug">
                  {hs.areaBn}
                </h5>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase shrink-0 ${badgeStyles}`}
                >
                  {hs.riskLevel === 'high' ? 'উচ্চ প্রবণতা' : hs.riskLevel === 'medium' ? 'মাঝারি' : 'স্বাভাবিক'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-800">পিক সময়:</strong> {hs.peakHours}
                </p>
                <p>
                  <strong className="text-slate-800">প্রধান লক্ষণ:</strong> {hs.commonTypeBn}
                </p>
                <p>
                  <strong className="text-slate-800">চলতি মাসে ঘটনা:</strong> {hs.incidentCount} টি
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-brand-800 font-medium bg-brand-50/50 p-2 rounded-xl">
                <strong>প্রতিরোধমূলক ব্যবস্থা:</strong> {hs.preventiveActionBn}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
