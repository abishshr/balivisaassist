import { Metadata } from 'next';
import { Calendar, Info, AlertCircle, Bell, Megaphone, ExternalLink } from 'lucide-react';
import { getAllActiveVisaNews, VisaNews } from '@/data/visa-news';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Visa News & Updates - BaliVisaAssist',
  description: 'Stay updated with the latest Indonesia visa news, regulation changes, and important reminders for your visa applications.',
};

const categoryConfig = {
  update: {
    icon: Megaphone,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-300',
    label: 'New Update',
  },
  alert: {
    icon: AlertCircle,
    gradient: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-300',
    label: 'Important Alert',
  },
  reminder: {
    icon: Bell,
    gradient: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-300',
    label: 'Reminder',
  },
  info: {
    icon: Info,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-300',
    label: 'Info',
  },
};

function NewsCard({ news }: { news: VisaNews }) {
  const config = categoryConfig[news.category];
  const Icon = config.icon;

  const dateStr = new Date(news.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border ${config.borderColor} hover:bg-white/15 transition-all duration-300`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className={`${config.bgColor} ${config.textColor} border-0 shadow-md`}>
              {config.label}
            </Badge>
            <span className="flex items-center gap-1.5 text-sm text-white/60">
              <Calendar className="w-3.5 h-3.5" />
              {dateStr}
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">
            {news.title}
          </h3>

          <p className="text-white/80 leading-relaxed mb-4 drop-shadow-sm">
            {news.description}
          </p>

          {news.link && (
            <a
              href={news.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-semibold transition-all duration-200 border border-white/20 shadow-md hover:shadow-lg group"
            >
              Learn More
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const newsItems = getAllActiveVisaNews();

  return (
    <div>
      {/* Header */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              Visa News & Updates
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed drop-shadow-md">
              Stay informed about the latest Indonesia visa regulations, processing changes, and important reminders.
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-8 sm:py-12 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {newsItems.length > 0 ? (
              <div className="space-y-6">
                {newsItems.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                  <Info className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No News Available</h3>
                  <p className="text-white/60">
                    Check back later for visa updates and announcements.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-lg rounded-3xl p-8 border border-amber-500/30 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md">
                Want to Stay Updated?
              </h2>
              <p className="text-white/90 mb-6 drop-shadow-sm">
                We regularly update this page with the latest visa news and regulation changes.
                Bookmark this page or contact us directly for personalized visa advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/6287762468806?text=${encodeURIComponent('Hi! I\'d like to subscribe to visa updates.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Bell className="w-5 h-5" />
                  Get WhatsApp Updates
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
