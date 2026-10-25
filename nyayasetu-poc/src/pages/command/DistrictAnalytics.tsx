import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CaseTrendChart } from '../../components/charts/CaseTrendChart';
import { HeatmapLayer } from '../../components/charts/HeatmapLayer';
import { generateSafeRoutes, SafeRouteOption } from '../../lib/geo';
import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  Navigation,
  Compass,
  Lightbulb,
  Video,
  Car,
} from 'lucide-react';

export const DistrictAnalytics: React.FC = () => {
  const { t } = useTranslation();

  // Safe Route Planner Widget state
  const [origin, setOrigin] = useState('dhanmondi');
  const [destination, setDestination] = useState('mirpur');
  const [routeOptions, setRouteOptions] = useState<SafeRouteOption[]>(() =>
    generateSafeRoutes(23.7461, 90.3742, 23.807, 90.3686)
  );

  const handlePlanRoute = () => {
    // Generate route based on selected points
    const fromCoords =
      origin === 'dhanmondi' ? [23.7461, 90.3742] : [23.7925, 90.4167];
    const toCoords =
      destination === 'mirpur' ? [23.807, 90.3686] : [23.8728, 90.3984];
    setRouteOptions(
      generateSafeRoutes(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1])
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Title */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 block flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          DISTRICT-WIDE CRIME PATTERNS & SPATIAL SAFETY INTELLIGENCE
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
          {t('nav.districtAnalytics')}
        </h1>
        <p className="text-xs text-slate-500 font-bengali">
          ঢাকা মেট্রোপলিটন ক্রাইম ট্রেন্ড, হটস্পট ভৌগোলিক বিশ্লেষণ ও নিরাপদ রুট সহকারী
        </p>
      </div>

      {/* Crime Trend Chart Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900 font-bengali">
              গত ৬ মাসের অপরাধ পরিসংখ্যান ট্রেন্ড (ক্যাটাগরিভিত্তিক)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">ঢাকা মহানগরী</span>
        </div>
        <CaseTrendChart />
      </div>

      {/* Place-and-Time Hotspot Heatmap Section (Aggregated, Ethical AI note) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-bold text-slate-900 font-bengali">
              স্থান ও সময়ভিত্তিক অপরাধপ্রবণ মানচিত্র (Hotspot Analysis)
            </h2>
          </div>
        </div>

        <HeatmapLayer />
      </div>

      {/* Safe Route Suggestion Widget */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 font-bengali">
              {t('dashboards.safeRouteTitle')} (রাত্রিকালীন নিরাপদ যাতায়াত নির্দেশিকা)
            </h2>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold font-bengali">
            সিসিটিভি ও টহল টিম সংযুক্ত
          </span>
        </div>

        {/* Origin / Destination Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
              যাত্রা শুরুর স্থান:
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
            >
              <option value="dhanmondi">ধানমন্ডি (রোড ২৭ মোড়)</option>
              <option value="gulshan">গুলশান (২ নম্বর গোলচত্বর)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
              গন্তব্যস্থল:
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
            >
              <option value="mirpur">মিরপুর (১০ নম্বর সেকশন)</option>
              <option value="uttara">উত্তরা (আজমপুর পয়েন্ট)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handlePlanRoute}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-card transition-all"
            >
              নিরাপদ রুট গণনা করুন
            </button>
          </div>
        </div>

        {/* Route comparison options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {routeOptions.map((opt) => (
            <div
              key={opt.id}
              className={`p-4 rounded-2xl border space-y-2.5 ${
                opt.safetyScore >= 90
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 font-bengali">
                  {opt.name}
                </span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full ${
                    opt.safetyScore >= 90
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  নিরাপত্তা স্কোর: {opt.safetyScore}/১০০
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-mono">
                <div>দূরত্ব: {opt.distanceKm} কিমি</div>
                <div>আনুমানিক সময়: {opt.estimatedMinutes} মিনিট</div>
              </div>

              <div className="space-y-1 text-xs text-slate-700 pt-1 border-t border-slate-200/60 font-bengali">
                <p className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-brand-600" />
                  <span>{opt.cctvCoverage}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>{opt.lightingLevel}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-blue-600" />
                  <span>{opt.patrolFrequency}</span>
                </p>
              </div>

              <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200/80 font-bengali leading-snug">
                {opt.recommendationNoteBn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
