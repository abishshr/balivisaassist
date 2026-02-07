import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'default' | 'destructive';
  children: React.ReactNode;
}

export function Badge({ variant = 'primary', className, children, ...props }: BadgeProps) {
  const variants = {
    primary: 'bg-amber-500/90 text-white border-amber-400/50',
    secondary: 'bg-orange-500/90 text-white border-orange-400/50',
    success: 'bg-green-500/90 text-white border-green-400/50',
    warning: 'bg-yellow-500/90 text-white border-yellow-400/50',
    info: 'bg-blue-500/90 text-white border-blue-400/50',
    default: 'bg-slate-500/90 text-white border-slate-400/50',
    destructive: 'bg-red-500/90 text-white border-red-400/50',
  };

  return (
    <span
      className={cn(
        'relative inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xl shadow-lg overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full pointer-events-none"></div>
      <span className="relative z-10">{children}</span>
    </span>
  );
}
