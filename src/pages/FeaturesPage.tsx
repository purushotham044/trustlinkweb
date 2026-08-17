import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VaultPreview } from '@/sections/VaultPreview';
import { SharingSection } from '@/sections/SharingSection';
import { CTASection } from '@/sections/CTASection';
import { Shield, Lock, FileCheck, Share2, Activity, Link2, Database, Key } from 'lucide-react';

const detailedFeatures = [
  {
    icon: <Database size={24} />,
    title: 'Secure Document Vault',
    desc: 'Categorize records into logical folders. Strict access policies guarantee that your data is segregated and inaccessible to unauthorized actors.',
    tag: 'Storage'
  },
  {
    icon: <FileCheck size={24} />,
    title: 'SHA-256 Fingerprinting',
    desc: 'Instant, deterministic calculation of 256-bit hashes. Even the slightest alteration in file metadata or contents flags an immediate integrity failure.',
    tag: 'Integrity'
  },
  {
    icon: <Link2 size={24} />,
    title: 'Ethereum Blockchain Anchoring',
    desc: 'Anchor hashes to the public Ethereum Sepolia network via dedicated smart contracts for decentralized timestamping and existence verification.',
    tag: 'Blockchain'
  },
  {
    icon: <Share2 size={24} />,
    title: 'Granular Document Sharing',
    desc: 'Distribute access with precision: choose between VIEW or DOWNLOAD permissions, accompanied by custom expiration limits or manual instant revocation.',
    tag: 'Access'
  },
  {
    icon: <Activity size={24} />,
    title: 'Immutable Audit Trail',
    desc: 'Capture complete lifecycle events for every document—upload, hash generation, verification attempts, share distribution, and revocation.',
    tag: 'Compliance'
  },
  {
    icon: <Key size={24} />,
    title: 'PostgreSQL Row-Level Security',
    desc: 'Security enforced at the database layer rather than client logic, providing bulletproof authorization boundaries regardless of client entry point.',
    tag: 'Architecture'
  }
];

export function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest bg-[rgba(0,212,255,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
              Core Capabilities
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#F1F5F9] mt-6 mb-6">
              Engineered for Absolute Document Integrity
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              Explore the end-to-end security architecture that powers TrustLink across mobile and web ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {detailedFeatures.map(f => (
              <div key={f.title} className="p-8 bg-[#111827] border border-[#1E293B] hover:border-[#2D3748] rounded-2xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#0A0E1A] border border-[#1E293B] flex items-center justify-center text-[#00D4FF]">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-[#8B5CF6] bg-[rgba(139,92,246,0.12)] px-2.5 py-1 rounded-md border border-[rgba(139,92,246,0.3)]">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F1F5F9] mb-3">{f.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <VaultPreview />
        <SharingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
