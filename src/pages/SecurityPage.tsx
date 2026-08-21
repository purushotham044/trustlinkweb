import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SecuritySection } from '@/sections/SecuritySection';
import { CTASection } from '@/sections/CTASection';

export function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen bg-[#0A0E1A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
          <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest bg-[rgba(0,212,255,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
            Enterprise Cryptography
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F1F5F9] mt-6 mb-4">
            Security Architecture
          </h1>
          <p className="text-base text-[#94A3B8] max-w-2xl mx-auto mb-6">
            Multi-tenant isolated storage, deterministic SHA-256 digital fingerprinting, and immutable Ethereum Sepolia smart contract anchoring.
          </p>
        </div>
        <SecuritySection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
