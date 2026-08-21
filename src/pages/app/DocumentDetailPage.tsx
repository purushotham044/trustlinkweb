// ============================================================
// TrustLink Web — Document Detail, Blockchain Proof & Live Tamper Tester
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Link2, 
  Download, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Copy, 
  Check, 
  Shield, 
  Upload, 
  FileCheck, 
  FileX 
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { documentService } from '@/services/documentService';
import { integrityService } from '@/services/integrityService';
import { blockchainService } from '@/services/blockchainService';
import { Document, BlockchainProof } from '@/types';
import { BLOCKCHAIN_EXPLORER_BASE, CONTRACT_EXPLORER_BASE, CONTRACT_ADDRESS } from '@/lib/constants';
import { truncateHash, truncateTxHash, computeFileSha256 } from '@/lib/crypto';

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

  // Local Tamper-Test file checker state
  const testFileInputRef = useRef<HTMLInputElement>(null);
  const [testResult, setTestResult] = useState<{
    testedFileName: string;
    testedHash: string;
    matches: boolean;
  } | null>(null);
  const [isTestingFile, setIsTestingFile] = useState(false);

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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerifyIntegrity = async () => {
    if (!doc) return;
    setVerifying(true);
    setVerificationFeedback(null);
    try {
      const isMatch = await integrityService.verifyDocument(doc);
      setDoc(prev => prev ? { ...prev, integrity_status: isMatch ? 'VERIFIED' : 'FAILED' } : null);

      if (isMatch) {
        setVerificationFeedback({
          success: true,
          message: 'Cryptographic Integrity Confirmed: The document stored in vault cloud storage perfectly matches the recorded SHA-256 fingerprint.',
        });
      } else {
        setVerificationFeedback({
          success: false,
          message: 'Tamper Alert: The computed SHA-256 hash of the vault file does not match the immutable ledger record.',
        });
      }
    } catch (err: any) {
      setVerificationFeedback({
        success: false,
        message: `Integrity check failed: ${err.message || 'Network error'}`,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleAnchorBlockchain = async () => {
    if (!doc) return;
    setAnchoring(true);
    try {
      const newProof = await blockchainService.anchorDocument(doc.id);
      setProof(newProof);
      setVerificationFeedback({
        success: true,
        message: `Successfully anchored to Ethereum Sepolia smart contract! Block #${newProof.block_number || 'Confirmed'}.`,
      });
    } catch (err: any) {
      setVerificationFeedback({
        success: false,
        message: `Blockchain anchoring error: ${err.message || 'Transaction failed'}`,
      });
    } finally {
      setAnchoring(false);
    }
  };

  const handleDownload = async () => {
    if (!doc) return;
    setDownloading(true);
    try {
      await documentService.downloadDocument(doc);
    } catch (err: any) {
      alert(err.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!doc) return;
    if (!window.confirm(`Are you sure you want to permanently delete "${doc.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await documentService.deleteDocument(doc);
      navigate('/app/vault');
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
      setDeleting(false);
    }
  };

  const handleTriggerTestFile = () => {
    if (testFileInputRef.current) {
      testFileInputRef.current.value = '';
      testFileInputRef.current.click();
    }
  };

  const handleTestFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !doc) return;

    setIsTestingFile(true);
    setTestResult(null);

    try {
      const computed = await computeFileSha256(file);
      const matches = computed.toLowerCase() === (doc.current_hash || '').toLowerCase();
      setTestResult({
        testedFileName: file.name,
        testedHash: computed,
        matches,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to calculate hash of local file');
    } finally {
      setIsTestingFile(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString(undefined, {
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
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs">Loading document verification records...</p>
        </div>
      </AppLayout>
    );
  }

  if (!doc) {
    return (
      <AppLayout>
        <div className="py-20 text-center space-y-4">
          <p className="text-sm text-slate-500">Document not found or inaccessible.</p>
          <Button variant="primary" onClick={() => navigate('/app/vault')}>
            Return to Vault
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Hidden file input for tamper checking */}
      <input
        ref={testFileInputRef}
        type="file"
        className="hidden"
        onChange={handleTestFileChosen}
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/app/vault"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Document Vault</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleDownload}
              disabled={downloading}
              className="gap-1.5 text-xs py-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Downloading...' : 'Download File'}</span>
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
                  <span>{truncateTxHash(proof.contract_address || CONTRACT_ADDRESS)}</span>
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
                  <span className="text-slate-500">Block Height</span>
                  <span className="font-semibold text-slate-900 dark:text-white">#{proof.block_number}</span>
                </div>
              )}
              {proof.anchored_at && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Anchored Timestamp</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatDate(proof.anchored_at)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-5 text-center space-y-3">
              <p className="text-xs text-slate-500">
                This document's SHA-256 fingerprint has not been anchored to the Ethereum blockchain yet.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAnchorBlockchain}
                loading={anchoring}
                className="gap-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Anchor to Sepolia Blockchain</span>
              </Button>
            </div>
          )}
        </div>

        {/* Cryptographic Verification Action Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Verify Vault Cryptographic Integrity
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Trigger a live server re-verification of this document: the system fetches the encrypted vault file from storage, re-computes its SHA-256 fingerprint, and compares it against the recorded ledger.
          </p>
          <Button
            variant="primary"
            onClick={handleVerifyIntegrity}
            loading={verifying}
            className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Cryptographic Integrity</span>
          </Button>
        </div>

        {/* Live Tamper-Check Simulation Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Search for Tamper (Compare Local File)
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select a file from your computer to compute its SHA-256 fingerprint client-side and verify if it matches this vaulted document.
          </p>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleTriggerTestFile}
            loading={isTestingFile}
            className="gap-1.5 text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Pick Local File to Compare</span>
          </Button>

          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 animate-in fade-in duration-150 ${
                testResult.matches
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.matches ? (
                  <>
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>✓ MATCH CONFIRMED (Unaltered File)</span>
                  </>
                ) : (
                  <>
                    <FileX className="w-4 h-4 text-rose-600" />
                    <span>⚠ TAMPER DETECTED / DIFFERENT FILE</span>
                  </>
                )}
              </div>
              <p className="text-[11px]">
                Selected File: <span className="font-semibold">{testResult.testedFileName}</span>
              </p>
              <div className="font-mono text-[10px] break-all bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-current/10">
                {testResult.testedHash}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
