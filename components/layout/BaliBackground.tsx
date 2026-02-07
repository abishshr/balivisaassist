'use client';

import React from 'react';

export function BaliBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ willChange: 'auto', transform: 'translateZ(0)' }}
    >
      {/* Bali rice terraces background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000')",
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
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ willChange: 'auto' }}>
      {/* Bali temple at sunset */}
      <div
        className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=2000')",
          backgroundBlendMode: 'overlay',
          willChange: 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/45 to-gray-900/55" style={{ willChange: 'auto' }} />
    </div>
  );
}

// Stats section background - Bali beach/ocean
export function StatsBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2000')",
        }}
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/85 via-slate-800/80 to-gray-900/85" />
    </div>
  );
}

// Services section background - Bali offerings/ceremony
export function ServicesBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=2000')",
          backgroundBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
