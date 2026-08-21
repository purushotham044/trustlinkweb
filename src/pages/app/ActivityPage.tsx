// ============================================================
// TrustLink Web — Security Audit Trail & Activity Timeline
// Clean, High-Precision Timestamps & Sleek Modern Design
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Shield, 
  Link2, 
  Upload, 
  Download, 
  Trash2, 
  LogIn, 
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
          title: 'Sepolia Proof Confirmed',
          badgeText: 'On-Chain',
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
          title: 'SHA-256 Fingerprint Generated',
          badgeText: 'Fingerprinted',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'DOCUMENT_VERIFIED':
        return {
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          title: 'Cryptographic Integrity Verified',
          badgeText: 'Verified',
          badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          nodeBorder: 'border-emerald-500',
        };
      case 'DOCUMENT_UPLOADED':
        return {
          icon: <Upload className="w-4 h-4 text-indigo-600" />,
          title: 'Document Vaulted',
          badgeText: 'Vaulted',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'DOCUMENT_DOWNLOADED':
        return {
          icon: <Download className="w-4 h-4 text-slate-500" />,
          title: 'Document Downloaded',
          badgeText: 'Downloaded',
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
      case 'USER_LOGIN':
        return {
          icon: <LogIn className="w-4 h-4 text-indigo-600" />,
          title: 'Security Authentication',
          badgeText: 'Session',
          badgeClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
          nodeBorder: 'border-indigo-500',
        };
      case 'USER_REGISTERED':
        return {
          icon: <UserPlus className="w-4 h-4 text-emerald-600" />,
          title: 'Account Created',
          badgeText: 'Security',
          badgeClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          nodeBorder: 'border-emerald-500',
        };
      default:
        return {
          icon: <Activity className="w-4 h-4 text-slate-500" />,
          title: action.replace(/_/g, ' '),
          badgeText: 'Audit Event',
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
        weekday: 'short',
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

  const formatPreciseTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatFullDate = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
  };

  // Clean 4 categories (All, Sepolia Proofs, Verifications, Vault Files)
  const categories: { key: AuditCategory; label: string; icon: any }[] = [
    { key: 'ALL', label: 'All Activity', icon: Layers },
    { key: 'BLOCKCHAIN', label: 'Sepolia Proofs', icon: Link2 },
    { key: 'INTEGRITY', label: 'Verifications', icon: Shield },
    { key: 'FILES', label: 'Vault Files', icon: FileText },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Security Ledger
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Audit Trail & Activity
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold self-start sm:self-center">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Immutable Ledger</span>
          </div>
        </div>

        {/* Category Filter Pills */}
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
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Shield className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Activity Logged</h4>
            <p className="text-xs text-slate-500 max-w-sm">
              {activeCategory === 'ALL'
                ? 'Your audit trail logs all uploads, SHA-256 fingerprints, verification checks, and Ethereum Sepolia proofs with second-precision timestamps.'
                : `No activity found in the ${activeCategory.toLowerCase()} filter.`}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSections.map((section) => (
              <div key={section.title} className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                  <span>{section.title}</span>
                </div>

                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-3 ml-3">
                  {section.data.map((item) => {
                    const config = getActionConfig(item.action);
                    const meta = (item.metadata || {}) as Record<string, any>;
                    const targetName = item.document?.name || meta.name || meta.folder_name || meta.email || null;
                    const preciseTime = formatPreciseTime(item.created_at);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEvent(item)}
                        className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-4 transition shadow-sm hover:shadow cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        {/* Timeline Node */}
                        <div
                          className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 ${config.nodeBorder} flex items-center justify-center`}
                        />

                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shrink-0 mt-0.5">
                            {config.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                                {config.title}
                              </p>
                              <span
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${config.badgeClass}`}
                              >
                                {config.badgeText}
                              </span>
                            </div>
                            {targetName && (
                              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold truncate mt-0.5">
                                {targetName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{preciseTime}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forensic Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Audit Certificate
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Event Summary Banner */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">
                {getActionConfig(selectedEvent.action).title}
              </p>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {formatFullDate(selectedEvent.created_at)}
              </p>
            </div>

            {/* Structured Details */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Action Code</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{selectedEvent.action}</span>
              </div>

              {selectedEvent.document?.name && (
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Associated File</span>
                  <span className="font-semibold text-indigo-600">{selectedEvent.document.name}</span>
                </div>
              )}

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Precise Timestamp</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">{formatPreciseTime(selectedEvent.created_at)}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Ledger Security</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Immutable Record</span>
                </span>
              </div>
            </div>

            {/* Cryptographic Details (Hash & Sepolia Proofs) */}
            {selectedEvent.metadata && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cryptographic Metadata</p>
                
                {(selectedEvent.metadata as any).hash && (
                  <div className="space-y-1">
                    <p className="text-[11px] text-slate-400">SHA-256 Digest:</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-mono text-indigo-600 break-all flex-1 select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                        {(selectedEvent.metadata as any).hash}
                      </p>
                      <button
                        onClick={() => copyToClipboard((selectedEvent.metadata as any).hash, 'hash')}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                        title="Copy Hash"
                      >
                        {copiedField === 'hash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      </button>
                    </div>
                  </div>
                )}

                {(selectedEvent.metadata as any).transaction_hash && (
                  <div className="space-y-1 pt-1">
                    <p className="text-[11px] text-slate-400">Ethereum Sepolia Transaction:</p>
                    <a
                      href={`${BLOCKCHAIN_EXPLORER_BASE}${(selectedEvent.metadata as any).transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-mono"
                    >
                      <span>{truncateTxHash((selectedEvent.metadata as any).transaction_hash)}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="w-full text-xs"
              >
                Close Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
