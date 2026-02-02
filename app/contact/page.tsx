import { Metadata } from 'next';
import { Mail, MessageCircle, MapPin } from 'lucide-react';
import { COMPANY } from '@/constants/company';
import { Card, CardBody } from '@/components/ui/Card';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';

export const metadata: Metadata = {
  title: 'Contact Us - BaliVisaAssist',
  description: 'Get in touch with BaliVisaAssist for visa assistance in Indonesia. Contact us via WhatsApp, email, or fill out our contact form for a free consultation.',
  keywords: 'contact BaliVisaAssist, Indonesia visa inquiry, Bali visa consultation, visa help Indonesia',
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Fastest way to reach us. We typically respond within 2 hours during business hours.',
      action: 'Chat on WhatsApp',
      color: 'green',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us a detailed inquiry and we\'ll respond within 24 hours.',
      value: COMPANY.email,
      href: `mailto:${COMPANY.email}`,
      action: 'Send Email',
      color: 'blue',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed drop-shadow-md">
              Have questions about visa requirements or our services? We're here to help.
              Choose your preferred contact method below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 text-center drop-shadow-lg">
              Contact Methods
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <Card key={index}>
                  <CardBody>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                      <method.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">
                      {method.title}
                    </h3>
                    <p className="text-gray-200 mb-4 drop-shadow-sm">{method.description}</p>
                    {method.value && (
                      <p className="text-sm font-semibold text-amber-300 mb-4 drop-shadow-sm">
                        {method.value}
                      </p>
                    )}
                    {method.title === 'WhatsApp' ? (
                      <WhatsAppButton fixed={false} />
                    ) : (
                      <a
                        href={method.href}
                        className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-400 font-bold transition-colors drop-shadow-sm"
                      >
                        {method.action} →
                      </a>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours & Info */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 text-center drop-shadow-lg">
              Business Information
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardBody>
                  <h3 className="font-bold text-white mb-3 drop-shadow-md">
                    Business Hours
                  </h3>
                  <p className="text-gray-200 drop-shadow-sm">{COMPANY.businessHours}</p>
                  <p className="text-sm text-gray-300 mt-2 drop-shadow-sm">
                    Weekend inquiries will be responded to on the next business day.
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h3 className="font-bold text-white mb-3 drop-shadow-md">
                    Legal Entity
                  </h3>
                  <p className="text-gray-200 mb-2 drop-shadow-sm">
                    <strong className="text-white">{COMPANY.legalName}</strong>
                  </p>
                  <p className="text-sm text-gray-300 drop-shadow-sm">
                    Licensed visa assistance provider in Indonesia
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-center shadow-xl">
              <p className="text-sm text-white drop-shadow-sm">
                <strong className="text-amber-300">Please note:</strong> For the fastest response, we recommend contacting
                us via WhatsApp. Email inquiries are answered within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
