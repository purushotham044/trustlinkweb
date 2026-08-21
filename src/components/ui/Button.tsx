import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'blockchain';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', icon, loading, fullWidth, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-[#00D4FF] hover:bg-[#00B4D8] text-[#0A0E1A] font-bold shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.35)] focus:ring-[#00D4FF]',
      secondary: 'bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1A2235] text-slate-800 dark:text-[#F1F5F9] border border-slate-200 dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-[#2D3748] focus:ring-[#475569] shadow-sm',
      danger: 'bg-red-50 dark:bg-[rgba(239,68,68,0.1)] hover:bg-red-100 dark:hover:bg-[rgba(239,68,68,0.2)] text-red-600 dark:text-[#EF4444] border border-red-200 dark:border-[rgba(239,68,68,0.3)] focus:ring-[#EF4444]',
      ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-[rgba(255,255,255,0.05)] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F1F5F9] focus:ring-[#475569]',
      blockchain: 'bg-purple-50 dark:bg-[rgba(139,92,246,0.12)] hover:bg-purple-100 dark:hover:bg-[rgba(139,92,246,0.2)] text-purple-700 dark:text-[#A78BFA] border border-purple-200 dark:border-[rgba(139,92,246,0.3)] focus:ring-[#8B5CF6]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
