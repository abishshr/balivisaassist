'use client';

import React from 'react';
import Image from 'next/image';

export function BaliBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#FAFAF7] via-[#F5E6D3]/15 to-[#FAFAF7]" />
  );
}

// Hero background with Bali video
export function BaliWatermark() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Poster image (always visible on mobile, fallback on desktop) */}
      <Image
        src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      {/* Background video — hidden on mobile for performance */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/bali-hero.mp4?v=3" type="video/mp4" />
      </video>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F4C5C]/80 via-[#0F4C5C]/70 to-[#1A1A2E]/85" />
    </div>
  );
}

// Stats section background
export function StatsBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C5C] via-[#1A6B7A] to-[#0F4C5C]" />
    </div>
  );
}

// Services section background - light
export function ServicesBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#FAFAF7]" />
    </div>
  );
}
