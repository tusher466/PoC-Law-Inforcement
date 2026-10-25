import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sha256 } from '../../lib/hash';
import { HashBadge } from './HashBadge';
import {
  Upload,
  FileText,
  Image,
  Video,
  CheckCircle2,
  Trash2,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface PendingEvidenceFile {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  mime: string;
  sha256: string;
  previewUrl: string;
  capturedAt: string;
  gps?: { lat: number; lng: number; address: string };
}

interface EvidenceUploaderProps {
  onFilesChanged: (files: PendingEvidenceFile[]) => void;
  maxFiles?: number;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  onFilesChanged,
  maxFiles = 5,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<PendingEvidenceFile[]>([]);
  const [isHashing, setIsHashing] = useState(false);

  const processFile = async (rawFile: File) => {
    setIsHashing(true);
    try {
      const buffer = await rawFile.arrayBuffer();
      const hash = await sha256(buffer);
      const previewUrl = rawFile.type.startsWith('image/')
        ? URL.createObjectURL(rawFile)
        : '';

      const pending: PendingEvidenceFile = {
        id: 'evid-pending-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        file: rawFile,
        name: rawFile.name,
        sizeBytes: rawFile.size,
        mime: rawFile.type || 'application/octet-stream',
        sha256: hash,
        previewUrl,
        capturedAt: new Date().toISOString(),
        gps: {
          lat: 23.7465,
          lng: 90.3745,
          address: 'Dhanmondi, Dhaka (EXIF/Device Location)',
        },
      };

      const next = [...files, pending].slice(0, maxFiles);
      setFiles(next);
      onFilesChanged(next);
    } catch (err) {
      console.error('Evidence hashing failed', err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      selected.forEach((f) => processFile(f));
    }
  };

  const handleRemove = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onFilesChanged(next);
  };

  const handleSimulateAttachSample = async () => {
    // Generate a mock evidence item with real SHA-256 for demo convenience
    setIsHashing(true);
    const mockContent = 'DEMO_EVIDENCE_PAYLOAD_' + Date.now();
    const hash = await sha256(mockContent);
    const mockItem: PendingEvidenceFile = {
      id: 'evid-sample-' + Date.now(),
      file: new File([mockContent], 'cctv_snatch_frame_sample.jpg', {
        type: 'image/jpeg',
      }),
      name: 'cctv_snatch_frame_sample.jpg',
      sizeBytes: 194850,
      mime: 'image/jpeg',
      sha256: hash,
      previewUrl: '/sample-evidence/cctv_frame.svg',
      capturedAt: new Date().toISOString(),
      gps: {
        lat: 23.7465,
        lng: 90.3745,
        address: 'Dhanmondi Rd 27, Dhaka',
      },
    };

    const next = [...files, mockItem].slice(0, maxFiles);
    setFiles(next);
    onFilesChanged(next);
    setIsHashing(false);
  };

  return (
    <div className="space-y-3">
      {/* Upload Dropzone */}
      <label className="border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
        <input
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={files.length >= maxFiles || isHashing}
        />

        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <Upload className="w-6 h-6" />
        </div>

        <p className="text-sm font-bold text-slate-800 font-bengali">
          ছবি, ভিডিও বা ডকুমেন্টস ফাইল নির্বাচন করুন
        </p>
        <p className="text-xs text-slate-500 mt-1">
          ফাইল নির্বাচনের সাথে সাথে ব্রাউজারে স্বয়ংক্রিয় SHA-256 হ্যাশ সিল তৈরি হবে
        </p>
      </label>

      {/* Demo sample simulator button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSimulateAttachSample}
          disabled={files.length >= maxFiles || isHashing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>নমুনা সিসিটিভি ছবি যুক্ত করুন (Demo Sample)</span>
        </button>
      </div>

      {/* Uploaded items list */}
      {files.length > 0 && (
        <div className="space-y-2 mt-3">
          {files.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-soft"
            >
              <div className="flex items-start gap-3 min-w-0">
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mb-1">
                    {(item.sizeBytes / 1024).toFixed(1)} KB • {item.mime}
                  </p>
                  <HashBadge sha256={item.sha256} />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
