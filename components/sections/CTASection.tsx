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
          className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 sm:p-16 border border-white/20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
            Ready to Start Your
            <br />
            <span className="text-amber-400">Bali Journey?</span>
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Get in touch today for a free consultation. We'll help you choose the right visa
            and guide you through every step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WhatsAppButton
              fixed={false}
              className="bg-green-600 text-white hover:bg-green-700 w-full sm:w-auto min-h-[56px] shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold text-lg"
            />
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 border-2 border-white w-full sm:w-auto min-h-[56px] shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold text-lg"
              >
                Email Us Instead
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-300 mt-8 font-medium">
            ⚡ Typical response time: Under 2 hours during business hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}
