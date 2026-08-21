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
      secondary: 'bg-[#111827] hover:bg-[#1A2235] text-[#F1F5F9] border border-[#1E293B] hover:border-[#2D3748] focus:ring-[#475569]',
      danger: 'bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)] text-[#EF4444] border border-[rgba(239,68,68,0.3)] focus:ring-[#EF4444]',
      ghost: 'bg-transparent hover:bg-[rgba(255,255,255,0.05)] text-[#94A3B8] hover:text-[#F1F5F9] focus:ring-[#475569]',
      blockchain: 'bg-[rgba(139,92,246,0.12)] hover:bg-[rgba(139,92,246,0.2)] text-[#A78BFA] border border-[rgba(139,92,246,0.3)] focus:ring-[#8B5CF6]',
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
