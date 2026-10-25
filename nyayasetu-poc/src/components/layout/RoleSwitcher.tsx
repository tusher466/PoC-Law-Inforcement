import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Role } from '../../types';
import { ROLE_CONFIGS } from '../../lib/rbac';
import {
  User,
  Store,
  BadgeAlert,
  ShieldCheck,
  Archive,
  Radio,
  FileCheck2,
  ChevronDown,
  Check,
} from 'lucide-react';

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  citizen: <User className="w-4 h-4 text-emerald-600" />,
  operator: <Store className="w-4 h-4 text-teal-600" />,
  oc: <BadgeAlert className="w-4 h-4 text-blue-600" />,
  io: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
  evidence: <Archive className="w-4 h-4 text-purple-600" />,
  dispatcher: <Radio className="w-4 h-4 text-red-600" />,
  auditor: <FileCheck2 className="w-4 h-4 text-amber-600" />,
};

export const RoleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentRole = useAuthStore((s) => s.currentRole);
  const setRole = useAuthStore((s) => s.setRole);
  const language = useAuthStore((s) => s.language);

  const activeConfig = ROLE_CONFIGS[currentRole];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (roleKey: Role) => {
    setRole(roleKey);
    setIsOpen(false);
    const targetPath = ROLE_CONFIGS[roleKey].defaultPath;
    navigate(targetPath);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shadow-soft transition-all min-h-[40px] focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Switch demonstration role"
      >
        <span className="p-1 rounded-md bg-slate-100">{ROLE_ICONS[currentRole]}</span>
        <div className="text-left hidden md:block">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            {language === 'bn' ? 'বর্তমান ভূমিকা' : 'Role'}
          </div>
          <div className="text-xs font-bold text-slate-900 leading-tight">
            {language === 'bn' ? activeConfig.badgeBn : activeConfig.badgeEn}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white shadow-elevated border border-slate-200 z-50 py-2 focus:outline-none animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900">
              {language === 'bn' ? 'ডেমো ভূমিকা পরিবর্তন করুন' : 'Select Demo Role'}
            </p>
            <p className="text-[11px] text-slate-500">
              {language === 'bn'
                ? 'পাসওয়ার্ড ছাড়াই যেকোনো প্রোফাইলে পরিবর্তন করে দেখুন'
                : 'Instantly view the system from any stakeholder perspective'}
            </p>
          </div>

          <div className="max-h-[360px] overflow-y-auto py-1">
            {(Object.keys(ROLE_CONFIGS) as Role[]).map((rKey) => {
              const cfg = ROLE_CONFIGS[rKey];
              const isSelected = rKey === currentRole;

              return (
                <button
                  key={rKey}
                  onClick={() => handleRoleSelect(rKey)}
                  className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                    isSelected ? 'bg-brand-50/80 text-brand-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                  role="menuitem"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {ROLE_ICONS[rKey]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {language === 'bn' ? cfg.nameBn : cfg.nameEn}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {language === 'bn' ? cfg.descriptionBn : cfg.descriptionEn}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/demo-roles');
              }}
              className="w-full text-center text-xs font-bold text-brand-600 hover:text-brand-800 py-1.5 px-3 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{language === 'bn' ? 'সকল ভূমিকা বিস্তারিত হাব দেখুন →' : 'View Full Demo Roles Hub →'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
