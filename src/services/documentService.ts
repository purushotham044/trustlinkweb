// ============================================================
// TrustLink Web — Document Service
// ============================================================

import { supabase } from '@/lib/supabase';
import type { Document, Folder, DashboardStats } from '@/types';

export const documentService = {
  async getDocuments(folderId: string | null = null): Promise<Document[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    let query = supabase
      .from('documents')
      .select('*')
      .eq('owner_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (folderId === null) {
      query = query.is('folder_id', null);
    } else {
      query = query.eq('folder_id', folderId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Document[];
  },

  async getDocumentById(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Document;
  },

  async getFolders(parentId: string | null = null): Promise<Folder[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    let query = supabase
      .from('folders')
      .select('*')
      .eq('owner_id', userData.user.id)
      .order('name', { ascending: true });

    if (parentId === null) {
      query = query.is('parent_id', null);
    } else {
      query = query.eq('parent_id', parentId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Folder[];
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const uid = userData.user.id;

    const [
      { count: totalCount },
      { count: verifiedCount },
      { count: anchoredCount },
      { count: sharedCount },
    ] = await Promise.all([
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('owner_id', uid),
      supabase.from('documents').select('*', { count: 'exact', head: true }).eq('owner_id', uid).eq('integrity_status', 'VERIFIED'),
      supabase.from('blockchain_proofs').select('*, documents!inner(owner_id)', { count: 'exact', head: true }).eq('documents.owner_id', uid).eq('status', 'CONFIRMED'),
      supabase.from('document_shares').select('*', { count: 'exact', head: true }).eq('owner_id', uid).is('revoked_at', null),
    ]);

    return {
      totalDocs: totalCount || 0,
      verifiedDocs: verifiedCount || 0,
      anchoredDocs: anchoredCount || 0,
      sharedDocs: sharedCount || 0,
    };
  },

  async deleteDocument(doc: Document): Promise<void> {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([doc.storage_path]);
    if (storageError) console.warn('Storage delete warning:', storageError);

    const { error } = await supabase.from('documents').delete().eq('id', doc.id);
    if (error) throw error;
  },
};
