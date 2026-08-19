// ============================================================
// TrustLink Web — Audit Service with Demo Fallback & Category Filter
// ============================================================

import { supabase } from '@/lib/supabase';
import type { AuditAction, AuditLog, AuditCategory, ExtendedAuditLog } from '@/types';

const DEMO_LOGS: ExtendedAuditLog[] = [
  {
    id: 'log-1',
    user_id: 'demo-user-0000-0000-000000000001',
    document_id: 'doc-1',
    action: 'BLOCKCHAIN_ANCHORED',
    metadata: { tx_hash: '0x8A3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b', network: 'Ethereum Sepolia', block: 5894123 },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    document: {
      id: 'doc-1',
      owner_id: 'demo-user-0000-0000-000000000001',
      folder_id: 'f-1',
      name: 'Master_Services_Agreement_2026.pdf',
      mime_type: 'application/pdf',
      size: 245760,
      storage_path: 'legal/msa_2026.pdf',
      current_hash: 'a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3',
      integrity_status: 'VERIFIED',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
  {
    id: 'log-2',
    user_id: 'demo-user-0000-0000-000000000001',
    document_id: 'doc-1',
    action: 'DOCUMENT_VERIFIED',
    metadata: { result: 'MATCH', hash: 'a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3' },
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: 'log-3',
    user_id: 'demo-user-0000-0000-000000000001',
    document_id: 'doc-2',
    action: 'DOCUMENT_SHARED',
    metadata: { shared_with: 'cfo@company.com', permission: 'DOWNLOAD', expires_at: '24h' },
    created_at: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
  },
  {
    id: 'log-4',
    user_id: 'demo-user-0000-0000-000000000001',
    document_id: 'doc-1',
    action: 'DOCUMENT_UPLOADED',
    metadata: { size_bytes: 245760, mime_type: 'application/pdf' },
    created_at: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
  }
];

export const auditService = {
  async logEvent(
    action: AuditAction,
    documentId: string | null = null,
    metadata: Record<string, unknown> | null = null
  ): Promise<AuditLog | null> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userData.user.id,
          document_id: documentId,
          action,
          metadata,
        })
        .select()
        .single();

      if (error) {
        console.warn('Failed to insert audit log:', error);
        return null;
      }
      return data as AuditLog;
    } catch {
      return null;
    }
  },

  async getAuditLogs(category: AuditCategory = 'ALL'): Promise<ExtendedAuditLog[]> {
    const actionsMap: Record<AuditCategory, AuditAction[] | null> = {
      ALL: null,
      BLOCKCHAIN: ['BLOCKCHAIN_ANCHORED', 'BLOCKCHAIN_ANCHOR_FAILED'],
      INTEGRITY: ['HASH_CREATED', 'DOCUMENT_VERIFIED'],
      SHARING: ['DOCUMENT_SHARED', 'SHARE_REVOKED'],
      FILES: ['DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_RENAMED', 'DOCUMENT_MOVED', 'DOCUMENT_DELETED'],
    };

    const targetActions = actionsMap[category];

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return targetActions ? DEMO_LOGS.filter(l => targetActions.includes(l.action)) : DEMO_LOGS;
      }

      let query = supabase
        .from('audit_logs')
        .select(`*, document:documents(*)`)
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (targetActions) {
        query = query.in('action', targetActions);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return targetActions ? DEMO_LOGS.filter(l => targetActions.includes(l.action)) : DEMO_LOGS;
      }
      return data as ExtendedAuditLog[];
    } catch {
      return targetActions ? DEMO_LOGS.filter(l => targetActions.includes(l.action)) : DEMO_LOGS;
    }
  },
};
