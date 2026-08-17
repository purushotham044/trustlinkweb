import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <div className="max-w-4xl mx-auto text-center">
        {/* Glow */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-96 h-96 rounded-full bg-[rgba(0,212,255,0.05)] blur-3xl" />
          </div>

          <div className="relative bg-[#111827] border border-[#1E293B] rounded-3xl p-12 sm:p-16">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.3)] flex items-center justify-center mx-auto mb-8">
              <Shield size={32} className="text-[#00D4FF]" />
            </div>

            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
              Start Protecting Your Documents
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join TrustLink and give every important document a cryptographic identity — provably authentic, verifiably intact, securely shared.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<Shield size={18} />}>
                  Create Your Vault
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="ghost" size="lg" icon={<ArrowRight size={18} />}>
                  Learn How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#475569]">
              <span className="flex items-center gap-1.5"><span className="text-[#10B981]">✓</span> SHA-256 integrity verification</span>
              <span className="flex items-center gap-1.5"><span className="text-[#8B5CF6]">✓</span> Ethereum Sepolia blockchain anchoring</span>
              <span className="flex items-center gap-1.5"><span className="text-[#00D4FF]">✓</span> Granular sharing controls</span>
              <span className="flex items-center gap-1.5"><span className="text-[#F59E0B]">✓</span> Complete audit trail</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
