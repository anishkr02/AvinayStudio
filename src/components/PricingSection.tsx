'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { waLink } from '@/lib/siteConfig';

export default function PricingSection() {
  const plans = [
    {
      name: 'Basic Website',
      price: '₹7,999',
      period: 'one-time investment',
      desc: 'Ideal for local businesses seeking a clean, fast, credible digital card & mobile inquiry gateway.',
      features: [
        'Single-page modern responsive site',
        'Mobile & tablet optimized layout',
        'Direct WhatsApp inquiry button',
        'Click-to-call phone integration',
        'Google Maps location embed',
        'High-speed cloud hosting setup',
        'Turnaround in 3–5 working days',
      ],
      popular: false,
      ctaText: 'Start with ₹7,999',
    },
    {
      name: 'Business Website',
      price: '₹14,999 – ₹19,999',
      period: 'complete custom package',
      desc: 'Our flagship choice for ambitious local enterprises wanting to rank on Google & convert incoming leads.',
      features: [
        'Up to 5 custom-designed pages',
        'Local SEO & Google Business optimization',
        'Interactive quote / inquiry lead forms',
        'Customer testimonials & portfolio gallery',
        'Custom domain setup & SSL security',
        'High-converting copy & typography',
        'Full WhatsApp enquiry pipeline',
        '30 days direct post-launch support',
      ],
      popular: true,
      ctaText: 'Choose Business Growth',
    },
    {
      name: 'Advanced Online Store',
      price: '₹39,999 – ₹49,999',
      period: 'full digital sales engine',
      desc: 'Full-scale e-commerce & catalogue platform for retailers, electronics stores, and regional brands.',
      features: [
        'Unlimited product catalog system',
        'Category filters & instant search',
        'Online payment gateway integration (UPI / Cards)',
        'Admin dashboard to manage products & stock',
        'Order dispatch tracking & customer notifications',
        'Automated invoice generation engine',
        'Speed-optimized architecture (Next.js + CDN)',
        'Priority 1-on-1 founder support',
      ],
      popular: false,
      ctaText: 'Build Online Store',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#08080B] border-t border-[#D4C5B9]/10 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#C5A880]/30 text-xs uppercase tracking-widest text-[#DFC08F] font-semibold mb-4">
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F2ED] font-['Outfit'] mb-4">
            Honest Investment. <span className="gold-gradient-text">Exceptional Returns.</span>
          </h2>
          <p className="text-base text-[#B8B3AB]">
            No surprise hidden charges. Every package is backed by high-standard craftsmanship and direct developer accountability.
          </p>
        </div>

        {/* Pricing Cards Grid (Strict user pricing: ₹7,999 / ₹14,999–₹19,999 / ₹39,999–₹49,999) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#121218] border-2 border-[#DFC08F] shadow-[0_0_40px_rgba(212,175,120,0.15)] scale-[1.02] z-10'
                  : 'bg-[#0E0E12] border border-[#D4C5B9]/15 hover:border-[#C5A880]/35'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#DFC08F] text-[#050505] text-[11px] font-extrabold uppercase tracking-widest shadow-md">
                  Most Value for Money
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#F5F2ED] mb-2 font-['Outfit']">
                    {plan.name}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#DFC08F] font-['Outfit'] tracking-tight">
                    {plan.price}
                  </div>
                  <div className="text-xs text-[#75716B] mt-1 font-medium">
                    {plan.period}
                  </div>
                  <p className="text-xs text-[#B8B3AB] mt-4 leading-relaxed pb-6 border-b border-[#D4C5B9]/10">
                    {plan.desc}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 mb-8">
                  <div className="text-[11px] uppercase tracking-wider text-[#DFC08F] font-bold">
                    What’s Included:
                  </div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#E8DFD8]">
                      <Check className="w-4 h-4 text-[#DFC08F] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={waLink(`Hi Avinay, I'd like to order the ${plan.name} (${plan.price}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? 'bg-[#DFC08F] text-[#050505] hover:bg-[#E8DFD8] shadow-lg shadow-[#DFC08F]/25'
                    : 'bg-[#181820] text-[#E8DFD8] hover:bg-[#22222E] border border-[#D4C5B9]/15'
                }`}
              >
                {plan.ctaText}
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Custom Project Note */}
        <div className="mt-14 p-6 rounded-2xl bg-[#0F0F14] border border-[#D4C5B9]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181820] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F5F2ED]">Need a Custom Web Application or Special Requirements?</h4>
              <p className="text-xs text-[#B8B3AB] mt-0.5">We build bespoke portals, internal software, and API integrations tailored to your exact workflow.</p>
            </div>
          </div>
          <a
            href={waLink('Hi Avinay, I have a custom web application requirement.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] shrink-0"
          >
            Request Custom Scope
          </a>
        </div>

      </div>
    </section>
  );
}
