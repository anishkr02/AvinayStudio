'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Target, Zap, HeartHandshake, PhoneCall, Sparkles } from 'lucide-react';
import { SITE_CONFIG, waLink } from '@/lib/siteConfig';
import ThreeDCard from './ThreeDCard';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven Parallax and Reveal for Confident Founder Image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });
  const imageScale = useTransform(smoothProgress, [0, 1], [0.88, 1]);
  const imageOpacity = useTransform(smoothProgress, [0, 0.65, 1], [0.2, 0.85, 1]);
  const imageRotate = useTransform(smoothProgress, [0, 1], [-4, 0]);
  const haloScale = useTransform(smoothProgress, [0, 1], [0.6, 1.15]);
  const haloOpacity = useTransform(smoothProgress, [0, 1], [0.1, 0.45]);

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-28 bg-[#08080B] relative overflow-hidden border-t border-[#D4C5B9]/10"
    >
      {/* Dynamic Scroll-Linked Ambient Light Halo */}
      <motion.div
        style={{
          scale: haloScale,
          opacity: haloOpacity,
        }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#C5A880]/15 rounded-full blur-[160px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Confident Founder Portrait with 3D Depth & Scroll Reveal */}
          <motion.div
            style={{
              scale: imageScale,
              opacity: imageOpacity,
              rotateZ: imageRotate,
            }}
            className="lg:col-span-5 relative order-2 lg:order-1"
          >
            {/* Interactive 3D Card Wrapper */}
            <ThreeDCard depth={12} className="w-full">
              <div className="relative rounded-2xl overflow-hidden border border-[#D4C5B9]/20 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.95)] bg-[#050507]">
                
                {/* Image Frame */}
                <div className="relative aspect-[9/15] max-h-[640px] w-full [transform:translateZ(25px)]">
                  <Image
                    src="/images/about-avinay.png"
                    alt="Avinay Sharma - Founder of AvinayStudio"
                    fill
                    className="object-cover object-top filter contrast-[1.05] brightness-95"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />

                  {/* Cinematic Vignette & Bottom Falloff */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.9)] pointer-events-none" />
                </div>

                {/* Floating 3D Founder Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[#0C0C12]/92 backdrop-blur-md border border-[#C5A880]/35 shadow-2xl [transform:translateZ(55px)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#F5F2ED] font-['Outfit']">
                        Avinay Sharma
                      </div>
                      <div className="text-xs text-[#DFC08F]">
                        Founder & Lead Architect
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded bg-[#181822] text-[#DFC08F] border border-[#C5A880]/30 font-bold">
                        1-on-1 Direct
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating Pill Accent */}
              <div className="absolute -top-3 -left-3 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121216]/95 border border-[#C5A880]/40 backdrop-blur-md text-[11px] font-bold text-[#DFC08F] [transform:translateZ(60px)] shadow-xl">
                <Sparkles className="w-3.5 h-3.5" />
                Crafted in Assam
              </div>
            </ThreeDCard>
          </motion.div>

          {/* About Text Content */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-start order-1 lg:order-2"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#14141A] border border-[#C5A880]/30 text-xs uppercase tracking-widest text-[#DFC08F] font-semibold mb-6">
              Behind AvinayStudio
            </div>

            {/* Strict Founder Quote */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F2ED] font-['Outfit'] leading-tight mb-6">
              “Hi, I’m Avinay. <br className="hidden sm:inline" />
              <span className="gold-gradient-text">
                I help businesses grow online through websites, content, and digital presence.
              </span>”
            </h2>

            <p className="text-base sm:text-lg text-[#B8B3AB] leading-relaxed mb-6 font-normal">
              Most businesses don’t need another generic website template that sits quietly on the internet. They need an active sales machine that commands immediate respect, ranks high in local search, and turns curious visitors into paying customers.
            </p>

            <p className="text-sm sm:text-base text-[#B8B3AB] leading-relaxed mb-8">
              At AvinayStudio, every project is handled directly by me — no junior handoffs, no outsourced confusion. From high-conversion structure and bespoke design to lightning-fast hosting and WhatsApp client pipelines, I build digital assets that create real commercial growth.
            </p>

            {/* 3D Interactive Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <ThreeDCard depth={8} glare={false}>
                <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#D4C5B9]/15 flex items-start gap-3 h-full hover:border-[#C5A880]/40 transition-colors">
                  <Target className="w-5 h-5 text-[#DFC08F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F2ED]">Conversion Focused</h4>
                    <p className="text-xs text-[#B8B3AB] mt-0.5">Designed specifically to generate calls and WhatsApp enquiries.</p>
                  </div>
                </div>
              </ThreeDCard>

              <ThreeDCard depth={8} glare={false}>
                <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#D4C5B9]/15 flex items-start gap-3 h-full hover:border-[#C5A880]/40 transition-colors">
                  <Zap className="w-5 h-5 text-[#DFC08F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F2ED]">Modern Speed & SEO</h4>
                    <p className="text-xs text-[#B8B3AB] mt-0.5">Sub-second load times engineered for local Google dominance.</p>
                  </div>
                </div>
              </ThreeDCard>

              <ThreeDCard depth={8} glare={false}>
                <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#D4C5B9]/15 flex items-start gap-3 h-full hover:border-[#C5A880]/40 transition-colors">
                  <ShieldCheck className="w-5 h-5 text-[#DFC08F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F2ED]">Human-Crafted Quality</h4>
                    <p className="text-xs text-[#B8B3AB] mt-0.5">Zero copy-paste AI layouts. Tailored brand identity.</p>
                  </div>
                </div>
              </ThreeDCard>

              <ThreeDCard depth={8} glare={false}>
                <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#D4C5B9]/15 flex items-start gap-3 h-full hover:border-[#C5A880]/40 transition-colors">
                  <HeartHandshake className="w-5 h-5 text-[#DFC08F] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F2ED]">Long-Term Partner</h4>
                    <p className="text-xs text-[#B8B3AB] mt-0.5">Direct phone support and updates as your business scales.</p>
                  </div>
                </div>
              </ThreeDCard>
            </div>

            {/* Direct Connect CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={waLink("Hi Avinay, I'd like to discuss working together.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all transform hover:-translate-y-1 shadow-[0_0_25px_rgba(223,192,143,0.3)]"
              >
                Talk Directly with Avinay
              </a>
              <a
                href={`tel:${SITE_CONFIG.phoneTel}`}
                className="px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#E8DFD8] bg-[#14141A] hover:bg-[#1A1A22] border border-[#D4C5B9]/20 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#DFC08F]" />
                {SITE_CONFIG.phoneDisplay}
              </a>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
