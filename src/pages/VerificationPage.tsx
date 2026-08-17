import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { VerificationFlow } from '@/sections/VerificationFlow';
import { CTASection } from '@/sections/CTASection';

export function VerificationPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
          <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest bg-[rgba(0,212,255,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,212,255,0.2)]">
            Interactive Verification Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#F1F5F9] mt-6 mb-4">
            Verify Any Document's Integrity
          </h1>
          <p className="text-base text-[#94A3B8] max-w-2xl mx-auto mb-6">
            Test and observe the dual-layer integrity verification system combining local SHA-256 fingerprinting and Ethereum smart contract validation.
          </p>
        </div>
        <VerificationFlow />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
