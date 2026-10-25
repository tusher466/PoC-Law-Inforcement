import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Case,
  CaseStage,
  Evidence,
  Unit,
  Incident,
  Station,
  Rating,
  AuditEntry,
  SmsMessage,
  Tip,
  CustodyBlock,
  Role,
} from '../types';
import {
  SEED_CASES,
  SEED_EVIDENCE,
  SEED_UNITS,
  SEED_INCIDENTS,
  SEED_STATIONS,
  SEED_RATINGS,
  SEED_AUDIT_LOG,
  SEED_SMS,
  SEED_TIPS,
} from './seed';
import { computeAuditHash, computeCustodyHash } from '../lib/hash';
import { createSms, processInboundSms, SMS_TEMPLATES } from '../lib/sms';

interface AppState {
  cases: Case[];
  evidence: Evidence[];
  units: Unit[];
  incidents: Incident[];
  stations: Station[];
  ratings: Rating[];
  auditLog: AuditEntry[];
  smsList: SmsMessage[];
  tips: Tip[];
  isSmsDrawerOpen: boolean;
  tourStep: number | null; // 0..7 or null
  toast: { message: string; type: 'success' | 'warning' | 'error' } | null;

  // UI Drawer / Tour actions
  setSmsDrawerOpen: (open: boolean) => void;
  setTourStep: (step: number | null) => void;
  addToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  clearToast: () => void;
  addSms: (sms: { to: string; type?: string; text: string; caseId?: string }) => void;

  // Case Actions
  addCase: (newCase: Case) => Promise<void>;
  updateCaseStatus: (
    caseId: string,
    newStage: CaseStage,
    note: string,
    actorRole: Role,
    actorName: string
  ) => Promise<void>;
  assignIo: (
    caseId: string,
    ioId: string,
    ioName: string,
    ioPhone: string,
    actorRole: Role,
    actorName: string
  ) => Promise<void>;
  addCaseDiary: (
    caseId: string,
    summary: string,
    actionsTaken: string,
    nextSteps: string,
    ioName: string
  ) => Promise<void>;
  setCourtDate: (
    caseId: string,
    courtDate: string,
    courtName: string,
    actorName: string
  ) => Promise<void>;

  // Evidence Actions
  addEvidence: (evidenceItem: Evidence) => Promise<void>;
  transferEvidenceCustody: (
    evidenceId: string,
    from: string,
    to: string,
    reason: string,
    actorRole: Role
  ) => Promise<void>;

  // Dispatch & Units Actions
  triggerSos: (
    citizenName: string,
    phone: string,
    lat: number,
    lng: number,
    address: string
  ) => Promise<string>;
  assignUnitToIncident: (unitId: string, incidentId: string) => Promise<void>;
  updateUnitPatrolStatus: (
    unitId: string,
    newStatus: 'available' | 'assigned' | 'enroute' | 'onscene',
    incidentId?: string
  ) => Promise<void>;
  simulateIncoming999Call: (description: string, callerName: string, callerPhone: string) => Promise<void>;
  stepPatrolSimulationLoop: () => void;

  // Rating & Community
  addRating: (rating: Rating) => void;
  addTip: (tip: Tip) => void;
  updateTipStatus: (tipId: string, status: 'received' | 'reviewing' | 'resolved', notes?: string) => void;

  // SMS Simulator
  sendSmsKeyword: (keywordText: string) => void;

  // Audit and Cryptographic Tampering Demo
  appendAuditEntry: (
    actorRole: Role,
    action: string,
    target: string,
    detail: string
  ) => Promise<void>;
  simulateAuditTampering: (indexToTamper: number) => void;
  simulateCustodyTampering: (evidenceId: string, blockIndex: number) => void;

  // Reset
  resetDemoData: () => void;
}

