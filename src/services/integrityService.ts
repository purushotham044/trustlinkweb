// ============================================================
// TrustLink Web — Integrity Service
// Cryptographic integrity records and verification checks
// ============================================================

import { supabase } from '@/lib/supabase';
import { Document, IntegrityRecord } from '@/types';
import { computeSha256FromBuffer } from '@/lib/crypto';

export const integrityService = {
  /**
   * Creates an immutable integrity record for a document.
   */
  async createIntegrityRecord(
    documentId: string,
    sha256Hash: string,
    versionReference: number = 1
  ): Promise<IntegrityRecord | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('document_integrity_records')
      .insert({
        document_id: documentId,
        sha256_hash: sha256Hash.toLowerCase(),
        generated_by: user.user.id,
        version_reference: versionReference,
      })
      .select()
      .single();

    if (error) {
      console.warn('Failed to insert integrity record:', error);
      return null;
    }

    // Log to audit trail
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.user.id,
        document_id: documentId,
        action: 'HASH_CREATED',
        metadata: { hash: sha256Hash.toLowerCase(), version: versionReference },
      });
    } catch (e) {}

    return data as IntegrityRecord;
  },

  /**
   * Fetches all integrity records (versions) for a document.
   */
  async getIntegrityRecords(documentId: string): Promise<IntegrityRecord[]> {
    const { data, error } = await supabase
      .from('document_integrity_records')
      .select('*')
      .eq('document_id', documentId)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return (data || []) as IntegrityRecord[];
  },

  /**
   * Verifies a document's cryptographic integrity by fetching its binary from storage,
   * re-computing SHA-256 in browser, and comparing against the recorded hash.
   */
  async verifyDocument(document: Document): Promise<boolean> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    // 1. Get signed URL to fetch bytes
    const { data: signedData, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(document.storage_path, 60);

    if (urlError || !signedData?.signedUrl) {
      throw new Error('Could not access document storage to verify integrity.');
    }

    // 2. Fetch binary
    const response = await fetch(signedData.signedUrl);
    if (!response.ok) {
      throw new Error('Failed to retrieve document binary from cloud vault.');
    }

    const arrayBuffer = await response.arrayBuffer();
    const computedHash = computeSha256FromBuffer(arrayBuffer);
    const expectedHash = (document.current_hash || '').toLowerCase();
    const isMatch = computedHash === expectedHash;

    // 3. Update status in database
    const newStatus = isMatch ? 'VERIFIED' : 'FAILED';
    await supabase
      .from('documents')
      .update({
        integrity_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', document.id);

    // 4. Log verification to audit trail
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.user.id,
        document_id: document.id,
        action: 'DOCUMENT_VERIFIED',
        metadata: {
          computed_hash: computedHash,
          expected_hash: expectedHash,
          match: isMatch,
        },
      });
    } catch (e) {}

    return isMatch;
  }
};
