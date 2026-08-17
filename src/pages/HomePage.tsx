import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { SecuritySection } from '@/sections/SecuritySection';
import { VaultPreview } from '@/sections/VaultPreview';
import { VerificationFlow } from '@/sections/VerificationFlow';
import { SharingSection } from '@/sections/SharingSection';
import { AuditTimeline } from '@/sections/AuditTimeline';
import { CTASection } from '@/sections/CTASection';

export function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <SecuritySection />
        <VaultPreview />
        <VerificationFlow />
        <SharingSection />
        <AuditTimeline />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
