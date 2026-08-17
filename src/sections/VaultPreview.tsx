import React, { useState } from 'react';
import { Folder, FileText, Image, File, CheckCircle, Clock, AlertTriangle, Search, Upload, ChevronRight } from 'lucide-react';

const mockFolders = [
  { name: 'Legal Documents', count: 4 },
  { name: 'Financial Records', count: 7 },
  { name: 'Identity Papers', count: 2 },
];

const mockDocuments = [
  { name: 'NDA_Agreement_2024.pdf', size: '245 KB', date: 'Aug 12, 2026', status: 'VERIFIED', type: 'pdf', hash: 'a3f8c2e9...b2d3' },
  { name: 'Q3_Financial_Report.xlsx', size: '1.2 MB', date: 'Aug 10, 2026', status: 'VERIFIED', type: 'excel', hash: '7d4e1f2a...c9b8' },
  { name: 'Passport_Scan.png', size: '892 KB', date: 'Aug 8, 2026', status: 'PENDING', type: 'image', hash: null },
  { name: 'Contract_Draft_v3.docx', size: '156 KB', date: 'Aug 5, 2026', status: 'VERIFIED', type: 'word', hash: '2f9c7b4e...a1d5' },
];

function FileIcon({ type }: { type: string }) {
  if (type === 'pdf') return <FileText size={18} className="text-[#EF4444]" />;
  if (type === 'image') return <Image size={18} className="text-[#3B82F6]" />;
  if (type === 'excel') return <FileText size={18} className="text-[#10B981]" />;
  if (type === 'word') return <FileText size={18} className="text-[#2563EB]" />;
  return <File size={18} className="text-[#94A3B8]" />;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#10B981] bg-[rgba(16,185,129,0.12)] px-2 py-0.5 rounded-md uppercase tracking-wide">
      <CheckCircle size={10} /> Verified
    </span>
  );
  if (status === 'FAILED') return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#EF4444] bg-[rgba(239,68,68,0.12)] px-2 py-0.5 rounded-md uppercase tracking-wide">
      <AlertTriangle size={10} /> Tampered
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-[#F59E0B] bg-[rgba(245,158,11,0.12)] px-2 py-0.5 rounded-md uppercase tracking-wide">
      <Clock size={10} /> Pending
    </span>
  );
}

export function VaultPreview() {
  const [searchVal, setSearchVal] = useState('');
  const filtered = mockDocuments.filter(d =>
    d.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" aria-labelledby="vault-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-3">Document Vault</p>
          <h2 id="vault-heading" className="text-3xl sm:text-4xl font-bold text-[#F1F5F9] mb-4">
            Your Secure Document Vault
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            Organize documents in folders, verify their integrity at a glance, and manage every file with full cryptographic accountability.
          </p>
          <p className="text-xs text-[#475569] mt-3">UI Preview — illustrative content only</p>
        </div>

        {/* Vault UI mock */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1E293B]">
            <div className="flex-1 flex items-center gap-2 bg-[#0A0E1A] border border-[#1E293B] rounded-xl px-4 h-10">
              <Search size={14} className="text-[#475569]" />
              <input
                type="text"
                placeholder="Search vault..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#F1F5F9] placeholder-[#475569] outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 h-10 bg-[#00D4FF] text-[#0A0E1A] text-sm font-semibold rounded-xl hover:bg-[#0099BB] transition-colors">
              <Upload size={14} />
              Upload
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1E293B]">
            {/* Folders sidebar */}
            <div className="p-5">
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">Folders</p>
              <div className="flex flex-col gap-1.5">
                {mockFolders.map(f => (
                  <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1A2235] cursor-pointer transition-colors group">
                    <Folder size={16} className="text-[#F59E0B]" />
                    <span className="flex-1 text-sm text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">{f.name}</span>
                    <span className="text-[10px] text-[#475569]">{f.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Document list */}
            <div className="sm:col-span-2 p-5">
              <p className="text-[10px] font-bold text-[#475569] uppercase tracking-widest mb-3">
                Recent Documents {searchVal && `— "${searchVal}"`}
              </p>
              <div className="flex flex-col gap-2">
                {filtered.map(doc => (
                  <div key={doc.name} className="flex items-center gap-3 p-3 rounded-xl bg-[#0A0E1A] border border-[#1E293B] hover:border-[#2D3748] cursor-pointer transition-all duration-200 group">
                    <div className="w-9 h-9 rounded-lg bg-[#1A2235] border border-[#1E293B] flex items-center justify-center shrink-0">
                      <FileIcon type={doc.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#F1F5F9] truncate">{doc.name}</p>
                      <p className="text-[10px] text-[#475569]">{doc.size} · {doc.date}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <StatusBadge status={doc.status} />
                      <ChevronRight size={14} className="text-[#475569] group-hover:text-[#94A3B8]" />
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-[#475569] text-center py-6">No matching documents</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
