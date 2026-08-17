import React, { useState, useEffect } from 'react';
import { Activity, Upload, ShieldCheck, Link2, Share2, Download, Trash2, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { auditService } from '@/services/auditService';
import { ExtendedAuditLog, AuditCategory } from '@/types';
import { AUDIT_ACTION_LABELS } from '@/lib/constants';

export function ActivityPage() {
  const [logs, setLogs] = useState<ExtendedAuditLog[]>([]);
  const [category, setCategory] = useState<AuditCategory>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [category]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAuditLogs(category);
      setLogs(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('BLOCKCHAIN')) return <Link2 size={16} className="text-[#8B5CF6]" />;
    if (action.includes('VERIFIED')) return <ShieldCheck size={16} className="text-[#10B981]" />;
    if (action.includes('SHARED')) return <Share2 size={16} className="text-[#00D4FF]" />;
    if (action.includes('DOWNLOAD')) return <Download size={16} className="text-[#94A3B8]" />;
    return <Upload size={16} className="text-[#00D4FF]" />;
  };

  const categories: { label: string; val: AuditCategory }[] = [
    { label: 'All Activities', val: 'ALL' },
    { label: 'Integrity & Hashing', val: 'INTEGRITY' },
    { label: 'Blockchain', val: 'BLOCKCHAIN' },
    { label: 'Sharing', val: 'SHARING' },
    { label: 'File Operations', val: 'FILES' },
  ];

  return (
    <AppLayout>
      <div className="p-6 sm:p-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F1F5F9] mb-1">Audit Trail &amp; Activity</h1>
          <p className="text-[#94A3B8] text-sm">Full verifiable audit history for compliance and transparency.</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => (
            <button
              key={c.val}
              onClick={() => setCategory(c.val)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === c.val
                  ? 'bg-[rgba(0,212,255,0.12)] text-[#00D4FF] border border-[rgba(0,212,255,0.3)]'
                  : 'bg-[#111827] text-[#94A3B8] border border-[#1E293B] hover:text-[#F1F5F9]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Logs Timeline */}
        {loading ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1E293B] rounded-2xl">
            <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#94A3B8]">Loading audit records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 bg-[#111827] border border-[#1E293B] rounded-2xl">
            <Activity size={36} className="text-[#475569] mx-auto mb-3" />
            <p className="text-base font-semibold text-[#F1F5F9] mb-1">No activity records found</p>
            <p className="text-sm text-[#475569]">Actions performed in your vault will automatically log here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map(log => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 bg-[#111827] border border-[#1E293B] rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0A0E1A] border border-[#1E293B] flex items-center justify-center shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <p className="text-sm font-semibold text-[#F1F5F9]">
                      {AUDIT_ACTION_LABELS[log.action] || log.action}
                    </p>
                    <span className="text-[11px] text-[#475569]">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  {log.document && (
                    <p className="text-xs text-[#00D4FF] truncate mb-1">
                      File: {log.document.name}
                    </p>
                  )}
                  {log.metadata && (
                    <p className="text-[11px] text-[#475569] font-mono break-all">
                      {JSON.stringify(log.metadata)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
