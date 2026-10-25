import { AuditEntry, CustodyBlock } from '../types';

/**
 * Calculates SHA-256 hash using the standard Web Crypto API.
 * Works seamlessly in modern browsers and Web Workers.
 */
export async function sha256(input: string | ArrayBuffer): Promise<string> {
  const buffer =
    typeof input === 'string' ? new TextEncoder().encode(input) : input;

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compute the cryptographic hash for a block in the chain of custody.
 * Formula: SHA-256(prevHash + index + from + to + reason + at)
 */
export async function computeCustodyHash(
  prevHash: string,
  block: Omit<CustodyBlock, 'hash' | 'prevHash'>
): Promise<string> {
  const payload = `${prevHash}|${block.index}|${block.from}|${block.to}|${block.reason}|${block.at}`;
  return sha256(payload);
}

/**
 * Verifies the integrity of a chain of custody.
 */
export async function verifyCustodyChain(
  chain: CustodyBlock[]
): Promise<{ valid: boolean; brokenIndex?: number; reason?: string }> {
  if (!chain || chain.length === 0) return { valid: true };

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const expectedPrev = i === 0 ? 'GENESIS_CUSTODY_BLOCK' : chain[i - 1].hash;

    if (block.prevHash !== expectedPrev) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Previous hash mismatch at block ${i}`,
      };
    }

    const calculatedHash = await computeCustodyHash(block.prevHash, block);
    if (block.hash !== calculatedHash) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Block data altered at index ${i}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Compute the cryptographic hash for an audit log entry.
 * Formula: SHA-256(prevHash + index + actorRole + action + target + detail + at)
 */
export async function computeAuditHash(
  prevHash: string,
  entry: Omit<AuditEntry, 'hash' | 'prevHash'>
): Promise<string> {
  const payload = `${prevHash}|${entry.index}|${entry.actorRole}|${entry.action}|${entry.target}|${entry.detail}|${entry.at}`;
  return sha256(payload);
}

/**
 * Verifies the integrity of the append-only audit log chain.
 */
export async function verifyAuditChain(
  chain: AuditEntry[]
): Promise<{ valid: boolean; brokenIndex?: number; reason?: string }> {
  if (!chain || chain.length === 0) return { valid: true };

  for (let i = 0; i < chain.length; i++) {
    const entry = chain[i];
    const expectedPrev = i === 0 ? 'GENESIS_AUDIT_LOG_ENTRY' : chain[i - 1].hash;

    if (entry.prevHash !== expectedPrev) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Previous hash link broken at entry #${i}`,
      };
    }

    const calculatedHash = await computeAuditHash(entry.prevHash, entry);
    if (entry.hash !== calculatedHash) {
      return {
        valid: false,
        brokenIndex: i,
        reason: `Tampering detected at entry #${i}: content does not match cryptographic hash`,
      };
    }
  }

  return { valid: true };
}

/**
 * Helper to simulate tampering in demo mode for proof of detection.
 */
export function tamperAuditEntry(
  chain: AuditEntry[],
  indexToTamper: number,
  tamperedDetail: string = 'MALICIOUS_UNAUTHORIZED_RECORD_OVERWRITE'
): AuditEntry[] {
  return chain.map((entry, idx) => {
    if (idx === indexToTamper) {
      return {
        ...entry,
        detail: tamperedDetail,
        isTampered: true,
      };
    }
    return entry;
  });
}

/**
 * Truncate hash for clean UI badge display (e.g. 0x4f8a...9c2d)
 */
export function truncateHash(hash: string, front: number = 6, back: number = 4): string {
  if (!hash || hash.length <= front + back) return hash;
  return `${hash.slice(0, front)}...${hash.slice(-back)}`;
}
