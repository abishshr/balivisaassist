'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/data/services';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ArrowRight } from 'lucide-react';
import { ServicesBackground } from '@/components/layout/BaliBackground';

export function ServiceHighlights() {
  return (
    <section className="py-20 sm:py-28 relative z-10">
      <ServicesBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Decorative Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/90 via-amber-400/80 to-orange-500/90 rounded-full text-sm font-bold mb-6 shadow-xl text-white border border-white/30 backdrop-blur-xl overflow-hidden relative"
          >
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full"></div>
            <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z"/>
            </svg>
            <span className="relative z-10">7 Visa Types Available</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight">
            Our Visa Services
          </h2>
          <p className="text-xl sm:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            From tourist visas to permanent residence.
            <br className="hidden sm:block" />
            <span className="text-amber-300 font-semibold">We handle it all.</span>
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/services"
            className="relative inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-3xl text-white hover:bg-white/10 font-bold text-lg transition-all duration-300 group rounded-3xl border border-white/30 hover:border-white/50 shadow-2xl overflow-hidden"
          >
            {/* iOS-style glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>

            <span className="relative z-10">View Detailed Pricing & Requirements</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
