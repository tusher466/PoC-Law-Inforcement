export type Role =
  | 'citizen'
  | 'operator'
  | 'oc'
  | 'io'
  | 'evidence'
  | 'dispatcher'
  | 'auditor';

export type CaseStage =
  | 'filed'
  | 'received'
  | 'assigned'
  | 'investigation'
  | 'chargesheet'
  | 'court'
  | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Channel = 'app' | 'voice' | 'sms' | 'kiosk' | '999';

export type ComplaintType =
  | 'lost_item'
  | 'theft'
  | 'harassment'
  | 'cyber_fraud'
  | 'missing_person'
  | 'road_accident'
  | 'extortion'
  | 'domestic_violence'
  | 'other';

export interface LocationInfo {
  lat: number;
  lng: number;
  address: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  stage: CaseStage;
  note: string;
  actorRole: Role;
  actorName: string;
  at: string; // ISO String
}

export interface DiaryEntry {
  id: string;
  caseId: string;
  date: string;
  ioName: string;
  summary: string;
  actionsTaken: string;
  nextSteps: string;
  at: string;
}

export interface Case {
  id: string; // NS-YYYY-DISTRICT-6DIGITS
  type: ComplaintType;
  title: string;
  description: string;
  language: 'bn' | 'en';
  status: CaseStage;
  priority: Priority;
  urgent: boolean;
  channel: Channel;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  stationId: string;
  ioId?: string;
  ioName?: string;
  location: LocationInfo;
  createdAt: string; // ISO String
  slaDueAt: string; // ISO String
  timeline: TimelineEvent[];
  evidenceIds: string[];
  courtDate?: string;
  incidentId?: string;
  diary: DiaryEntry[];
  sectionSuggestions?: string[];
  isFirRecommended?: boolean;
}

export interface CustodyBlock {
  index: number;
  from: string;
  to: string;
  reason: string;
  at: string;
  prevHash: string;
  hash: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  fileName: string;
  mime: string;
  sizeBytes: number;
  sha256: string;
  capturedAt: string;
  gps?: LocationInfo;
  uploadedBy: string;
  custodyChain: CustodyBlock[];
  previewUrl?: string;
  seizureListNo?: string;
  itemDescription?: string;
  isTampered?: boolean;
}

export type UnitStatus = 'available' | 'assigned' | 'enroute' | 'onscene';

export interface Unit {
  id: string;
  callSign: string;
  stationId: string;
  lat: number;
  lng: number;
  status: UnitStatus;
  assignedIncidentId?: string;
  officerName: string;
  phone: string;
  vehicleType: string;
}

export type IncidentSource = 'app_sos' | 'call_999' | 'gd_urgent' | 'sms';
export type IncidentSeverity = 'critical' | 'high' | 'medium';

export interface Incident {
  id: string;
  caseId?: string;
  source: IncidentSource;
  severity: IncidentSeverity;
  lat: number;
  lng: number;
  address: string;
  createdAt: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  resolvedAt?: string;
  assignedUnitId?: string;
  callerName?: string;
  callerPhone?: string;
  description: string;
  status: 'pending' | 'dispatched' | 'onscene' | 'resolved';
}

export interface Station {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  lat: number;
  lng: number;
  rating: number;
  slaCompliance: number; // Percentage, e.g., 94
  phone: string;
  ocName: string;
  activeCases: number;
}

export interface Rating {
  id: string;
  stationId: string;
  caseId: string;
  stars: number;
  tags: string[]; // e.g., ['polite', 'fast', 'corruption_free', 'helpful']
  comment?: string;
  at: string;
}

export interface AuditEntry {
  index: number;
  actorRole: Role;
  action: string;
  target: string;
  detail: string;
  at: string;
  prevHash: string;
  hash: string;
  isTampered?: boolean;
}

export interface SmsMessage {
  id: string;
  to: string;
  body: string;
  at: string;
  direction: 'out' | 'in';
  caseId?: string;
}

export interface Tip {
  tipId: string;
  category: 'police_misconduct' | 'narcotics' | 'gambling' | 'trafficking' | 'corruption' | 'other';
  text: string;
  status: 'received' | 'reviewing' | 'resolved';
  createdAt: string;
  updateNotes?: string;
}

export interface ScamReport {
  id: string;
  query: string; // phone number, link, or account
  type: 'phone' | 'link' | 'bkash' | 'nagad';
  riskScore: 'safe' | 'suspicious' | 'reported_scam';
  reportCount: number;
  reasons: string[];
  lastReportedAt: string;
}
