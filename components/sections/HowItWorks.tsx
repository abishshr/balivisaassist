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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-1 bg-gradient-to-r from-amber-400/50 to-transparent z-0" />
              )}

              {/* Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group relative z-10 h-full">
                {/* Step Number Badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center text-xl font-black shadow-xl border-4 border-white/20">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7 text-amber-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-200 leading-relaxed text-center text-sm">
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
