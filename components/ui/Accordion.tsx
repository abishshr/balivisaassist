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
    <div className="bg-white border border-gray-200 rounded-2xl transition-colors duration-200">
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left group"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="font-bold text-gray-900 group-hover:text-[#0F4C5C] transition-colors text-sm sm:text-base">{title}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-4',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className="px-5 sm:px-6 pb-5 sm:pb-6"
        >
          <div className="pt-3 border-t border-gray-100 text-sm text-gray-500 leading-relaxed">{children}</div>
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
