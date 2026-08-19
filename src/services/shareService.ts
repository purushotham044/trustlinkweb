// ============================================================
// TrustLink Web — Share Service with Test / Demo Fallback
// ============================================================

import { supabase } from '@/lib/supabase';
import type { DocumentShare, SharePermission, ExtendedDocumentShare } from '@/types';

let demoShares: ExtendedDocumentShare[] = [
  {
    id: 'share-1',
    document_id: 'doc-1',
    owner_id: 'demo-user-0000-0000-000000000001',
    shared_with_id: 'colleague@firm.com',
    permission: 'VIEW',
    expires_at: new Date(Date.now() + 86400000 * 7).toISOString(),
    revoked_at: null,
    created_at: new Date().toISOString(),
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  },
  {
    id: 'share-2',
    document_id: 'doc-2',
    owner_id: 'demo-user-0000-0000-000000000001',
    shared_with_id: 'auditor@kpmg.com',
    permission: 'DOWNLOAD',
    expires_at: new Date(Date.now() + 86400000 * 2).toISOString(),
    revoked_at: null,
    created_at: new Date().toISOString(),
  }
];

export const shareService = {
  async shareDocument(
    documentId: string,
    recipientIdentifier: string,
    permission: SharePermission = 'VIEW',
    expiresAt: string | null = null
  ): Promise<DocumentShare> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
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

        if (!error && data) {
          await supabase.from('audit_logs').insert({
            user_id: userData.user.id,
            document_id: documentId,
            action: 'DOCUMENT_SHARED',
            metadata: { shared_with: targetUserId, permission, expires_at: expiresAt },
          });
          return data as DocumentShare;
        }
      }
    } catch (e) {
      console.warn('Supabase shareDocument fallback to demo state:', e);
    }

    const newShare: ExtendedDocumentShare = {
      id: `share-${Date.now()}`,
      document_id: documentId,
      owner_id: 'demo-user-0000-0000-000000000001',
      shared_with_id: recipientIdentifier,
      permission,
      expires_at: expiresAt,
      revoked_at: null,
      created_at: new Date().toISOString(),
    };
    demoShares = [newShare, ...demoShares];
    return newShare;
  },

  async getSharesByMe(): Promise<ExtendedDocumentShare[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data, error } = await supabase
          .from('document_shares')
          .select(`*, document:documents(*)`)
          .eq('owner_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) return data as ExtendedDocumentShare[];
      }
      return demoShares;
    } catch {
      return demoShares;
    }
  },

  async getSharesWithMe(): Promise<ExtendedDocumentShare[]> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data, error } = await supabase
          .from('document_shares')
          .select(`*, document:documents(*)`)
          .eq('shared_with_id', userData.user.id)
          .is('revoked_at', null)
          .order('created_at', { ascending: false });

        if (!error && data) return data as ExtendedDocumentShare[];
      }
      return demoShares.filter(s => s.revoked_at === null);
    } catch {
      return demoShares.filter(s => s.revoked_at === null);
    }
  },

  async revokeShare(shareId: string, documentId?: string): Promise<void> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase
          .from('document_shares')
          .update({ revoked_at: new Date().toISOString() })
          .eq('id', shareId);

        await supabase.from('audit_logs').insert({
          user_id: userData.user.id,
          document_id: documentId || null,
          action: 'SHARE_REVOKED',
          metadata: { share_id: shareId },
        });
      }
    } catch (e) {
      console.warn('Supabase revokeShare fallback:', e);
    }

    demoShares = demoShares.map(s => s.id === shareId ? { ...s, revoked_at: new Date().toISOString() } : s);
  },
};
