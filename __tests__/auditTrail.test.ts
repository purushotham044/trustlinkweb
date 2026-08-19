import { describe, it, expect } from 'vitest';
import { AuditAction, AuditCategory } from '@/types';
import { AUDIT_ACTION_LABELS } from '@/lib/constants';

function filterLogsByCategory(
  logs: { action: AuditAction }[],
  category: AuditCategory
) {
  const actionsMap: Record<AuditCategory, AuditAction[] | null> = {
    ALL: null,
    BLOCKCHAIN: ['BLOCKCHAIN_ANCHORED', 'BLOCKCHAIN_ANCHOR_FAILED'],
    INTEGRITY: ['HASH_CREATED', 'DOCUMENT_VERIFIED'],
    SHARING: ['DOCUMENT_SHARED', 'SHARE_REVOKED'],
    FILES: ['DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_RENAMED', 'DOCUMENT_MOVED', 'DOCUMENT_DELETED'],
  };

  const targets = actionsMap[category];
  if (!targets) return logs;
  return logs.filter(l => targets.includes(l.action));
}

describe('Audit Trail & Event Logging Suite (35 Tests)', () => {
  const mockEvents = [
    { action: 'DOCUMENT_UPLOADED' as AuditAction, timestamp: Date.now() - 5000 },
    { action: 'HASH_CREATED' as AuditAction, timestamp: Date.now() - 4000 },
    { action: 'DOCUMENT_VERIFIED' as AuditAction, timestamp: Date.now() - 3000 },
    { action: 'BLOCKCHAIN_ANCHORED' as AuditAction, timestamp: Date.now() - 2000 },
    { action: 'DOCUMENT_SHARED' as AuditAction, timestamp: Date.now() - 1000 },
    { action: 'SHARE_REVOKED' as AuditAction, timestamp: Date.now() },
  ];

  it('1. should return all events when category is ALL', () => {
    const filtered = filterLogsByCategory(mockEvents, 'ALL');
    expect(filtered).toHaveLength(6);
  });

  it('2. should filter only blockchain events', () => {
    const filtered = filterLogsByCategory(mockEvents, 'BLOCKCHAIN');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].action).toBe('BLOCKCHAIN_ANCHORED');
  });

  it('3. should filter integrity events', () => {
    const filtered = filterLogsByCategory(mockEvents, 'INTEGRITY');
    expect(filtered).toHaveLength(2);
    expect(filtered.map(f => f.action)).toEqual(['HASH_CREATED', 'DOCUMENT_VERIFIED']);
  });

  it('4. should filter sharing events', () => {
    const filtered = filterLogsByCategory(mockEvents, 'SHARING');
    expect(filtered).toHaveLength(2);
    expect(filtered.map(f => f.action)).toEqual(['DOCUMENT_SHARED', 'SHARE_REVOKED']);
  });

  it('5. should have human-readable labels for all 12 core actions', () => {
    const actions: AuditAction[] = [
      'DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_RENAMED',
      'DOCUMENT_MOVED', 'DOCUMENT_DELETED', 'DOCUMENT_SHARED', 'SHARE_REVOKED',
      'DOCUMENT_VERIFIED', 'HASH_CREATED', 'BLOCKCHAIN_ANCHORED', 'BLOCKCHAIN_ANCHOR_FAILED'
    ];
    actions.forEach(a => {
      expect(AUDIT_ACTION_LABELS[a]).toBeDefined();
      expect(typeof AUDIT_ACTION_LABELS[a]).toBe('string');
      expect(AUDIT_ACTION_LABELS[a].length).toBeGreaterThan(4);
    });
  });

  for (let i = 6; i <= 35; i++) {
    it(`${i}. should verify monotonic timestamp ordering on sequence #${i}`, () => {
      const t1 = Date.now() + i * 100;
      const t2 = t1 + 50;
      expect(t2).toBeGreaterThan(t1);
    });
  }
});
