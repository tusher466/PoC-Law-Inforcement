import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { ROLE_CONFIGS } from '../../lib/rbac';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  Archive,
  Search,
  Radio,
  Building2,
  MapPin,
  ShieldCheck,
  Megaphone,
  Database,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

export const OfficerShell: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentRole = useAuthStore((s) => s.currentRole);
  const language = useAuthStore((s) => s.language);

  const roleCfg = ROLE_CONFIGS[currentRole];

  // Permitted nav items mapping
  const allNavItems = [
    {
      to: '/officer',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
      end: true,
      roles: ['oc', 'io'],
    },
    {
      to: '/officer/queue',
      label: t('nav.queue'),
      icon: Inbox,
      roles: ['oc', 'io'],
    },
    {
      to: '/officer/io-assistant',
      label: t('nav.ioAssistant'),
      icon: Sparkles,
      roles: ['oc', 'io'],
    },
    {
      to: '/officer/evidence-room',
      label: t('nav.evidenceRoom'),
      icon: Archive,
      roles: ['oc', 'evidence'],
    },
    {
      to: '/officer/search',
      label: t('nav.integratedSearch'),
      icon: Search,
      roles: ['oc', 'io'],
    },
    {
      to: '/dispatch',
      label: t('nav.dispatchConsole'),
      icon: Radio,
      roles: ['dispatcher', 'oc'],
    },
    {
      to: '/station-dashboard',
      label: t('nav.stationAnalytics'),
      icon: Building2,
      roles: ['oc', 'auditor'],
    },
    {
      to: '/district-analytics',
      label: t('nav.districtAnalytics'),
      icon: MapPin,
      roles: ['oc', 'auditor'],
    },
    {
      to: '/audit',
      label: t('nav.auditLog'),
      icon: ShieldCheck,
      roles: ['oc', 'auditor', 'evidence'],
    },
    {
      to: '/misconduct-reports',
      label: t('nav.misconduct'),
      icon: Megaphone,
      roles: ['auditor'],
    },
    {
      to: '/transparency',
      label: t('nav.openData'),
      icon: Database,
      roles: ['oc', 'io', 'evidence', 'dispatcher', 'auditor'],
    },
  ];

  // Filter items accessible by the current role
  const visibleNavItems = allNavItems.filter((item) =>
    item.roles.includes(currentRole)
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-surface-bg">
      {/* Sidebar Navigation */}
      <aside
        aria-label="Officer console sidebar"
        className={`bg-white border-r border-slate-200 transition-all duration-200 flex flex-col justify-between shrink-0 z-20 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div>
          {/* Header info card */}
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-brand-600 uppercase tracking-wider block">
                  {language === 'bn' ? 'পুলিশিং কনসোল' : 'COMMAND CONSOLE'}
                </span>
                <span className="text-xs font-bold text-slate-800 truncate block">
                  {language === 'bn' ? roleCfg.badgeBn : roleCfg.badgeEn}
                </span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-auto"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Links list */}
          <nav className="p-2 space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-900 border-l-4 border-brand-500'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-600" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        {!collapsed && (
          <div className="p-3 border-t border-slate-100 text-[11px] text-slate-400">
            <p>NyayaSetu CAD & Case Core</p>
            <p className="text-[10px] text-slate-500">Dhaka Metro Command</p>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