// BroadcastChannel for cross-tab multi-user synchronization
const broadcastChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('nyayasetu_sync')
    : null;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      // Listen for broadcast sync updates from other tabs
      if (broadcastChannel) {
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_STATE' && event.data.state) {
            set(event.data.state);
          }
        };
      }

      const syncTabs = () => {
        if (broadcastChannel) {
          const { cases, evidence, units, incidents, stations, ratings, auditLog, smsList, tips } = get();
          broadcastChannel.postMessage({
            type: 'SYNC_STATE',
            state: { cases, evidence, units, incidents, stations, ratings, auditLog, smsList, tips },
          });
        }
      };

      return {
        cases: SEED_CASES,
        evidence: SEED_EVIDENCE,
        units: SEED_UNITS,
        incidents: SEED_INCIDENTS,
        stations: SEED_STATIONS,
        ratings: SEED_RATINGS,
        auditLog: SEED_AUDIT_LOG,
        smsList: SEED_SMS,
        tips: SEED_TIPS,
        isSmsDrawerOpen: false,
        tourStep: null,
        toast: null,

        setSmsDrawerOpen: (open) => set({ isSmsDrawerOpen: open }),
        setTourStep: (step) => set({ tourStep: step }),

        addToast: (message, type = 'success') => {
          const toastType = type === 'info' ? 'success' : type;
          set({ toast: { message, type: toastType } });
          setTimeout(() => {
            if (get().toast?.message === message) {
              set({ toast: null });
            }
          }, 4000);
        },

        clearToast: () => set({ toast: null }),

        addSms: (sms) => {
          const newMsg: SmsMessage = {
            id: 'sms-out-' + Date.now(),
            to: sms.to,
            body: sms.text,
            at: new Date().toISOString(),
            direction: 'out',
            caseId: sms.caseId,
          };
          set((state) => ({ smsList: [newMsg, ...state.smsList] }));
          syncTabs();
        },

        appendAuditEntry: async (actorRole, action, target, detail) => {
          const { auditLog } = get();
          const lastEntry = auditLog[auditLog.length - 1];
          const prevHash = lastEntry ? lastEntry.hash : 'GENESIS_AUDIT_LOG_ENTRY';
          const index = auditLog.length;
          const at = new Date().toISOString();

          const hash = await computeAuditHash(prevHash, {
            index,
            actorRole,
            action,
            target,
            detail,
            at,
          });

          const newEntry: AuditEntry = {
            index,
            actorRole,
            action,
            target,
            detail,
            at,
            prevHash,
            hash,
          };

          set((state) => ({ auditLog: [...state.auditLog, newEntry] }));
          syncTabs();
        },

        addCase: async (newCase) => {
          set((state) => ({ cases: [newCase, ...state.cases] }));

          // Append to cryptographic audit chain
          await get().appendAuditEntry(
            newCase.channel === 'kiosk' ? 'operator' : 'citizen',
            'CASE_CREATED',
            newCase.id,
            `Complaint registered: "${newCase.title}" via ${newCase.channel.toUpperCase()} channel. Station: ${newCase.stationId}`
          );

          // Trigger simulated citizen SMS
          const smsText = SMS_TEMPLATES.caseFiled(newCase.id, newCase.title);
          const sms = createSms(newCase.citizenPhone, smsText, newCase.id);
          set((state) => ({ smsList: [sms, ...state.smsList] }));

          syncTabs();
        },

        updateCaseStatus: async (caseId, newStage, note, actorRole, actorName) => {
          const now = new Date().toISOString();
          const targetCase = get().cases.find((c) => c.id === caseId);
          if (!targetCase) return;

          const timelineEvent = {
            id: 'tl-' + Date.now(),
            caseId,
            stage: newStage,
            note,
            actorRole,
            actorName,
            at: now,
          };

          set((state) => ({
            cases: state.cases.map((c) =>
              c.id === caseId
                ? {
                    ...c,
                    status: newStage,
                    timeline: [...c.timeline, timelineEvent],
                  }
                : c
            ),
          }));

          // Audit log
          await get().appendAuditEntry(
            actorRole,
            'CASE_STATUS_UPDATED',
            caseId,
            `Stage updated to '${newStage}' by ${actorName}. Note: ${note}`
          );

          // SMS notification to citizen
          const stageLabelsBn: Record<string, string> = {
            filed: 'দাখিলকৃত',
            received: 'থানায় গৃহীত',
            assigned: 'তদন্ত কর্মকর্তা নিযুক্ত',
            investigation: 'তদন্তাধীন',
            chargesheet: 'চার্জশিট দাখিল',
            court: 'আদালতে বিচারাধীন',
            closed: 'নিষ্পত্তি',
          };
          const smsBody = SMS_TEMPLATES.statusUpdated(
            caseId,
            stageLabelsBn[newStage] || newStage,
            note
          );
          const sms = createSms(targetCase.citizenPhone, smsBody, caseId);
          set((state) => ({ smsList: [sms, ...state.smsList] }));

          syncTabs();
        },

        assignIo: async (caseId, ioId, ioName, ioPhone, actorRole, actorName) => {
          const now = new Date().toISOString();
          const targetCase = get().cases.find((c) => c.id === caseId);
          if (!targetCase) return;

          const timelineEvent = {
            id: 'tl-' + Date.now(),
            caseId,
            stage: 'assigned' as CaseStage,
            note: `তদন্ত কর্মকর্তা (IO) হিসেবে এসআই ${ioName}-কে নিযুক্ত করা হয়েছে। ফোন: ${ioPhone}`,
            actorRole,
            actorName,
            at: now,
          };

          set((state) => ({
            cases: state.cases.map((c) =>
              c.id === caseId
                ? {
                    ...c,
                    status: 'assigned',
                    ioId,
                    ioName,
                    timeline: [...c.timeline, timelineEvent],
                  }
                : c
            ),
          }));

          await get().appendAuditEntry(
            actorRole,
            'IO_ASSIGNED',
            caseId,
            `Assigned IO ${ioName} (${ioId}) to case ${caseId} by ${actorName}`
          );

          const smsBody = SMS_TEMPLATES.ioAssigned(caseId, ioName, ioPhone);
          const sms = createSms(targetCase.citizenPhone, smsBody, caseId);
          set((state) => ({ smsList: [sms, ...state.smsList] }));

          syncTabs();
        },

        addCaseDiary: async (caseId, summary, actionsTaken, nextSteps, ioName) => {
          const now = new Date().toISOString();
          const entry = {
            id: 'cd-' + Date.now(),
            caseId,
            date: now.split('T')[0],
            ioName,
            summary,
            actionsTaken,
            nextSteps,
            at: now,
          };

          set((state) => ({
            cases: state.cases.map((c) =>
              c.id === caseId ? { ...c, diary: [...c.diary, entry] } : c
            ),
          }));

          await get().appendAuditEntry(
            'io',
            'CASE_DIARY_RECORDED',
            caseId,
            `Case Diary entry added by ${ioName}. Summary: "${summary.slice(0, 60)}..."`
          );

          syncTabs();
        },

        setCourtDate: async (caseId, courtDate, courtName, actorName) => {
          const targetCase = get().cases.find((c) => c.id === caseId);
          if (!targetCase) return;

          set((state) => ({
            cases: state.cases.map((c) =>
              c.id === caseId ? { ...c, courtDate } : c
            ),
          }));

          await get().appendAuditEntry(
            'io',
            'COURT_HEARING_SCHEDULED',
            caseId,
            `Court date scheduled for ${courtDate} at ${courtName}`
          );

          const smsBody = SMS_TEMPLATES.courtDateSet(caseId, courtDate, courtName);
          const sms = createSms(targetCase.citizenPhone, smsBody, caseId);
          set((state) => ({ smsList: [sms, ...state.smsList] }));

          syncTabs();
        },

        addEvidence: async (evidenceItem) => {
          set((state) => ({
            evidence: [evidenceItem, ...state.evidence],
            cases: state.cases.map((c) =>
              c.id === evidenceItem.caseId
                ? { ...c, evidenceIds: [...c.evidenceIds, evidenceItem.id] }
                : c
            ),
          }));

          await get().appendAuditEntry(
            'evidence',
            'EVIDENCE_REGISTERED',
            evidenceItem.id,
            `Seized evidence "${evidenceItem.fileName}" linked to Case #${evidenceItem.caseId}. SHA-256: ${evidenceItem.sha256}`
          );

          // SMS notification to citizen
          const targetCase = get().cases.find((c) => c.id === evidenceItem.caseId);
          if (targetCase) {
            const smsBody = SMS_TEMPLATES.evidenceAdded(
              targetCase.id,
              evidenceItem.fileName,
              evidenceItem.sha256.substring(0, 8)
            );
            const sms = createSms(targetCase.citizenPhone, smsBody, targetCase.id);
            set((state) => ({ smsList: [sms, ...state.smsList] }));
          }

          syncTabs();
        },

        transferEvidenceCustody: async (evidenceId, from, to, reason, actorRole) => {
          const evidence = get().evidence.find((e) => e.id === evidenceId);
          if (!evidence) return;

          const chain = evidence.custodyChain;
          const lastBlock = chain[chain.length - 1];
          const prevHash = lastBlock ? lastBlock.hash : 'GENESIS_CUSTODY_BLOCK';
          const index = chain.length;
          const at = new Date().toISOString();

          const hash = await computeCustodyHash(prevHash, {
            index,
            from,
            to,
            reason,
            at,
          });

          const newBlock: CustodyBlock = {
            index,
            from,
            to,
            reason,
            at,
            prevHash,
            hash,
          };

          set((state) => ({
            evidence: state.evidence.map((e) =>
              e.id === evidenceId
                ? { ...e, custodyChain: [...e.custodyChain, newBlock] }
                : e
            ),
          }));

          await get().appendAuditEntry(
            actorRole,
            'CUSTODY_CHAIN_TRANSFERRED',
            evidenceId,
            `Custody transfer from "${from}" to "${to}". Reason: ${reason}`
          );

          syncTabs();
        },

        triggerSos: async (citizenName, phone, lat, lng, address) => {
          const now = new Date().toISOString();
          const incidentId = 'inc-sos-' + Date.now();
          const caseId = 'NS-2026-DHK-' + String(Math.floor(100000 + Math.random() * 900000));

          const newIncident: Incident = {
            id: incidentId,
            caseId,
            source: 'app_sos',
            severity: 'critical',
            lat,
            lng,
            address,
            createdAt: now,
            callerName: citizenName,
            callerPhone: phone,
            description: `[সাইলেন্ট এসওএস অ্যালার্ট] ${citizenName}-এর জরুরি উদ্ধার বার্তা। অবস্থান: ${address}। নিকটস্থ টহল দলের দ্রুত উপস্থিতি প্রয়োজন।`,
            status: 'pending',
          };

          const newCase: Case = {
            id: caseId,
            type: 'harassment',
            title: `জরুরি এসওএস অ্যালার্ট - ${address}`,
            description: `নাগরিক মোবাইল অ্যাপ থেকে তাৎক্ষণিক এসওএস সংকেত পাঠানো হয়েছে। মোবাইল: ${phone}`,
            language: 'bn',
            status: 'received',
            priority: 'urgent',
            urgent: true,
            channel: '999',
            citizenId: 'cit-sos',
            citizenName,
            citizenPhone: phone,
            stationId: 'dhanmondi',
            location: { lat, lng, address },
            createdAt: now,
            slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
            evidenceIds: [],
            incidentId,
            diary: [],
            timeline: [
              {
                id: 'tl-' + Date.now(),
                caseId,
                stage: 'received',
                note: '৯৯৯ জরুরি ডিসপ্যাচ কনসোলে এসওএস সংকেত পৌঁছেছে।',
                actorRole: 'dispatcher',
                actorName: '৯৯৯ রেসপন্স টিম',
                at: now,
              },
            ],
          };

          set((state) => ({
            incidents: [newIncident, ...state.incidents],
            cases: [newCase, ...state.cases],
          }));

          await get().appendAuditEntry(
            'citizen',
            'SILENT_SOS_TRIGGERED',
            incidentId,
            `Silent SOS signal triggered by ${citizenName} at (${lat.toFixed(4)}, ${lng.toFixed(4)}). Instant 999 CAD push.`
          );

          const smsBody = SMS_TEMPLATES.sosTriggered(caseId, 'ধানমন্ডি মডেল');
          const sms = createSms(phone, smsBody, caseId);
          set((state) => ({ smsList: [sms, ...state.smsList] }));

          syncTabs();
          return incidentId;
        },

        assignUnitToIncident: async (unitId, incidentId) => {
          const now = new Date().toISOString();
          const unit = get().units.find((u) => u.id === unitId);
          const incident = get().incidents.find((i) => i.id === incidentId);
          if (!unit || !incident) return;

          set((state) => ({
            units: state.units.map((u) =>
              u.id === unitId
                ? { ...u, status: 'assigned', assignedIncidentId: incidentId }
                : u
            ),
            incidents: state.incidents.map((i) =>
              i.id === incidentId
                ? { ...i, status: 'dispatched', assignedUnitId: unitId, dispatchedAt: now }
                : i
            ),
          }));

          // If linked to a case, update case timeline
          if (incident.caseId) {
            const timelineNote = `টহল টিম (${unit.callSign}, অফিসার: ${unit.officerName}) কে ঘটনাস্থলে প্রেরণ করা হয়েছে।`;
            await get().updateCaseStatus(
              incident.caseId,
              'investigation',
              timelineNote,
              'dispatcher',
              '৯৯৯ ডিসপ্যাচার'
            );
          }

          await get().appendAuditEntry(
            'dispatcher',
            'CAD_UNIT_DISPATCHED',
            unitId,
            `Dispatched unit ${unit.callSign} to Incident #${incidentId} (${incident.address})`
          );

          syncTabs();
        },

        updateUnitPatrolStatus: async (unitId, newStatus, incidentId) => {
          const now = new Date().toISOString();
          const unit = get().units.find((u) => u.id === unitId);
          if (!unit) return;

          const linkedIncidentId = incidentId || unit.assignedIncidentId;
          const incident = get().incidents.find((i) => i.id === linkedIncidentId);

          set((state) => ({
            units: state.units.map((u) =>
              u.id === unitId
                ? {
                    ...u,
                    status: newStatus,
                    assignedIncidentId: newStatus === 'available' ? undefined : u.assignedIncidentId,
                  }
                : u
            ),
            incidents: state.incidents.map((i) => {
              if (i.id === linkedIncidentId) {
                if (newStatus === 'onscene') {
                  return { ...i, status: 'onscene', arrivedAt: now };
                }
                if (newStatus === 'available') {
                  return { ...i, status: 'resolved', resolvedAt: now };
                }
              }
              return i;
            }),
          }));

          if (incident && incident.caseId) {
            const statusBn =
              newStatus === 'enroute'
                ? 'টহল টিম দ্রুত ঘটনাস্থলের দিকে অগ্রসর হচ্ছে'
                : newStatus === 'onscene'
                ? 'টহল টিম ঘটনাস্থলে পৌঁছে প্রত্যক্ষ নিরাপত্তা প্রদান করছে'
                : 'জরুরি পরিস্থিতি সফলভাবে মোকাবিলা ও সমাধান করা হয়েছে';

            await get().updateCaseStatus(
              incident.caseId,
              newStatus === 'available' ? 'closed' : 'investigation',
              statusBn,
              'dispatcher',
              unit.callSign
            );
          }

          await get().appendAuditEntry(
            'dispatcher',
            'PATROL_TABLET_STATUS_CHANGE',
            unitId,
            `Patrol unit ${unit.callSign} updated status to '${newStatus}'`
          );

          syncTabs();
        },

        simulateIncoming999Call: async (description, callerName, callerPhone) => {
          const now = new Date().toISOString();
          const incidentId = 'inc-999-' + Date.now();
          const targetStation = SEED_STATIONS[Math.floor(Math.random() * SEED_STATIONS.length)];

          const newIncident: Incident = {
            id: incidentId,
            source: 'call_999',
            severity: 'high',
            lat: targetStation.lat + (Math.random() - 0.5) * 0.02,
            lng: targetStation.lng + (Math.random() - 0.5) * 0.02,
            address: `${targetStation.nameBn} সংলগ্ন এলাকা`,
            createdAt: now,
            callerName,
            callerPhone,
            description,
            status: 'pending',
          };

          set((state) => ({ incidents: [newIncident, ...state.incidents] }));

          await get().appendAuditEntry(
            'dispatcher',
            'CALL_999_INTAKE',
            incidentId,
            `Incoming 999 call logged from ${callerName} (${callerPhone}). Urgency: High.`
          );

          syncTabs();
        },

        stepPatrolSimulationLoop: () => {
          // Move units slightly within Dhaka bounds to simulate live patrol GPS
          set((state) => ({
            units: state.units.map((unit) => {
              const deltaLat = (Math.random() - 0.5) * 0.001;
              const deltaLng = (Math.random() - 0.5) * 0.001;
              return {
                ...unit,
                lat: unit.lat + deltaLat,
                lng: unit.lng + deltaLng,
              };
            }),
          }));
        },

        addRating: (rating) => {
          set((state) => {
            const nextRatings = [rating, ...state.ratings];
            // Recalculate station average rating
            const stationRatings = nextRatings.filter((r) => r.stationId === rating.stationId);
            const avg =
              stationRatings.reduce((sum, r) => sum + r.stars, 0) / (stationRatings.length || 1);

            return {
              ratings: nextRatings,
              stations: state.stations.map((s) =>
                s.id === rating.stationId
                  ? { ...s, rating: Math.round(avg * 10) / 10 }
                  : s
              ),
            };
          });

          get().appendAuditEntry(
            'citizen',
            'CITIZEN_RATING_RECORDED',
            rating.stationId,
            `Citizen submitted rating: ${rating.stars} stars. Tags: ${rating.tags.join(', ')}`
          );

          syncTabs();
        },

        addTip: (tip) => {
          set((state) => ({ tips: [tip, ...state.tips] }));

          get().appendAuditEntry(
            'citizen',
            'ANONYMOUS_TIP_FILED',
            tip.tipId,
            `Anonymous intelligence tip registered under category: ${tip.category}. Tracking ID generated.`
          );

          syncTabs();
        },

        updateTipStatus: (tipId, status, notes) => {
          set((state) => ({
            tips: state.tips.map((t) =>
              t.tipId === tipId ? { ...t, status, updateNotes: notes } : t
            ),
          }));

          get().appendAuditEntry(
            'auditor',
            'TIP_STATUS_UPDATED',
            tipId,
            `Oversight review updated tip #${tipId} status to '${status}'`
          );

          syncTabs();
        },

        sendSmsKeyword: (keywordText) => {
          const { cases, smsList } = get();
          const userPhone = '01712-345678';

          // Add inbound message
          const inbound: SmsMessage = {
            id: 'sms-in-' + Date.now(),
            to: '106 (NyayaSetu)',
            body: keywordText,
            at: new Date().toISOString(),
            direction: 'in',
          };

          const reply = processInboundSms(keywordText, userPhone, cases);

          set({ smsList: [reply, inbound, ...smsList] });
          syncTabs();
        },

        simulateAuditTampering: (indexToTamper) => {
          set((state) => ({
            auditLog: state.auditLog.map((entry, idx) => {
              if (idx === indexToTamper) {
                return {
                  ...entry,
                  detail: 'MALICIOUS_RECORD_ALTERATION_WITHOUT_RECOMPUTING_HASH',
                  isTampered: true,
                };
              }
              return entry;
            }),
          }));
          syncTabs();
        },

        simulateCustodyTampering: (evidenceId, blockIndex) => {
          set((state) => ({
            evidence: state.evidence.map((e) => {
              if (e.id === evidenceId) {
                const tamperedChain = e.custodyChain.map((b, idx) => {
                  if (idx === blockIndex) {
                    return {
                      ...b,
                      reason: 'UNAUTHORIZED_EVIDENCE_REASON_TAMPERING',
                    };
                  }
                  return b;
                });
                return { ...e, custodyChain: tamperedChain, isTampered: true };
              }
              return e;
            }),
          }));
          syncTabs();
        },

        resetDemoData: () => {
          set({
            cases: SEED_CASES,
            evidence: SEED_EVIDENCE,
            units: SEED_UNITS,
            incidents: SEED_INCIDENTS,
            stations: SEED_STATIONS,
            ratings: SEED_RATINGS,
            auditLog: SEED_AUDIT_LOG,
            smsList: SEED_SMS,
            tips: SEED_TIPS,
            tourStep: null,
          });
          syncTabs();
        },
      };
    },
    {
      name: 'nyayasetu_app_storage',
    }
  )
);
