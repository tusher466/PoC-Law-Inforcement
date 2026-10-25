import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CitizenShell } from './components/layout/CitizenShell';
import { OfficerShell } from './components/layout/OfficerShell';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { CitizenHome } from './pages/citizen/CitizenHome';
import { FileGD } from './pages/citizen/FileGD';
import { SosScreen } from './pages/citizen/SosScreen';
import { MyCases } from './pages/citizen/MyCases';
import { CaseDetail } from './pages/citizen/CaseDetail';
import { UploadEvidence } from './pages/citizen/UploadEvidence';
import { RateStation } from './pages/citizen/RateStation';
import { ScamCheck } from './pages/citizen/ScamCheck';
import { Profile } from './pages/citizen/Profile';

import { DigitalCentreKiosk } from './pages/kiosk/DigitalCentreKiosk';

import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { CaseQueue } from './pages/officer/CaseQueue';
import { OfficerCaseDetail } from './pages/officer/OfficerCaseDetail';
import { IoAssistant } from './pages/officer/IoAssistant';
import { EvidenceRoom } from './pages/officer/EvidenceRoom';
import { IntegratedSearch } from './pages/officer/IntegratedSearch';

import { DispatchConsole } from './pages/dispatch/DispatchConsole';

import { StationDashboard } from './pages/command/StationDashboard';
import { DistrictAnalytics } from './pages/command/DistrictAnalytics';
import { AuditLog } from './pages/command/AuditLog';
import { MisconductReports } from './pages/command/MisconductReports';

import { OpenDataPortal } from './pages/transparency/OpenDataPortal';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DemoRolesPage } from './pages/demo/DemoRolesPage';
import { NotFound } from './pages/NotFound';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      // Auth & Dedicated Demo Roles
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'demo-roles',
        element: <DemoRolesPage />,
      },
      // Citizen flow
      {
        path: 'citizen',
        element: <CitizenShell />,
        children: [
          { index: true, element: <CitizenHome /> },
          { path: 'file-gd', element: <FileGD /> },
          { path: 'sos', element: <SosScreen /> },
          { path: 'my-cases', element: <MyCases /> },
          { path: 'case/:caseId', element: <CaseDetail /> },
          { path: 'upload-evidence', element: <UploadEvidence /> },
          { path: 'rate-station', element: <RateStation /> },
          { path: 'scam-check', element: <ScamCheck /> },
          { path: 'profile', element: <Profile /> },
        ],
      },
      // Kiosk assisted mode
      {
        path: 'kiosk',
        element: <DigitalCentreKiosk />,
      },
      // Officer flow
      {
        path: 'officer',
        element: <OfficerShell />,
        children: [
          { index: true, element: <OfficerDashboard /> },
          { path: 'queue', element: <CaseQueue /> },
          { path: 'case/:caseId', element: <OfficerCaseDetail /> },
          { path: 'io-assistant', element: <IoAssistant /> },
          { path: 'evidence-room', element: <EvidenceRoom /> },
          { path: 'search', element: <IntegratedSearch /> },
        ],
      },
      // 999 Dispatch console
      {
        path: 'dispatch',
        element: <DispatchConsole />,
      },
      // Station & District & Reform Dashboards
      {
        path: 'station-dashboard',
        element: <StationDashboard />,
      },
      {
        path: 'district-analytics',
        element: <DistrictAnalytics />,
      },
      {
        path: 'audit',
        element: <AuditLog />,
      },
      {
        path: 'misconduct-reports',
        element: <MisconductReports />,
      },
      {
        path: 'report-misconduct',
        element: <MisconductReports />,
      },
      // Public Open Data Portal
      {
        path: 'transparency',
        element: <OpenDataPortal />,
      },
      // 404
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
