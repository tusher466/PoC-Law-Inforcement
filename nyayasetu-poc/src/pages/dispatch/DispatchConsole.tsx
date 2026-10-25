import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Incident, Unit } from '../../types';
import { DispatchMap } from '../../components/map/DispatchMap';
import { findNearestUnits } from '../../lib/geo';
import {
  Radio,
  PhoneCall,
  AlertOctagon,
  Clock,
  Car,
  CheckCircle2,
  Navigation,
  ArrowRight,
  Tablet,
  Sparkles,
  BarChart2,
  Volume2,
  MessageSquare,
  Smartphone,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const RESPONSE_METRICS_DATA = [
  { name: 'কল গ্রহণ ও স্থান নির্ণয়', legacy: 4.5, nyayasetu: 0.8 },
  { name: 'নিকটতম টহল নির্বাচন', legacy: 5.2, nyayasetu: 0.4 },
  { name: 'ঘটনাস্থলে যাত্রা (En Route)', legacy: 8.5, nyayasetu: 5.2 },
  { name: 'সর্বমোট রেসপন্স টাইম', legacy: 18.2, nyayasetu: 6.4 },
];

export const DispatchConsole: React.FC = () => {
  const { t } = useTranslation();
  const incidents = useAppStore((s) => s.incidents);
  const units = useAppStore((s) => s.units);
  const assignUnitToIncident = useAppStore((s) => s.assignUnitToIncident);
  const updateUnitPatrolStatus = useAppStore((s) => s.updateUnitPatrolStatus);
  const simulateIncoming999Call = useAppStore((s) => s.simulateIncoming999Call);
  const language = useAuthStore((s) => s.language);

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents[0] ? incidents[0].id : 'inc-999-01'
  );
  const [showTabletSimulator, setShowTabletSimulator] = useState(false);
  const [callTakerModal, setCallTakerModal] = useState(false);
  const [callCaller, setCallCaller] = useState('মো. জয়নাল আবেদীন');
  const [callPhone, setCallPhone] = useState('01819-776655');
  const [callDesc, setCallDesc] = useState('সাতমসজিদ রোডে এক পথচারীকে অস্ত্র ঠেকিয়ে মানিব্যাগ ছিনতাই');

  const selectedIncident =
    incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  // Nearest 3 units for selected incident
  const nearestResults = selectedIncident
    ? findNearestUnits(selectedIncident.lat, selectedIncident.lng, units, 3)
    : [];

  // Currently assigned unit to selected incident
  const assignedUnit = units.find(
    (u) => u.id === selectedIncident?.assignedUnitId
  );

  const handleAutoAssign = async () => {
    if (!selectedIncident || nearestResults.length === 0) return;
    const bestUnit = nearestResults[0].unit;
    await assignUnitToIncident(bestUnit.id, selectedIncident.id);
  };

  const handleSimulateCall = async (e: React.FormEvent) => {
    e.preventDefault();
    await simulateIncoming999Call(callDesc, callCaller, callPhone);
    setCallTakerModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* CAD Console Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 block flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            NATIONAL 999 CAD & SMART DISPATCH INTERFACE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
            {t('dispatch.title')}
          </h1>
          <p className="text-xs text-slate-500 font-bengali">
            রিয়েল-টাইম জিপিএস টহল টিম, স্মার্ট নিকটতম ইউনিট নির্বাচন ও রেসপন্স টাইম অ্যানালিটিক্স
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Simulate 999 Call Button */}
          <button
            onClick={() => setCallTakerModal(true)}
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-2 rounded-2xl text-xs shadow-card transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('dispatch.simulateIncomingCall')}</span>
          </button>

          {/* Toggle Patrol Tablet Simulator */}
          <button
            onClick={() => setShowTabletSimulator(!showTabletSimulator)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
              showTabletSimulator
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Tablet className="w-4 h-4 text-emerald-600" />
            <span>টহল ট্যাবলেট ভিউ</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left CAD Map & Dispatcher Panel | Right Incident Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Live Dhaka CAD Map with Nearest Highlights */}
        <div className="lg:col-span-8 space-y-4">
          <DispatchMap
            units={units}
            incidents={incidents}
            selectedIncidentId={selectedIncidentId}
            onSelectIncident={(inc) => setSelectedIncidentId(inc.id)}
            className="h-[460px]"
          />

          {/* Smart Dispatch Recommendation Box */}
          {selectedIncident && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-brand-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-bengali">
                    {t('dispatch.smartDispatch')}: {selectedIncident.id}
                  </h3>
                </div>

                {!selectedIncident.assignedUnitId && nearestResults.length > 0 && (
                  <button
                    onClick={handleAutoAssign}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('dispatch.autoAssignNearest')}</span>
                  </button>
                )}
              </div>

              {/* Top 3 Nearest Units Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {nearestResults.map(({ unit, distanceKm, etaMinutes }, idx) => {
                  const isAssigned = unit.id === selectedIncident.assignedUnitId;

                  return (
                    <div
                      key={unit.id}
                      className={`p-3 rounded-2xl border text-xs transition-all space-y-1 ${
                        isAssigned
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                          : idx === 0
                          ? 'bg-brand-50/70 border-brand-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-900">
                          {unit.callSign.split(' ')[0]}
                        </span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {etaMinutes} মিনিট ETA
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 truncate font-bengali">
                        {unit.officerName}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        দূরত্ব: {distanceKm} কিমি
                      </p>

                      {!selectedIncident.assignedUnitId ? (
                        <button
                          onClick={() => assignUnitToIncident(unit.id, selectedIncident.id)}
                          className="w-full mt-2 bg-slate-900 hover:bg-brand-600 text-white font-semibold py-1 rounded-lg text-[11px] transition-colors"
                        >
                          প্রেরণ করুন
                        </button>
                      ) : isAssigned ? (
                        <span className="block mt-2 text-center font-bold text-emerald-800 text-[11px] bg-emerald-100/80 py-0.5 rounded">
                          ✓ দায়িত্বপ্রাপ্ত টিম
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Response-time comparison chart (NyayaSetu vs. 18-minute Legacy Baseline) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 font-bengali">
                  সাড়াদান সময় বিশ্লেষণ (রেসপন্স টাইম তুলনামূলক চিত্র)
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bengali">
                {t('dispatch.avgResponseTime')}
              </span>
            </div>

            <div className="w-full h-56 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={RESPONSE_METRICS_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" মি" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar
                    dataKey="legacy"
                    name="পূর্বের ফোন-রিলে ব্যবস্থা (মিনিট)"
                    fill="#94a3b8"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="nyayasetu"
                    name="ন্যায়সেতু ডিজিটাল সিএডি (মিনিট)"
                    fill="#006A4E"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Emergency Incident Feed & Patrol Tablet Simulator */}
        <div className="lg:col-span-4 space-y-4">
          {/* Incident Queue Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>{t('dispatch.incomingQueue')} ({incidents.length})</span>
              </h3>
              <span className="text-[10px] font-bold uppercase text-slate-400">
                LIVE 999 FEED
              </span>
            </div>

            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncidentId;
                const sourceBadge =
                  inc.source === 'app_sos'
                    ? 'bg-red-100 text-red-800'
                    : inc.source === 'call_999'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800';

                return (
                  <button
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-brand-50/70 border-brand-400 ring-2 ring-brand-100 shadow-card'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px]">
                      <span className={`font-bold px-2 py-0.5 rounded-full uppercase ${sourceBadge}`}>
                        {inc.source === 'app_sos' ? 'সাইলেন্ট এসওএস' : inc.source === 'call_999' ? '৯৯৯ কল' : 'জরুরি জিডি'}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {inc.createdAt.split('T')[1]?.slice(0, 5)}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900 line-clamp-2 font-bengali">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="truncate max-w-[140px]">{inc.address}</span>
                      <span className="font-bold text-slate-700 capitalize">{inc.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patrol Tablet Panel Simulator (Interactive on-scene actions!) */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-elevated space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  {t('dispatch.patrolTablet')}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                SIMULATOR
              </span>
            </div>

            {assignedUnit ? (
              <div className="space-y-3">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">
                      {assignedUnit.callSign}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      {assignedUnit.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-bengali">
                    অফিসার: {assignedUnit.officerName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-bengali">
                    টার্গেট ইনসিডেন্ট: {selectedIncident?.id} ({selectedIncident?.address})
                  </p>
                </div>

                {/* Tablet Step Buttons: Accept -> En Route -> On Scene -> Resolved */}
                <div className="space-y-2">
                  <button
                    onClick={() => updateUnitPatrolStatus(assignedUnit.id, 'enroute')}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      assignedUnit.status === 'enroute'
                        ? 'bg-amber-500 text-slate-950 shadow-card ring-2 ring-amber-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    ১. {t('dispatch.enRoute')} (রওয়ানা হলাম)
                  </button>

                  <button
                    onClick={() => updateUnitPatrolStatus(assignedUnit.id, 'onscene')}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      assignedUnit.status === 'onscene'
                        ? 'bg-purple-600 text-white shadow-card ring-2 ring-purple-300'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    ২. {t('dispatch.onScene')} (ঘটনাস্থলে উপস্থিত)
                  </button>

                  <button
                    onClick={() => updateUnitPatrolStatus(assignedUnit.id, 'available')}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
                  >
                    ৩. {t('dispatch.resolveIncident')} (পরিস্থিতি শান্ত ও ফ্রি)
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center font-bengali">
                  ট্যাবলেটের স্ট্যাটাস পরিবর্তন সরাসরি নাগরিকের কেস টাইমলাইনে সিঙ্ক হয়।
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-center text-xs text-slate-400">
                <p>কোনো টহল টিম বর্তমানে নির্বাচিত ইনসিডেন্টে দায়িত্বপ্রাপ্ত নয়।</p>
                <p className="text-[11px] mt-1 text-emerald-400">
                  উপরে &quot;স্বয়ংক্রিয় নিকটতম প্রেরণ&quot; চাপুন।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Taker Simulator Modal */}
      {callTakerModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <PhoneCall className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900 font-bengali">
                {t('dispatch.simulateIncomingCall')}
              </h3>
            </div>

            <form onSubmit={handleSimulateCall} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  কলারের নাম:
                </label>
                <input
                  type="text"
                  value={callCaller}
                  onChange={(e) => setCallCaller(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  মোবাইল নম্বর:
                </label>
                <input
                  type="tel"
                  value={callPhone}
                  onChange={(e) => setCallPhone(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
                  জরুরি ঘটনার বিবরণ:
                </label>
                <textarea
                  rows={3}
                  value={callDesc}
                  onChange={(e) => setCallDesc(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCallTakerModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all"
                >
                  ৯৯৯ কিউতে যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
