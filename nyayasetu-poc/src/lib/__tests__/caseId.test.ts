import { describe, it, expect } from 'vitest';
import { generateCaseId, isValidCaseId, parseCaseId } from '../caseId';

describe('Unique Case ID Generator & Validator', () => {
  it('generates standard Bangladesh police format NS-YYYY-DISTRICT-6DIGITS', () => {
    const caseId = generateCaseId('DHK');
    const year = new Date().getFullYear();
    expect(caseId).toMatch(new RegExp(`^NS-${year}-DHK-\\d{6}$`));
  });

  it('validates genuine Case IDs correctly', () => {
    expect(isValidCaseId('NS-2026-DHK-000142')).toBe(true);
    expect(isValidCaseId('NS-2026-CTG-001928')).toBe(true);
    expect(isValidCaseId('INVALID-CASE-ID')).toBe(false);
    expect(isValidCaseId('NS-2026-DHK-12')).toBe(false);
  });

  it('parses year, district and sequence from Case ID', () => {
    const parsed = parseCaseId('NS-2026-DHK-000101');
    expect(parsed.valid).toBe(true);
    expect(parsed.year).toBe(2026);
    expect(parsed.district).toBe('DHK');
    expect(parsed.sequence).toBe('000101');
  });
});
