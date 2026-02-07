'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { BaliWatermark } from '@/components/layout/BaliBackground';

export const Hero = React.memo(function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-[140px]">
      <BaliWatermark />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/60 backdrop-blur-xl text-white rounded-full text-sm font-bold mb-8 shadow-xl border border-white/30 overflow-hidden"
          >
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-full"></div>
            <Shield className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Licensed Visa Sponsor & Immigration Services</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl"
          >
            Live Your Dream
            <br />
            <span className="text-amber-400">in Bali</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl sm:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Fast, legal visa processing for digital nomads, retirees, and investors.
            <br className="hidden sm:block" />
            We handle the paperwork. You enjoy paradise.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mb-16 justify-center"
          >
            <Link href="/services">
              <Button size="lg" className="w-full sm:w-auto shadow-2xl">
                Explore Visa Services
                <ArrowRight className="w-5 h-5 flex-shrink-0" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 shadow-2xl">
                Free Consultation
              </Button>
            </Link>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Shield, value: '100%', label: 'Legal & Licensed' },
              { icon: Clock, value: '5-7', label: 'Days Processing' },
              { icon: CheckCircle2, value: '7', label: 'Visa Types' },
              { icon: ArrowRight, value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + index * 0.05,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});
