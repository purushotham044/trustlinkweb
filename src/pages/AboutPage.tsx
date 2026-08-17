import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, CheckCircle, Lock, Link2 } from 'lucide-react';
import { CTASection } from '@/sections/CTASection';

export function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest bg-[rgba(0,212,255,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
              Our Mission
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#F1F5F9] mt-6 mb-6">
              About TrustLink
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed">
              TrustLink was engineered to restore cryptographic certainty to document storage and exchange in an era of rampant tampering and deepfakes.
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 sm:p-10 mb-12 space-y-6 text-sm text-[#94A3B8] leading-relaxed">
            <h2 className="text-xl font-bold text-[#F1F5F9]">The Problem We Solve</h2>
            <p>
              Traditional cloud storage platforms provide storage, but fail to guarantee that files have not been modified or corrupted over time. When sensitive legal agreements, identity documents, and financial audits are exchanged, participants require incontrovertible proof of authenticity.
            </p>
            <p>
              TrustLink solves this by binding every uploaded document to a deterministic cryptographic fingerprint (SHA-256) and enabling immutable timestamped anchoring to the Ethereum Sepolia blockchain network.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            <div className="p-6 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <Shield className="text-[#00D4FF] mb-3" size={24} />
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">Cryptographic Transparency</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Verification algorithms run transparently with standard SHA-256 implementations, requiring zero blind trust in proprietary black boxes.
              </p>
            </div>
            <div className="p-6 bg-[#111827] border border-[#1E293B] rounded-2xl">
              <Link2 className="text-[#8B5CF6] mb-3" size={24} />
              <h3 className="text-base font-bold text-[#F1F5F9] mb-2">Decentralized Timestamping</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Smart contract proofs anchored on Ethereum are publicly verifiable on block explorers by any external third party.
              </p>
            </div>
          </div>
        </div>
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
