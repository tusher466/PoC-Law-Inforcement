import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { caseService } from '../../lib/services';
import { ComplaintType } from '../../types';
import { VoiceRecorder } from '../../components/voice/VoiceRecorder';
import { EvidenceUploader, PendingEvidenceFile } from '../../components/evidence/EvidenceUploader';
import { IncidentMap } from '../../components/map/IncidentMap';
import { CaseIdChip } from '../../components/case/CaseIdChip';
import {
  FileText,
  ShieldAlert,
  Smartphone,
  Users,
  Car,
  AlertTriangle,
  Home,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  QrCode,
  Download,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const COMPLAINT_CATEGORIES: {
  type: ComplaintType;
  titleBn: string;
  titleEn: string;
  icon: any;
  isCognizable: boolean;
  descBn: string;
}[] = [
  {
    type: 'theft',
    titleBn: 'চুরি বা ছিনতাই',
    titleEn: 'Theft / Snatching',
    icon: ShieldAlert,
    isCognizable: true,
    descBn: 'মোবাইল, ব্যাগ, টাকা বা যানবাহন ছিনতাই ও চুরি',
  },
  {
    type: 'cyber_fraud',
    titleBn: 'সাইবার ও আর্থিক প্রতারণা',
    titleEn: 'Cyber & Financial Fraud',
    icon: Smartphone,
    isCognizable: true,
    descBn: 'বিকাশ/নগদ ওটিপি জালিয়াতি, ভুয়া ওয়েবসাইট বা হ্যাকিং',
  },
  {
    type: 'harassment',
    titleBn: 'হয়রানি ও সাইবার বুলিং',
    titleEn: 'Harassment & Bullying',
    icon: AlertTriangle,
    isCognizable: true,
    descBn: 'সামাজিক মাধ্যমে অপপ্রচার, ব্ল্যাকমেইল বা পথরোধ',
  },
  {
    type: 'lost_item',
    titleBn: 'হারানো বিজ্ঞপ্তি',
    titleEn: 'Lost Document / Item',
    icon: FileText,
    isCognizable: false,
    descBn: 'এনআইডি, সার্টিফিকেট, পাসপোর্ট বা প্রয়োজনীয় দলিলপত্র',
  },
  {
    type: 'missing_person',
    titleBn: 'নিখোঁজ সংবাদ',
    titleEn: 'Missing Person',
    icon: Users,
    isCognizable: true,
    descBn: 'পরিবারের কোনো সদস্য বা শিশু নিখোঁজ সংক্রান্ত জিডি',
  },
  {
    type: 'road_accident',
    titleBn: 'সড়ক দুর্ঘটনা',
    titleEn: 'Road Accident',
    icon: Car,
    isCognizable: true,
    descBn: 'গাড়ি দুর্ঘটনা, ধাক্কা বা ক্ষয়ক্ষতির প্রাথমিক এজাহার',
  },
  {
    type: 'extortion',
    titleBn: 'চাঁদাবাজি ও হুমকি',
    titleEn: 'Extortion & Threat',
    icon: ShieldAlert,
    isCognizable: true,
    descBn: 'ব্যবসায় বা বাড়ি নির্মাণে চাঁদা দাবি ও ভীতি প্রদর্শন',
  },
  {
    type: 'domestic_violence',
    titleBn: 'পারিবারিক সহিংসতা',
    titleEn: 'Domestic Violence',
    icon: Home,
    isCognizable: true,
    descBn: 'পারিবারিক নির্যাতন ও শারীরিক নিরাপত্তাহীনতা',
  },
];

export const FileGD: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const stations = useAppStore((s) => s.stations);
  const language = useAuthStore((s) => s.language);

  // Wizard Step (1 to 4)
  const [step, setStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<ComplaintType>('theft');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('2026-10-24T11:30');
  const [location, setLocation] = useState({
    lat: 23.7465,
    lng: 90.3745,
    address: 'রোড নং ২৭, ধানমন্ডি আ/এ, ঢাকা',
  });
  const [selectedStation, setSelectedStation] = useState('dhanmondi');
  const [attachedFiles, setAttachedFiles] = useState<PendingEvidenceFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCaseId, setCreatedCaseId] = useState<string | null>(null);

  const selectedCategoryObj = COMPLAINT_CATEGORIES.find((c) => c.type === selectedType);

  const handleVoiceTranscript = (text: string, suggestedTitle?: string, suggestedType?: string) => {
    setDescription(text);
    if (suggestedTitle && !title) {
      setTitle(suggestedTitle);
    }
    if (suggestedType) {
      setSelectedType(suggestedType as ComplaintType);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const evidenceIds = attachedFiles.map((f) => f.id);
      const newCase = await caseService.fileComplaint({
        type: selectedType,
        title: title || `${selectedCategoryObj?.titleBn || 'অভিযোগ'} - ${location.address.slice(0, 20)}`,
        description,
        channel: 'voice',
        citizenName: user.name,
        citizenPhone: user.phone,
        stationId: selectedStation,
        location,
        evidenceIds,
      });

      // Register attached evidence in vault
      for (const f of attachedFiles) {
        await useAppStore.getState().addEvidence({
          id: f.id,
          caseId: newCase.id,
          fileName: f.name,
          mime: f.mime,
          sizeBytes: f.sizeBytes,
          sha256: f.sha256,
          capturedAt: f.capturedAt,
          gps: f.gps,
          uploadedBy: user.name,
          previewUrl: f.previewUrl,
          itemDescription: `নাগরিক আপলোডকৃত ডিজিটাল আলামত (${f.name})`,
          custodyChain: [
            {
              index: 0,
              from: `${user.name} (নাগরিক অনলাইন)`,
              to: 'সেন্ট্রাল ডিজিটাল এভিডেন্স ভল্ট',
              reason: 'জিডি অন্তর্ভুক্তির সময় সরাসরি আপলোড ও ক্রিপ্টোগ্রাফিক হ্যাশ সিঙ্ক',
              at: new Date().toISOString(),
              prevHash: 'GENESIS_CUSTODY_BLOCK',
              hash: f.sha256,
            },
          ],
        });
      }

      setCreatedCaseId(newCase.id);
      setStep(4); // Success screen
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 font-bengali">
          <span className={step >= 1 ? 'text-brand-600 font-extrabold' : ''}>
            ১. {t('fileGd.step1')}
          </span>
          <span className={step >= 2 ? 'text-brand-600 font-extrabold' : ''}>
            ২. {t('fileGd.step2')}
          </span>
          <span className={step >= 3 ? 'text-brand-600 font-extrabold' : ''}>
            ৩. {t('fileGd.step3')}
          </span>
          <span className={step >= 4 ? 'text-brand-600 font-extrabold' : ''}>
            ৪. {t('fileGd.step4')}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Select Complaint Type */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-bengali">
              অভিযোগের ধরন নির্বাচন করুন
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনার ঘটনার সাথে সবচেয়ে উপযুক্ত ক্যাটাগরি বেছে নিন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {COMPLAINT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedType === cat.type;

              return (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => setSelectedType(cat.type)}
                  className={`p-4 rounded-3xl border text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-200 shadow-card'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-soft'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 ${
                      isSelected
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                      {language === 'bn' ? cat.titleBn : cat.titleEn}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-bengali">
                      {cat.descBn}
                    </p>
                    {cat.isCognizable && (
                      <span className="inline-block mt-1.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                        আমলযোগ্য অপরাধ (FIR)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Incident Details, Bangla Voice Input & Map Location */}
      {step === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-bengali">
              ঘটনার বিবরণ ও অবস্থান
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              মুখে বাংলায় বলে অথবা কীবোর্ডে টাইপ করে বিস্তারিত লিখুন
            </p>
          </div>

          {/* FIR Advisory Banner if Cognizable */}
          {selectedCategoryObj?.isCognizable && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold font-bengali block">
                  {t('fileGd.firAdvisoryTitle')}
                </strong>
                <p className="mt-0.5 text-amber-800 font-bengali leading-relaxed">
                  {t('fileGd.firAdvisoryDesc')}
                </p>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-bengali">
              {t('fileGd.titleLabel')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="যেমন: ধানমন্ডি ২৭ নম্বরে মোবাইল ও মানিব্যাগ ছিনতাই"
              className="w-full bg-white border border-slate-200 focus:border-brand-500 rounded-2xl p-3 text-xs sm:text-sm text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>

          {/* Voice Input Recorder Component */}
          <VoiceRecorder
            onTranscriptReady={handleVoiceTranscript}
            initialText={description}
          />

          {/* Location & Map Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 font-bengali flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>{t('fileGd.locationLabel')}</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  setLocation({
                    lat: 23.7465,
                    lng: 90.3745,
                    address: 'রোড নং ২৭, ধানমন্ডি, ঢাকা (বর্তমান অবস্থান)',
                  })
                }
                className="text-[11px] font-bold text-brand-600 hover:underline"
              >
                {t('fileGd.useMyLocation')}
              </button>
            </div>

            <IncidentMap
              centerLat={location.lat}
              centerLng={location.lng}
              onLocationSelected={(lat, lng, address) =>
                setLocation({ lat, lng, address })
              }
            />

            <input
              type="text"
              value={location.address}
              onChange={(e) =>
                setLocation({ ...location, address: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bengali focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="ঘটনাস্থলের ঠিকানা লিখুন..."
            />

            {/* Nearest Thana selector */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 font-bengali font-bold">
                {t('fileGd.nearestStation')}:
              </span>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 font-bengali"
              >
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameBn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-bold px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!description.trim()}
              className="inline-flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
            >
              <span>পরবর্তী ধাপ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Attach Digital Evidence with Instant SHA-256 */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-bengali">
              {t('fileGd.step3')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              সিসিটিভি ফুটেজ, ছবি, ট্রানজেকশন স্ক্রিনশট বা রশিদ সংযুক্ত করুন
            </p>
          </div>

          <EvidenceUploader onFilesChanged={(files) => setAttachedFiles(files)} />

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 font-bengali leading-relaxed space-y-1">
            <strong className="text-slate-800 block">
              ক্রিপ্টোগ্রাফিক সুরক্ষা নিশ্চয়তা:
            </strong>
            <p>
              সংযুক্ত প্রতিটি ফাইলের একটি অদ্বিতীয় গাণিতিক ফিঙ্গারপ্রিন্ট (SHA-256) অবিলম্বে তৈরি হয় এবং অপরিবর্তনীয় অডিট চেইনে সংরক্ষিত হয়। পরবর্তীতে কেউ প্রমাণ বদলালে তা শনাক্ত হবে।
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-bold px-4 py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্ববর্তী</span>
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
            >
              {isSubmitting ? (
                <span>দাখিল হচ্ছে...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('fileGd.submitBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Registration Success with Unique Case ID, QR, and SMS preview */}
      {step === 4 && createdCaseId && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-card text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-bengali">
              {t('fileGd.successTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-bengali">
              আপনার অভিযোগটি সংশ্লিষ্ট থানায় নথিভুক্ত হয়েছে এবং তদন্ত কর্মকর্তা নিয়োগের প্রক্রিয়া শুরু হয়েছে।
            </p>
          </div>

          {/* Big Unique Case ID Banner */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 max-w-sm mx-auto space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-bengali">
              {t('fileGd.caseIdLabel')}
            </span>
            <div className="flex items-center justify-center">
              <CaseIdChip caseId={createdCaseId} showQrModal={false} />
            </div>
            <p className="text-[11px] text-slate-500 font-bengali">
              ভবিষ্যতে যেকোনো অনুসন্ধান ও আদালতের জন্য এই নম্বরটি সংরক্ষণ করুন।
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 inline-block shadow-inner">
            <QRCodeSVG
              value={`https://nyayasetu.gov.bd/track?case=${createdCaseId}`}
              size={130}
              level="M"
            />
          </div>

          {/* SMS Sent Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 max-w-md mx-auto text-xs text-emerald-950 font-bengali flex items-center gap-2 text-left">
            <Smartphone className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{t('fileGd.smsSentNotice')}</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/citizen/case/${createdCaseId}`)}
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-card transition-all"
            >
              {t('fileGd.trackNow')}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-2xl text-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>{t('fileGd.downloadPdf')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
