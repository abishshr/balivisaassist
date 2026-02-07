'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { StatsBackground } from '@/components/layout/BaliBackground';

export const Stats = React.memo(function Stats() {
  const stats = [
    {
      icon: CheckCircle,
      value: '100%',
      label: 'Licensed',
      description: 'Legal visa sponsor',
    },
    {
      icon: Clock,
      value: '5-7',
      label: 'Business Days',
      description: 'Average processing time',
    },
    {
      icon: TrendingUp,
      value: '7',
      label: 'Visa Types',
      description: 'Comprehensive services',
    },
    {
      icon: Users,
      value: '24/7',
      label: 'Support',
      description: 'Always available for you',
    },
  ];

  return (
    <section className="py-20 sm:py-28 relative z-10">
      <StatsBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Your Trusted Visa Partner
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Professional, licensed visa services to help you make Bali your home. 🏝️
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.01, transition: { duration: 0.2, ease: 'easeOut' } }}
            >
              <div className="relative bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 hover:bg-white/20 transition-all duration-500 hover:shadow-3xl h-full group">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Number */}
                <div className="mb-3">
                  <h3 className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg">
                    {stat.value}
                  </h3>
                </div>

                {/* Label */}
                <h4 className="text-lg font-bold text-white mb-2 drop-shadow-md">
                  {stat.label}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-200 drop-shadow-sm">
                  {stat.description}
                </p>

                {/* Gradient Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-gray-200 text-base drop-shadow-md">
            Start your journey to living your dream life in Bali 🌴
          </p>
        </motion.div>
      </div>
    </section>
  );
});
