'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

export const Stats = React.memo(function Stats() {
  const stats = [
    {
      icon: CheckCircle,
      value: '17',
      label: 'Visa Types',
      description: 'Comprehensive coverage',
    },
    {
      icon: Clock,
      value: '5-7',
      label: 'Business Days',
      description: 'Average processing time',
    },
    {
      icon: TrendingUp,
      value: '17',
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
    <section className="py-20 sm:py-28 relative z-10 bg-[#F5E6D3]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Your Trusted Visa Partner
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional, licensed visa services to help you make Bali your home.
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
              whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-md hover:border-[#F5E6D3] transition-all duration-300 h-full group">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-16 h-16 bg-gradient-to-br from-[#0F4C5C] to-[#1A6B7A] rounded-2xl flex items-center justify-center mb-6 shadow-md"
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Number */}
                <div className="mb-3">
                  <h3 className="text-5xl sm:text-6xl font-black text-gray-900">
                    {stat.value}
                  </h3>
                </div>

                {/* Label */}
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {stat.label}
                </h4>

                {/* Description */}
                <p className="text-sm text-gray-500">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
