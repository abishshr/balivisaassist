import { Metadata } from 'next';
import { Calendar, Info, AlertCircle, Bell, Megaphone, ExternalLink } from 'lucide-react';
import { getAllActiveVisaNews, VisaNews } from '@/data/visa-news';

export const metadata: Metadata = {
  title: 'Visa News & Updates',
  description: 'Stay updated with the latest Indonesia visa news, regulation changes, and important reminders for your visa applications.',
  keywords: 'Indonesia visa news, Bali visa updates, immigration regulation changes, visa policy Indonesia',
  alternates: { canonical: '/news' },
};

const categoryConfig = {
  update: { icon: Megaphone, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Update' },
  alert: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Alert' },
  reminder: { icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Reminder' },
  info: { icon: Info, color: 'text-green-600', bg: 'bg-green-50', label: 'Info' },
};

function NewsCard({ news }: { news: VisaNews }) {
  const config = categoryConfig[news.category];
  const Icon = config.icon;

  const dateStr = new Date(news.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
          <Icon className="w-3 h-3" />
          {config.label}
        </span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {dateStr}
        </span>
      </div>

      <h3 className="text-sm font-bold text-gray-900 mb-2">
        {news.title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        {news.description}
      </p>

      {news.link && (
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#0F4C5C] transition-colors"
        >
          Learn more
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}

export default function NewsPage() {
  const newsItems = getAllActiveVisaNews();

  return (
    <div>
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Visa News & Updates
            </h1>
            <p className="text-lg text-gray-500">
              Latest Indonesia visa regulations, processing changes, and reminders.
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-10 sm:py-14 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {newsItems.length > 0 ? (
              <div className="space-y-4">
                {newsItems.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Info className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No news available. Check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
