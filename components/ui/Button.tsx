import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border shadow-sm hover:shadow-md active:scale-[0.98] transform';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#0F4C5C] to-[#1A6B7A] text-white hover:opacity-90 focus:ring-[#1A6B7A]/50 border-transparent',
    secondary:
      'bg-gradient-to-r from-[#E07A5F] to-[#C4603F] text-white hover:opacity-90 focus:ring-[#E07A5F]/50 border-transparent',
    outline:
      'bg-white border-[#0F4C5C] text-[#0F4C5C] hover:bg-[#0F4C5C] hover:text-white focus:ring-[#0F4C5C]/50',
    ghost:
      'bg-transparent border-transparent text-[#0F4C5C] hover:bg-[#F5E6D3]/50 focus:ring-gray-300 shadow-none hover:shadow-none',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-3 text-base h-12',
    lg: 'px-8 py-4 text-lg h-14',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
