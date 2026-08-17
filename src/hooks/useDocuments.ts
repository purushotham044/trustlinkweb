import { useState, useEffect, useCallback } from 'react';
import { documentService } from '@/services/documentService';
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
        documentService.getFolders(folderId),
      ]);
      setDocuments(docs);
      setFolders(fols);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => { load(); }, [load]);

  return { documents, folders, loading, error, refresh: load };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({ totalDocs: 0, verifiedDocs: 0, anchoredDocs: 0, sharedDocs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    documentService.getDashboardStats()
      .then(setStats)
      .catch(console.warn)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}
