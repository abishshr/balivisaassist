import React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Instagram } from 'lucide-react';
import { COMPANY } from '@/constants/company';

const footerLinks = {
  visas: [
    { name: 'C1 Tourist Visa', href: '/services/c1-visa' },
    { name: 'C2 Business Visa', href: '/services/c2-business-visa' },
    { name: 'D12 Pre-Investment', href: '/services/d12-visa-1year' },
    { name: 'B1 Visa', href: '/services/b1-visa' },
    { name: 'All Services', href: '/services' },
  ],
  permits: [
    { name: 'Retirement KITAS', href: '/services/retirement-kitas' },
    { name: 'Digital Nomad KITAS', href: '/services/digital-nomad-kitas' },
    { name: 'Working KITAS', href: '/services/investor-kitas' },
    { name: 'B1 Extension', href: '/services/b1-extension' },
    { name: 'PT PMA Setup', href: '/services/pt-pma' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'News', href: '/news' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Refund Policy', href: '/refund-policy' },
    { name: 'Payment Terms', href: '/payment-terms' },
  ],
};

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0F4C5C] relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-base font-bold text-white">
                BaliVisa<span className="text-[#E07A5F]">Assist</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              {COMPANY.tagline}
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {COMPANY.email}
              </a>
              {COMPANY.whatsapp && (
                <a
                  href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              )}
              {COMPANY.social.instagram && (
                <a
                  href={`https://instagram.com/${COMPANY.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  @{COMPANY.social.instagram}
                </a>
              )}
            </div>
          </div>

          <FooterColumn title="Visas" links={footerLinks.visas} />
          <FooterColumn title="Permits" links={footerLinks.permits} />
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Legal" links={footerLinks.legal} />
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center space-y-2">
          <p className="text-xs text-gray-400">
            {COMPANY.operatorDisclosure} | NIB: {COMPANY.nib}
          </p>
          <p className="text-xs text-gray-500">
            {COMPANY.disclaimer}
          </p>
          <p className="text-xs text-gray-500">
            &copy; {currentYear} PT {COMPANY.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
