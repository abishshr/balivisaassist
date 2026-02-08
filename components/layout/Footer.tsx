import React from 'react';
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import { COMPANY } from '@/constants/company';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'C1 Visa', href: '/services/c1-visa' },
      { name: 'Retirement KITAS', href: '/services/retirement-kitas' },
      { name: 'Digital Nomad KITAS', href: '/services/digital-nomad-kitas' },
      { name: 'Investor KITAS', href: '/services/investor-kitas' },
      { name: 'All Services', href: '/services' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ],
  };

  return (
    <footer className="bg-white/5 backdrop-blur-2xl text-white border-t border-white/20 shadow-2xl relative z-10 overflow-hidden" style={{ willChange: 'auto', transform: 'translateZ(0)' }}>
      {/* iOS-style glass reflections */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-3 sm:mb-4 group inline-flex">
              <div className="relative w-11 h-11 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-xl logo-sparkle">
                {/* Very subtle glow effect */}
                <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <span className="relative text-white font-black text-2xl drop-shadow-lg z-10">B</span>
              </div>
              <span className="text-xl font-black text-white drop-shadow-lg">
                BaliVisa<span className="text-amber-300 drop-shadow-lg">Assist</span>
              </span>
            </Link>
            <p className="text-sm text-gray-200 mb-3 sm:mb-4 drop-shadow-md">
              {COMPANY.tagline}
            </p>
            <div className="space-y-2">
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-2 text-sm text-gray-200 hover:text-amber-300 transition-colors drop-shadow-sm"
              >
                <Mail className="w-4 h-4" />
                {COMPANY.email}
              </a>
              {COMPANY.whatsapp && (
                <a
                  href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-200 hover:text-amber-300 transition-colors drop-shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base drop-shadow-md">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-200 hover:text-amber-300 transition-colors drop-shadow-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base drop-shadow-md">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-200 hover:text-amber-300 transition-colors drop-shadow-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base drop-shadow-md">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-200 hover:text-amber-300 transition-colors drop-shadow-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6 sm:pt-8 space-y-3 sm:space-y-4">
          {/* CRITICAL: PT Operator Disclosure */}
          <div className="text-center px-4">
            <p className="text-xs sm:text-sm font-bold text-white drop-shadow-lg">
              {COMPANY.operatorDisclosure}
            </p>
          </div>

          {/* Disclaimer */}
          <div className="text-center px-4">
            <p className="text-xs text-gray-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {COMPANY.disclaimer}
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center px-4">
            <p className="text-xs text-gray-300 drop-shadow-sm">
              &copy; {currentYear} {COMPANY.legalName}. All rights reserved. 🌴
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
