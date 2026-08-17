import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Security', to: '/security' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'Document Verification', to: '/verify' },
    { label: 'Secure Sharing', to: '/sharing' },
  ],
  Company: [
    { label: 'About TrustLink', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  Blockchain: [
    { label: 'Ethereum Sepolia', href: 'https://sepolia.etherscan.io', external: true },
    { label: 'Smart Contract', href: 'https://sepolia.etherscan.io/address/0x1b9A1FBD6FC714B1aC443d00a555529567bd8D0E', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#111827] border-t border-[#1E293B] mt-24" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0A0E1A] border border-[#00D4FF] flex items-center justify-center">
                <Shield size={16} className="text-[#00D4FF]" />
              </div>
              <span className="font-bold text-[#F1F5F9] tracking-[0.1em] text-sm">TRUSTLINK</span>
            </Link>
            <p className="text-sm text-[#475569] leading-relaxed max-w-xs">
              A secure digital document vault with SHA-256 cryptographic integrity verification and Ethereum blockchain anchoring.
            </p>
            <div className="mt-6 flex items-center gap-2 text-[10px] text-[#475569] uppercase tracking-wider">
              <Shield size={12} className="text-[#10B981]" />
              <span>Secured by SHA-256 + Blockchain</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-widest mb-4">{section}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-[#475569] hover:text-[#94A3B8] transition-colors duration-200"
                      >
                        {link.label}
                        <ExternalLink size={10} />
                      </a>
                    ) : (
                      <Link
                        to={'to' in link ? link.to : '/'}
                        className="text-sm text-[#475569] hover:text-[#94A3B8] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#475569]">
            © {new Date().getFullYear()} TrustLink. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#475569]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
              Ethereum Sepolia Network
            </span>
            <span>·</span>
            <span>PostgreSQL RLS Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
