import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Folder as FolderIcon, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Upload, 
  Search, 
  Plus, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { useDocuments } from '@/hooks/useDocuments';
import { Document, Folder } from '@/types';

export function VaultPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, folders, loading, error, refresh } = useDocuments(currentFolderId);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (mime: string) => {
    if (mime.includes('pdf')) return <FileText size={20} className="text-[#EF4444]" />;
    if (mime.includes('image')) return <ImageIcon size={20} className="text-[#3B82F6]" />;
    if (mime.includes('word') || mime.includes('document')) return <FileText size={20} className="text-[#2563EB]" />;
    if (mime.includes('excel') || mime.includes('sheet')) return <FileText size={20} className="text-[#10B981]" />;
    return <File size={20} className="text-[#00D4FF]" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  return (
    <AppLayout>
      <div className="p-6 sm:p-8 max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {currentFolderId && (
                <button 
                  onClick={() => setCurrentFolderId(null)}
                  className="text-xs text-[#00D4FF] hover:underline flex items-center gap-1 mr-2"
                >
                  <ArrowLeft size={14} /> Back to Root
                </button>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9]">Document Vault</h1>
            </div>
            <p className="text-[#94A3B8] text-sm">Manage and cryptographically verify all stored documents.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" icon={<Plus size={16} />} onClick={() => alert('Folder creation in web client demo')}>
              New Folder
            </Button>
            <Button variant="primary" size="sm" icon={<Upload size={16} />} onClick={() => alert('Document upload via Supabase storage')}>
              Upload Document
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-3 bg-[#111827] border border-[#1E293B] rounded-xl px-4 py-3 focus-within:border-[#00D4FF] transition-colors">
            <Search size={18} className="text-[#475569]" />
            <input
              type="text"
              placeholder="Search documents by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#F1F5F9] placeholder-[#475569] outline-none"
            />
          </div>
        </div>

        {/* Folders Section */}
        {folders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-3">Folders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {folders.map(folder => (
                <div
                  key={folder.id}
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="flex items-center justify-between p-4 bg-[#111827] border border-[#1E293B] hover:border-[#2D3748] rounded-xl cursor-pointer transition-all hover:bg-[#1A2235]"
                >
                  <div className="flex items-center gap-3">
                    <FolderIcon size={20} className="text-[#F59E0B]" />
                    <span className="text-sm font-semibold text-[#F1F5F9]">{folder.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-[#475569]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[#475569] uppercase tracking-widest">
              Documents ({filteredDocs.length})
            </h2>
            <button onClick={refresh} className="text-xs text-[#00D4FF] hover:underline">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#94A3B8]">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-2xl text-center">
              <p className="text-sm text-[#EF4444] mb-2">{error}</p>
              <Button variant="ghost" size="sm" onClick={refresh}>Retry</Button>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <FileText size={36} className="text-[#475569] mx-auto mb-3" />
              <p className="text-base font-semibold text-[#F1F5F9] mb-1">No documents found</p>
              <p className="text-sm text-[#475569] mb-4">
                {searchQuery ? 'Try a different search query' : 'Upload your first document to begin securing files.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredDocs.map(doc => (
                <Link
                  key={doc.id}
                  to={`/app/vault/${doc.id}`}
                  className="flex items-center justify-between p-4 bg-[#111827] border border-[#1E293B] hover:border-[#2D3748] rounded-xl transition-all hover:bg-[#1A2235] group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#0A0E1A] border border-[#1E293B] flex items-center justify-center shrink-0">
                      {getFileIcon(doc.mime_type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#F1F5F9] truncate group-hover:text-[#00D4FF] transition-colors">
                        {doc.name}
                      </p>
                      <p className="text-xs text-[#475569]">
                        {formatSize(doc.size)} • {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {doc.integrity_status === 'VERIFIED' ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981] bg-[rgba(16,185,129,0.12)] px-2.5 py-1 rounded-md border border-[rgba(16,185,129,0.3)]">
                        <CheckCircle size={12} /> Verified
                      </span>
                    ) : doc.integrity_status === 'FAILED' ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#EF4444] bg-[rgba(239,68,68,0.12)] px-2.5 py-1 rounded-md border border-[rgba(239,68,68,0.3)]">
                        <AlertTriangle size={12} /> Tampered
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#F59E0B] bg-[rgba(245,158,11,0.12)] px-2.5 py-1 rounded-md border border-[rgba(245,158,11,0.3)]">
                        <Clock size={12} /> Pending
                      </span>
                    )}
                    <ChevronRight size={16} className="text-[#475569] group-hover:text-[#94A3B8]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
