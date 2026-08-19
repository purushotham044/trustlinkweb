import { describe, it, expect } from 'vitest';
import { auditService } from '@/services/auditService';
import { AUDIT_ACTION_LABELS } from '@/lib/constants';

describe('Audit Trail & Logging Service', () => {
  it('should retrieve unfiltered audit logs', async () => {
    const logs = await auditService.getAuditLogs('ALL');
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
    const first = logs[0];
    expect(first).toHaveProperty('action');
    expect(first).toHaveProperty('created_at');
  });

  it('should filter audit logs by BLOCKCHAIN category', async () => {
    const logs = await auditService.getAuditLogs('BLOCKCHAIN');
    expect(Array.isArray(logs)).toBe(true);
    logs.forEach(l => {
      expect(['BLOCKCHAIN_ANCHORED', 'BLOCKCHAIN_ANCHOR_FAILED']).toContain(l.action);
    });
  });

  it('should filter audit logs by INTEGRITY category', async () => {
    const logs = await auditService.getAuditLogs('INTEGRITY');
    expect(Array.isArray(logs)).toBe(true);
    logs.forEach(l => {
      expect(['HASH_CREATED', 'DOCUMENT_VERIFIED']).toContain(l.action);
    });
  });

  it('should filter audit logs by SHARING category', async () => {
    const logs = await auditService.getAuditLogs('SHARING');
    expect(Array.isArray(logs)).toBe(true);
    logs.forEach(l => {
      expect(['DOCUMENT_SHARED', 'SHARE_REVOKED']).toContain(l.action);
    });
  });

  it('should filter audit logs by FILES category', async () => {
    const logs = await auditService.getAuditLogs('FILES');
    expect(Array.isArray(logs)).toBe(true);
  });

  it('should map all audit action codes to clear human-readable labels', () => {
    const actions = [
      'DOCUMENT_UPLOADED',
      'DOCUMENT_VIEWED',
      'DOCUMENT_DOWNLOADED',
      'DOCUMENT_RENAMED',
      'DOCUMENT_MOVED',
      'DOCUMENT_DELETED',
      'DOCUMENT_SHARED',
      'SHARE_REVOKED',
      'DOCUMENT_VERIFIED',
      'HASH_CREATED',
      'BLOCKCHAIN_ANCHORED',
      'BLOCKCHAIN_ANCHOR_FAILED'
    ];
    actions.forEach(action => {
      expect(AUDIT_ACTION_LABELS[action]).toBeDefined();
      expect(typeof AUDIT_ACTION_LABELS[action]).toBe('string');
      expect(AUDIT_ACTION_LABELS[action].length).toBeGreaterThan(3);
    });
  });

  it('should log custom security events without throwing', async () => {
    const result = await auditService.logEvent('DOCUMENT_VERIFIED', 'doc-1', { method: 'SHA-256' });
    // Returns log object or null in mock/demo
    expect(result === null || typeof result === 'object').toBe(true);
  });
});
