'use client';

import { useState, useEffect } from 'react';
import { X, Info, AlertCircle, Bell, Megaphone, ExternalLink } from 'lucide-react';
import { getLatestVisaNews, VisaNews } from '@/data/visa-news';
import Link from 'next/link';

const categoryConfig = {
  update: {
    icon: Megaphone,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    subtextColor: 'text-blue-700',
    label: 'New Update',
  },
  alert: {
    icon: AlertCircle,
    gradient: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    subtextColor: 'text-red-700',
    label: 'Important Alert',
  },
  reminder: {
    icon: Bell,
    gradient: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    subtextColor: 'text-amber-700',
    label: 'Reminder',
  },
  info: {
    icon: Info,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    subtextColor: 'text-green-700',
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
    setNews(latestNews);

    if (latestNews) {
      const dismissedNewsId = localStorage.getItem('dismissedVisaNews');
      if (dismissedNewsId === latestNews.id) {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (news) {
      localStorage.setItem('dismissedVisaNews', news.id);
      setIsDismissed(true);
    }
  };

  if (!isClient || !news || isDismissed) {
    return null;
  }

  const config = categoryConfig[news.category];
  const Icon = config.icon;

  const dateStr = new Date(news.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`fixed top-16 md:top-20 left-0 right-0 z-40 ${config.bgColor} border-b ${config.borderColor} shadow-sm`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3 md:items-center">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5 md:mt-0">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.gradient}`}>
                  {config.label}
                </span>
                <span className="text-xs text-gray-500 font-medium">{dateStr}</span>
              </div>

              <div className="md:ml-2 flex-1">
                <h3 className={`text-sm md:text-base font-bold ${config.textColor} mb-1`}>
                  {news.title}
                </h3>
                <p className={`text-xs md:text-sm ${config.subtextColor}`}>
                  {news.description}
                </p>
              </div>

              {/* Link */}
              {news.link && (
                <a
                  href={news.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-lg text-gray-700 text-xs font-semibold transition-all duration-200 border border-gray-200 shadow-sm group mt-2 md:mt-0"
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
            className="flex-shrink-0 p-1 hover:bg-gray-200/50 rounded-lg transition-colors group mt-0.5 md:mt-0"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
