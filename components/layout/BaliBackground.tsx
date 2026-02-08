'use client';

import React from 'react';

export function BaliBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        willChange: 'auto',
        transform: 'translate3d(0, 0, 0)',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    >
      {/* Bali rice terraces background - optimized with lower quality for smooth scrolling */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=60&w=1920&auto=format&fit=crop')",
          backgroundAttachment: 'fixed',
          transform: 'translateZ(0)',
          willChange: 'auto',
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-800/85 to-gray-900/90" />
    </div>
  );
}

// Watermark background for hero/banner sections
export function BaliWatermark() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ willChange: 'auto', contain: 'layout style paint' }}>
      {/* Bali temple at sunset - optimized */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=50&w=1600&auto=format&fit=crop')",
          backgroundBlendMode: 'overlay',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          imageRendering: 'crisp-edges',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/55 to-gray-900/60" />
    </div>
  );
}

// Stats section background - Bali beach/ocean
export function StatsBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ contain: 'layout style paint' }}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=50&w=1600&auto=format&fit=crop')",
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          imageRendering: 'crisp-edges',
        }}
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/88 via-slate-800/83 to-gray-900/88" />
    </div>
  );
}

// Services section background - Bali offerings/ceremony
export function ServicesBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ contain: 'layout style paint' }}>
      <div
        className="absolute inset-0 opacity-15 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=40&w=1400&auto=format&fit=crop')",
          backgroundBlendMode: 'overlay',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          imageRendering: 'crisp-edges',
        }}
      />
    </div>
  );
}
