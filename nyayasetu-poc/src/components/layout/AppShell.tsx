import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DemoBanner } from './DemoBanner';
import { Header } from './Header';
import { SmsSimulatorDrawer } from './SmsSimulatorDrawer';
import { GuidedTour } from '../common/GuidedTour';
import { Toast } from '../common/Toast';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

export const AppShell: React.FC = () => {
  const isHighContrast = useAuthStore((s) => s.isHighContrast);
  const isLargeText = useAuthStore((s) => s.isLargeText);
  const stepPatrolSimulationLoop = useAppStore((s) => s.stepPatrolSimulationLoop);
  const toast = useAppStore((s) => s.toast);
  const clearToast = useAppStore((s) => s.clearToast);

  // Apply accessibility classes
  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (isLargeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [isHighContrast, isLargeText]);

  // Live GPS movement loop for Dhaka patrol units (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      stepPatrolSimulationLoop();
    }, 5000);
    return () => clearInterval(interval);
  }, [stepPatrolSimulationLoop]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-bg text-slate-800 font-sans selection:bg-brand-100 selection:text-brand-900">
      {/* Top Demo Banner */}
      <DemoBanner />

      {/* Main Global Header */}
      <Header />

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Interactive SMS Drawer Simulator */}
      <SmsSimulatorDrawer />

      {/* Interactive 8-step Guided Tour Overlay */}
      <GuidedTour />

      {/* Global Interactive Notification Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  );
};
