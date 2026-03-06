'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { BaliWatermark } from '@/components/layout/BaliBackground';

const ease = [0.16, 1, 0.3, 1] as const;

export const Hero = React.memo(function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pb-24 sm:pb-28">
      <BaliWatermark />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight"
          >
            Your Visa to Bali,
            <br />
            <span className="text-[#E07A5F]">Made Simple.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-lg sm:text-xl text-gray-300 mb-8"
          >
            Licensed agency. 17 visa types. Fully online process.
          </motion.p>

          {/* Single CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
          >
            <Link href="/services">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Explore Visa Services
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
});
