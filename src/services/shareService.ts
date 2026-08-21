// ============================================================
// TrustLink Web — Share Service
// Multi-channel and in-app sharing with duration presets and revocation
// ============================================================

import { supabase } from '@/lib/supabase';
import { Document, DocumentShare, SharePermission } from '@/types';

export const shareService = {
  /**
   * Shares a document with another user via email.
   */
  async shareDocument(
    documentId: string,
    recipientEmail: string,
    permission: SharePermission,
    expiresAt: string | null = null
  ): Promise<DocumentShare> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const cleanEmail = recipientEmail.trim().toLowerCase();

    // 1. Resolve recipient profile by email or direct ID
    let recipientId = cleanEmail;
    const isEmail = cleanEmail.includes('@');

    if (isEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profile) {
        recipientId = profile.id;
      }
    }

    // 2. Insert or update share
    const { data, error } = await supabase
      .from('document_shares')
      .upsert(
        {
          document_id: documentId,
          owner_id: user.user.id,
          shared_with_id: recipientId,
          permission,
          expires_at: expiresAt,
          revoked_at: null,
        },
        { onConflict: 'document_id,shared_with_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Share error:', error);
      throw new Error(`Sharing failed: ${error.message || 'Could not grant access'}`);
    }

    // 3. Log share to audit trail
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.user.id,
        document_id: documentId,
        action: 'DOCUMENT_SHARED',
        metadata: {
          recipient: recipientEmail,
          permission,
          expires_at: expiresAt,
        },
      });
    } catch (e) {}

    return data as DocumentShare;
  },

  /**
   * Fetches documents shared with the current user.
   */
  async getSharedWithMe(): Promise<DocumentShare[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('document_shares')
      .select(`
        *,
        document:documents(*)
      `)
      .or(`shared_with_id.eq.${user.user.id},shared_with_id.eq.${user.user.email}`)
      .is('revoked_at', null)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DocumentShare[];
  },

  /**
   * Fetches documents shared by the current user.
   */
  async getSharedByMe(): Promise<DocumentShare[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('document_shares')
      .select(`
        *,
        document:documents(*)
      `)
      .eq('owner_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DocumentShare[];
  },

  /**
   * Revokes an active share.
   */
  async revokeShare(shareId: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('document_shares')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', shareId)
      .select()
      .single();

    if (error) throw error;

    // Log revocation to audit trail
    if (data) {
      try {
        await supabase.from('audit_logs').insert({
          user_id: user.user.id,
          document_id: data.document_id,
          action: 'SHARE_REVOKED',
          metadata: { share_id: shareId },
        });
      } catch (e) {}
    }
  },

  /**
   * Shares a document via Web Share API or copies link to clipboard.
   */
  async shareViaWeb(doc: Document): Promise<void> {
    const shareUrl = `${window.location.origin}/app/documents/${doc.id}`;
    const shareText = `TrustLink Verified Document\n"${doc.name}"\nSHA-256: ${doc.current_hash || 'Verified'}\nAccess Link: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `TrustLink — ${doc.name}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
    }
  }
};
