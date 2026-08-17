import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SharingSection } from '@/sections/SharingSection';
import { CTASection } from '@/sections/CTASection';

export function SharingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <SharingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
