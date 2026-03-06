'use client';

import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Service } from '@/data/services';
import { formatPrice } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = React.memo(function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.FileText;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group h-full"
    >
      <div className="relative h-full flex flex-col bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:border-[#0F4C5C]/20 transition-colors duration-200">
        {/* Icon + Name + Badge */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F4C5C]/[0.06] flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-5 h-5 text-[#0F4C5C]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-[15px] font-semibold text-gray-900 group-hover:text-[#0F4C5C] transition-colors leading-snug">
                {service.name}
              </h3>
              {service.popular && (
                <span className="text-[10px] font-semibold text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded-full flex-shrink-0">
                  Popular
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {service.duration}
              {service.processingDays && (
                <span> · {service.processingDays}</span>
              )}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-4 flex-grow leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Price + Arrow */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">From</p>
            <p className="text-sm font-bold text-gray-900">
              {formatPrice(service.startingPrice)}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0F4C5C] group-hover:translate-x-0.5 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
});
