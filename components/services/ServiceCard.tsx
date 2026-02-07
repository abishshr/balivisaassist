'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Service } from '@/data/services';
import { formatPrice } from '@/lib/utils';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = React.memo(function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.FileText;

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="h-full"
    >
      <div className="relative h-full flex flex-col bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl hover:bg-white/10 hover:border-white/30 transition-all duration-500 group overflow-hidden">
        {/* iOS-style glass reflections */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>

        <div className="flex flex-col h-full p-6 sm:p-8 relative z-10">
          {/* Icon and Popular Badge */}
          <div className="flex items-start justify-between mb-6">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative w-16 h-16 bg-gradient-to-br from-amber-500/90 via-amber-400/80 to-orange-500/90 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-white/30 overflow-hidden"
            >
              {/* Glass reflection on icon */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-3xl"></div>
              <IconComponent className="w-8 h-8 text-white relative z-10" />
            </motion.div>
            {service.popular && (
              <Badge variant="secondary" className="animate-pulse text-xs font-bold shadow-lg bg-orange-500/90 text-white border-orange-400/50">
                Popular
              </Badge>
            )}
          </div>

          {/* Service Name */}
          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 group-hover:text-amber-300 transition-colors duration-300 drop-shadow-lg leading-tight">
            {service.name}
          </h3>

          {/* Duration */}
          <p className="text-sm text-gray-200 mb-4 font-semibold drop-shadow-md">
            {service.duration}
          </p>

          {/* Short Description */}
          <p className="text-base text-gray-100 mb-6 flex-grow leading-relaxed drop-shadow-md">
            {service.shortDescription}
          </p>

          {/* Pricing - iOS Glass Box */}
          <div className="relative mb-8 p-6 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-xl overflow-hidden">
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none"></div>
            <p className="text-sm text-gray-200 mb-2 font-semibold relative z-10">Starting from</p>
            <p className="text-4xl font-black text-white drop-shadow-lg relative z-10">
              {formatPrice(service.startingPrice)}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href={`/services/${service.slug}`} className="block">
              <Button
                variant="primary"
                className="w-full min-h-[48px] font-bold group-hover:shadow-2xl transition-all duration-300 text-base"
              >
                View Details
              </Button>
            </Link>
            <WhatsAppButton
              serviceId={service.id}
              fixed={false}
              className="w-full min-h-[48px] font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
