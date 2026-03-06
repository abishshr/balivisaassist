'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, DollarSign, Headphones } from 'lucide-react';

const items = [
  { icon: Shield, label: 'Licensed Agency' },
  { icon: Clock, label: 'Fast Processing' },
  { icon: DollarSign, label: 'Transparent Pricing' },
  { icon: Headphones, label: '24/7 Support' },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function TrustBadges() {
  return (
    <section className="relative z-10 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 max-w-3xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease }}
              className="flex items-center gap-2.5 text-gray-600"
            >
              <item.icon className="w-5 h-5 text-[#0F4C5C]" />
              <span className="text-sm font-semibold">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
