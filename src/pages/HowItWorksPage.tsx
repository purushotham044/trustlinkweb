import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HowItWorks } from '@/sections/HowItWorks';
import { VerificationFlow } from '@/sections/VerificationFlow';
import { CTASection } from '@/sections/CTASection';

export function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <HowItWorks />
        <VerificationFlow />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
