import { Metadata } from 'next';
import Image from 'next/image';
import { Shield, Users, Clock, Award } from 'lucide-react';
import { COMPANY } from '@/constants/company';
import { CTASection } from '@/components/sections/CTASection';
import { Card, CardBody } from '@/components/ui/Card';
import { BaliWatermark } from '@/components/layout/BaliBackground';

export const metadata: Metadata = {
  title: 'About Us - BaliVisaAssist',
  description: 'Learn about BaliVisaAssist, operated by PT CIPTA SOLUSI GLOBAL. Professional visa assistance services in Indonesia with expert guidance and full compliance.',
  keywords: 'about BaliVisaAssist, PT CIPTA SOLUSI GLOBAL, Indonesia visa company, Bali visa services',
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'Full compliance with Indonesian immigration laws. We work only with licensed sponsors and follow all regulations.',
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Our team has years of experience navigating Indonesia\'s visa system. We provide personalized support throughout the process.',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'We know the fastest routes through bureaucracy. Most applications are processed faster than industry averages.',
    },
    {
      icon: Award,
      title: 'Transparent Pricing',
      description: 'No hidden fees. Our pricing includes government fees, processing fees, and our service fee - all upfront.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <BaliWatermark />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              About BaliVisaAssist
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed drop-shadow-md">
              Professional visa assistance services operated by PT CIPTA SOLUSI GLOBAL,
              helping foreigners navigate Indonesia's visa system with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 drop-shadow-lg">Our Story</h2>
            <div className="space-y-6 text-lg text-gray-200 leading-relaxed drop-shadow-sm">
              <p>
                BaliVisaAssist was founded to simplify the complex process of obtaining visas
                and permits for Indonesia. We understand that navigating immigration requirements
                can be overwhelming, especially in a foreign country with different regulations
                and procedures.
              </p>
              <p>
                Operated by <strong className="text-white">PT CIPTA SOLUSI GLOBAL</strong>, a registered Indonesian company,
                we provide fully compliant visa assistance services for tourists, retirees, digital nomads,
                investors, and businesses looking to establish operations in Indonesia.
              </p>
              <p>
                Our mission is to make the visa process as smooth and stress-free as possible,
                allowing you to focus on what matters most - your Indonesian adventure, retirement
                plans, business ventures, or remote work lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-12 text-center drop-shadow-lg">
              Why Choose BaliVisaAssist?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardBody>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                      <value.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 drop-shadow-md">{value.title}</h3>
                    <p className="text-gray-200 drop-shadow-sm">{value.description}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Operator Disclosure */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              <h3 className="font-bold text-amber-300 mb-4 text-lg drop-shadow-md">Legal Entity</h3>
              <p className="text-white mb-3 font-semibold drop-shadow-md">
                {COMPANY.operatorDisclosure}
              </p>
              <p className="text-sm text-gray-200 drop-shadow-sm">
                We are not affiliated with the Indonesian government or any government
                immigration agency. We are a private visa assistance company.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
