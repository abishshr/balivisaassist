'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-3xl rounded-3xl p-12 sm:p-16 border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* iOS-style glass reflections */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-3xl"></div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg relative z-10">
            Ready to Start Your
            <br />
            <span className="text-amber-400">Bali Journey?</span>
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto relative z-10">
            Get in touch today for a free consultation. We'll help you choose the right visa
            and guide you through every step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
            <WhatsAppButton
              fixed={false}
              className="w-full sm:w-auto min-h-[56px] shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold text-lg"
            />
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-h-[56px] font-bold text-lg"
              >
                Email Us Instead
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-300 mt-8 font-medium relative z-10">
            ⚡ Typical response time: Under 2 hours during business hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}
