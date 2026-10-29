'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X, ShieldCheck } from 'lucide-react';
import { waLink } from '@/lib/siteConfig';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Work', href: '#portfolio' },
    { label: 'Services', href: '#services' },
    { label: 'About', href: '#about' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#09090c]/90 backdrop-blur-md border-b border-[#D4C5B9]/10 shadow-2xl shadow-black/80 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Monogram & Name */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#141418] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] font-bold text-lg tracking-wider group-hover:border-[#C5A880] transition-colors shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            AS
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#F5F2ED] group-hover:text-[#DFC08F] transition-colors font-['Outfit']">
              AvinayStudio
            </span>
            <span className="text-[10px] tracking-widest text-[#B8B3AB] uppercase font-medium">
              Build • Create • Grow
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#B8B3AB] hover:text-[#DFC08F] transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/admin"
            className="text-xs text-[#75716B] hover:text-[#B8B3AB] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded border border-transparent hover:border-[#D4C5B9]/15"
            title="Agency Admin & Client Management"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </Link>
          <a
            href={waLink("Hi Avinay, I'd like to discuss a project with AvinayStudio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(223,192,143,0.3)]"
          >
            Start Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#B8B3AB] hover:text-[#DFC08F] hover:bg-[#141418] transition-colors"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090c] border-b border-[#D4C5B9]/15 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#B8B3AB] hover:text-[#DFC08F] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-[#D4C5B9]/10 flex flex-col gap-3">
            <a
              href={waLink("Hi Avinay, I'd like to discuss a project with AvinayStudio.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all shadow-[0_0_20px_rgba(223,192,143,0.25)]"
            >
              Start Project via WhatsApp
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-center text-[#75716B] hover:text-[#DFC08F] py-1"
            >
              Admin & Client Portal →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
