import { describe, it, expect } from 'vitest';
import {
  sha256,
  computeCustodyHash,
  verifyCustodyChain,
  computeAuditHash,
  verifyAuditChain,
  tamperAuditEntry,
  truncateHash,
} from '../hash';
import { AuditEntry, CustodyBlock } from '../../types';

describe('Cryptographic Hash & Chain Verification', () => {
  it('generates standard 64-character hex SHA-256 digest', async () => {
    const hash = await sha256('NyayaSetu-Bangladesh-Law-Enforcement');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('verifies a valid append-only custody chain', async () => {
    const genesisPrev = 'GENESIS_CUSTODY_BLOCK';
    const block0Data = {
      index: 0,
      from: 'Citizen',
      to: 'IO SI Mahmud',
      reason: 'Physical Handover',
      at: '2026-10-24T10:00:00Z',
    };
    const hash0 = await computeCustodyHash(genesisPrev, block0Data);
    const block0: CustodyBlock = { ...block0Data, prevHash: genesisPrev, hash: hash0 };

    const block1Data = {
      index: 1,
      from: 'IO SI Mahmud',
      to: 'Forensic Lab',
      reason: 'Digital Forensics Extraction',
      at: '2026-10-24T12:00:00Z',
    };
    const hash1 = await computeCustodyHash(hash0, block1Data);
    const block1: CustodyBlock = { ...block1Data, prevHash: hash0, hash: hash1 };

    const chain = [block0, block1];
    const verification = await verifyCustodyChain(chain);
    expect(verification.valid).toBe(true);
  });

  it('detects tampering in custody chain when content is modified', async () => {
    const genesisPrev = 'GENESIS_CUSTODY_BLOCK';
    const block0Data = {
      index: 0,
      from: 'Citizen',
      to: 'Officer',
      reason: 'Initial Seizure',
      at: '2026-10-24T10:00:00Z',
    };
    const hash0 = await computeCustodyHash(genesisPrev, block0Data);
    const block0: CustodyBlock = { ...block0Data, prevHash: genesisPrev, hash: hash0 };

    // Maliciously alter reason without updating cryptographic hash
    const tamperedBlock0 = { ...block0, reason: 'TAMPERED_MALICIOUS_REASON' };

    const verification = await verifyCustodyChain([tamperedBlock0]);
    expect(verification.valid).toBe(false);
    expect(verification.brokenIndex).toBe(0);
  });

  it('verifies valid audit chain and flags tampered audit entry', async () => {
    const genesisPrev = 'GENESIS_AUDIT_LOG_ENTRY';
    const entry0Data = {
      index: 0,
      actorRole: 'auditor' as const,
      action: 'INIT',
      target: 'ROOT',
      detail: 'Ledger root created',
      at: '2026-10-24T00:00:00Z',
    };
    const hash0 = await computeAuditHash(genesisPrev, entry0Data);
    const entry0: AuditEntry = { ...entry0Data, prevHash: genesisPrev, hash: hash0 };

    const validAudit = [entry0];
    const initialVerify = await verifyAuditChain(validAudit);
    expect(initialVerify.valid).toBe(true);

    // Tamper demo
    const tamperedList = tamperAuditEntry(validAudit, 0, 'UNAUTHORIZED_ALTERATION');
    const tamperedVerify = await verifyAuditChain(tamperedList);
    expect(tamperedVerify.valid).toBe(false);
  });

  it('truncates hash cleanly for UI badge', () => {
    const fullHash = '9f83c18b7654a9d8e7b1a2c3d4e5f60718293a4b5c6d7e8f90123456789abcde';
    expect(truncateHash(fullHash, 6, 4)).toBe('9f83c1...bcde');
  });
});
