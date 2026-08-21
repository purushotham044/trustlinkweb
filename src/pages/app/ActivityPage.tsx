// ============================================================
// TrustLink Web — Security Audit Trail & Activity Timeline
// Complete feature parity with mobile app: timeline, date groups, certificate modal
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Shield, 
  Link2, 
  Share2, 
  Upload, 
  Download, 
  Trash2, 
  LogIn, 
  LogOut, 
  UserPlus, 
  FolderPlus, 
  FolderMinus, 
  Edit2, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Layers,
  FileText,
  Copy,
  Check,
  ExternalLink,
  X,
  File
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { auditService } from '@/services/auditService';
import { ExtendedAuditLog, AuditCategory } from '@/types';
import { truncateHash, truncateTxHash } from '@/lib/crypto';
import { BLOCKCHAIN_EXPLORER_BASE } from '@/lib/constants';

interface DateSection {
  title: string;
  data: ExtendedAuditLog[];
}

export function ActivityPage() {
  const [activeCategory, setActiveCategory] = useState<AuditCategory>('ALL');
  const [logs, setLogs] = useState<ExtendedAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedAuditLog | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loadLogs = async (category: AuditCategory = activeCategory) => {
    try {
      setLoading(true);
      const data = await auditService.getAuditLogs(category);
      setLogs(data);
    } catch (err: any) {
      console.warn('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs(activeCategory);
  }, [activeCategory]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getActionConfig = (action: string) => {
    switch (action) {
      case 'BLOCKCHAIN_ANCHORED':
        return {
          icon: <Link2 className="w-4 h-4 text-indigo-600" />,
          title: 'Ethereum Proof Created',
          badgeText: 'Sepolia',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'BLOCKCHAIN_ANCHOR_FAILED':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
          title: 'Blockchain Anchoring Failed',
          badgeText: 'Failed',
          badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          nodeBorder: 'border-rose-500',
        };
      case 'HASH_CREATED':
        return {
          icon: <Shield className="w-4 h-4 text-indigo-600" />,
          title: 'Digital Fingerprint Generated',
          badgeText: 'SHA-256',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'DOCUMENT_VERIFIED':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          title: 'Cryptographic Check Passed',
          badgeText: 'Authentic',
          badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          nodeBorder: 'border-emerald-500',
        };
      case 'DOCUMENT_SHARED':
        return {
          icon: <Share2 className="w-4 h-4 text-amber-600" />,
          title: 'Document Access Granted',
          badgeText: 'Shared',
          badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          nodeBorder: 'border-amber-500',
        };
      case 'SHARE_REVOKED':
        return {
          icon: <Share2 className="w-4 h-4 text-rose-600" />,
          title: 'Share Access Revoked',
          badgeText: 'Revoked',
          badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          nodeBorder: 'border-rose-500',
        };
      case 'DOCUMENT_UPLOADED':
        return {
          icon: <Upload className="w-4 h-4 text-indigo-600" />,
          title: 'Document Vaulted',
          badgeText: 'Stored',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'DOCUMENT_DOWNLOADED':
        return {
          icon: <Download className="w-4 h-4 text-slate-500" />,
          title: 'Document Downloaded',
          badgeText: 'Download',
          badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
          nodeBorder: 'border-slate-400',
        };
      case 'DOCUMENT_DELETED':
        return {
          icon: <Trash2 className="w-4 h-4 text-rose-600" />,
          title: 'Document Deleted',
          badgeText: 'Deleted',
          badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          nodeBorder: 'border-rose-500',
        };
      case 'USER_LOGIN':
        return {
          icon: <LogIn className="w-4 h-4 text-indigo-600" />,
          title: 'User Signed In',
          badgeText: 'Auth',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'USER_LOGOUT':
        return {
          icon: <LogOut className="w-4 h-4 text-slate-400" />,
          title: 'User Signed Out',
          badgeText: 'Auth',
          badgeClass: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
          nodeBorder: 'border-slate-400',
        };
      case 'USER_REGISTERED':
        return {
          icon: <UserPlus className="w-4 h-4 text-emerald-600" />,
          title: 'Account Created',
          badgeText: 'New User',
          badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          nodeBorder: 'border-emerald-500',
        };
      case 'FOLDER_CREATED':
        return {
          icon: <FolderPlus className="w-4 h-4 text-amber-600" />,
          title: 'Folder Created',
          badgeText: 'Folder',
          badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          nodeBorder: 'border-amber-500',
        };
      case 'FOLDER_RENAMED':
        return {
          icon: <Edit2 className="w-4 h-4 text-amber-600" />,
          title: 'Folder Renamed',
          badgeText: 'Folder',
          badgeClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
          nodeBorder: 'border-amber-500',
        };
      case 'FOLDER_DELETED':
        return {
          icon: <FolderMinus className="w-4 h-4 text-rose-600" />,
          title: 'Folder Deleted',
          badgeText: 'Deleted',
          badgeClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
          nodeBorder: 'border-rose-500',
        };
      default:
        return {
          icon: <Activity className="w-4 h-4 text-slate-500" />,
          title: action.replace(/_/g, ' '),
          badgeText: 'Event',
          badgeClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
          nodeBorder: 'border-slate-400',
        };
    }
  };

  const groupedSections: DateSection[] = useMemo(() => {
    if (!logs.length) return [];

    const map = new Map<string, ExtendedAuditLog[]>();
    const today = new Date().toDateString();
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();

    logs.forEach((log) => {
      const d = new Date(log.created_at);
      const dateStr = d.toDateString();

      let header = d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      if (dateStr === today) {
        header = 'Today';
      } else if (dateStr === yesterday) {
        header = 'Yesterday';
      }

      if (!map.has(header)) {
        map.set(header, []);
      }
      map.get(header)!.push(log);
    });

    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [logs]);

  const categories: { key: AuditCategory; label: string; icon: any }[] = [
    { key: 'ALL', label: 'All Activity', icon: Layers },
    { key: 'FILES', label: 'Vault Files', icon: FileText },
    { key: 'INTEGRITY', label: 'Signatures', icon: Shield },
    { key: 'BLOCKCHAIN', label: 'Blockchain', icon: Link2 },
    { key: 'SHARING', label: 'Sharing', icon: Share2 },
  ];

  const selectedMeta = selectedEvent?.metadata as Record<string, any> | null;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Enterprise Audit Trail
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Activity History
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold self-start sm:self-center">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Cryptographically Logged</span>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Sectioned Timeline */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Loading audit trail records...</p>
          </div>
        ) : groupedSections.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <Activity className="w-12 h-12 text-slate-400 mb-3 opacity-50" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Activity in this Category</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Every document upload, cryptographic signature, blockchain anchoring event, and permission grant is automatically recorded here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedSections.map((section) => (
              <div key={section.title} className="space-y-3">
                {/* Date Header Badge */}
                <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  {section.title}
                </div>

                {/* Vertical Timeline Items */}
                <div className="relative pl-6 space-y-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {section.data.map((item) => {
                    const config = getActionConfig(item.action);
                    const meta = (item.metadata || {}) as Record<string, any>;
                    const targetName = item.document?.name || meta.name || meta.folder_name || meta.email || null;
                    const timeString = new Date(item.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEvent(item)}
                        className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-4 transition shadow-sm hover:shadow cursor-pointer"
                      >
                        {/* Node Icon on Timeline */}
                        <div
                          className={`absolute -left-[31px] top-4 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 ${config.nodeBorder} flex items-center justify-center shadow-sm shrink-0 z-10`}
                        >
                          {config.icon}
                        </div>

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                              {config.title}
                            </p>
                            {targetName && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                                <FileText className="w-3 h-3 shrink-0 text-slate-400" />
                                <span>{targetName}</span>
                              </p>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1">{timeString}</p>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${config.badgeClass}`}
                          >
                            {config.badgeText}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Audit Certificate Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Audit Event Certificate
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                {/* Event Summary Banner */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/50">
                  <p className="font-bold text-slate-900 dark:text-white mb-0.5">
                    {getActionConfig(selectedEvent.action).title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(selectedEvent.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Metadata Table */}
                <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between items-center p-2.5">
                    <span className="text-slate-500">Event ID</span>
                    <button
                      onClick={() => copyToClipboard(selectedEvent.id, 'id')}
                      className="font-mono text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <span>{truncateHash(selectedEvent.id)}</span>
                      {copiedField === 'id' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  {selectedEvent.document && (
                    <div className="flex justify-between items-center p-2.5">
                      <span className="text-slate-500">Document</span>
                      <span className="font-medium text-slate-900 dark:text-white truncate max-w-xs">{selectedEvent.document.name}</span>
                    </div>
                  )}

                  {selectedMeta?.folder_name && (
                    <div className="flex justify-between items-center p-2.5">
                      <span className="text-slate-500">Folder</span>
                      <span className="font-medium text-slate-900 dark:text-white">{selectedMeta.folder_name}</span>
                    </div>
                  )}

                  {selectedMeta?.email && (
                    <div className="flex justify-between items-center p-2.5">
                      <span className="text-slate-500">User Email</span>
                      <span className="font-medium text-slate-900 dark:text-white">{selectedMeta.email}</span>
                    </div>
                  )}

                  {selectedMeta?.size && (
                    <div className="flex justify-between items-center p-2.5">
                      <span className="text-slate-500">File Size</span>
                      <span className="font-medium text-slate-900 dark:text-white">{(selectedMeta.size / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                </div>

                {/* SHA-256 Fingerprint */}
                {selectedMeta?.hash && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700/50 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">SHA-256 Fingerprint</span>
                      <button
                        onClick={() => copyToClipboard(selectedMeta.hash, 'hash')}
                        className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {copiedField === 'hash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'hash' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all select-all">
                      {selectedMeta.hash}
                    </p>
                  </div>
                )}

                {/* Sepolia Transaction Proof */}
                {selectedMeta?.transaction_hash && (
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl p-3 border border-indigo-200 dark:border-indigo-900/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-300">Sepolia Transaction</span>
                      <button
                        onClick={() => copyToClipboard(selectedMeta.transaction_hash, 'tx')}
                        className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        {copiedField === 'tx' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedField === 'tx' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 break-all">
                      {selectedMeta.transaction_hash}
                    </p>
                    <a
                      href={`${BLOCKCHAIN_EXPLORER_BASE}${selectedMeta.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline pt-1"
                    >
                      <span>Verify on Sepolia Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => setSelectedEvent(null)}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
