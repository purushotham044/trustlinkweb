// ============================================================
// TrustLink Web — Professional Dashboard Page
// Complete feature parity with mobile app: 3-Metric Streamlined Layout
// ============================================================

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  ShieldCheck, 
  Link2, 
  Upload, 
  ArrowRight, 
  Shield, 
  Info,
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
    { label: 'Total Vault Files', value: stats.totalDocs, icon: <FileText className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-950/40', link: '/app/vault' },
    { label: 'Verified Intact', value: stats.verifiedDocs, icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-950/40', link: '/app/activity' },
    { label: 'Blockchain Proofs', value: stats.anchoredDocs, icon: <Link2 className="w-5 h-5 text-indigo-500" />, bg: 'bg-indigo-50 dark:bg-indigo-950/40', link: '/app/activity' },
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

        {/* Pipeline Summary Card */}
        <div className="bg-gradient-to-r from-indigo-900/10 via-slate-900/5 to-emerald-900/10 dark:from-indigo-950/40 dark:via-slate-900/40 dark:to-emerald-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  The TrustLink Protocol
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                  Vault Storage ➔ SHA-256 Digest ➔ Ethereum Sepolia Proof ➔ Mathematical Verification
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

        {/* 3-Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <Link
              key={s.label}
              to={s.link}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow hover:border-indigo-400 dark:hover:border-indigo-600 transition block"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? <span className="inline-block w-8 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" /> : s.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Recent Documents & Quick Links */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
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
              <p className="text-xs">No documents vaulted yet.</p>
              <Button
                variant="primary"
                onClick={handleQuickUploadTrigger}
                className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Upload First File
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/app/documents/${doc.id}`}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      doc.integrity_status === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : doc.integrity_status === 'FAILED'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    {doc.integrity_status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress Modal */}
      <UploadProgressModal
        state={uploadProgress}
        onClose={() => setUploadProgress(prev => ({ ...prev, visible: false }))}
      />
    </AppLayout>
  );
}
