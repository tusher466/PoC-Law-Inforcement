import { Role } from '../types';

export interface RoleConfig {
  id: Role;
  nameBn: string;
  nameEn: string;
  badgeBn: string;
  badgeEn: string;
  defaultPath: string;
  descriptionBn: string;
  descriptionEn: string;
  allowedPaths: string[];
  permissions: {
    canFileGD: boolean;
    canTriggerSOS: boolean;
    canKioskRegister: boolean;
    canAssignIO: boolean;
    canUpdateCaseStage: boolean;
    canAddCaseDiary: boolean;
    canManageEvidenceVault: boolean;
    canDispatchUnits: boolean;
    canViewAuditChain: boolean;
    canViewOpenData: boolean;
    canViewMisconduct: boolean;
    canSearchRestrictedDatabases: boolean;
  };
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  citizen: {
    id: 'citizen',
    nameBn: 'নাগরিক (রহিমা খাতুন)',
    nameEn: 'Citizen (Rahima Khatun)',
    badgeBn: 'নাগরিক',
    badgeEn: 'Citizen',
    defaultPath: '/citizen',
    descriptionBn: 'অভিযোগ দায়ের, কেস ট্র্যাকিং, ডিজিটাল আলামত আপলোড ও জরুরি ৯৯৯ এসওএস সেবা।',
    descriptionEn: 'File complaints, track cases, upload evidence, and trigger emergency SOS.',
    allowedPaths: [
      '/citizen',
      '/citizen/file-gd',
      '/citizen/sos',
      '/citizen/my-cases',
      '/citizen/case',
      '/citizen/upload-evidence',
      '/citizen/rate-station',
      '/citizen/scam-check',
      '/citizen/profile',
      '/transparency',
      '/report-misconduct',
    ],
    permissions: {
      canFileGD: true,
      canTriggerSOS: true,
      canKioskRegister: false,
      canAssignIO: false,
      canUpdateCaseStage: false,
      canAddCaseDiary: false,
      canManageEvidenceVault: false,
      canDispatchUnits: false,
      canViewAuditChain: false,
      canViewOpenData: true,
      canViewMisconduct: false,
      canSearchRestrictedDatabases: false,
    },
  },

  operator: {
    id: 'operator',
    nameBn: 'ডিজিটাল সেন্টার অপারেটর (ইউনিয়ন/পৌরসভা)',
    nameEn: 'Digital Centre Operator (Union/Ward)',
    badgeBn: 'ইউনিয়ন অপারেটর',
    badgeEn: 'Kiosk Operator',
    defaultPath: '/kiosk',
    descriptionBn: 'স্মার্টফোনবিহীন প্রান্তিক নাগরিকদের পক্ষে সরাসরি জিডি নিবন্ধন ও প্রিন্ট রসিদ প্রদান।',
    descriptionEn: 'Assisted GD filing on behalf of citizens without smartphones & printable receipts.',
    allowedPaths: ['/kiosk', '/transparency'],
    permissions: {
      canFileGD: true,
      canTriggerSOS: false,
      canKioskRegister: true,
      canAssignIO: false,
      canUpdateCaseStage: false,
      canAddCaseDiary: false,
      canManageEvidenceVault: false,
      canDispatchUnits: false,
      canViewAuditChain: false,
      canViewOpenData: true,
      canViewMisconduct: false,
      canSearchRestrictedDatabases: false,
    },
  },

  oc: {
    id: 'oc',
    nameBn: 'ভারপ্রাপ্ত কর্মকর্তা / ওসি (ধানমন্ডি মডেল থানা)',
    nameEn: 'Duty Officer / Station OC (Dhanmondi)',
    badgeBn: 'থানার ওসি',
    badgeEn: 'Station OC',
    defaultPath: '/officer',
    descriptionBn: 'থানার সকল অভিযোগ মনিটরিং, এসএলএ ওভারভিউ, দ্রুত তদন্ত কর্মকর্তা নিয়োগ ও তদারকি।',
    descriptionEn: 'Monitor incoming complaints, SLA compliance, assign IOs, and review precinct analytics.',
    allowedPaths: [
      '/officer',
      '/officer/queue',
      '/officer/case',
      '/officer/io-assistant',
      '/officer/evidence-room',
      '/officer/search',
      '/station-dashboard',
      '/transparency',
    ],
    permissions: {
      canFileGD: false,
      canTriggerSOS: false,
      canKioskRegister: false,
      canAssignIO: true,
      canUpdateCaseStage: true,
      canAddCaseDiary: true,
      canManageEvidenceVault: true,
      canDispatchUnits: false,
      canViewAuditChain: true,
      canViewOpenData: true,
      canViewMisconduct: false,
      canSearchRestrictedDatabases: true,
    },
  },

