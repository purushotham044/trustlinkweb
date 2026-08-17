// ============================================================
// TrustLink Web — Audit Service
// ============================================================

import { supabase } from '@/lib/supabase';
import type { AuditAction, AuditLog, AuditCategory, ExtendedAuditLog } from '@/types';

export const auditService = {
  async logEvent(
    action: AuditAction,
    documentId: string | null = null,
    metadata: Record<string, unknown> | null = null
  ): Promise<AuditLog | null> {
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
  },

  async getAuditLogs(category: AuditCategory = 'ALL'): Promise<ExtendedAuditLog[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    let query = supabase
      .from('audit_logs')
      .select(`*, document:documents(*)`)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    const actionsMap: Record<AuditCategory, AuditAction[] | null> = {
      ALL: null,
      BLOCKCHAIN: ['BLOCKCHAIN_ANCHORED', 'BLOCKCHAIN_ANCHOR_FAILED'],
      INTEGRITY: ['HASH_CREATED', 'DOCUMENT_VERIFIED'],
      SHARING: ['DOCUMENT_SHARED', 'SHARE_REVOKED'],
      FILES: ['DOCUMENT_UPLOADED', 'DOCUMENT_VIEWED', 'DOCUMENT_DOWNLOADED', 'DOCUMENT_RENAMED', 'DOCUMENT_MOVED', 'DOCUMENT_DELETED'],
    };

    const targetActions = actionsMap[category];
    if (targetActions) {
      query = query.in('action', targetActions);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as ExtendedAuditLog[];
  },
};
