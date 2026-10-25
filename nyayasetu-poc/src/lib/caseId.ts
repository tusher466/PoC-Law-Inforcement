/**
 * Unique Case ID generator & validator following the Bangladesh National Law Enforcement schema:
 * Format: NS-YYYY-<DISTRICT_CODE>-<6_DIGIT_SEQUENCE>
 * Example: NS-2026-DHK-000142
 */

let sequenceCounter = 142;

export function generateCaseId(districtCode: string = 'DHK'): string {
  const year = new Date().getFullYear();
  sequenceCounter += 1;
  const seq = String(sequenceCounter).padStart(6, '0');
  return `NS-${year}-${districtCode.toUpperCase()}-${seq}`;
}

export function isValidCaseId(caseId: string): boolean {
  if (!caseId) return false;
  const regex = /^NS-\d{4}-[A-Z]{3,4}-\d{6}$/;
  return regex.test(caseId.trim());
}

export interface ParsedCaseId {
  valid: boolean;
  year?: number;
  district?: string;
  sequence?: string;
}

export function parseCaseId(caseId: string): ParsedCaseId {
  if (!isValidCaseId(caseId)) {
    return { valid: false };
  }
  const parts = caseId.trim().split('-');
  return {
    valid: true,
    year: parseInt(parts[1], 10),
    district: parts[2],
    sequence: parts[3],
  };
}
