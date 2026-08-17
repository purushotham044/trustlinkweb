import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const HASH_SAMPLE = 'a3f8c2e91d47b65f0e8a2c3d4b5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3';

export function Hero() {
  const hashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const chars = '0123456789abcdef';
    const el = hashRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (frame++ % 8 !== 0) return;
      const idx = Math.floor(Math.random() * HASH_SAMPLE.length);
      const spans = el.querySelectorAll('span');
      if (spans[idx]) {
        spans[idx].textContent = chars[Math.floor(Math.random() * chars.length)];
        spans[idx].style.color = '#00D4FF';
        setTimeout(() => {
          if (spans[idx]) {
            spans[idx].textContent = HASH_SAMPLE[idx];
            spans[idx].style.color = '';
          }
        }, 300);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid pt-16" aria-labelledby="hero-heading">
      {/* Background radial gradient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(0,212,255,0.04)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(139,92,246,0.04)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.2)] mb-8 animate-[fade-in_0.6s_ease-out]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="text-xs text-[#00D4FF] font-medium tracking-wide">Blockchain-Backed Document Integrity</span>
        </div>

        {/* Wordmark */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-[slide-up_0.5s_ease-out]">
          <div className="w-14 h-14 rounded-2xl bg-[#111827] border-2 border-[#00D4FF] flex items-center justify-center shadow-[0_0_32px_rgba(0,212,255,0.2)]">
            <Shield size={28} className="text-[#00D4FF]" />
          </div>
          <h1 id="hero-heading" className="text-5xl sm:text-7xl font-bold text-[#F1F5F9] tracking-[0.2em]">
            TRUST<span className="text-[#00D4FF]">LINK</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-medium text-[#F1F5F9] mb-4 animate-[slide-up_0.6s_ease-out]">
          Secure Your Documents.<br className="sm:hidden" />{' '}
          Prove Their Integrity.<br className="sm:hidden" />{' '}
          Share With Confidence.
        </p>
        <p className="text-base sm:text-lg text-[#94A3B8] mb-12 max-w-2xl mx-auto leading-relaxed animate-[slide-up_0.7s_ease-out]">
          A secure digital document vault that protects, verifies, and provides cryptographic proof of your important documents — backed by SHA-256 hashing and Ethereum blockchain anchoring.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-[slide-up_0.8s_ease-out]">
          <Link to="/register">
            <Button variant="primary" size="lg" icon={<Shield size={18} />}>
              Get Started Free
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="ghost" size="lg" icon={<ChevronDown size={18} />}>
              Explore TrustLink
            </Button>
          </a>
        </div>

        {/* Animated hash display */}
        <div className="max-w-2xl mx-auto bg-[#111827] border border-[#1E293B] rounded-2xl p-5 animate-[slide-up_0.9s_ease-out]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">SHA-256 Fingerprint</span>
            <span className="text-[10px] text-[#475569] uppercase tracking-widest">Deterministic</span>
          </div>
          <div ref={hashRef} className="font-mono text-xs sm:text-sm text-[#475569] break-all text-left leading-relaxed">
            {HASH_SAMPLE.split('').map((c, i) => (
              <span key={i} style={{ transition: 'color 0.15s' }}>{c}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1E293B]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[10px] text-[#10B981] font-medium">Integrity Verified</span>
            <span className="ml-auto text-[10px] text-[#8B5CF6]">⛓ Anchored on Sepolia</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center animate-bounce" aria-hidden="true">
          <ChevronDown size={20} className="text-[#475569]" />
        </div>
      </div>
    </section>
  );
}
