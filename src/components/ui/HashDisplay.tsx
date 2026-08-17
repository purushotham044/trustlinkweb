import React from 'react';

interface HashDisplayProps {
  hash: string | null;
  label?: string;
  truncate?: boolean;
}

function truncateHash(h: string, prefix = 8, suffix = 6) {
  if (h.length <= prefix + suffix + 3) return h;
  return `${h.slice(0, prefix)}...${h.slice(-suffix)}`;
}

export function HashDisplay({ hash, label = 'SHA-256', truncate = false }: HashDisplayProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    if (!hash) return;
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!hash) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">{label}</span>
        <span className="text-xs text-[#475569] font-mono">Not computed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#475569] uppercase tracking-wider">{label}</span>
        <span className="text-[9px] text-[#475569] uppercase tracking-wider">Deterministic</span>
      </div>
      <div className="flex items-center gap-2 bg-[#0A0E1A] rounded-[8px] border border-[#1E293B] px-3 py-2">
        <code className="flex-1 text-[11px] text-[#00D4FF] font-mono break-all leading-relaxed">
          {truncate ? truncateHash(hash) : hash}
        </code>
        <button
          onClick={copy}
          className="shrink-0 text-[10px] text-[#475569] hover:text-[#00D4FF] transition-colors duration-150 cursor-pointer"
          title="Copy hash"
        >
          {copied ? '✓' : '⎘'}
        </button>
      </div>
    </div>
  );
}
