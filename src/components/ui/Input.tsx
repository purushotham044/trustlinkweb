import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#475569]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#0A0E1A] border rounded-xl px-4 py-2.5 text-sm text-[#F1F5F9] placeholder-[#475569] transition-all duration-200 focus:outline-none focus:ring-1 ${
              icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                : 'border-[#1E293B] focus:border-[#00D4FF] focus:ring-[#00D4FF]'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#EF4444] mt-1.5 font-medium">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