  io: {
    id: 'io',
    nameBn: 'তদন্ত কর্মকর্তা - আইও (এসআই মাহমুদুল হাসান)',
    nameEn: 'Investigating Officer - IO (SI Mahmud)',
    badgeBn: 'তদন্ত কর্মকর্তা',
    badgeEn: 'Investigating Officer',
    defaultPath: '/officer/queue',
    descriptionBn: 'এসাইনকৃত কেস তদন্ত, ডিজিটাল কেস ডায়েরি লেখা, আইনি ধারা বিশ্লেষণ ও চার্জশিট প্রস্তুতি।',
    descriptionEn: 'Handle assigned cases, generate case diary entries, legal section mapping, checklist.',
    allowedPaths: [
      '/officer',
      '/officer/queue',
      '/officer/case',
      '/officer/io-assistant',
      '/officer/search',
      '/transparency',
    ],
    permissions: {
      canFileGD: false,
      canTriggerSOS: false,
      canKioskRegister: false,
      canAssignIO: false,
      canUpdateCaseStage: true,
      canAddCaseDiary: true,
      canManageEvidenceVault: false,
      canDispatchUnits: false,
      canViewAuditChain: false,
      canViewOpenData: true,
      canViewMisconduct: false,
      canSearchRestrictedDatabases: true,
    },
  },

  evidence: {
    id: 'evidence',
    nameBn: 'আলামত কর্মকর্তা / মালখানা ইনচার্জ',
    nameEn: 'Evidence Room Officer (Malkhana)',
    badgeBn: 'মালখানা ইনচার্জ',
    badgeEn: 'Evidence Custodian',
    defaultPath: '/officer/evidence-room',
    descriptionBn: 'জব্দকৃত বস্তু নিবন্ধন, সুরক্ষিত কিউআর ট্যাগিং ও ক্রিপ্টোগ্রাফিক ডিজিটাল চেইন অফ কাস্টডি।',
    descriptionEn: 'Seized items custody ledger, printable QR labels, and SHA-256 custody chain.',
    allowedPaths: [
      '/officer/evidence-room',
      '/officer/case',
      '/transparency',
    ],
    permissions: {
      canFileGD: false,
      canTriggerSOS: false,
      canKioskRegister: false,
      canAssignIO: false,
      canUpdateCaseStage: false,
      canAddCaseDiary: false,
      canManageEvidenceVault: true,
      canDispatchUnits: false,
      canViewAuditChain: true,
      canViewOpenData: true,
      canViewMisconduct: false,
      canSearchRestrictedDatabases: false,
    },
  },

  dispatcher: {
    id: 'dispatcher',
    nameBn: '৯৯৯ জাতীয় জরুরি সেবা ডিসপ্যাচার',
    nameEn: '999 Dispatcher (National CAD)',
    badgeBn: '৯৯৯ ডিসপ্যাচ',
    badgeEn: '999 Dispatcher',
    defaultPath: '/dispatch',
    descriptionBn: 'জরুরি কল ও এসওএস গ্রহণ, জিপিএস ভিত্তিক নিকটতম প্যাট্রোল টিমকে স্মার্ট রুট নির্দেশনা।',
    descriptionEn: 'Emergency call intake, real-time map, smart nearest-unit dispatch & patrol tablet.',
    allowedPaths: ['/dispatch', '/transparency'],
    permissions: {
      canFileGD: false,
      canTriggerSOS: false,
      canKioskRegister: false,
      canAssignIO: false,
      canUpdateCaseStage: false,
      canAddCaseDiary: false,
      canManageEvidenceVault: false,
      canDispatchUnits: true,
      canViewAuditChain: false,
      canViewOpenData: true,
      canViewMisconduct: false,
      canSearchRestrictedDatabases: false,
    },
  },

  auditor: {
    id: 'auditor',
    nameBn: 'সংস্কার পর্যবেক্ষক / অভ্যন্তরীণ নিরীক্ষক',
    nameEn: 'Reform Auditor / Police Oversight',
    badgeBn: 'নিরীক্ষক ও মানবাধিকার',
    badgeEn: 'Reform Auditor',
    defaultPath: '/audit',
    descriptionBn: 'অপরিবর্তনীয় ক্রিপ্টোগ্রাফিক অডিট লগ নিরীক্ষা, গোপনীয় অসদাচরণ অভিযোগ ও স্বচ্ছতা ড্যাশবোর্ড।',
    descriptionEn: 'Immutable audit log verification, anonymous misconduct review, and open data oversight.',
    allowedPaths: [
      '/audit',
      '/district-analytics',
      '/station-dashboard',
      '/misconduct-reports',
      '/transparency',
    ],
    permissions: {
      canFileGD: false,
      canTriggerSOS: false,
      canKioskRegister: false,
      canAssignIO: false,
      canUpdateCaseStage: false,
      canAddCaseDiary: false,
      canManageEvidenceVault: false,
      canDispatchUnits: false,
      canViewAuditChain: true,
      canViewOpenData: true,
      canViewMisconduct: true,
      canSearchRestrictedDatabases: false,
    },
  },
};

/**
 * Validates if a role is authorized to access a given URL path
 */
export function isPathAllowedForRole(role: Role, path: string): boolean {
  if (
    path === '/' ||
    path.startsWith('/transparency') ||
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/demo-roles')
  ) {
    return true;
  }
  const config = ROLE_CONFIGS[role];
  if (!config) return false;

  return config.allowedPaths.some((allowed) =>
    path === allowed || path.startsWith(allowed + '/')
  );
}
