import React, { useState, useEffect } from 'react';
import { Share2, Eye, Download, Clock, ShieldAlert, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { shareService } from '@/services/shareService';
import { ExtendedDocumentShare } from '@/types';

export function SharePage() {
  const [activeTab, setActiveTab] = useState<'by_me' | 'with_me'>('by_me');
  const [sharesByMe, setSharesByMe] = useState<ExtendedDocumentShare[]>([]);
  const [sharesWithMe, setSharesWithMe] = useState<ExtendedDocumentShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShares();
  }, []);

  const loadShares = async () => {
    setLoading(true);
    try {
      const [byMe, withMe] = await Promise.all([
        shareService.getSharesByMe().catch(() => []),
        shareService.getSharesWithMe().catch(() => [])
      ]);
      setSharesByMe(byMe);
      setSharesWithMe(withMe);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (shareId: string) => {
    if (confirm('Revoke access for this recipient?')) {
      try {
        await shareService.revokeShare(shareId);
        loadShares();
      } catch (err: any) {
        alert(err.message || 'Failed to revoke');
      }
    }
  };

  const currentList = activeTab === 'by_me' ? sharesByMe : sharesWithMe;

  return (
    <AppLayout>
      <div className="p-6 sm:p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-1">Document Sharing</h1>
          <p className="text-[#94A3B8] text-sm">Manage time-bounded document access and permissions.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 p-1 bg-[#111827] border border-[#1E293B] rounded-xl w-fit mb-8">
          <button
            onClick={() => setActiveTab('by_me')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'by_me'
                ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            Shares Created by Me ({sharesByMe.length})
          </button>
          <button
            onClick={() => setActiveTab('with_me')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'with_me'
                ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            Shared with Me ({sharesWithMe.length})
          </button>
        </div>

        {/* Shares List */}
        {loading ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1E293B] rounded-2xl">
            <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#94A3B8]">Loading shares...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1E293B] rounded-2xl">
            <Share2 size={36} className="text-[#475569] mx-auto mb-3" />
            <p className="text-base font-semibold text-[#F1F5F9] mb-1">
              {activeTab === 'by_me' ? 'No active shares created' : 'No documents shared with you'}
            </p>
            <p className="text-sm text-[#475569]">
              {activeTab === 'by_me' 
                ? 'You can grant time-bounded VIEW or DOWNLOAD access to any vault document.' 
                : 'Shared documents from colleagues will appear here with expiration indicators.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentList.map(share => (
              <div
                key={share.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#111827] border border-[#1E293B] rounded-xl gap-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[#F1F5F9] mb-1">
                    {share.document?.name || 'Document'}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#475569]">
                    <span className="flex items-center gap-1 text-[#00D4FF]">
                      {share.permission === 'VIEW' ? <Eye size={12} /> : <Download size={12} />}
                      {share.permission}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {share.expires_at ? `Expires: ${new Date(share.expires_at).toLocaleDateString()}` : 'Never expires'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {share.revoked_at ? (
                    <span className="text-[11px] font-semibold text-[#EF4444] bg-[rgba(239,68,68,0.12)] px-2.5 py-1 rounded-md border border-[rgba(239,68,68,0.3)]">
                      Revoked
                    </span>
                  ) : (
                    <>
                      <span className="text-[11px] font-semibold text-[#10B981] bg-[rgba(16,185,129,0.12)] px-2.5 py-1 rounded-md border border-[rgba(16,185,129,0.3)]">
                        Active
                      </span>
                      {activeTab === 'by_me' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRevoke(share.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
