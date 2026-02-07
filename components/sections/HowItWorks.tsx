'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FileCheck, Clock, CheckCircle2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Contact Us',
      description: 'Reach out via WhatsApp or contact form with your visa needs.',
    },
    {
      icon: FileCheck,
      title: 'Submit Documents',
      description: 'Send required documents. We review and guide you through.',
    },
    {
      icon: Clock,
      title: 'We Process',
      description: 'Our team handles all paperwork and immigration liaisons.',
    },
    {
      icon: CheckCircle2,
      title: 'Get Your Visa',
      description: 'Receive approval and start your Indonesian adventure!',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Simple 4-step process to get your visa approved
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col items-center"
            >
              {/* Step Number Badge - Centered at Top */}
              <div className="relative w-20 h-20 bg-gradient-to-br from-amber-500 via-amber-400 to-orange-500 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-2xl border-4 border-white/40 overflow-hidden mb-6 z-20">
                {/* Glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full"></div>
                {/* Inner glow for visibility */}
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-sm"></div>
                <span className="relative z-10 drop-shadow-lg">{index + 1}</span>
              </div>

              {/* Connector Line - Between Numbers */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%+32px-80px)] h-1 bg-gradient-to-r from-amber-400 to-amber-400/40 z-10" />
              )}

              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group w-full h-full overflow-hidden shadow-2xl">
                {/* iOS-style glass reflections */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>

                {/* Icon */}
                <div className="relative w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 border border-white/20 overflow-hidden">
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-3xl"></div>
                  <step.icon className="w-8 h-8 text-amber-400 relative z-10 drop-shadow-lg" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 text-center relative z-10">
                  {step.title}
                </h3>
                <p className="text-gray-200 leading-relaxed text-center text-sm relative z-10">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
