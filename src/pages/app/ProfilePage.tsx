import React from 'react';
import { User as UserIcon, Shield, Key, LogOut } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { BLOCKCHAIN_NETWORK } from '@/lib/constants';

export function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'User';

  return (
    <AppLayout>
      <div className="p-6 sm:p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-1">User Profile &amp; Settings</h1>
          <p className="text-[#94A3B8] text-sm">Account identity, security configuration, and network details.</p>
        </div>

        {/* User Card */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#0A0E1A] border border-[#00D4FF] flex items-center justify-center text-[#00D4FF]">
              <UserIcon size={32} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9]">{displayName}</h2>
              <p className="text-xs text-[#94A3B8]">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold text-[#10B981] bg-[rgba(16,185,129,0.12)] px-2 py-0.5 rounded border border-[rgba(16,185,129,0.3)]">
                Authenticated via Supabase
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1E293B] pt-4 text-xs">
            <div>
              <span className="text-[#475569] block mb-1">User ID (UUID)</span>
              <span className="font-mono text-[#94A3B8]">{user?.id || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#475569] block mb-1">Account Created</span>
              <span className="text-[#94A3B8]">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Security / Network Info */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest">Environment &amp; Blockchain</h3>
          <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-3">
            <span className="text-[#94A3B8]">Connected Blockchain Network</span>
            <span className="text-[#8B5CF6] font-semibold">{BLOCKCHAIN_NETWORK}</span>
          </div>
          <div className="flex items-center justify-between text-xs border-b border-[#1E293B] pb-3">
            <span className="text-[#94A3B8]">Cryptographic Hash Algorithm</span>
            <span className="text-[#00D4FF] font-mono font-semibold">SHA-256</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Database Security Model</span>
            <span className="text-[#10B981] font-semibold">PostgreSQL Row-Level Security (RLS)</span>
          </div>
        </div>

        {/* Actions */}
        <Button variant="danger" size="md" icon={<LogOut size={16} />} onClick={() => signOut()}>
          Sign Out of TrustLink
        </Button>
      </div>
    </AppLayout>
  );
}
