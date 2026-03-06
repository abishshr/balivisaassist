'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, CreditCard, FileCheck } from 'lucide-react';

const highlights = [
  {
    icon: Shield,
    title: 'Licensed & Registered',
    description: 'Operated by CIPTA SOLUSI GLOBAL, a registered Indonesian company with full legal compliance.',
  },
  {
    icon: FileCheck,
    title: '17 Visa Types',
    description: 'Tourist visas, business visas, KITAS, extensions, and PT PMA setup — all handled online.',
  },
  {
    icon: Clock,
    title: 'Fast Processing',
    description: 'Most e-visas processed in 3-5 business days. We handle the paperwork so you don\'t have to.',
  },
  {
    icon: CreditCard,
    title: 'All-Inclusive Pricing',
    description: 'Government fees, processing, and service fee included. No hidden charges — you get a quote upfront.',
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 relative z-10 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center"
        >
          Why Work With Us
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease }}
              className="flex gap-4 p-5 rounded-xl border border-gray-200 bg-white"
            >
              <item.icon className="w-5 h-5 text-[#0F4C5C] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
