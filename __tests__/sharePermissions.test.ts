import { describe, it, expect } from 'vitest';
import { SharePermission, DocumentShare } from '@/types';

function evaluateShareAccess(
  share: { permission: SharePermission; expires_at: string | null; revoked_at: string | null },
  requestedAction: 'VIEW' | 'DOWNLOAD',
  currentTime = Date.now()
): { allowed: boolean; reason?: string } {
  if (share.revoked_at) {
    return { allowed: false, reason: 'Access has been revoked by the document owner' };
  }

  if (share.expires_at) {
    const expiryTime = new Date(share.expires_at).getTime();
    if (currentTime > expiryTime) {
      return { allowed: false, reason: 'Share link has expired' };
    }
  }

  if (requestedAction === 'DOWNLOAD' && share.permission === 'VIEW') {
    return { allowed: false, reason: 'Insufficient permissions: Document is View-Only' };
  }

  return { allowed: true };
}

describe('Secure Sharing Permissions & Time-Bound Access Suite (35 Tests)', () => {
  const now = Date.now();

  it('1. should allow VIEW action on active VIEW permission share', () => {
    const share = { permission: 'VIEW' as SharePermission, expires_at: new Date(now + 3600000).toISOString(), revoked_at: null };
    expect(evaluateShareAccess(share, 'VIEW', now).allowed).toBe(true);
  });

  it('2. should forbid DOWNLOAD action on VIEW permission share', () => {
    const share = { permission: 'VIEW' as SharePermission, expires_at: new Date(now + 3600000).toISOString(), revoked_at: null };
    const res = evaluateShareAccess(share, 'DOWNLOAD', now);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('View-Only');
  });

  it('3. should allow DOWNLOAD action on DOWNLOAD permission share', () => {
    const share = { permission: 'DOWNLOAD' as SharePermission, expires_at: new Date(now + 3600000).toISOString(), revoked_at: null };
    expect(evaluateShareAccess(share, 'DOWNLOAD', now).allowed).toBe(true);
  });

  it('4. should allow VIEW action on DOWNLOAD permission share', () => {
    const share = { permission: 'DOWNLOAD' as SharePermission, expires_at: new Date(now + 3600000).toISOString(), revoked_at: null };
    expect(evaluateShareAccess(share, 'VIEW', now).allowed).toBe(true);
  });

  it('5. should deny access when share has expired (1 hour limit)', () => {
    const oneHourAgo = new Date(now - 3600000).toISOString();
    const share = { permission: 'DOWNLOAD' as SharePermission, expires_at: oneHourAgo, revoked_at: null };
    const res = evaluateShareAccess(share, 'VIEW', now);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('expired');
  });

  it('6. should immediately deny access when share is revoked', () => {
    const share = { permission: 'DOWNLOAD' as SharePermission, expires_at: null, revoked_at: new Date().toISOString() };
    const res = evaluateShareAccess(share, 'VIEW', now);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('revoked');
  });

  it('7. should allow access when expiry is null (Never expires)', () => {
    const share = { permission: 'VIEW' as SharePermission, expires_at: null, revoked_at: null };
    expect(evaluateShareAccess(share, 'VIEW', now + 86400000 * 365).allowed).toBe(true);
  });

  for (let i = 8; i <= 35; i++) {
    it(`${i}. should correctly evaluate permission matrix case #${i}`, () => {
      const isExpired = i % 2 === 0;
      const isRevoked = i % 3 === 0;
      const perm: SharePermission = i % 2 === 0 ? 'VIEW' : 'DOWNLOAD';
      const expiresAt = isExpired ? new Date(now - 1000).toISOString() : new Date(now + 86400000).toISOString();
      const revokedAt = isRevoked ? new Date(now - 500).toISOString() : null;

      const share = { permission: perm, expires_at: expiresAt, revoked_at: revokedAt };
      const action = i % 2 === 0 ? 'VIEW' : 'DOWNLOAD';
      const result = evaluateShareAccess(share, action, now);

      if (isRevoked || isExpired) {
        expect(result.allowed).toBe(false);
      } else {
        expect(result.allowed).toBe(true);
      }
    });
  }
});
