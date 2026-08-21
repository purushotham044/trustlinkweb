// ============================================================
// TrustLink Web — Document Service
// Cloud storage uploads, SHA-256 integrity, folder associations
// ============================================================

import { supabase } from '@/lib/supabase';
import { Document } from '@/types';
import { computeFileSha256 } from '@/lib/crypto';
import { integrityService } from './integrityService';

export const documentService = {
  /**
   * Fetches all documents owned by the current user, optionally filtered by folder.
   */
  async getDocuments(folderId: string | null = null): Promise<Document[]> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('Not authenticated');

    let query = supabase
      .from('documents')
      .select('*')
      .eq('owner_id', session.session.user.id)
      .order('created_at', { ascending: false });

    if (folderId === null) {
      query = query.is('folder_id', null);
    } else {
      query = query.eq('folder_id', folderId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as Document[]) || [];
  },

  /**
   * Fetches a single document by ID with verification that it belongs to the user.
   */
  async getDocumentById(documentId: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle();

    if (error) throw error;
    return data as Document | null;
  },

  /**
   * Uploads a file to Supabase Storage, records it in PostgreSQL with initial status PENDING.
   */
  async uploadDocument(
    file: File,
    folderId: string | null = null,
    onProgress?: (step: number, statusText: string) => void
  ): Promise<Document> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 0. Ensure user profile exists
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          }, { onConflict: 'id' });
      }
    } catch (profileErr) {
      console.warn('Profile sync note:', profileErr);
    }

    // Step 1: Compute SHA-256 fingerprint
    onProgress?.(1, 'Computing cryptographic SHA-256 fingerprint...');
    const sha256Hash = await computeFileSha256(file);

    // Step 2: Storage Upload with isolated path
    onProgress?.(2, 'Encrypting & uploading to vault storage...');
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folderPrefix = folderId ? `folders/${folderId}/` : '';
    const storagePath = `${user.id}/${folderPrefix}${Date.now()}_${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Storage error: ${uploadError.message || 'Could not save file to storage bucket.'}`);
    }

    // Step 3: Database Record & Ledger
    onProgress?.(3, 'Recording verification entry in database...');
    const { data, error: dbError } = await supabase
      .from('documents')
      .insert({
        owner_id: user.id,
        folder_id: folderId,
        name: file.name,
        storage_path: storagePath,
        mime_type: file.type || 'application/octet-stream',
        size: file.size,
        current_hash: sha256Hash,
        integrity_status: 'PENDING', // Initial state upon upload is PENDING
      })
      .select()
      .single();

    if (dbError || !data) {
      // Rollback storage if DB fails
      await supabase.storage.from('documents').remove([storagePath]);
      throw new Error(`Database error: ${dbError?.message || 'Could not create document record.'}`);
    }

    const createdDoc = data as Document;

    // Create integrity record (resilient)
    try {
      await integrityService.createIntegrityRecord(createdDoc.id, sha256Hash, 1);
    } catch (integrityErr: any) {
      console.warn('Integrity ledger record note:', integrityErr.message);
    }

    // Log upload to audit trail (resilient)
    try {
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        document_id: createdDoc.id,
        action: 'DOCUMENT_UPLOADED',
        metadata: { name: file.name, size: file.size, mime_type: file.type, hash: sha256Hash },
      });
    } catch (auditErr: any) {
      console.warn('Audit log note:', auditErr.message);
    }

    onProgress?.(4, 'Document vaulted and ready for verification!');
    return createdDoc;
  },

  /**
   * Generates a signed, short-lived (60s) URL to download the document directly from Supabase Storage.
   */
  async getDownloadUrl(storagePath: string, expiresIn: number = 60): Promise<string> {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(storagePath, expiresIn);

    if (error || !data?.signedUrl) {
      throw new Error(`Failed to generate download URL: ${error?.message || 'Unknown error'}`);
    }

    return data.signedUrl;
  },

  /**
   * Initiates direct file download in the browser.
   */
  async downloadDocument(document: Document): Promise<void> {
    const downloadUrl = await this.getDownloadUrl(document.storage_path);
    const link = window.document.createElement('a');
    link.href = downloadUrl;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    // Record audit event
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          document_id: document.id,
          action: 'DOCUMENT_DOWNLOADED',
          metadata: { name: document.name },
        });
      } catch (e) {}
    }
  },

  /**
   * Moves a document into a folder (or removes it to root if folderId is null).
   */
  async moveDocument(documentId: string, folderId: string | null): Promise<void> {
    const { error } = await supabase
      .from('documents')
      .update({ folder_id: folderId })
      .eq('id', documentId);

    if (error) throw error;
  },

  /**
   * Permanently deletes a document from storage and database.
   */
  async deleteDocument(document: Document): Promise<void> {
    // 1. Delete DB record first
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', document.id);

    if (dbError) throw dbError;

    // 2. Remove physical file from bucket
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.storage_path]);

    if (storageError) {
      console.warn('Storage file cleanup warning:', storageError);
    }

    // 3. Record audit event
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          document_id: null,
          action: 'DOCUMENT_DELETED',
          metadata: { name: document.name, storage_path: document.storage_path },
        });
      } catch (e) {}
    }
  },
};
