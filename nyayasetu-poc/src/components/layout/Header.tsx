import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { LangToggle } from './LangToggle';
import { RoleSwitcher } from './RoleSwitcher';
import {
  Smartphone,
  Eye,
  Sparkles,
  LogIn,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const setSmsDrawerOpen = useAppStore((s) => s.setSmsDrawerOpen);
  const smsList = useAppStore((s) => s.smsList);
  const setTourStep = useAppStore((s) => s.setTourStep);
  const isHighContrast = useAuthStore((s) => s.isHighContrast);
  const setHighContrast = useAuthStore((s) => s.setHighContrast);
  const language = useAuthStore((s) => s.language);

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-surface-border shadow-soft transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-brand-500 rounded-xl p-1"
          aria-label="NyayaSetu Home"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-card group-hover:scale-105 transition-transform">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18" />
              <path d="M6 7l6-3 6 3" />
              <path d="M3 13l3-6 3 6a3 3 0 0 1-6 0z" />
              <path d="M15 13l3-6 3 6a3 3 0 0 1-6 0z" />
              <path d="M4 21h16" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-brand-900 tracking-tight font-bengali">
                {t('app.name')}
              </span>
              <span className="text-xs font-bold text-tealAccent-500 uppercase tracking-widest hidden sm:inline">
                NyayaSetu
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-1 hidden md:block font-bengali">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Demo Roles Page Trigger */}
          <Link
            to="/demo-roles"
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] border shadow-sm ${
              location.pathname === '/demo-roles'
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
            title="সকল ডেমো ভূমিকা দেখুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{language === 'bn' ? 'ডেমো ভূমিকা' : 'Demo Roles'}</span>
          </Link>

          {/* Guided Tour Trigger */}
          <button
            onClick={() => setTourStep(0)}
            className="hidden lg:inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] shadow-sm"
            title="Start Guided Demo Walkthrough"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>{t('app.tourBtn')}</span>
          </button>

          {/* Login Link */}
          <Link
            to="/login"
            className={`hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[40px] border ${
              location.pathname === '/login' || location.pathname === '/register'
                ? 'bg-brand-50 text-brand-900 border-brand-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="লগইন পোর্টাল"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'bn' ? 'লগইন' : 'Login'}</span>
          </Link>

          {/* SMS Simulator Drawer Button */}
          <button
            onClick={() => setSmsDrawerOpen(true)}
            className="relative inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[40px] border border-slate-200"
            title="Open Simulated SMS Phone Outbox"
            aria-label="Open SMS Simulator"
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">{t('app.smsDrawer')}</span>
            {smsList.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {smsList.length}
              </span>
            )}
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!isHighContrast)}
            className={`p-2 rounded-xl border transition-all min-h-[40px] min-w-[40px] flex items-center justify-center ${
              isHighContrast
                ? 'bg-slate-900 text-amber-300 border-slate-900'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title="Toggle High Contrast for WCAG AA Accessibility"
            aria-label="High contrast mode"
            aria-pressed={isHighContrast}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <LangToggle />

          {/* Role Switcher */}
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
};
