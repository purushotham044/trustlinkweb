import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SecuritySection } from '@/sections/SecuritySection';
import { AuditTimeline } from '@/sections/AuditTimeline';
import { CTASection } from '@/sections/CTASection';
import { ShieldCheck, Lock, Key, Server, Cpu, Database } from 'lucide-react';

export function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest bg-[rgba(0,212,255,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
              Architecture &amp; Trust Model
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#F1F5F9] mt-6 mb-6">
              Security Without Compromise
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              TrustLink pairs deterministic cryptographic hashing with decentralized public blockchain verification to create an indisputable record of truth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="p-6 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <Cpu size={24} className="text-[#00D4FF] mb-4" />
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">Deterministic Cryptography</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Binary SHA-256 hashes generated locally ensure that any file modifications, even a single bit, are flagged as tampered immediately.
              </p>
            </div>
            <div className="p-6 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <Server size={24} className="text-[#8B5CF6] mb-4" />
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">Sepolia Ethereum Anchoring</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Anchors are recorded in smart contracts on Ethereum Sepolia, providing timestamped, decentralized proof that cannot be altered or removed.
              </p>
            </div>
            <div className="p-6 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <Database size={24} className="text-[#10B981] mb-4" />
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">Zero Client-Side Trust</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Row-Level Security (RLS) guarantees backend database protection regardless of client status, blocking unauthorized reads and writes.
              </p>
            </div>
          </div>
        </div>

        <SecuritySection />
        <AuditTimeline />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
