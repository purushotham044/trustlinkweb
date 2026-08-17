import React from 'react';
import { Eye, Download, Clock, X, Share2, Shield } from 'lucide-react';

const shareFeatures = [
  { icon: <Eye size={18} />, title: 'View-Only Access', description: 'Recipients can view documents without the ability to download or modify them.', color: 'text-[#00D4FF]', bg: 'bg-[rgba(0,212,255,0.08)]' },
  { icon: <Download size={18} />, title: 'Download Rights', description: 'Grant download permission explicitly when recipients need a local copy.', color: 'text-[#10B981]', bg: 'bg-[rgba(16,185,129,0.08)]' },
  { icon: <Clock size={18} />, title: 'Time-Bounded Access', description: 'Set expiration: 1 hour, 24 hours, 7 days, or never. Access auto-expires.', color: 'text-[#F59E0B]', bg: 'bg-[rgba(245,158,11,0.08)]' },
  { icon: <X size={18} />, title: 'Instant Revocation', description: 'Revoke any share at any time. Access is cut off immediately across all recipients.', color: 'text-[#EF4444]', bg: 'bg-[rgba(239,68,68,0.08)]' },
];

const mockShares = [
  { doc: 'NDA_Agreement_2024.pdf', recipient: 'legal@partner.com', perm: 'VIEW', expiry: '7 days', status: 'active' },
  { doc: 'Q3_Financial_Report.xlsx', recipient: 'cfo@company.com', perm: 'DOWNLOAD', expiry: '24 hours', status: 'active' },
  { doc: 'Passport_Scan.png', recipient: 'kyc@bank.com', perm: 'VIEW', expiry: '1 hour', status: 'expired' },
];

export function SharingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="sharing-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-3">Secure Sharing</p>
          <h2 id="sharing-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
            Controlled Document Sharing
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Share with precision. Every share is time-bounded, permission-scoped, and fully revocable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {shareFeatures.map(f => (
              <div key={f.title} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 hover:border-[#2D3748] transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center ${f.color} mb-4`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#F1F5F9] mb-2">{f.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Share list mock */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center gap-2">
              <Share2 size={16} className="text-[#00D4FF]" />
              <span className="text-sm font-semibold text-[#F1F5F9]">Active Shares</span>
              <span className="ml-auto text-xs text-[#475569]">UI Preview</span>
            </div>
            <div className="divide-y divide-[#1E293B]">
              {mockShares.map(s => (
                <div key={s.doc} className="p-5 hover:bg-[#1A2235] transition-colors duration-200">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-semibold text-[#F1F5F9] truncate">{s.doc}</p>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                      s.status === 'active'
                        ? 'text-[#10B981] bg-[rgba(16,185,129,0.12)]'
                        : 'text-[#475569] bg-[#1A2235]'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] mb-3">{s.recipient}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[10px] text-[#00D4FF] bg-[rgba(0,212,255,0.08)] px-2 py-0.5 rounded-md">
                      {s.perm === 'VIEW' ? <Eye size={10} /> : <Download size={10} />} {s.perm}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[#475569]">
                      <Clock size={10} /> {s.expiry}
                    </span>
                    {s.status === 'active' && (
                      <button className="ml-auto text-[10px] text-[#EF4444] hover:text-[#F87171] transition-colors">Revoke</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
