'use client';

import { useState, useEffect } from 'react';
import { Info, AlertCircle, Bell, Megaphone } from 'lucide-react';
import { getAllActiveVisaNews, VisaNews } from '@/data/visa-news';

const categoryConfig = {
  update: {
    icon: Megaphone,
    color: 'text-cyan-300',
    bg: 'bg-gradient-to-r from-blue-500/15 to-cyan-500/15',
    label: 'UPDATE',
  },
  alert: {
    icon: AlertCircle,
    color: 'text-rose-300',
    bg: 'bg-gradient-to-r from-red-500/15 to-orange-500/15',
    label: 'ALERT',
  },
  reminder: {
    icon: Bell,
    color: 'text-amber-300',
    bg: 'bg-gradient-to-r from-amber-500/15 to-yellow-500/15',
    label: 'REMINDER',
  },
  info: {
    icon: Info,
    color: 'text-emerald-300',
    bg: 'bg-gradient-to-r from-green-500/15 to-emerald-500/15',
    label: 'INFO',
  },
};

export function VisaNewsTicker() {
  const [newsItems, setNewsItems] = useState<VisaNews[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const activeNews = getAllActiveVisaNews();
    // Duplicate news items for seamless loop
    setNewsItems([...activeNews, ...activeNews, ...activeNews]);
  }, []);

  // Always render the ticker container to avoid layout shift
  return (
    <div className="fixed top-[80px] left-0 right-0 z-[90] h-[60px] overflow-hidden glass-shimmer" style={{ willChange: 'auto', transform: 'translateZ(0)' }}>
      {/* Liquid Glass Background with gradient shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/8 via-white/5 to-white/8 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-orange-500/10 to-amber-500/5 animate-pulse"></div>
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent"></div>
      </div>

      {/* Ticker Label - Premium Glass morphism */}
      <div className="absolute left-0 top-0 bottom-0 z-10 px-4 flex items-center">
        <div className="relative group">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-xl"></div>

          {/* Glass container */}
          <div className="relative bg-gradient-to-br from-white/20 via-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-white/30 rounded-r-2xl px-5 py-2.5 shadow-2xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-r-2xl"></div>

            <div className="relative flex items-center gap-2.5">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-amber-500/70"></div>
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-sm animate-pulse"></div>
              </div>
              <span className="text-white font-black text-sm tracking-widest drop-shadow-2xl bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                VISA NEWS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling News Container */}
      <div className="relative pl-40 overflow-hidden h-full flex items-center">
        <div className="flex gap-8 animate-ticker hover:pause-ticker items-center h-full">
          {newsItems.map((news, index) => {
            const config = categoryConfig[news.category];
            const Icon = config.icon;

            return (
              <div
                key={`${news.id}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap flex-shrink-0"
              >
                {/* Category Badge - Glass style */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${config.bg} backdrop-blur-sm border border-white/20 shadow-lg`}>
                  <Icon className={`w-3.5 h-3.5 ${config.color} drop-shadow-lg`} />
                  <span className={`text-xs font-bold ${config.color} drop-shadow-lg`}>
                    {config.label}
                  </span>
                </div>

                {/* News Content */}
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm drop-shadow-lg">
                    {news.title}
                  </span>
                  <span className="text-white/50 text-sm">•</span>
                  <span className="text-white/80 text-sm max-w-md truncate drop-shadow-md">
                    {news.description}
                  </span>
                </div>

                {/* Separator - Glass divider */}
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/30 to-transparent mx-4 shadow-sm"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom accent line - Glass glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent shadow-lg"></div>
    </div>
  );
}
