'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = `accordion-content-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const buttonId = `accordion-button-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-xl hover:bg-white/20 transition-all duration-300">
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left transition-colors"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="font-bold text-white drop-shadow-md">{title}</span>
        <ChevronDown
          className={cn(
            'w-6 h-6 text-gray-200 transition-transform duration-300',
            isOpen && 'transform rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className="px-6 pb-6"
        >
          <div className="pt-4 border-t border-white/20 text-gray-100 drop-shadow-sm">{children}</div>
        </div>
      )}
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}
