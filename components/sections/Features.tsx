'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, ThumbsUp, HeadphonesIcon } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: '100% Legal & Compliant',
      description: 'Licensed visa sponsor following all Indonesian immigration laws.',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'Quick turnaround with regular updates on your application.',
    },
    {
      icon: ThumbsUp,
      title: 'Expert Processing',
      description: 'Professional visa assistance with attention to every detail.',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Always available via WhatsApp or email when you need us.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Your trusted partner for Bali visa services
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white/5 backdrop-blur-3xl rounded-3xl p-8 border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group overflow-hidden shadow-2xl"
            >
              {/* iOS-style glass reflections */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>

              <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500/90 via-amber-400/80 to-orange-500/90 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xl border border-white/30 overflow-hidden">
                {/* Glass reflection on icon */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-3xl"></div>
                <feature.icon className="w-8 h-8 text-white relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-200 leading-relaxed text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
