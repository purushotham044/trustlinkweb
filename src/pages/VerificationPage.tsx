// ============================================================
// TrustLink Web — Live Real-Time Document Verifier
// Drop any file to compute real SHA-256 and query Ethereum Sepolia + Vault
// ============================================================

import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  Link2, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  Shield, 
  X,
  FileCheck,
  FileX
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { computeFileSha256 } from '@/lib/crypto';
import { blockchainService } from '@/services/blockchainService';
import { supabase } from '@/lib/supabase';
import { CONTRACT_ADDRESS, CONTRACT_EXPLORER_BASE, BLOCKCHAIN_EXPLORER_BASE } from '@/lib/constants';

interface LiveVerificationResult {
  fileName: string;
  fileSize: number;
  computedHash: string;
  onChainFound: boolean;
  onChainOwner?: string;
  onChainTimestamp?: number;
  onChainBlock?: number;
  vaultDoc?: {
    name: string;
    owner_id: string;
    created_at: string;
  } | null;
  txHash?: string | null;
}

export function VerificationPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<LiveVerificationResult | null>(null);
  const [manualHashInput, setManualHashInput] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      verifyTargetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      verifyTargetFile(e.target.files[0]);
    }
  };

  const verifyTargetFile = async (file: File) => {
    setSelectedFile(file);
    setVerifying(true);
    setResult(null);

    try {
      // 1. Real Web Crypto SHA-256 computation
      const hash = await computeFileSha256(file);

      // 2. Query Live Ethereum Sepolia Smart Contract
      const onChainResult = await blockchainService.verifyOnChain(hash);

      // 3. Query Supabase Vault Database
      const { data: dbDoc } = await supabase
        .from('documents')
        .select('name, owner_id, created_at, id')
        .eq('current_hash', hash)
        .maybeSingle();

      let txHash: string | null = null;
      if (dbDoc?.id) {
        const { data: proof } = await supabase
          .from('blockchain_proofs')
          .select('transaction_hash')
          .eq('document_id', dbDoc.id)
          .eq('status', 'CONFIRMED')
          .maybeSingle();
        txHash = proof?.transaction_hash || null;
      }

      setResult({
        fileName: file.name,
        fileSize: file.size,
        computedHash: hash,
        onChainFound: onChainResult.exists,
        onChainOwner: onChainResult.owner,
        onChainTimestamp: onChainResult.timestamp,
        onChainBlock: onChainResult.blockNumber,
        vaultDoc: dbDoc,
        txHash,
      });
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleManualHashVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHash = manualHashInput.trim().toLowerCase().replace(/^0x/, '');
    if (!cleanHash || cleanHash.length !== 64) {
      alert('Please enter a valid 64-character SHA-256 hexadecimal hash.');
      return;
    }

    setVerifying(true);
    setResult(null);

    try {
      const onChainResult = await blockchainService.verifyOnChain(cleanHash);

      const { data: dbDoc } = await supabase
        .from('documents')
        .select('name, owner_id, created_at, id')
        .eq('current_hash', cleanHash)
        .maybeSingle();

      let txHash: string | null = null;
      if (dbDoc?.id) {
        const { data: proof } = await supabase
          .from('blockchain_proofs')
          .select('transaction_hash')
          .eq('document_id', dbDoc.id)
          .maybeSingle();
        txHash = proof?.transaction_hash || null;
      }

      setResult({
        fileName: dbDoc?.name || 'Manual Hash Query',
        fileSize: 0,
        computedHash: cleanHash,
        onChainFound: onChainResult.exists,
        onChainOwner: onChainResult.owner,
        onChainTimestamp: onChainResult.timestamp,
        onChainBlock: onChainResult.blockNumber,
        vaultDoc: dbDoc,
        txHash,
      });
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-slate-950 text-slate-100 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-800/80">
              Live Real-Time Cryptographic Verifier
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3">
              Verify Document Authenticity
            </h1>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Select any file on your device. TrustLink calculates its real-time SHA-256 fingerprint in your browser and verifies existence directly against the Ethereum Sepolia smart contract.
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Dropzone Card */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition duration-200 bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-indigo-500 shadow-xl ${
              verifying ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              Choose or Drop Any File to Verify
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Upload your original or modified document. Your file never leaves your browser during this integrity check.
            </p>
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Select File from Device</span>
            </Button>
          </div>

          {/* Manual Hash Search */}
          <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <form onSubmit={handleManualHashVerify} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Or enter any 64-character SHA-256 hash directly..."
                  value={manualHashInput}
                  onChange={(e) => setManualHashInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={verifying || !manualHashInput.trim()}
                className="text-xs shrink-0 py-2.5"
              >
                {verifying ? 'Querying Blockchain...' : 'Verify Hash'}
              </Button>
            </form>
          </div>

          {/* Loading Indicator */}
          {verifying && (
            <div className="mt-8 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-white">Computing SHA-256 & Querying Sepolia Smart Contract...</p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Querying: {CONTRACT_ADDRESS}</p>
            </div>
          )}

          {/* Verification Results Display */}
          {result && (
            <div className="mt-8 space-y-4 animate-in fade-in duration-300">
              {/* Main Banner */}
              <div
                className={`p-6 rounded-2xl border ${
                  result.onChainFound
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      result.onChainFound ? 'bg-emerald-900/60 text-emerald-400' : 'bg-rose-900/60 text-rose-400'
                    }`}
                  >
                    {result.onChainFound ? <FileCheck className="w-7 h-7" /> : <FileX className="w-7 h-7" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {result.onChainFound
                        ? '✓ AUTHENTIC & VERIFIED ON ETHEREUM'
                        : '⚠ UNREGISTERED OR TAMPERED FILE'}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed">
                      {result.onChainFound
                        ? `This document's exact mathematical fingerprint matches an immutable record permanently anchored on Ethereum Sepolia block #${result.onChainBlock}. It is guaranteed 100% original and untouched.`
                        : `This document does NOT match any confirmed blockchain proof. If this file was modified by even 1 single character, byte, or pixel, its hash changed and failed integrity verification.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
                {/* File info */}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Target File</span>
                  <span className="font-bold text-white">{result.fileName}</span>
                </div>

                {/* SHA-256 */}
                <div className="py-2 border-b border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Calculated SHA-256 Fingerprint</span>
                    <button
                      onClick={() => copyHash(result.computedHash)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl font-mono text-indigo-400 break-all select-all text-[11px] border border-slate-800/80">
                    {result.computedHash}
                  </div>
                </div>

                {/* Smart Contract Info */}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Smart Contract Address</span>
                  <a
                    href={`${CONTRACT_EXPLORER_BASE}${CONTRACT_ADDRESS}#code`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-6)}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {result.onChainFound && (
                  <>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Mined Block Height</span>
                      <span className="font-bold text-white">#{result.onChainBlock}</span>
                    </div>
                    {result.onChainTimestamp && result.onChainTimestamp > 0 && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Blockchain Timestamp</span>
                        <span className="text-slate-200">
                          {new Date(result.onChainTimestamp * 1000).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {result.onChainOwner && (
                      <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Owner Wallet Address</span>
                        <span className="font-mono text-slate-300">
                          {result.onChainOwner.slice(0, 10)}...{result.onChainOwner.slice(-6)}
                        </span>
                      </div>
                    )}
                    {result.txHash && (
                      <div className="flex justify-between items-center py-1.5">
                        <span className="text-slate-400">Sepolia Transaction</span>
                        <a
                          href={`${BLOCKCHAIN_EXPLORER_BASE}${result.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          <span>{result.txHash.slice(0, 10)}...{result.txHash.slice(-6)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </>
                )}

                {/* Vault Registration Status */}
                <div className="pt-2">
                  <span className="text-slate-400">Vault Database Record: </span>
                  <span className="font-semibold text-white">
                    {result.vaultDoc ? `Registered as "${result.vaultDoc.name}"` : 'Not registered in private vault'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
