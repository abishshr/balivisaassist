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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500 shadow-lg hover:shadow-xl active:scale-95 transform',
    secondary:
      'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400 shadow-lg hover:shadow-xl active:scale-95 transform',
    outline:
      'border-2 border-amber-500 text-amber-600 hover:bg-amber-50 focus:ring-amber-500 active:scale-95 transform',
    ghost:
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 active:scale-95 transform',
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
      {children}
    </button>
  );
}
