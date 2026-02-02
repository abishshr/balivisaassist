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
      <div className="h-full flex flex-col bg-white/15 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl hover:shadow-3xl hover:bg-white/20 transition-all duration-500 group overflow-hidden">
        <div className="flex flex-col h-full p-6 sm:p-8">
          {/* Icon and Popular Badge */}
          <div className="flex items-start justify-between mb-6">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300"
            >
              <IconComponent className="w-8 h-8 text-white" />
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

          {/* Pricing - Frosted Glass Box */}
          <div className="mb-8 p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl">
            <p className="text-sm text-gray-200 mb-2 font-semibold">Starting from</p>
            <p className="text-4xl font-black text-white drop-shadow-lg">
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
              className="w-full min-h-[48px] font-bold bg-white/20 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/30 shadow-xl hover:shadow-2xl transition-all duration-300"
            />
          </div>
        </div>

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none rounded-3xl"></div>
      </div>
    </motion.div>
  );
});
