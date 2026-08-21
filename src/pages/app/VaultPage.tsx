// ============================================================
// TrustLink Web — Professional Vault Page (File & Folder Explorer)
// Complete feature parity with mobile app
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
  Sparkles
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
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
      statusText: 'Computing SHA-256 digital fingerprint...',
      isComplete: false,
    });

    try {
      await documentService.uploadDocument(
        file,
        currentFolderId,
        (step, statusText) => {
          setUploadProgress(prev => ({
            ...prev,
            step,
            statusText,
            isComplete: step >= 4,
          }));
        }
      );

      await refresh();

      setTimeout(() => {
        setUploadProgress(prev => ({ ...prev, visible: false }));
      }, 800);
    } catch (err: any) {
      setUploadProgress(prev => ({ ...prev, visible: false }));
      alert(err.message || 'File upload failed');
    }
  };

  const handleOpenCreateFolder = () => {
    setFolderModalMode('create');
    setTargetFolder(null);
    setFolderNameInput('');
    setFolderModalOpen(true);
  };

  const handleOpenRenameFolder = (folder: Folder) => {
    setFolderModalMode('rename');
    setTargetFolder(folder);
    setFolderNameInput(folder.name);
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
  };

  const handleLeaveFolder = () => {
    setCurrentFolderId(null);
    setCurrentFolderName('');
    setActiveDropdownFolderId(null);
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
          <div className="flex items-center gap-2">
            {!isInsideFolder && (
              <Button
                variant="secondary"
                onClick={handleOpenCreateFolder}
                className="gap-1.5 text-xs py-2"
              >
                <Plus className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span>New Folder</span>
              </Button>
            )}

            <Button
              variant="primary"
              onClick={handleTriggerFileInput}
              className="gap-1.5 text-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </Button>
          </div>
        </div>

        {/* Search & Breadcrumb Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={handleLeaveFolder}
              className={`hover:text-indigo-600 font-medium ${!isInsideFolder ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
            >
              Vault Root
            </button>
            {isInsideFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                  {currentFolderName}
                </span>
              </>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isInsideFolder ? `Search in ${currentFolderName}...` : 'Search documents & folders...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Explorer Grid / List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Loading vault contents...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Folders Section (Only shown at root level when folders exist) */}
            {!isInsideFolder && filteredFolders.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Folders ({filteredFolders.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-3.5 flex items-center justify-between transition shadow-sm hover:shadow"
                    >
                      <button
                        onClick={() => handleEnterFolder(folder)}
                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                          <FolderIcon className="w-5 h-5" />
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
                  ))}
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
                  {filteredDocs.map((doc) => (
                    <Link
                      key={doc.id}
                      to={`/app/documents/${doc.id}`}
                      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-4 transition shadow-sm hover:shadow flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shrink-0">
                          {getFileIcon(doc.mime_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition">
                            {doc.name}
                          </p>
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
                          className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[9px] ${
                            doc.integrity_status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : doc.integrity_status === 'FAILED'
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                              : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}
                        >
                          {doc.integrity_status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create / Rename Folder Modal */}
        {folderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderIcon className="w-4 h-4 text-amber-500" />
                  <span>{folderModalMode === 'create' ? 'Create New Folder' : 'Rename Folder'}</span>
                </h3>
                <button
                  onClick={() => setFolderModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFolderSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Folder Name
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Legal Contracts, Invoices, Tax"
                    value={folderNameInput}
                    onChange={(e) => setFolderNameInput(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setFolderModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmittingFolder || !folderNameInput.trim()}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isSubmittingFolder ? 'Saving...' : folderModalMode === 'create' ? 'Create Folder' : 'Rename'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Live Upload Progress & Animation Modal */}
        <UploadProgressModal state={uploadProgress} />
      </div>
    </AppLayout>
  );
}
