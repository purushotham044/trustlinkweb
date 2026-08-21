// ============================================================
// TrustLink Web — Document Detail & Blockchain Proof View
// Complete feature parity with mobile app
// ============================================================

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
  Copy,
  Check,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Send
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { HashDisplay } from '@/components/ui/HashDisplay';
import { supabase } from '@/lib/supabase';
import { documentService } from '@/services/documentService';
import { integrityService } from '@/services/integrityService';
import { blockchainService } from '@/services/blockchainService';
import { shareService } from '@/services/shareService';
import { Document, BlockchainProof, SharePermission } from '@/types';
import { BLOCKCHAIN_EXPLORER_BASE, CONTRACT_EXPLORER_BASE, CONTRACT_ADDRESS } from '@/lib/constants';
import { truncateHash, truncateTxHash } from '@/lib/crypto';

export function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Document | null>(null);
  const [proof, setProof] = useState<BlockchainProof | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [anchoring, setAnchoring] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareRecipient, setShareRecipient] = useState('');
  const [sharePermission, setSharePermission] = useState<SharePermission>('VIEW');
  const [shareExpiry, setShareExpiry] = useState<'1h' | '24h' | '7d' | 'never'>('24h');
  const [isSharing, setIsSharing] = useState(false);

  const loadDocumentData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (docError || !docData) {
        throw new Error(docError?.message || 'Document not found');
      }

      setDoc(docData as Document);

      // Fetch blockchain proof
      const proofData = await blockchainService.getBlockchainProof(id);
      setProof(proofData);
    } catch (err: any) {
      console.warn('Error loading document detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentData();
  }, [id]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerify = async () => {
    if (!doc) return;
    try {
      setVerifying(true);
      setVerificationFeedback(null);

      const isLocalMatch = await integrityService.verifyDocument(doc);
      const dualResult = await blockchainService.verifyDualIntegrity(
        doc.name,
        doc.current_hash || '',
        doc.current_hash,
        proof
      );

      if (isLocalMatch && dualResult.blockchainMatch !== false) {
        setDoc({ ...doc, integrity_status: 'VERIFIED' });
        setVerificationFeedback({
          success: true,
          message: `✓ Cryptographic Integrity Verified: Cloud storage bytes exactly match the SHA-256 fingerprint. ${proof ? 'Confirmed on Ethereum Sepolia.' : 'Vault reference intact.'}`,
        });
      } else {
        setDoc({ ...doc, integrity_status: 'FAILED' });
        setVerificationFeedback({
          success: false,
          message: '⚠ Fingerprint Mismatch Detected: The file bytes differ from the registered reference record.',
        });
      }
    } catch (err: any) {
      setVerificationFeedback({
        success: false,
        message: err.message || 'Could not verify document integrity.',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleAnchor = async () => {
    if (!doc) return;
    try {
      setAnchoring(true);
      const newProof = await blockchainService.anchorDocument(doc.id);
      setProof(newProof);
      alert(`Proof Confirmed: An immutable proof for "${doc.name}" has been permanently recorded on ${newProof.blockchain_network}.`);
    } catch (err: any) {
      alert(err.message || 'Blockchain anchoring is currently unavailable.');
    } finally {
      setAnchoring(false);
    }
  };

  const handleDownload = async () => {
    if (!doc) return;
    try {
      setDownloading(true);
      await documentService.downloadDocument(doc);
    } catch (err: any) {
      alert(err.message || 'Could not download document.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!doc) return;
    if (!window.confirm(`Permanently delete "${doc.name}" from your vault? This will remove the file and all associated proofs.`)) {
      return;
    }

    try {
      setDeleting(true);
      await documentService.deleteDocument(doc);
      navigate('/app/vault');
    } catch (err: any) {
      alert(err.message || 'Failed to delete document.');
      setDeleting(false);
    }
  };

  const handleWebShare = async () => {
    if (!doc) return;
    await shareService.shareViaWeb(doc);
    alert('Share link and document details copied to clipboard!');
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc || !shareRecipient.trim()) return;

    let expiresAt: string | null = null;
    const now = Date.now();
    if (shareExpiry === '1h') expiresAt = new Date(now + 3600 * 1000).toISOString();
    if (shareExpiry === '24h') expiresAt = new Date(now + 24 * 3600 * 1000).toISOString();
    if (shareExpiry === '7d') expiresAt = new Date(now + 7 * 24 * 3600 * 1000).toISOString();

    try {
      setIsSharing(true);
      await shareService.shareDocument(doc.id, shareRecipient.trim(), sharePermission, expiresAt);
      setIsShareModalOpen(false);
      setShareRecipient('');
      alert(`Access granted for ${shareRecipient} (${sharePermission === 'DOWNLOAD' ? 'Download & View' : 'View Only'}).`);
    } catch (err: any) {
      alert(err.message || 'Could not grant share access.');
    } finally {
      setIsSharing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Loading document record & cryptographic proofs...</p>
        </div>
      </AppLayout>
    );
  }

  if (!doc) {
    return (
      <AppLayout>
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500 mb-4">Document not found or access revoked.</p>
          <Link to="/app/vault" className="text-xs text-indigo-600 font-semibold hover:underline">
            ← Back to Vault
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/app/vault"
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vault</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleWebShare}
              className="gap-1.5 text-xs py-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsShareModalOpen(true)}
              className="gap-1.5 text-xs py-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Grant In-App Access</span>
            </Button>
            <Button
              variant="secondary"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-1.5 text-xs py-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Downloading...' : 'Download'}</span>
            </Button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition"
              title="Delete Document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Result Feedback Banner */}
        {verificationFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start gap-3 animate-in fade-in duration-200 ${
              verificationFeedback.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            {verificationFeedback.success ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <p className="leading-relaxed">{verificationFeedback.message}</p>
          </div>
        )}

        {/* File Overview Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white break-all">
                  {doc.name}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {formatSize(doc.size)} • Uploaded {formatDate(doc.created_at)}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-center ${
                doc.integrity_status === 'VERIFIED'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : doc.integrity_status === 'FAILED'
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}
            >
              {doc.integrity_status}
            </span>
          </div>
        </div>

        {/* SHA-256 Digital Fingerprint Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                SHA-256 Cryptographic Fingerprint
              </h2>
            </div>
            {doc.current_hash && (
              <button
                onClick={() => copyToClipboard(doc.current_hash!, 'hash')}
                className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-lg transition"
              >
                {copiedField === 'hash' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            This 256-bit hash is computed mathematically from the exact binary bytes of this document. Any modification to the file content completely alters this signature.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all select-all">
            {doc.current_hash || 'No hash generated'}
          </div>
        </div>

        {/* Ethereum Sepolia Blockchain Proof Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Ethereum Blockchain Proof
              </h2>
            </div>
            {proof?.status === 'CONFIRMED' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Confirmed on Sepolia
              </span>
            )}
          </div>

          {proof ? (
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Blockchain Network</span>
                <span className="font-semibold text-slate-900 dark:text-white">{proof.blockchain_network}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-500">Smart Contract</span>
                <a
                  href={`${CONTRACT_EXPLORER_BASE}${CONTRACT_ADDRESS}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>{truncateTxHash(CONTRACT_ADDRESS)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {proof.transaction_hash && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Transaction Hash</span>
                  <a
                    href={`${BLOCKCHAIN_EXPLORER_BASE}${proof.transaction_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>{truncateTxHash(proof.transaction_hash)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {proof.block_number && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500">Mined Block Height</span>
                  <span className="font-semibold text-slate-900 dark:text-white">#{proof.block_number}</span>
                </div>
              )}
              {proof.anchored_at && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Anchored Timestamp</span>
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(proof.anchored_at)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-dashed border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
                This document has not been anchored to Ethereum yet. Creating a blockchain proof records an unalterable timestamp on the public Sepolia ledger.
              </p>
              <Button
                variant="primary"
                onClick={handleAnchor}
                disabled={anchoring || verifying}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>{anchoring ? 'Anchoring to Sepolia...' : 'Create Blockchain Proof'}</span>
              </Button>
            </div>
          )}
        </div>

        {/* Primary Verification Action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={verifying || anchoring}
            className="flex-1 py-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-bold shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{verifying ? 'Re-Computing Cryptographic Signature...' : 'Verify Cryptographic Integrity'}</span>
          </Button>
        </div>

        {/* Grant In-App Sharing Modal */}
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span>Grant In-App Access</span>
                </h3>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleShareSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Recipient Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="colleague@enterprise.com"
                    value={shareRecipient}
                    onChange={(e) => setShareRecipient(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Access Permission
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSharePermission('VIEW')}
                      className={`p-2.5 rounded-lg border text-center font-medium transition ${
                        sharePermission === 'VIEW'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      View Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setSharePermission('DOWNLOAD')}
                      className={`p-2.5 rounded-lg border text-center font-medium transition ${
                        sharePermission === 'DOWNLOAD'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Download & View
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                    Access Expiration
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['1h', '24h', '7d', 'never'] as const).map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => setShareExpiry(exp)}
                        className={`py-1.5 rounded-lg border text-center text-[11px] font-medium transition uppercase ${
                          shareExpiry === exp
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {exp === 'never' ? 'Never' : exp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsShareModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSharing || !shareRecipient.trim()}
                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isSharing ? 'Sharing...' : 'Grant Access'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
