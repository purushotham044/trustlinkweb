import React from 'react';
import { Upload, Lock, ShieldCheck, Link2, Share2, Activity } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: <Upload size={22} />,
    title: 'Store',
    description: 'Securely upload and organize your important documents into folders. Supports PDF, Word, Excel, images, and text files up to 50 MB.',
    color: 'text-[#00D4FF]',
    bg: 'bg-[rgba(0,212,255,0.08)]',
    border: 'border-[rgba(0,212,255,0.2)]',
  },
  {
    num: '02',
    icon: <Lock size={22} />,
    title: 'Protect',
    description: 'Documents are protected through secure Supabase storage with Row Level Security. Only you control access to your vault.',
    color: 'text-[#10B981]',
    bg: 'bg-[rgba(16,185,129,0.08)]',
    border: 'border-[rgba(16,185,129,0.2)]',
  },
  {
    num: '03',
    icon: <ShieldCheck size={22} />,
    title: 'Verify',
    description: 'Generate a deterministic SHA-256 cryptographic fingerprint for every document. Any single-byte modification produces a completely different hash.',
    color: 'text-[#F59E0B]',
    bg: 'bg-[rgba(245,158,11,0.08)]',
    border: 'border-[rgba(245,158,11,0.2)]',
  },
  {
    num: '04',
    icon: <Link2 size={22} />,
    title: 'Anchor',
    description: 'Publish your document\'s SHA-256 hash to the Ethereum Sepolia blockchain. This creates an immutable, timestamped public proof of existence.',
    color: 'text-[#8B5CF6]',
    bg: 'bg-[rgba(139,92,246,0.08)]',
    border: 'border-[rgba(139,92,246,0.2)]',
  },
  {
    num: '05',
    icon: <Share2 size={22} />,
    title: 'Share',
    description: 'Share documents with granular permission control — VIEW only or DOWNLOAD rights. Set expiration times of 1 hour, 24 hours, 7 days, or never. Revoke access instantly.',
    color: 'text-[#00D4FF]',
    bg: 'bg-[rgba(0,212,255,0.08)]',
    border: 'border-[rgba(0,212,255,0.2)]',
  },
  {
    num: '06',
    icon: <Activity size={22} />,
    title: 'Audit',
    description: 'Every significant action — uploads, verifications, shares, revocations, and blockchain anchoring — is recorded in a tamper-evident audit trail.',
    color: 'text-[#10B981]',
    bg: 'bg-[rgba(16,185,129,0.08)]',
    border: 'border-[rgba(16,185,129,0.2)]',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="how-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-3">Product Workflow</p>
          <h2 id="how-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
            How TrustLink Works
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Six clear steps from document storage to cryptographic proof — every step designed for security without complexity.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative bg-[#111827] border border-[#1E293B] rounded-2xl p-7 hover:border-[#2D3748] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Step number */}
              <div className="flex items-center justify-between mb-5">
                <div className={`w-11 h-11 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center ${step.color}`}>
                  {step.icon}
                </div>
                <span className="text-4xl font-black text-[#1E293B] group-hover:text-[#2D3748] transition-colors duration-300">
                  {step.num}
                </span>
              </div>
              <h3 className={`text-lg font-bold mb-2 ${step.color}`}>{step.title}</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
