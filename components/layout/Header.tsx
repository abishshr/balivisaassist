'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Services', href: '/services' },
  { name: 'News', href: '/news' },
  { name: 'FAQ', href: '/faq' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Only use transparent mode on homepage
  const showSolid = !isHome || isScrolled;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        showSolid
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              showSolid ? 'bg-[#0F4C5C]' : 'bg-white/10'
            )}>
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className={cn(
              'text-base font-bold transition-colors duration-300',
              showSolid ? 'text-gray-900' : 'text-white'
            )}>
              BaliVisa<span className="text-[#E07A5F]">Assist</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium transition-colors duration-200 rounded-lg',
                  showSolid
                    ? 'text-gray-500 hover:text-gray-900'
                    : 'text-white/70 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/services"
              className={cn(
                'ml-3 px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-200',
                showSolid
                  ? 'bg-[#0F4C5C] text-white hover:bg-[#0D3F4D]'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              )}
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'md:hidden p-2 transition-colors rounded-lg',
              showSolid
                ? 'text-gray-500 hover:text-gray-900'
                : 'text-white/70 hover:text-white'
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <nav className="container mx-auto px-4 sm:px-6 py-3 flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-1 px-3 py-2.5 bg-[#0F4C5C] text-white text-sm font-semibold text-center rounded-lg"
              >
                Get Started
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
