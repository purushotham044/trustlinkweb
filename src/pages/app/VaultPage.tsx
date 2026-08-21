// ============================================================
// TrustLink Web — Professional Vault Page (File & Folder Explorer)
// Complete feature parity with mobile app: Multi-Select & Batch Actions
// ============================================================

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
  MoreVertical,
  Edit2,
  Trash2,
  Shield,
  FolderMinus,
  Check
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDocuments } from '@/hooks/useDocuments';
import { documentService } from '@/services/documentService';
import { folderService } from '@/services/folderService';
import { Document, Folder } from '@/types';
import { UploadProgressModal, UploadProgressState } from '@/components/common/UploadProgressModal';

export function VaultPage() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderName, setCurrentFolderName] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { documents, folders, loading, error, refresh } = useDocuments(currentFolderId);

  // Multi-selection state
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const isSelectionMode = selectedKeys.size > 0;

  // Upload modal & live animation state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    visible: false,
    fileName: '',
    step: 1,
    statusText: 'Preparing upload...',
    isComplete: false,
  });

  // Folder modal state (Create / Rename)
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState<'create' | 'rename'>('create');
  const [targetFolder, setTargetFolder] = useState<Folder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState('');
  const [isSubmittingFolder, setIsSubmittingFolder] = useState(false);

  // Active 3-dots folder dropdown
  const [activeDropdownFolderId, setActiveDropdownFolderId] = useState<string | null>(null);

  const isInsideFolder = currentFolderId !== null;

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFilteredCount = filteredDocs.length + filteredFolders.length;

  const toggleItemSelection = (key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedKeys.size === totalFilteredCount) {
      setSelectedKeys(new Set());
    } else {
      const allKeys = new Set([
        ...filteredFolders.map(f => `folder-${f.id}`),
        ...filteredDocs.map(d => `doc-${d.id}`),
      ]);
      setSelectedKeys(allKeys);
    }
  };

  const handleBatchDelete = async () => {
    const count = selectedKeys.size;
    if (count === 0) return;

    if (!window.confirm(`Are you sure you want to permanently delete ${count} selected item${count > 1 ? 's' : ''}?`)) {
      return;
    }

    try {
      const selectedFolders = folders.filter(f => selectedKeys.has(`folder-${f.id}`));
      const selectedDocuments = documents.filter(d => selectedKeys.has(`doc-${d.id}`));

      for (const folder of selectedFolders) {
        await folderService.deleteFolder(folder.id);
      }
      for (const doc of selectedDocuments) {
        await documentService.deleteDocument(doc);
      }

      setSelectedKeys(new Set());
      await refresh();
    } catch (err: any) {
      alert(err.message || 'Could not delete selected items');
    }
  };

  const getFileIcon = (mime: string) => {
    if (mime.includes('pdf')) return <FileText className="w-6 h-6 text-rose-500" />;
    if (mime.includes('image')) return <ImageIcon className="w-6 h-6 text-blue-500" />;
    if (mime.includes('word') || mime.includes('document')) return <FileText className="w-6 h-6 text-indigo-500" />;
    if (mime.includes('excel') || mime.includes('sheet')) return <FileText className="w-6 h-6 text-emerald-500" />;
    return <File className="w-6 h-6 text-cyan-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress({
      visible: true,
      fileName: file.name,
      step: 1,
      statusText: 'Reading file & calculating SHA-256 fingerprint...',
      isComplete: false,
    });

    try {
      await documentService.uploadDocument(file, currentFolderId, (step, statusText) => {
        setUploadProgress(prev => ({
          ...prev,
          step,
          statusText,
        }));
      });

      setUploadProgress(prev => ({
        ...prev,
        step: 4,
        statusText: 'Document secured in your vault!',
        isComplete: true,
      }));

      await refresh();
    } catch (err: any) {
      setUploadProgress(prev => ({ ...prev, visible: false }));
      alert(err.message || 'File upload failed');
    }
  };

  const handleOpenCreateFolder = () => {
    setFolderModalMode('create');
    setFolderNameInput('');
    setTargetFolder(null);
    setFolderModalOpen(true);
  };

  const handleOpenRenameFolder = (folder: Folder) => {
    setFolderModalMode('rename');
    setFolderNameInput(folder.name);
    setTargetFolder(folder);
    setFolderModalOpen(true);
    setActiveDropdownFolderId(null);
  };

  const handleFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = folderNameInput.trim();
    if (!trimmed) return;

    setIsSubmittingFolder(true);
    try {
      if (folderModalMode === 'create') {
        await folderService.createFolder(trimmed, null);
      } else if (targetFolder) {
        await folderService.renameFolder(targetFolder.id, trimmed);
      }
      setFolderModalOpen(false);
      setFolderNameInput('');
      await refresh();
    } catch (err: any) {
      alert(err.message || 'Folder operation failed');
    } finally {
      setIsSubmittingFolder(false);
    }
  };

  const handleDeleteFolderPreservingFiles = async (folder: Folder) => {
    setActiveDropdownFolderId(null);
    if (!window.confirm(`Move all files in "${folder.name}" to your main vault and delete only the folder?`)) {
      return;
    }

    try {
      await folderService.deleteFolderPreservingFiles(folder.id);
      await refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete folder');
    }
  };

  const handleDeleteFolderAll = async (folder: Folder) => {
    setActiveDropdownFolderId(null);
    if (!window.confirm(`Permanently delete "${folder.name}" and ALL documents stored inside it? This cannot be undone.`)) {
      return;
    }

    try {
      await folderService.deleteFolder(folder.id);
      await refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to delete folder');
    }
  };

  const handleEnterFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id);
    setCurrentFolderName(folder.name);
    setActiveDropdownFolderId(null);
    setSelectedKeys(new Set());
  };

  const handleLeaveFolder = () => {
    setCurrentFolderId(null);
    setCurrentFolderName('');
    setActiveDropdownFolderId(null);
    setSelectedKeys(new Set());
  };

  return (
    <AppLayout>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChosen}
      />

      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {isInsideFolder && (
                <button
                  onClick={handleLeaveFolder}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  title="Back to Vault Root"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isInsideFolder ? currentFolderName : 'Document Vault'}
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isInsideFolder
                ? `Viewing files inside "${currentFolderName}"`
                : 'Secure multi-tenant cryptographic storage repository'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {!isInsideFolder && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenCreateFolder}
                className="gap-1.5 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Folder</span>
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleTriggerFileInput}
              className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        </div>

        {/* Multi-Select Action Bar */}
        {isSelectionMode ? (
          <div className="flex items-center justify-between p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedKeys(new Set())}
                className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {selectedKeys.size} Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                {selectedKeys.size === totalFilteredCount ? 'Deselect All' : 'Select All'}
              </button>

              <button
                onClick={handleBatchDelete}
                className="px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/60 transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedKeys.size})</span>
              </button>
            </div>
          </div>
        ) : (
          /* Search Bar */
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={isInsideFolder ? `Search in ${currentFolderName}...` : 'Search vault documents and folders...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs py-2 bg-white dark:bg-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading vault cryptographic assets...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Folders Section (Only shown at root or inside folder if subfolders exist) */}
            {filteredFolders.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Folders ({filteredFolders.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredFolders.map((folder) => {
                    const isSelected = selectedKeys.has(`folder-${folder.id}`);
                    return (
                      <div
                        key={folder.id}
                        className={`relative group bg-white dark:bg-slate-900 border rounded-xl p-3.5 flex items-center justify-between transition shadow-sm hover:shadow ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={(e) => toggleItemSelection(`folder-${folder.id}`, e)}
                          className={`w-5 h-5 rounded border mr-2 flex items-center justify-center transition shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-transparent hover:border-slate-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <button
                          onClick={() => handleEnterFolder(folder)}
                          className="flex items-center gap-3 flex-1 min-w-0 text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <FolderIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {folder.name}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Created {formatDate(folder.created_at)}
                            </p>
                          </div>
                        </button>

                        {/* 3-Dots Options Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownFolderId(activeDropdownFolderId === folder.id ? null : folder.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeDropdownFolderId === folder.id && (
                            <div className="absolute right-0 top-7 z-20 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-150">
                              <button
                                onClick={() => handleOpenRenameFolder(folder)}
                                className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Rename Folder</span>
                              </button>
                              <button
                                onClick={() => handleDeleteFolderPreservingFiles(folder)}
                                className="w-full px-3 py-2 text-left text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                              >
                                <FolderMinus className="w-3.5 h-3.5" />
                                <span>Delete (Keep Files)</span>
                              </button>
                              <button
                                onClick={() => handleDeleteFolderAll(folder)}
                                className="w-full px-3 py-2 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Folder & All Files</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Documents Section */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Documents ({filteredDocs.length})
              </h3>

              {filteredDocs.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {searchQuery ? 'No matching documents found' : isInsideFolder ? `No documents in "${currentFolderName}"` : 'Vault is Empty'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mb-4">
                    {searchQuery ? 'Try a different search query' : 'Upload contracts, certificates, identity proofs, and deeds to protect them cryptographically.'}
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleTriggerFileInput}
                    className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload First Document</span>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredDocs.map((doc) => {
                    const isSelected = selectedKeys.has(`doc-${doc.id}`);
                    return (
                      <div
                        key={doc.id}
                        className={`group bg-white dark:bg-slate-900 border rounded-xl p-4 transition shadow-sm hover:shadow flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {/* Checkbox */}
                          <button
                            onClick={(e) => toggleItemSelection(`doc-${doc.id}`, e)}
                            className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-transparent hover:border-slate-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shrink-0">
                            {getFileIcon(doc.mime_type)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/app/documents/${doc.id}`}
                              className="text-xs font-bold text-slate-900 dark:text-white truncate block hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                            >
                              {doc.name}
                            </Link>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {formatSize(doc.size)} • {formatDate(doc.created_at)}
                            </p>
                          </div>
                        </div>

                        {/* Status and Fingerprint */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                          <div className="flex items-center gap-1 font-mono text-slate-400">
                            <Shield className="w-3 h-3 text-indigo-500" />
                            <span>{doc.current_hash ? `${doc.current_hash.slice(0, 6)}...${doc.current_hash.slice(-4)}` : 'Pending'}</span>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              doc.integrity_status === 'VERIFIED'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                                : doc.integrity_status === 'FAILED'
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                            }`}
                          >
                            {doc.integrity_status === 'VERIFIED' && <CheckCircle className="w-2.5 h-2.5" />}
                            {doc.integrity_status === 'FAILED' && <AlertTriangle className="w-2.5 h-2.5" />}
                            {doc.integrity_status === 'PENDING' && <Clock className="w-2.5 h-2.5" />}
                            <span>{doc.integrity_status}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New / Rename Folder Modal */}
      {folderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              {folderModalMode === 'create' ? 'Create New Folder' : 'Rename Folder'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {folderModalMode === 'create'
                ? 'Organize your cryptographic documents into structured collections.'
                : `Enter a new name for "${targetFolder?.name}"`}
            </p>

            <form onSubmit={handleFolderSubmit} className="space-y-4">
              <Input
                type="text"
                autoFocus
                placeholder="Folder Name"
                value={folderNameInput}
                onChange={(e) => setFolderNameInput(e.target.value)}
                className="text-xs"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFolderModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={isSubmittingFolder}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {folderModalMode === 'create' ? 'Create Folder' : 'Save Name'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Progress Modal */}
      <UploadProgressModal
        state={uploadProgress}
        onClose={() => setUploadProgress(prev => ({ ...prev, visible: false }))}
      />
    </AppLayout>
  );
}
