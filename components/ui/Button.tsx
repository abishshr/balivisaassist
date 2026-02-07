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
    'group inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl border shadow-lg hover:shadow-2xl active:scale-95 transform relative overflow-hidden';

  const variants = {
    primary:
      'bg-gradient-to-br from-amber-500/90 via-amber-400/80 to-orange-500/90 text-white hover:from-amber-500 hover:via-amber-400 hover:to-orange-500 focus:ring-amber-400/50 border-white/30',
    secondary:
      'bg-gradient-to-br from-orange-500/90 via-orange-400/80 to-red-500/90 text-white hover:from-orange-500 hover:via-orange-400 hover:to-red-500 focus:ring-orange-400/50 border-white/30',
    outline:
      'bg-white/10 backdrop-blur-2xl border-white/30 text-white hover:bg-white/20 hover:border-white/50 focus:ring-white/50',
    ghost:
      'bg-white/5 backdrop-blur-xl border-white/20 text-white hover:bg-white/15 hover:border-white/30 focus:ring-white/30',
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
      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-2xl pointer-events-none" />

      {/* Inner glow for primary and secondary variants */}
      {(variant === 'primary' || variant === 'secondary') && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}

      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
