import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'blockchain';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[#00D4FF] text-[#0A0E1A] border-[#00D4FF] hover:bg-[#0099BB] hover:border-[#0099BB] font-semibold',
  secondary: 'bg-transparent text-[#00D4FF] border-[#00D4FF] hover:bg-[rgba(0,212,255,0.1)]',
  ghost: 'bg-transparent text-[#94A3B8] border-[#1E293B] hover:border-[#2D3748] hover:text-[#F1F5F9]',
  danger: 'bg-[rgba(239,68,68,0.12)] text-[#EF4444] border-[#EF4444] hover:bg-[rgba(239,68,68,0.2)]',
  blockchain: 'bg-[rgba(139,92,246,0.12)] text-[#8B5CF6] border-[#8B5CF6] hover:bg-[rgba(139,92,246,0.2)]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center rounded-[10px] border transition-all duration-200 select-none cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-45 cursor-not-allowed' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
