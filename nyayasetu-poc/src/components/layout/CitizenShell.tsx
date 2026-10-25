import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  FilePlus,
  AlertOctagon,
  FolderLock,
  User,
} from 'lucide-react';

export const CitizenShell: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { to: '/citizen', label: t('nav.home'), icon: Home, end: true },
    { to: '/citizen/file-gd', label: t('nav.fileGd'), icon: FilePlus },
    { to: '/citizen/sos', label: t('nav.sos'), icon: AlertOctagon, isSos: true },
    { to: '/citizen/my-cases', label: t('nav.myCases'), icon: FolderLock },
    { to: '/citizen/profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between pb-20 md:pb-6">
      {/* Main citizen viewport */}
      <main className="flex-1 max-w-lg md:max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4">
        <Outlet />
      </main>

      {/* Mobile-first Bottom Navigation Bar */}
      <nav
        aria-label="Citizen mobile navigation"
        className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-lg px-2 py-1.5 md:hidden"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all min-h-[48px] ${
                    item.isSos
                      ? 'text-alertRed hover:text-alertRed-dark font-extrabold'
                      : isActive
                      ? 'text-brand-600 font-bold bg-brand-50/70'
                      : 'text-slate-500 hover:text-slate-900 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`relative p-1 rounded-lg ${
                        item.isSos ? 'bg-red-100 text-alertRed animate-pulse' : ''
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.isSos ? 'stroke-[2.5]' : ''}`} />
                    </div>
                    <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px] text-center font-bengali">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Desktop tablet top sub-navigation for citizen view */}
      <nav
        aria-label="Citizen desktop sub navigation"
        className="hidden md:flex justify-center max-w-xl mx-auto my-4 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-soft"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  item.isSos
                    ? 'text-alertRed hover:bg-red-50'
                    : isActive
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
