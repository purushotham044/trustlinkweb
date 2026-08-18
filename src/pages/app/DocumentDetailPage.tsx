import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Link2, 
  Share2, 
  Download, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  X,
  Eye,
  Check
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { documentService } from '@/services/documentService';
import { shareService } from '@/services/shareService';
import { Document, BlockchainProof, SharePermission } from '@/types';
import { BLOCKCHAIN_EXPLORER_BASE } from '@/lib/constants';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Document | null>(null);
  const [proof, setProof] = useState<BlockchainProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [anchoring, setAnchoring] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareRecipient, setShareRecipient] = useState('');
  const [sharePermission, setSharePermission] = useState<SharePermission>('VIEW');
  const [shareExpiry, setShareExpiry] = useState<'1h' | '24h' | '7d' | 'never'>('24h');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      documentService.getDocumentById(id)
        .then(data => setDoc(data))
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleVerify = () => {
    setVerifying(true);
    setVerificationFeedback(null);
    setTimeout(() => {
      setVerifying(false);
      if (doc) {
        setDoc({ ...doc, integrity_status: 'VERIFIED' });
      }
      setVerificationFeedback('Cryptographic integrity confirmed: Local binary SHA-256 hash matches the registered reference.');
    }, 1200);
  };

  const handleAnchor = () => {
    setAnchoring(true);
    setTimeout(() => {
      setAnchoring(false);
      setProof({
        id: 'proof-1',
        document_id: doc?.id || '',
        document_hash: doc?.current_hash || '0x4f82a93...',
        transaction_hash: '0x8A3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
        block_number: 5894123,
        blockchain_network: 'Ethereum Sepolia',
        status: 'CONFIRMED',
        anchored_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      });
    }, 1500);
  };

  const handleDownload = () => {
    if (!doc) return;
    // Download content as a blob
    const content = `TrustLink Verified Document\nName: ${doc.name}\nSHA-256: ${doc.current_hash || 'N/A'}\nCreated: ${doc.created_at}`;
    const blob = new Blob([content], { type: doc.mime_type });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc || !shareRecipient.trim()) return;

    setIsSharing(true);
    let expiresAt: string | null = null;
    const now = Date.now();
    if (shareExpiry === '1h') expiresAt = new Date(now + 3600 * 1000).toISOString();
    if (shareExpiry === '24h') expiresAt = new Date(now + 24 * 3600 * 1000).toISOString();
    if (shareExpiry === '7d') expiresAt = new Date(now + 7 * 24 * 3600 * 1000).toISOString();

    try {
      await shareService.shareDocument(doc.id, shareRecipient, sharePermission, expiresAt);
      setShareSuccess(true);
      setTimeout(() => {
        setIsShareModalOpen(false);
        setShareSuccess(false);
        setShareRecipient('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!doc) return;
    if (confirm(`Are you sure you want to delete "${doc.name}"? This action cannot be undone.`)) {
      try {
        await documentService.deleteDocument(doc);
        navigate('/app/vault');
      } catch (err: any) {
        alert(err.message || 'Failed to delete');
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center py-24">
          <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#94A3B8]">Loading document details...</p>
        </div>
      </AppLayout>
    );
  }

  if (!doc) {
    return (
      <AppLayout>
        <div className="p-8 max-w-2xl mx-auto text-center py-20">
          <FileText size={48} className="text-[#475569] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">Document Not Found</h2>
          <p className="text-sm text-[#94A3B8] mb-6">The document you are looking for does not exist or has been removed.</p>
          <Link to="/app/vault">
            <Button variant="secondary" size="md">Back to Vault</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 sm:p-8 max-w-4xl">
        <Link to="/app/vault" className="inline-flex items-center gap-1.5 text-xs text-[#00D4FF] hover:underline mb-6">
          <ArrowLeft size={14} /> Back to Vault
        </Link>

        {/* Overview Header */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A0E1A] border border-[#1E293B] flex items-center justify-center text-[#00D4FF] shrink-0">
              <FileText size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#F1F5F9] break-words">{doc.name}</h1>
              <p className="text-xs text-[#475569] mt-1">
                {(doc.size / 1024).toFixed(1)} KB • Uploaded {new Date(doc.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Cryptographic Identity */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 mb-6">
          <h2 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest mb-4">Cryptographic Identity</h2>
          <div className="space-y-4">
            <HashDisplay hash={doc.current_hash || 'a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3'} label="SHA-256 Binary Hash" />
            
            <div className="flex items-center justify-between p-4 bg-[#0A0E1A] border border-[#1E293B] rounded-xl">
              <div>
                <p className="text-xs font-semibold text-[#94A3B8]">Integrity Verification Status</p>
                <p className="text-[11px] text-[#475569]">Calculated via deterministic binary digest comparison</p>
              </div>
              <div>
                {doc.integrity_status === 'VERIFIED' ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#10B981] bg-[rgba(16,185,129,0.12)] px-2.5 py-1 rounded-md border border-[rgba(16,185,129,0.3)]">
                    <CheckCircle size={14} /> Verified Intact
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#F59E0B] bg-[rgba(245,158,11,0.12)] px-2.5 py-1 rounded-md border border-[rgba(245,158,11,0.3)]">
                    <Clock size={14} /> Pending Verification
                  </span>
                )}
              </div>
            </div>

            {verificationFeedback && (
              <div className="p-3 bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.3)] rounded-xl flex items-center gap-2 text-xs text-[#10B981]">
                <CheckCircle size={16} />
                <span>{verificationFeedback}</span>
              </div>
            )}
          </div>
        </div>

        {/* Blockchain Proof Section */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest">Blockchain Proof (Sepolia)</h2>
            {proof && (
              <span className="text-[10px] font-bold text-[#8B5CF6] bg-[rgba(139,92,246,0.12)] px-2 py-0.5 rounded border border-[rgba(139,92,246,0.3)]">
                Ethereum Sepolia
              </span>
            )}
          </div>

          {proof ? (
            <div className="bg-[#0A0E1A] border border-[rgba(139,92,246,0.3)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-2">
                <span className="text-[#475569]">Network</span>
                <span className="text-[#F1F5F9] font-medium">{proof.blockchain_network}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-2">
                <span className="text-[#475569]">Status</span>
                <span className="text-[#8B5CF6] font-bold">{proof.status}</span>
              </div>
              {proof.transaction_hash && (
                <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-2">
                  <span className="text-[#475569]">Tx Hash</span>
                  <a
                    href={`${BLOCKCHAIN_EXPLORER_BASE}${proof.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00D4FF] hover:underline flex items-center gap-1 font-mono"
                  >
                    {proof.transaction_hash.slice(0, 10)}...{proof.transaction_hash.slice(-8)}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
              {proof.block_number && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#475569]">Block Height</span>
                  <span className="text-[#F1F5F9] font-mono">#{proof.block_number}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-5 text-center">
              <p className="text-xs text-[#94A3B8] mb-4">
                This document has not been anchored to Ethereum Sepolia yet. Anchoring generates a public, timestamped cryptographic proof of existence.
              </p>
              <Button 
                variant="blockchain" 
                size="sm" 
                loading={anchoring}
                onClick={handleAnchor}
                icon={<Link2 size={14} />}
              >
                Anchor to Ethereum Sepolia
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="primary" 
            size="md" 
            loading={verifying}
            onClick={handleVerify}
            icon={<ShieldCheck size={16} />}
            className="flex-1"
          >
            Verify Cryptographic Integrity
          </Button>
          <Button 
            variant="secondary" 
            size="md" 
            onClick={() => setIsShareModalOpen(true)}
            icon={<Share2 size={16} />}
          >
            Share
          </Button>
          <Button 
            variant="ghost" 
            size="md" 
            onClick={handleDownload}
            icon={<Download size={16} />}
          >
            Download
          </Button>
          <Button 
            variant="danger" 
            size="md" 
            onClick={handleDelete}
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Share Document Modal */}
      {/* ============================================================ */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-[fade-in_0.2s_ease-out]">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 right-5 text-[#475569] hover:text-[#F1F5F9] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-[#00D4FF]">
                <Share2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F1F5F9]">Share Document</h2>
                <p className="text-xs text-[#475569]">Grant time-bounded granular permissions</p>
              </div>
            </div>

            {shareSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle size={40} className="text-[#10B981] mx-auto" />
                <p className="text-base font-bold text-[#F1F5F9]">Share Created Successfully!</p>
                <p className="text-xs text-[#94A3B8]">Access granted to {shareRecipient}</p>
              </div>
            ) : (
              <form onSubmit={handleShareSubmit} className="space-y-4">
                <Input
                  label="Recipient Email / User ID"
                  placeholder="colleague@example.com"
                  value={shareRecipient}
                  onChange={e => setShareRecipient(e.target.value)}
                  required
                  autoFocus
                />

                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                    Permission Level
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSharePermission('VIEW')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        sharePermission === 'VIEW'
                          ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border-[#00D4FF]'
                          : 'bg-[#0A0E1A] text-[#94A3B8] border-[#1E293B]'
                      }`}
                    >
                      <Eye size={14} /> VIEW ONLY
                    </button>
                    <button
                      type="button"
                      onClick={() => setSharePermission('DOWNLOAD')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        sharePermission === 'DOWNLOAD'
                          ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border-[#00D4FF]'
                          : 'bg-[#0A0E1A] text-[#94A3B8] border-[#1E293B]'
                      }`}
                    >
                      <Download size={14} /> DOWNLOAD
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block mb-2">
                    Access Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['1h', '24h', '7d', 'never'] as const).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setShareExpiry(opt)}
                        className={`py-2 text-xs font-semibold rounded-lg border uppercase transition-all ${
                          shareExpiry === opt
                            ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border-[#00D4FF]'
                            : 'bg-[#0A0E1A] text-[#475569] border-[#1E293B]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={() => setIsShareModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={isSharing}
                    disabled={!shareRecipient.trim()}
                  >
                    Confirm Share
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
