import React from 'react';

type BadgeVariant = 'verified' | 'pending' | 'failed' | 'blockchain' | 'primary' | 'muted';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  verified: 'bg-[rgba(16,185,129,0.12)] text-[#10B981] border border-[rgba(16,185,129,0.3)]',
  pending: 'bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border border-[rgba(245,158,11,0.3)]',
  failed: 'bg-[rgba(239,68,68,0.12)] text-[#EF4444] border border-[rgba(239,68,68,0.3)]',
  blockchain: 'bg-[rgba(139,92,246,0.12)] text-[#8B5CF6] border border-[rgba(139,92,246,0.3)]',
  primary: 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]',
  muted: 'bg-[#1A2235] text-[#475569] border border-[#1E293B]',
};

export function Badge({ variant, children, icon, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${styles[variant]} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export function IntegrityBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') return <Badge variant="verified">✓ Verified</Badge>;
  if (status === 'FAILED') return <Badge variant="failed">⚠ Tampered</Badge>;
  return <Badge variant="pending">⏱ Pending</Badge>;
}
