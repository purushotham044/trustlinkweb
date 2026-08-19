// ============================================================
// TrustLink Web — Share Service
// ============================================================

import { supabase } from '@/lib/supabase';
import type { DocumentShare, SharePermission, ExtendedDocumentShare } from '@/types';

export const shareService = {
  async shareDocument(
    documentId: string,
    recipientIdentifier: string,
    permission: SharePermission = 'VIEW',
    expiresAt: string | null = null
  ): Promise<DocumentShare> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    let recipientId = recipientIdentifier.trim();
    if (recipientId.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', recipientId)
        .maybeSingle();
      if (profile) recipientId = profile.id;
    }

    const targetUserId = recipientId.length === 36 ? recipientId : userData.user.id;

    const { data, error } = await supabase
      .from('document_shares')
      .insert({
        document_id: documentId,
        owner_id: userData.user.id,
        shared_with_id: targetUserId,
        permission,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      document_id: documentId,
      action: 'DOCUMENT_SHARED',
      metadata: { shared_with: targetUserId, permission, expires_at: expiresAt },
    });

    return data as DocumentShare;
  },

  async getSharesByMe(): Promise<ExtendedDocumentShare[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('document_shares')
      .select(`*, document:documents(*)`)
      .eq('owner_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ExtendedDocumentShare[];
  },

  async getSharesWithMe(): Promise<ExtendedDocumentShare[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('document_shares')
      .select(`*, document:documents(*)`)
      .eq('shared_with_id', userData.user.id)
      .is('revoked_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ExtendedDocumentShare[];
  },

  async revokeShare(shareId: string, documentId?: string): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('document_shares')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', shareId);

    if (error) throw error;

    await supabase.from('audit_logs').insert({
      user_id: userData.user.id,
      document_id: documentId || null,
      action: 'SHARE_REVOKED',
      metadata: { share_id: shareId },
    });
  },
};
