'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { BaliWatermark } from '@/components/layout/BaliBackground';

export const Hero = React.memo(function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      <BaliWatermark />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500/90 backdrop-blur-sm text-white rounded-full text-sm font-bold mb-8 shadow-xl"
          >
            <Shield className="w-4 h-4" />
            Trusted Bali Visa Experts Since 2020
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
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
            transition={{ duration: 0.7, delay: 0.2 }}
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
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16 justify-center"
          >
            <Link href="/services">
              <Button size="lg" className="w-full sm:w-auto shadow-2xl">
                Explore Visa Services
                <ArrowRight className="w-5 h-5 ml-2" />
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
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: CheckCircle2, value: '500+', label: 'Happy Clients' },
              { icon: Shield, value: '98%', label: 'Success Rate' },
              { icon: Clock, value: '5-7', label: 'Days Average' },
              { icon: ArrowRight, value: '7+', label: 'Visa Types' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
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
