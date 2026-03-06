import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'default' | 'destructive';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', className, children, ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-[#0F4C5C]/10 text-[#0F4C5C] border-[#0F4C5C]/20',
    secondary: 'bg-[#E07A5F]/10 text-[#E07A5F] border-[#E07A5F]/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-[#0F4C5C]/10 text-[#0F4C5C] border-[#0F4C5C]/20',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    destructive: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
