'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { generateWhatsAppURL } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  serviceId?: string;
  className?: string;
  fixed?: boolean;
}

export const WhatsAppButton = React.memo(function WhatsAppButton({
  serviceId,
  className,
  fixed = true,
}: WhatsAppButtonProps) {
  const handleClick = useCallback(() => {
    trackWhatsAppClick(serviceId);
    window.open(generateWhatsAppURL(serviceId), '_blank', 'noopener,noreferrer');
  }, [serviceId]);

  if (fixed) {
    return (
      <motion.button
        onClick={handleClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(
          'fixed z-50 text-white rounded-full shadow-2xl flex items-center gap-3 group overflow-hidden',
          'bottom-20 right-4 sm:bottom-6 sm:right-6',
          'h-14 px-4 sm:h-16 sm:px-5',
          className
        )}
        style={{ backgroundColor: '#25D366' }}
        aria-label="Contact us on WhatsApp"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>

        <motion.div
          whileHover={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <svg viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8" fill="white">
            <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.957 0-7.384 6.083-13.467 13.467-13.467s13.467 6.083 13.467 13.467-6.083 13.467-13.467 13.467zM21.713 18.36c-0.268-0.134-1.586-0.783-1.832-0.873-0.245-0.089-0.424-0.134-0.603 0.134s-0.692 0.873-0.848 1.052c-0.157 0.179-0.313 0.201-0.581 0.067s-1.132-0.417-2.156-1.33c-0.797-0.711-1.336-1.589-1.492-1.857s-0.017-0.413 0.118-0.547c0.12-0.12 0.268-0.313 0.402-0.469s0.179-0.268 0.268-0.447c0.089-0.179 0.045-0.335-0.022-0.469s-0.603-1.453-0.826-1.989c-0.217-0.522-0.438-0.451-0.603-0.459-0.156-0.008-0.335-0.010-0.514-0.010s-0.469 0.067-0.715 0.335c-0.245 0.268-0.937 0.916-0.937 2.234s0.959 2.591 1.093 2.77c0.134 0.179 1.891 2.886 4.581 4.047 0.639 0.276 1.139 0.441 1.528 0.565 0.642 0.204 1.227 0.175 1.688 0.106 0.515-0.077 1.586-0.648 1.81-1.274s0.224-1.163 0.157-1.274c-0.067-0.112-0.245-0.179-0.514-0.313z"/>
          </svg>
        </motion.div>

        <span className="relative z-10 font-semibold text-sm sm:text-base whitespace-nowrap">
          Chat on WhatsApp
        </span>

        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#25D366' }} />
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden',
        className
      )}
      style={{ backgroundColor: '#25D366' }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
      <svg viewBox="0 0 32 32" className="w-5 h-5 relative z-10" fill="white">
        <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.957 0-7.384 6.083-13.467 13.467-13.467s13.467 6.083 13.467 13.467-6.083 13.467-13.467 13.467zM21.713 18.36c-0.268-0.134-1.586-0.783-1.832-0.873-0.245-0.089-0.424-0.134-0.603 0.134s-0.692 0.873-0.848 1.052c-0.157 0.179-0.313 0.201-0.581 0.067s-1.132-0.417-2.156-1.33c-0.797-0.711-1.336-1.589-1.492-1.857s-0.017-0.413 0.118-0.547c0.12-0.12 0.268-0.313 0.402-0.469s0.179-0.268 0.268-0.447c0.089-0.179 0.045-0.335-0.022-0.469s-0.603-1.453-0.826-1.989c-0.217-0.522-0.438-0.451-0.603-0.459-0.156-0.008-0.335-0.010-0.514-0.010s-0.469 0.067-0.715 0.335c-0.245 0.268-0.937 0.916-0.937 2.234s0.959 2.591 1.093 2.77c0.134 0.179 1.891 2.886 4.581 4.047 0.639 0.276 1.139 0.441 1.528 0.565 0.642 0.204 1.227 0.175 1.688 0.106 0.515-0.077 1.586-0.648 1.81-1.274s0.224-1.163 0.157-1.274c-0.067-0.112-0.245-0.179-0.514-0.313z"/>
      </svg>
      <span className="relative z-10">Chat on WhatsApp</span>
    </motion.button>
  );
});
