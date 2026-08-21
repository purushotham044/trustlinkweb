// ============================================================
// TrustLink Web — Document Sharing Management Page
// Complete feature parity with mobile app
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Share2, 
  Eye, 
  Download, 
  Clock, 
  ShieldAlert, 
  CheckCircle,
  FileText,
  UserCheck,
  Shield,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { shareService } from '@/services/shareService';
import { DocumentShare } from '@/types';

export function SharePage() {
  const [activeTab, setActiveTab] = useState<'by_me' | 'with_me'>('by_me');
  const [sharesByMe, setSharesByMe] = useState<DocumentShare[]>([]);
  const [sharesWithMe, setSharesWithMe] = useState<DocumentShare[]>([]);
  const [loading, setLoading] = useState(true);

  const loadShares = async () => {
    setLoading(true);
    try {
      const [byMe, withMe] = await Promise.all([
        shareService.getSharedByMe().catch(() => []),
        shareService.getSharedWithMe().catch(() => []),
      ]);
      setSharesByMe(byMe);
      setSharesWithMe(withMe);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, []);

  const handleRevoke = async (shareId: string) => {
    if (!window.confirm('Revoke access for this recipient? They will immediately lose access.')) {
      return;
    }
    try {
      await shareService.revokeShare(shareId);
      await loadShares();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke share access.');
    }
  };

  const currentList = activeTab === 'by_me' ? sharesByMe : sharesWithMe;

  const isShareActive = (share: DocumentShare) => {
    if (share.revoked_at) return false;
    if (share.expires_at && new Date(share.expires_at).getTime() < Date.now()) return false;
    return true;
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            Access Management
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Document Sharing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage granular, time-bounded document access permissions with instant revocation.
          </p>
        </div>

        {/* Segmented Tab Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit border border-slate-200 dark:border-slate-700/60">
          <button
            onClick={() => setActiveTab('by_me')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'by_me'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Shared by Me ({sharesByMe.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('with_me')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'with_me'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Shared with Me ({sharesWithMe.length})</span>
          </button>
        </div>

        {/* Main List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Loading share permissions...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center">
            <Share2 className="w-12 h-12 text-slate-400 mb-3 opacity-50" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              {activeTab === 'by_me' ? 'No active shares created' : 'No documents shared with you'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              {activeTab === 'by_me'
                ? 'Open any document from your vault and choose "Grant In-App Access" to share with colleagues.'
                : 'Documents shared directly with your email will appear here with expiration indicators.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentList.map((share) => {
              const active = isShareActive(share);
              const docName = share.document?.name || 'Document';

              return (
                <div
                  key={share.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {docName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {activeTab === 'by_me' ? `Recipient: ${share.shared_with_id}` : `Owner: ${share.owner_id}`}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          active
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : share.revoked_at
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {active ? 'Active' : share.revoked_at ? 'Revoked' : 'Expired'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 py-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1 font-medium">
                        <Shield className="w-3 h-3 text-indigo-500" />
                        <span>{share.permission === 'DOWNLOAD' ? 'Download & View' : 'View Only'}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {share.expires_at ? `Expires ${new Date(share.expires_at).toLocaleDateString()}` : 'Never expires'}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {share.document?.id ? (
                      <Link
                        to={`/app/documents/${share.document.id}`}
                        className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-400">Target document ID: {share.document_id.slice(0, 8)}...</span>
                    )}

                    {activeTab === 'by_me' && active && (
                      <button
                        onClick={() => handleRevoke(share.id)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md transition"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
