'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { COMPANY } from '@/constants/company';
import { cn } from '@/lib/utils';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'News', href: '/news' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        isScrolled
          ? 'bg-white/5 backdrop-blur-2xl shadow-2xl border-b border-white/20'
          : 'bg-white/3 backdrop-blur-2xl border-b border-white/15'
      )}
      style={{ willChange: 'auto', transform: 'translateZ(0)' }}
    >
      {/* iOS-style glass reflection */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative w-11 h-11 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-xl logo-sparkle"
            >
              {/* Very subtle glow effect */}
              <div className="absolute inset-0 bg-amber-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-white/20 rounded-lg backdrop-blur-sm"></div>
              <span className="relative text-white font-black text-2xl drop-shadow-lg z-10">B</span>
            </motion.div>
            <span className="text-xl font-black text-white drop-shadow-lg">
              BaliVisa<span className="text-amber-300 drop-shadow-lg">Assist</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-3 py-2 text-white hover:text-amber-300 font-bold transition-all duration-300 hover:bg-white/10 backdrop-blur-xl rounded-2xl hover:shadow-lg group overflow-hidden"
              >
                <span className="relative z-10">{item.name}</span>
                {/* Glass reflection on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 text-white hover:text-amber-300 transition-all hover:bg-white/15 backdrop-blur-xl rounded-2xl hover:shadow-lg border border-white/20"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 drop-shadow-lg" />
            ) : (
              <Menu className="w-6 h-6 drop-shadow-lg" />
            )}
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
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/5 backdrop-blur-3xl border-t border-white/20 shadow-2xl relative overflow-hidden"
          >
            {/* iOS-style glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2 relative">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative px-4 py-3 text-white hover:text-amber-300 hover:bg-white/15 backdrop-blur-xl font-bold transition-all rounded-2xl hover:shadow-lg border border-white/10 overflow-hidden group"
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Glass reflection on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
