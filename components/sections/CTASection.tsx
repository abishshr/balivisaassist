'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

const ease = [0.16, 1, 0.3, 1] as const;

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 relative z-10 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Ready to Start?
          </h2>
          <p className="text-gray-500 mb-6">
            Get in touch for a free consultation. We&apos;ll help you choose the right visa and guide you through every step.
          </p>
          <WhatsAppButton fixed={false} className="text-sm" />
        </motion.div>
      </div>
    </section>
  );
}
