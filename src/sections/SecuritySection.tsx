import React from 'react';
import { ShieldCheck, Link2, Lock, UserCheck, Activity } from 'lucide-react';

const pillars = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Cryptographic Integrity',
    description: 'Every document is hashed using SHA-256 — the same algorithm used in TLS and Bitcoin. A single-byte change to any file produces a completely different fingerprint, making tampering immediately detectable.',
    detail: 'SHA-256 · Deterministic · Binary-accurate',
    color: 'text-[#00D4FF]',
    bg: 'bg-[rgba(0,212,255,0.08)]',
    border: 'border-[rgba(0,212,255,0.2)]',
    accentBorder: 'border-l-[#00D4FF]',
  },
  {
    icon: <Link2 size={24} />,
    title: 'Blockchain Anchoring',
    description: 'Document hashes are published to the Ethereum Sepolia blockchain via a verified smart contract. This creates a permanent, publicly auditable proof of your document\'s existence and integrity at a specific point in time.',
    detail: 'Ethereum Sepolia · Smart Contract · Immutable',
    color: 'text-[#8B5CF6]',
    bg: 'bg-[rgba(139,92,246,0.08)]',
    border: 'border-[rgba(139,92,246,0.2)]',
    accentBorder: 'border-l-[#8B5CF6]',
  },
  {
    icon: <Lock size={24} />,
    title: 'Secure Storage',
    description: 'Files are stored with Row Level Security enforced at the database layer by PostgreSQL — not application code. Even if the app is compromised, your data access policies remain intact.',
    detail: 'PostgreSQL RLS · Supabase · Server-side enforcement',
    color: 'text-[#10B981]',
    bg: 'bg-[rgba(16,185,129,0.08)]',
    border: 'border-[rgba(16,185,129,0.2)]',
    accentBorder: 'border-l-[#10B981]',
  },
  {
    icon: <UserCheck size={24} />,
    title: 'Access Control',
    description: 'Sharing is granular. Choose between VIEW-only or DOWNLOAD permissions. Set precise expiration times. Revoke access instantly. Recipients only access what you explicitly allow.',
    detail: 'VIEW / DOWNLOAD · Time-bounded · Revocable',
    color: 'text-[#F59E0B]',
    bg: 'bg-[rgba(245,158,11,0.08)]',
    border: 'border-[rgba(245,158,11,0.2)]',
    accentBorder: 'border-l-[#F59E0B]',
  },
  {
    icon: <Activity size={24} />,
    title: 'Audit Trail',
    description: 'Every significant action is logged: uploads, verifications, blockchain anchoring events, shares created, shares revoked, and downloads. Your vault activity is always traceable.',
    detail: 'Immutable logs · Categorized · Timestamped',
    color: 'text-[#00D4FF]',
    bg: 'bg-[rgba(0,212,255,0.08)]',
    border: 'border-[rgba(0,212,255,0.2)]',
    accentBorder: 'border-l-[#00D4FF]',
  },
];

export function SecuritySection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#111827]" aria-labelledby="security-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-3">Security Architecture</p>
          <h2 id="security-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
            Enterprise-Grade Document Security
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            TrustLink is built on cryptographic principles — not just passwords. Every layer is designed to be independently verifiable.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className={`relative bg-[#0A0E1A] border border-[#1E293B] border-l-4 ${p.accentBorder} rounded-2xl p-7 hover:border-[#2D3748] transition-all duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-12 h-12 rounded-xl ${p.bg} border ${p.border} flex items-center justify-center ${p.color}`}>
                  {p.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#F1F5F9] mb-2">{p.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">{p.description}</p>
                  <div className={`inline-flex px-3 py-1 rounded-lg ${p.bg} border ${p.border} text-[10px] font-mono ${p.color} uppercase tracking-wide`}>
                    {p.detail}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust note */}
        <div className="mt-10 text-center">
          <p className="text-xs text-[#475569]">
            TrustLink is not a substitute for legal notarization. Blockchain proof demonstrates document integrity and timestamp, not legal enforceability.
          </p>
        </div>
      </div>
    </section>
  );
}
