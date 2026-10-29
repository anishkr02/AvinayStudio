'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, ShieldCheck, Heart } from 'lucide-react';
import { SITE_CONFIG, waLink } from '@/lib/siteConfig';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050507] border-t border-[#D4C5B9]/10 pt-16 pb-12 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#141418] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] font-bold text-base">
                AS
              </div>
              <span className="text-xl font-bold tracking-tight text-[#F5F2ED] font-['Outfit']">
                AvinayStudio
              </span>
            </div>
            <p className="text-xs text-[#DFC08F] tracking-widest uppercase font-semibold mb-3">
              Build • Create • Grow
            </p>
            <p className="text-xs text-[#B8B3AB] max-w-sm leading-relaxed mb-6">
              A bespoke digital agency based in Assam, crafting high-converting web applications, modern storefronts, and authority brands for ambitious businesses.
            </p>
            <div className="text-xs text-[#75716B]">
              Direct Phone: <span className="text-[#E8DFD8] font-mono">{SITE_CONFIG.phoneDisplay}</span> <br />
              Email: <span className="text-[#E8DFD8]">sharmaavinay0@gmail.com</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFC08F] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8B3AB]">
              <li><a href="#portfolio" className="hover:text-[#DFC08F] transition-colors">Client Portfolio</a></li>
              <li><a href="#services" className="hover:text-[#DFC08F] transition-colors">Agency Services</a></li>
              <li><a href="#pricing" className="hover:text-[#DFC08F] transition-colors">Pricing & Packages</a></li>
              <li><a href="#about" className="hover:text-[#DFC08F] transition-colors">About Avinay</a></li>
              <li><a href="#process" className="hover:text-[#DFC08F] transition-colors">4-Step Process</a></li>
              <li><a href="#contact" className="hover:text-[#DFC08F] transition-colors">Contact Directly</a></li>
            </ul>
          </div>

          {/* System & Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFC08F] mb-4">
              Internal & Ops
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8B3AB]">
              <li>
                <Link href="/admin" className="inline-flex items-center gap-1.5 text-[#DFC08F] hover:text-[#E8DFD8] transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Dashboard Login
                </Link>
              </li>
              <li>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DFC08F] transition-colors"
                >
                  WhatsApp Direct Channel
                </a>
              </li>
              <li className="text-[11px] text-[#75716B]">
                Supabase Cloud Database Integrated
              </li>
              <li className="text-[11px] text-[#75716B]">
                PDF Invoicing System Active
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D4C5B9]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#75716B]">
          <div>
            © {new Date().getFullYear()} AvinayStudio. All rights reserved. Crafted with care in Assam.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#B8B3AB] hover:text-[#DFC08F] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
