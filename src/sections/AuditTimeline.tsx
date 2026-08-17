import React from 'react';
import { Upload, ShieldCheck, Share2, Download, RotateCcw, Link2, Hash, Eye } from 'lucide-react';

const timelineEvents = [
  { time: '09:41 AM', date: 'Aug 17, 2026', action: 'BLOCKCHAIN_ANCHORED', doc: 'NDA_Agreement_2024.pdf', meta: 'Tx: 0x8A3b...92F1', icon: <Link2 size={14} />, color: 'text-[#8B5CF6]', bg: 'bg-[rgba(139,92,246,0.12)]', border: 'border-[rgba(139,92,246,0.3)]', label: 'Blockchain Anchored' },
  { time: '09:39 AM', date: 'Aug 17, 2026', action: 'DOCUMENT_VERIFIED', doc: 'NDA_Agreement_2024.pdf', meta: 'SHA-256: a3f8c2e9...', icon: <ShieldCheck size={14} />, color: 'text-[#10B981]', bg: 'bg-[rgba(16,185,129,0.12)]', border: 'border-[rgba(16,185,129,0.3)]', label: 'Integrity Verified' },
  { time: '09:35 AM', date: 'Aug 17, 2026', action: 'HASH_CREATED', doc: 'NDA_Agreement_2024.pdf', meta: 'SHA-256 proof generated', icon: <Hash size={14} />, color: 'text-[#00D4FF]', bg: 'bg-[rgba(0,212,255,0.12)]', border: 'border-[rgba(0,212,255,0.3)]', label: 'SHA-256 Hash Created' },
  { time: '09:33 AM', date: 'Aug 17, 2026', action: 'DOCUMENT_UPLOADED', doc: 'NDA_Agreement_2024.pdf', meta: '245 KB · application/pdf', icon: <Upload size={14} />, color: 'text-[#00D4FF]', bg: 'bg-[rgba(0,212,255,0.12)]', border: 'border-[rgba(0,212,255,0.3)]', label: 'Document Uploaded' },
  { time: '08:12 AM', date: 'Aug 17, 2026', action: 'DOCUMENT_SHARED', doc: 'Q3_Financial_Report.xlsx', meta: 'Shared with cfo@company.com · DOWNLOAD', icon: <Share2 size={14} />, color: 'text-[#F59E0B]', bg: 'bg-[rgba(245,158,11,0.12)]', border: 'border-[rgba(245,158,11,0.3)]', label: 'Document Shared' },
  { time: 'Yesterday', date: 'Aug 16, 2026', action: 'SHARE_REVOKED', doc: 'Passport_Scan.png', meta: 'Access revoked from kyc@bank.com', icon: <RotateCcw size={14} />, color: 'text-[#EF4444]', bg: 'bg-[rgba(239,68,68,0.12)]', border: 'border-[rgba(239,68,68,0.3)]', label: 'Share Revoked' },
  { time: 'Yesterday', date: 'Aug 16, 2026', action: 'DOCUMENT_DOWNLOADED', doc: 'Contract_Draft_v3.docx', meta: 'Downloaded to device', icon: <Download size={14} />, color: 'text-[#94A3B8]', bg: 'bg-[rgba(148,163,184,0.12)]', border: 'border-[rgba(148,163,184,0.2)]', label: 'Document Downloaded' },
];

export function AuditTimeline() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#111827]" aria-labelledby="audit-heading">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-3">Audit Trail</p>
          <h2 id="audit-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
            Transparent Activity Record
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Every significant document and sharing event is timestamped and categorized — giving you a complete, honest record of your vault activity.
          </p>
          <p className="text-xs text-[#475569] mt-2">UI Preview — illustrative events</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1E293B]" aria-hidden="true" />

          <div className="flex flex-col gap-0">
            {timelineEvents.map((event, i) => (
              <div key={i} className="flex gap-6 pb-6 last:pb-0">
                {/* Node */}
                <div className="relative shrink-0 flex flex-col items-center" style={{ width: '40px' }}>
                  <div className={`w-10 h-10 rounded-full ${event.bg} border ${event.border} flex items-center justify-center ${event.color} z-10 bg-[#111827]`}>
                    {event.icon}
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 bg-[#0A0E1A] border border-[#1E293B] rounded-2xl p-5 hover:border-[#2D3748] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${event.bg} ${event.color}`}>
                      {event.label}
                    </span>
                    <span className="text-[10px] text-[#475569]">{event.time} · {event.date}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#F1F5F9] mb-1 truncate">{event.doc}</p>
                  <p className="text-xs text-[#475569] font-mono">{event.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
