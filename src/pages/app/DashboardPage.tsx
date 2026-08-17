import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, Link2, Share2, Upload, ArrowRight, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDocuments';

export function DashboardPage() {
  const { profile, user } = useAuth();
  const { stats, loading } = useDashboardStats();
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';

  const statCards = [
    { label: 'Total Documents', value: stats.totalDocs, icon: <FileText size={20} />, color: 'text-[#00D4FF]', bg: 'bg-[rgba(0,212,255,0.08)]' },
    { label: 'Verified', value: stats.verifiedDocs, icon: <ShieldCheck size={20} />, color: 'text-[#10B981]', bg: 'bg-[rgba(16,185,129,0.08)]' },
    { label: 'Blockchain Anchored', value: stats.anchoredDocs, icon: <Link2 size={20} />, color: 'text-[#8B5CF6]', bg: 'bg-[rgba(139,92,246,0.08)]' },
    { label: 'Active Shares', value: stats.sharedDocs, icon: <Share2 size={20} />, color: 'text-[#F59E0B]', bg: 'bg-[rgba(245,158,11,0.08)]' },
  ];

  const quickActions = [
    { to: '/app/vault', label: 'Open Vault', icon: <FileText size={18} />, desc: 'Browse and manage your documents' },
    { to: '/verify', label: 'Verify Document', icon: <ShieldCheck size={18} />, desc: 'Check document integrity' },
    { to: '/app/sharing', label: 'Manage Shares', icon: <Share2 size={18} />, desc: 'View and control shared access' },
    { to: '/app/activity', label: 'Audit Trail', icon: <TrendingUp size={18} />, desc: 'Review all vault activity' },
  ];

  return (
    <AppLayout>
      <div className="p-6 sm:p-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#475569] text-sm mb-1">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9]">{displayName}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(s => (
            <div key={s.label} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-4`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-[#F1F5F9]">
                {loading ? <span className="inline-block w-8 h-6 bg-[#1A2235] rounded animate-pulse" /> : s.value}
              </p>
              <p className="text-xs text-[#475569] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <h2 className="text-xs font-bold text-[#475569] uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map(a => (
              <Link
                key={a.to}
                to={a.to}
                className="flex items-center gap-4 p-5 bg-[#111827] border border-[#1E293B] rounded-2xl hover:border-[#2D3748] transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[#00D4FF]">
                  {a.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#F1F5F9] text-sm">{a.label}</p>
                  <p className="text-xs text-[#475569]">{a.desc}</p>
                </div>
                <ArrowRight size={16} className="text-[#475569] group-hover:text-[#94A3B8] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Upload CTA */}
        <div className="bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(0,212,255,0.12)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center text-[#00D4FF] shrink-0">
            <Upload size={22} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-[#F1F5F9] mb-1">Upload a Document to Your Vault</p>
            <p className="text-sm text-[#94A3B8]">Supports PDF, Word, Excel, images, and text. Up to 50 MB.</p>
          </div>
          <Link to="/app/vault">
            <Button variant="primary" size="md" icon={<Upload size={16} />}>Go to Vault</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
