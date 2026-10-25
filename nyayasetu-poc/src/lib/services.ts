import {
  Case,
  Evidence,
  Unit,
  Incident,
  ComplaintType,
  CaseStage,
  Priority,
  Role,
} from '../types';
import { useAppStore } from '../store/useAppStore';

const delay = (ms: number = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Case Service - Core API adapter for filing, retrieving, and updating legal cases
 */
export const caseService = {
  async getCases(filters?: {
    stationId?: string;
    status?: CaseStage;
    priority?: Priority;
  }): Promise<Case[]> {
    await delay(300);
    let list = useAppStore.getState().cases;
    if (filters?.stationId) {
      list = list.filter((c) => c.stationId === filters.stationId);
    }
    if (filters?.status) {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.priority) {
      list = list.filter((c) => c.priority === filters.priority);
    }
    return list;
  },

  async getCaseById(caseId: string): Promise<Case | undefined> {
    await delay(250);
    return useAppStore.getState().cases.find((c) => c.id === caseId);
  },

  async fileComplaint(payload: {
    type: ComplaintType;
    title: string;
    description: string;
    channel: 'app' | 'voice' | 'kiosk';
    citizenName: string;
    citizenPhone: string;
    stationId: string;
    location: { lat: number; lng: number; address: string };
    evidenceIds: string[];
  }): Promise<Case> {
    await delay(450);
    const store = useAppStore.getState();
    const year = new Date().getFullYear();
    const seq = String(Math.floor(100000 + Math.random() * 900000));
    const caseId = `NS-${year}-DHK-${seq}`;
    const now = new Date().toISOString();
    const slaDue = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();

    const newCase: Case = {
      id: caseId,
      type: payload.type,
      title: payload.title,
      description: payload.description,
      language: 'bn',
      status: 'filed',
      priority: 'high',
      urgent: false,
      channel: payload.channel,
      citizenId: 'cit-' + Date.now(),
      citizenName: payload.citizenName,
      citizenPhone: payload.citizenPhone,
      stationId: payload.stationId,
      location: payload.location,
      createdAt: now,
      slaDueAt: slaDue,
      timeline: [
        {
          id: 'tl-' + Date.now(),
          caseId,
          stage: 'filed',
          note: `অভিযোগ প্রাথমিক সিস্টেমভুক্ত হয়েছে (${payload.channel.toUpperCase()} মাধ্যম)।`,
          actorRole: payload.channel === 'kiosk' ? 'operator' : 'citizen',
          actorName: payload.citizenName,
          at: now,
        },
      ],
      evidenceIds: payload.evidenceIds,
      diary: [],
    };

    await store.addCase(newCase);
    return newCase;
  },
};

/**
 * Evidence Service - Cryptographic vault adapter
 */
export const evidenceService = {
  async getEvidenceForCase(caseId: string): Promise<Evidence[]> {
    await delay(200);
    return useAppStore.getState().evidence.filter((e) => e.caseId === caseId);
  },

  async registerEvidence(evidence: Evidence): Promise<void> {
    await delay(400);
    await useAppStore.getState().addEvidence(evidence);
  },

  async transferCustody(
    evidenceId: string,
    from: string,
    to: string,
    reason: string,
    actorRole: Role
  ): Promise<void> {
    await delay(400);
    await useAppStore
      .getState()
      .transferEvidenceCustody(evidenceId, from, to, reason, actorRole);
  },
};

/**
 * Dispatch Service - 999 CAD connector
 */
export const dispatchService = {
  async triggerSos(
    citizenName: string,
    phone: string,
    lat: number,
    lng: number,
    address: string
  ): Promise<string> {
    await delay(300);
    return useAppStore
      .getState()
      .triggerSos(citizenName, phone, lat, lng, address);
  },

  async dispatchUnit(unitId: string, incidentId: string): Promise<void> {
    await delay(350);
    await useAppStore.getState().assignUnitToIncident(unitId, incidentId);
  },
};

/**
 * Integrated Search Service (mock adapters for CDMS, CIMS, BRTA, Prison, Court)
 */
export interface SearchResultItem {
  id: string;
  source: 'CDMS' | 'CIMS' | 'BRTA' | 'PRISON' | 'COURT';
  title: string;
  subtitle: string;
  matchField: string;
  details: Record<string, string>;
  isRestricted: boolean;
  adapterStatus: 'Planned Phase 3 Adapter (Mocked)';
}

export const searchService = {
  async performIntegratedSearch(
    query: string,
    justification: string,
    actorRole: Role
  ): Promise<SearchResultItem[]> {
    await delay(500);

    // Audit log the search justification
    await useAppStore
      .getState()
      .appendAuditEntry(
        actorRole,
        'INTEGRATED_SEARCH_EXECUTE',
        query,
        `Query: "${query}". Justification: "${justification}". Lawful search verification recorded.`
      );

    const clean = query.trim().toLowerCase();

    // Mock search responses grouped by national repositories
    const results: SearchResultItem[] = [
      {
        id: 'cdms-01',
        source: 'CDMS',
        title: 'ওয়ারেন্ট ও পূর্ববর্তী অপরাধ রেকর্ড (CDMS)',
        subtitle: 'অপরাধী ডাটাবেজ ম্যাচ: মো. রফিকুল ইসলাম (পিতা: করিমুল্লাহ)',
        matchField: 'মোবাইল / জাতীয় পরিচয়পত্র / নাম',
        details: {
          'রেকর্ড স্ট্যাটাস': 'সক্রিয় ওয়ারেন্ট নং ডব্লিউ-৯৮/২৬ (ধানমন্ডি থানা)',
          'অভিযোগ ধারা': 'দণ্ডবিধি ৩৯২ / ৪১১ (চোরাইমাল গ্রহণ)',
          'আদালত': 'মেট্রোপলিটন ম্যাজিস্ট্রেট কোর্ট ৪, ঢাকা',
          'পূর্ববর্তী জিডি সংখ্যা': '২টি নিষ্পত্তি',
        },
        isRestricted: true,
        adapterStatus: 'Planned Phase 3 Adapter (Mocked)',
      },
      {
        id: 'cims-01',
        source: 'CIMS',
        title: 'সিটিজেন ইনফরমেশন ম্যানেজমেন্ট সিস্টেম (CIMS - ভাড়াটিয়া তথ্য)',
        subtitle: 'ভাড়াটিয়া ও আবাসন নিবন্ধন ডাটাবেজ',
        matchField: 'ঠিকানা ও জাতীয় পরিচয়পত্র',
        details: {
          'বর্তমান ঠিকানা': 'বাসা নং ৪২, রোড ৭এ, ধানমন্ডি, ঢাকা',
          'বাড়ির মালিক': 'এম. এ. জলিল (এনআইডি যাচাইকৃত)',
          'পেশা': 'প্রাইভেট সার্ভিস',
          'পরিবার সদস্য সংখ্যা': '৩ জন',
        },
        isRestricted: true,
        adapterStatus: 'Planned Phase 3 Adapter (Mocked)',
      },
      {
        id: 'brta-01',
        source: 'BRTA',
        title: 'বাংলাদেশ সড়ক পরিবহন কর্তৃপক্ষ (BRTA ভেহিকেল রেজিস্ট্রি)',
        subtitle: 'যানবাহন মালিকানা ও ফিটনেস ট্র্যাকিং',
        matchField: 'মোটরসাইকেল ও গাড়ি নম্বর প্লেট',
        details: {
          'রেজিস্ট্রেশন নম্বর': 'ঢাকা মেট্রো-হ-১২-৩৪৫৬',
          'মডেল ও সিসি': 'Bajaj Pulsar 150cc (Black/Red)',
          'মালিকের নাম': 'মো. জহিরুল হক',
          'চেসিস নম্বর': 'MD2A11CY8JWC12093',
          'ফিটনেস ও ট্যাক্স টোকেন': 'বৈধ (মেয়াদ উত্তীর্ণ: ডিসে ২০২৭)',
        },
        isRestricted: true,
        adapterStatus: 'Planned Phase 3 Adapter (Mocked)',
      },
      {
        id: 'court-01',
        source: 'COURT',
        title: 'সুপ্রিম কোর্ট ও অধস্তন আদালত ই-জুডিশিয়ারি ডাটাবেজ',
        subtitle: 'মামলার শুনানির কার্যতালিকা ও রায় রেকর্ড',
        matchField: 'কেস রেফারেন্স / এনআইডি',
        details: {
          'মামলা নম্বর': 'ক্রিমিনাল মিস কেস নং ৩১২/২০২৫',
          'সর্বশেষ আদেশ': 'শর্তসাপেক্ষ অন্তর্বর্তীকালীন জামিন মঞ্জুর',
          'পরবর্তী তারিখ': '১০ নভেম্বর ২০২৬',
          'সংযুক্ত আইনজীবী': 'অ্যাডভোকেট সাজেদুল হক',
        },
        isRestricted: true,
        adapterStatus: 'Planned Phase 3 Adapter (Mocked)',
      },
    ];

    // Filter results loosely by query if specific keywords exist
    if (clean.includes('dhaka') || clean.includes('পায়') || clean.includes('গাড়ি') || clean.includes('bike')) {
      return results.filter((r) => r.source === 'BRTA' || r.source === 'CDMS');
    }

    return results;
  },
};
