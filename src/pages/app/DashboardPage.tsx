// ============================================================
// TrustLink Web — Professional Dashboard Page
// Complete feature parity with mobile app
// ============================================================

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Link2, 
  Share2, 
  Upload, 
  ArrowRight, 
  Activity,
  Shield,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDocuments';
import { documentService } from '@/services/documentService';
import { UploadProgressModal, UploadProgressState } from '@/components/common/UploadProgressModal';

export function DashboardPage() {
  const { profile, user } = useAuth();
  const { stats, recentDocs, loading, refresh } = useDashboardStats();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState>({
    visible: false,
    fileName: '',
    step: 1,
    statusText: 'Preparing upload...',
    isComplete: false,
  });

  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';

  const statCards = [
    { label: 'Total Documents', value: stats.totalDocs, icon: <FileText className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Verified Intact', value: stats.verifiedDocs, icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
    { label: 'Blockchain Proofs', value: stats.anchoredDocs, icon: <Link2 className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
    { label: 'Active Shares', value: stats.sharedDocs, icon: <Share2 className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-950/40' },
  ];

  const handleQuickUploadTrigger = () => {
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
      const uploaded = await documentService.uploadDocument(
        file,
        null,
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
        navigate(`/app/documents/${uploaded.id}`);
      }, 800);
    } catch (err: any) {
      setUploadProgress(prev => ({ ...prev, visible: false }));
      alert(err.message || 'Quick upload failed');
    }
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

      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Executive Vault
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              Welcome, {displayName}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              onClick={() => setShowHowItWorks(true)}
              className="gap-1.5 text-xs py-2"
            >
              <Info className="w-3.5 h-3.5 text-slate-500" />
              <span>How It Works</span>
            </Button>
            <Button
              variant="primary"
              onClick={handleQuickUploadTrigger}
              className="gap-1.5 text-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Upload className="w-4 h-4" />
              <span>Quick Upload</span>
            </Button>
          </div>
        </div>

        {/* 4-Step Pipeline Summary Card */}
        <div className="bg-gradient-to-r from-indigo-900/10 via-slate-900/5 to-emerald-900/10 dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-emerald-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  The TrustLink Guarantee
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  Store ➔ Protect (SHA-256) ➔ Anchor (Sepolia Blockchain) ➔ Verify & Share
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 self-start sm:self-center shrink-0"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Authoritative Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow transition"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? <span className="inline-block w-8 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : s.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Documents & Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Documents List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Documents
              </h2>
              <Link to="/app/vault" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                <span>View All Vault</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentDocs.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No documents uploaded yet.</p>
                <button
                  onClick={handleQuickUploadTrigger}
                  className="text-xs text-indigo-600 font-semibold hover:underline mt-2 inline-block"
                >
                  Upload your first file
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/app/documents/${doc.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 transition group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        doc.integrity_status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                      }`}
                    >
                      {doc.integrity_status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Navigation Hub */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Security Hub
            </h2>

            <Link
              to="/app/vault"
              className="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Document Vault</p>
                  <p className="text-[10px] text-slate-400">Organize and manage folders</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            <Link
              to="/app/sharing"
              className="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Access Management</p>
                  <p className="text-[10px] text-slate-400">Control active & revoked shares</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            <Link
              to="/app/activity"
              className="block p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Audit Timeline</p>
                  <p className="text-[10px] text-slate-400">Immutable security logs</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </div>

        {/* How It Works Explainer Modal */}
        {showHowItWorks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <span>How TrustLink Works</span>
                </h3>
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">1. 📂 Secure Cloud Storage</p>
                  <p className="leading-relaxed">Your files are stored in isolated private storage. No public URLs exist; access is exclusively granted via 60-second time-limited signed URLs.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">2. 🔐 SHA-256 Digital Fingerprint</p>
                  <p className="leading-relaxed">A mathematical 256-bit cryptographic signature is computed from your file's exact bytes. If even one letter or pixel changes, the hash breaks.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">3. ⛓️ Ethereum Sepolia Smart Contract</p>
                  <p className="leading-relaxed">Your document's fingerprint is permanently recorded on smart contract <code>0x1b9A...8D0E</code> on Sepolia, proving proof of existence and exact timestamp.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                  <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">4. 🛡️ 1-Click Verification & Sharing</p>
                  <p className="leading-relaxed">Re-verify file integrity anytime with 1 click, or share with colleagues via links or in-app access with duration presets and instant revocation.</p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setShowHowItWorks(false)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Got It
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Live Upload Progress & Animation Modal */}
        <UploadProgressModal state={uploadProgress} />
      </div>
    </AppLayout>
  );
}
