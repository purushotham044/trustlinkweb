// ============================================================
// TrustLink Web — useDocuments Hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { documentService } from '@/services/documentService';
import { folderService } from '@/services/folderService';
import { supabase } from '@/lib/supabase';
import type { Document, Folder, DashboardStats } from '@/types';

export function useDocuments(folderId: string | null = null) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [docs, fols] = await Promise.all([
        documentService.getDocuments(folderId),
        folderId === null ? folderService.getFolders(null) : Promise.resolve([]),
      ]);
      setDocuments(docs);
      setFolders(fols);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    load();
  }, [load]);

  return { documents, folders, loading, error, refresh: load };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDocs: 0,
    verifiedDocs: 0,
    anchoredDocs: 0,
    sharedDocs: 0,
  });
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setLoading(false);
      return;
    }

    try {
      const [
        { count: totalCount },
        { count: verifiedCount },
        { count: anchoredCount },
        { count: sharedCount },
        { data: recents },
      ] = await Promise.all([
        supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.user.id),
        supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.user.id)
          .eq('integrity_status', 'VERIFIED'),
        supabase
          .from('blockchain_proofs')
          .select('*, document:documents!inner(owner_id)', { count: 'exact', head: true })
          .eq('document.owner_id', user.user.id)
          .eq('status', 'CONFIRMED'),
        supabase
          .from('document_shares')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.user.id)
          .is('revoked_at', null),
        supabase
          .from('documents')
          .select('*')
          .eq('owner_id', user.user.id)
          .order('created_at', { ascending: false })
          .limit(4),
      ]);

      setStats({
        totalDocs: totalCount || 0,
        verifiedDocs: verifiedCount || 0,
        anchoredDocs: anchoredCount || 0,
        sharedDocs: sharedCount || 0,
      });
      setRecentDocs((recents || []) as Document[]);
    } catch (err) {
      console.warn('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stats, recentDocs, loading, refresh: load };
}
