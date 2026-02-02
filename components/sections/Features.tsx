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
      title: '98% Success Rate',
      description: 'Proven track record with hundreds of approved applications.',
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
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                <feature.icon className="w-8 h-8 text-white" />
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
