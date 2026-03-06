import { Metadata } from 'next';
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { COMPANY } from '@/constants/company';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with BaliVisaAssist for visa assistance in Indonesia. Contact us via WhatsApp, email, or visit our office in Canggu, Bali.',
  keywords: 'contact BaliVisaAssist, Indonesia visa inquiry, Bali visa consultation, visa help Indonesia',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-500">
              Questions about visas or our services? We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-10 sm:py-14 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="grid sm:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <MessageCircle className="w-5 h-5 text-[#0F4C5C] mb-4" />
                <h3 className="text-sm font-bold text-gray-900 mb-1">WhatsApp</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Fastest way to reach us. We respond within 2 hours during business hours.
                </p>
                <WhatsAppButton fixed={false} className="text-sm" />
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <Mail className="w-5 h-5 text-[#0F4C5C] mb-4" />
                <h3 className="text-sm font-bold text-gray-900 mb-1">Email</h3>
                <p className="text-xs text-gray-400 mb-4">
                  Send a detailed inquiry. We respond within 24 hours.
                </p>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm font-medium text-[#0F4C5C] hover:underline"
                >
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              Details
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Office</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Pantai Batu Bolong St, 38<br />
                    Canggu, Bali
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Hours</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {COMPANY.businessHours}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Legal Entity</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {COMPANY.legalName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
