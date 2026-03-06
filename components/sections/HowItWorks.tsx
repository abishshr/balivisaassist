'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'Tell Us Your Plans',
    description: 'Send us a message with your visa needs. We recommend the best option and quote you upfront.',
  },
  {
    number: '2',
    title: 'We Handle Everything',
    description: 'Send your passport scan and photo. We prepare and submit your application to immigration.',
  },
  {
    number: '3',
    title: 'Visa Delivered',
    description: 'Receive your e-visa by email. No embassy visit needed — start your Bali adventure.',
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            How It Works
          </h2>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            Three simple steps to your Indonesian visa
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gray-200" />

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1, ease }}
                className="flex flex-col items-center text-center"
              >
                {/* Number circle */}
                <div className="relative z-10 w-12 h-12 rounded-full border-2 border-[#0F4C5C] bg-white flex items-center justify-center mb-5">
                  <span className="text-lg font-bold text-[#0F4C5C]">{step.number}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
