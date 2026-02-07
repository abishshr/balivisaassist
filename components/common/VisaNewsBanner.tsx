'use client';

import { useState, useEffect } from 'react';
import { X, Info, AlertCircle, Bell, Megaphone, ExternalLink } from 'lucide-react';
import { getLatestVisaNews, VisaNews } from '@/data/visa-news';
import Link from 'next/link';

const categoryConfig = {
  update: {
    icon: Megaphone,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    label: 'New Update',
  },
  alert: {
    icon: AlertCircle,
    gradient: 'from-red-500 to-orange-500',
    bgGradient: 'from-red-500/20 to-orange-500/20',
    label: 'Important Alert',
  },
  reminder: {
    icon: Bell,
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-500/20 to-yellow-500/20',
    label: 'Reminder',
  },
  info: {
    icon: Info,
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    label: 'Info',
  },
};

export function VisaNewsBanner() {
  const [news, setNews] = useState<VisaNews | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const latestNews = getLatestVisaNews();
    console.log('📰 Latest visa news:', latestNews);
    setNews(latestNews);

    // Check if user has dismissed this specific news item
    if (latestNews) {
      const dismissedNewsId = localStorage.getItem('dismissedVisaNews');
      console.log('📌 Dismissed news ID:', dismissedNewsId);
      if (dismissedNewsId === latestNews.id) {
        console.log('⚠️ News was previously dismissed');
        setIsDismissed(true);
      } else {
        console.log('✅ Showing news banner');
      }
    }
  }, []);

  const handleDismiss = () => {
    if (news) {
      localStorage.setItem('dismissedVisaNews', news.id);
      setIsDismissed(true);
    }
  };

  // Don't render anything on server-side to avoid hydration mismatch
  if (!isClient || !news || isDismissed) {
    return null;
  }

  const config = categoryConfig[news.category];
  const Icon = config.icon;

  // Format date
  const dateStr = new Date(news.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`fixed top-16 md:top-20 left-0 right-0 z-40 bg-gradient-to-r ${config.bgGradient} backdrop-blur-md border-b border-white/30 shadow-lg`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3 md:items-center">
          {/* Icon */}
          <div className={`flex-shrink-0 mt-0.5 md:mt-0`}>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.gradient} shadow-md`}>
                  {config.label}
                </span>
                <span className="text-xs text-white/70 font-medium">{dateStr}</span>
              </div>

              <div className="md:ml-2 flex-1">
                <h3 className="text-sm md:text-base font-bold text-white drop-shadow-md mb-1">
                  {news.title}
                </h3>
                <p className="text-xs md:text-sm text-white/90 drop-shadow-sm">
                  {news.description}
                </p>
              </div>

              {/* Link */}
              {news.link && (
                <a
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white text-xs font-semibold transition-all duration-200 border border-white/30 shadow-md hover:shadow-lg group mt-2 md:mt-0"
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors group mt-0.5 md:mt-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
