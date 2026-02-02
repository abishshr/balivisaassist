'use client';

import React from 'react';

export function BaliBackground() {
  return (
    <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900" />
  );
}

// Watermark background for hero/banner sections
export function BaliWatermark() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Watermark temple image - only visible in hero sections */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bali-temple-bg.webp')",
          backgroundBlendMode: 'overlay',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/45 via-gray-900/40 to-gray-900/50" />
    </div>
  );
}
