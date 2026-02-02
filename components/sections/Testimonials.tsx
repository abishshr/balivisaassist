'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Digital Nomad',
      location: 'USA',
      content: 'BaliVisaAssist made getting my digital nomad KITAS incredibly easy. Professional service from start to finish!',
      rating: 5,
      avatar: '👩🏼‍💼',
    },
    {
      name: 'David Chen',
      role: 'Retiree',
      location: 'Singapore',
      content: 'The team was patient with all my questions and guided me through every step. Highly recommend!',
      rating: 5,
      avatar: '👨🏻‍🦳',
    },
    {
      name: 'Maria Garcia',
      role: 'Investor',
      location: 'Spain',
      content: 'Professional service for my investor KITAS. They know the system well and saved me time.',
      rating: 5,
      avatar: '👩🏽‍💼',
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
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Real experiences from people living their Bali dream
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-white mb-6 leading-relaxed text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-300">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
