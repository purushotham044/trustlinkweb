import { describe, it, expect } from 'vitest';
import { shareService } from '@/services/shareService';

describe('Share Service & Access Permissions', () => {
  it('should create a time-bounded VIEW share for a document', async () => {
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
    const share = await shareService.shareDocument('doc-1', 'partner@firm.com', 'VIEW', expiresAt);
    expect(share).toHaveProperty('id');
    expect(share.document_id).toBe('doc-1');
    expect(share.permission).toBe('VIEW');
  });

  it('should create a DOWNLOAD share with custom expiration', async () => {
    const expiresAt = new Date(Date.now() + 86400 * 1000 * 7).toISOString();
    const share = await shareService.shareDocument('doc-2', 'auditor@kpmg.com', 'DOWNLOAD', expiresAt);
    expect(share.permission).toBe('DOWNLOAD');
    expect(share.expires_at).toBe(expiresAt);
  });

  it('should retrieve outgoing shares list (shares by me)', async () => {
    const shares = await shareService.getSharesByMe();
    expect(Array.isArray(shares)).toBe(true);
  });

  it('should retrieve incoming shares list (shares with me)', async () => {
    const shares = await shareService.getSharesWithMe();
    expect(Array.isArray(shares)).toBe(true);
  });

  it('should revoke a document share successfully', async () => {
    await expect(shareService.revokeShare('share-123', 'doc-1')).resolves.not.toThrow();
  });
});
