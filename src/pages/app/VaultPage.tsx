import React, { useState, useRef } from 'react';
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
  ArrowLeft,
  X,
  Hash,
  Check
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDocuments } from '@/hooks/useDocuments';
import { documentService } from '@/services/documentService';
import { computeFileSha256 } from '@/lib/crypto';
import { Document, Folder } from '@/types';

export function VaultPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, folders, loading, error, refresh } = useDocuments(currentFolderId);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  
  // Upload modal state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);
  const [isCalculatingHash, setIsCalculatingHash] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string | null>(currentFolderId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New folder state
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFolder = folders.find(f => f.id === currentFolderId);

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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsCalculatingHash(true);
    setComputedHash(null);

    try {
      const hash = await computeFileSha256(file);
      setComputedHash(hash);
    } catch (err) {
      console.warn('Hash computation error:', err);
    } finally {
      setIsCalculatingHash(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await documentService.uploadDocument(selectedFile, uploadTargetFolder);
      setIsUploadOpen(false);
      setSelectedFile(null);
      setComputedHash(null);
      await refresh();
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await documentService.createFolder(newFolderName, currentFolderId);
      setIsNewFolderOpen(false);
      setNewFolderName('');
      await refresh();
    } catch (err: any) {
      alert(err.message || 'Folder creation failed');
    } finally {
      setIsCreatingFolder(false);
    }
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
              <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9]">
                {currentFolder ? currentFolder.name : 'Document Vault'}
              </h1>
            </div>
            <p className="text-[#94A3B8] text-sm">
              {currentFolder 
                ? `Browsing contents of folder "${currentFolder.name}"`
                : 'Manage, organize, and cryptographically verify all stored documents.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              icon={<Plus size={16} />} 
              onClick={() => setIsNewFolderOpen(true)}
            >
              New Folder
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              icon={<Upload size={16} />} 
              onClick={() => {
                setUploadTargetFolder(currentFolderId);
                setIsUploadOpen(true);
              }}
            >
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

        {/* Folders Section (Only at root or when subfolders exist) */}
        {!currentFolderId && folders.length > 0 && (
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
              <p className="text-base font-semibold text-[#F1F5F9] mb-1">No documents in this view</p>
              <p className="text-sm text-[#475569] mb-6">
                {searchQuery ? 'Try a different search query' : 'Upload your first document to calculate SHA-256 and anchor proof.'}
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Upload size={16} />}
                onClick={() => {
                  setUploadTargetFolder(currentFolderId);
                  setIsUploadOpen(true);
                }}
              >
                Upload Document Now
              </Button>
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

      {/* ============================================================ */}
      {/* Upload Document Modal */}
      {/* ============================================================ */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-[fade-in_0.2s_ease-out]">
            <button
              onClick={() => {
                setIsUploadOpen(false);
                setSelectedFile(null);
                setComputedHash(null);
              }}
              className="absolute top-5 right-5 text-[#475569] hover:text-[#F1F5F9] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-[#00D4FF]">
                <Upload size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F1F5F9]">Upload to Vault</h2>
                <p className="text-xs text-[#475569]">Generates deterministic SHA-256 binary fingerprint</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Dropzone / Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#1E293B] hover:border-[#00D4FF] rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#0A0E1A] group"
              >
                {selectedFile ? (
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-lg bg-[#1A2235] border border-[#1E293B] flex items-center justify-center text-[#00D4FF] shrink-0">
                      {getFileIcon(selectedFile.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#F1F5F9] truncate">{selectedFile.name}</p>
                      <p className="text-xs text-[#475569]">{formatSize(selectedFile.size)}</p>
                    </div>
                    <span className="text-xs text-[#00D4FF] group-hover:underline shrink-0">Change</span>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} className="text-[#475569] group-hover:text-[#00D4FF] mx-auto mb-2 transition-colors" />
                    <p className="text-sm font-semibold text-[#F1F5F9] mb-1">Click to select a document</p>
                    <p className="text-xs text-[#475569]">PDF, Word, Excel, Images, or Text (up to 50 MB)</p>
                  </div>
                )}
              </div>

              {/* SHA-256 Calculation State */}
              {isCalculatingHash && (
                <div className="flex items-center gap-2 p-3 bg-[#0A0E1A] border border-[#1E293B] rounded-xl text-xs text-[#00D4FF]">
                  <div className="w-3.5 h-3.5 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
                  Calculating binary SHA-256 checksum in browser...
                </div>
              )}

              {computedHash && (
                <div className="p-3 bg-[#0A0E1A] border border-[rgba(0,212,255,0.3)] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-wider flex items-center gap-1">
                      <Check size={12} /> SHA-256 Calculated
                    </span>
                    <span className="text-[9px] text-[#475569]">Deterministic</span>
                  </div>
                  <code className="text-[11px] text-[#00D4FF] font-mono break-all block leading-tight">
                    {computedHash}
                  </code>
                </div>
              )}

              {/* Folder Selector */}
              {folders.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-1.5">
                    Save to Folder
                  </label>
                  <select
                    value={uploadTargetFolder || ''}
                    onChange={e => setUploadTargetFolder(e.target.value || null)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm text-[#F1F5F9] bg-[#0A0E1A] border-[#1E293B] outline-none focus:border-[#00D4FF]"
                  >
                    <option value="">(Root Vault)</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setIsUploadOpen(false);
                    setSelectedFile(null);
                    setComputedHash(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isUploading}
                  disabled={!selectedFile || isCalculatingHash}
                  icon={<Upload size={16} />}
                >
                  Confirm &amp; Store
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Create New Folder Modal */}
      {/* ============================================================ */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-[fade-in_0.2s_ease-out]">
            <button
              onClick={() => {
                setIsNewFolderOpen(false);
                setNewFolderName('');
              }}
              className="absolute top-5 right-5 text-[#475569] hover:text-[#F1F5F9] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.3)] flex items-center justify-center text-[#F59E0B]">
                <FolderIcon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F1F5F9]">New Vault Folder</h2>
                <p className="text-xs text-[#475569]">Organize your verifiable records</p>
              </div>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-5">
              <Input
                label="Folder Name"
                placeholder="e.g. Real Estate Deeds"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                autoFocus
                required
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setIsNewFolderOpen(false);
                    setNewFolderName('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={isCreatingFolder}
                  disabled={!newFolderName.trim()}
                  icon={<Plus size={16} />}
                >
                  Create Folder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
