'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { FileText, ArrowRight } from 'lucide-react';
import { services, Service } from '@/data/services';
import { formatPrice } from '@/lib/utils';

const ease = [0.16, 1, 0.3, 1] as const;

const groups: { key: Service['category']; label: string }[] = [
  { key: 'visa', label: 'Visas' },
  { key: 'permit', label: 'Stay Permits' },
  { key: 'extension', label: 'Extensions' },
  { key: 'business', label: 'Business' },
];

function ServiceCard({ service }: { service: Service }) {
  const IconComponent = (LucideIcons as any)[service.icon] || FileText;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex-shrink-0 w-[240px] sm:w-[260px] snap-start"
    >
      <div className="h-full bg-white rounded-2xl border border-gray-200/80 p-5 hover:border-[#0F4C5C]/20 hover:shadow-md transition-all duration-300 flex flex-col">
        {/* Icon + Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-[#0F4C5C]/[0.06] flex items-center justify-center">
            <IconComponent className="w-[18px] h-[18px] text-[#0F4C5C]" />
          </div>
          {service.popular && (
            <span className="text-[10px] font-semibold text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded-full">
              Popular
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#0F4C5C] transition-colors leading-snug mb-1">
          {service.name}
        </h3>

        {/* Duration */}
        <p className="text-[11px] text-gray-400 mb-3 flex-1 leading-relaxed">
          {service.duration}
          {service.processingDays && ` · ${service.processingDays}`}
        </p>

        {/* Price + Arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-900">
            {formatPrice(service.startingPrice)}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F4C5C] group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}

export function ServiceHighlights() {
  const grouped = useMemo(() => {
    return groups.map((g) => ({
      ...g,
      services: services.filter((s) => s.category === g.key),
    }));
  }, []);

  return (
    <section className="py-16 sm:py-24 relative z-10 bg-[#FAFAF7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex items-end justify-between gap-4 mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Our Services
          </h2>
          <Link
            href="/services"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-[#0F4C5C] transition-colors flex-shrink-0"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Grouped rows */}
      <div className="space-y-10">
        {grouped.map((group, groupIndex) => (
          <div key={group.key}>
            {/* Group label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.05, ease }}
              className="container mx-auto px-4 sm:px-6 lg:px-8 mb-4"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {group.label}
              </h3>
            </motion.div>

            {/* Horizontal scroll row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: groupIndex * 0.05 + 0.1, ease }}
            >
              <div
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-6 lg:px-8 pb-2 no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="hidden lg:block flex-shrink-0 w-[calc((100vw-1280px)/2)]" />
                {group.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
                <div className="hidden lg:block flex-shrink-0 w-[calc((100vw-1280px)/2)]" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile "View all" */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:hidden">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-[#0F4C5C] transition-colors"
        >
          View all pricing & requirements
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
