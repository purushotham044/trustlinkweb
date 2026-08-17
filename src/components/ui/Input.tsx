import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'w-full px-4 py-3 rounded-[10px] border text-sm text-[#F1F5F9] placeholder-[#475569]',
          'bg-[#0A0E1A] border-[#1E293B] outline-none transition-all duration-200',
          'focus:border-[#00D4FF] focus:ring-1 focus:ring-[rgba(0,212,255,0.2)]',
          error ? 'border-[#EF4444]' : '',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
}
