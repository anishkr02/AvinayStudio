'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Send, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';
import { createLead } from '@/lib/agencyData';
import { SITE_CONFIG, waLink } from '@/lib/siteConfig';
import ThreeDCard from './ThreeDCard';

function sanitizePhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    business: '',
    package: 'Business Website',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [website, setWebsite] = useState('');
  const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (website) {
      setSubmitted(true);
      return;
    }
    if (!formData.name || !isPhoneValid) {
      return;
    }

    setSubmitting(true);
    setSubmitError(false);

    try {
      await createLead({
        name: formData.name,
        phone: `+91${formData.phone}`,
        business: formData.business,
        package: formData.package,
        message: formData.message,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-[#07070A] border-t border-[#D4C5B9]/10 relative overflow-hidden">
      {/* Background Soft Gold Ambience */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-[#C5A880]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Direct Founder Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#C5A880]/30 text-xs uppercase tracking-widest text-[#DFC08F] font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Let’s Collaborate
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F2ED] font-['Outfit'] mb-6 leading-tight">
                Ready to Bring <br />
                <span className="gold-gradient-text">More Customers</span> to Your Business?
              </h2>

              <p className="text-base text-[#B8B3AB] leading-relaxed mb-8">
                Reach out directly to Avinay. Whether you need a brand-new website, an e-commerce catalogue, or a complete digital overhaul, we are ready to build it.
              </p>

              {/* Contact Details with 3D Depth */}
              <div className="space-y-4 mb-8">
                {/* Phone */}
                <ThreeDCard depth={6} glare={false}>
                  <a
                    href={`tel:${SITE_CONFIG.phoneTel}`}
                    className="p-4 rounded-xl bg-[#0E0E13] border border-[#D4C5B9]/15 hover:border-[#C5A880]/50 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#16161C] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] group-hover:bg-[#DFC08F] group-hover:text-[#050505] transition-all">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#75716B] font-semibold">
                        Direct Phone
                      </div>
                      <div className="text-base font-bold text-[#F5F2ED] font-mono group-hover:text-[#DFC08F] transition-colors">
                        {SITE_CONFIG.phoneDisplay}
                      </div>
                    </div>
                  </a>
                </ThreeDCard>

                {/* Email */}
                <ThreeDCard depth={6} glare={false}>
                  <a
                    href="mailto:sharmaavinay0@gmail.com"
                    className="p-4 rounded-xl bg-[#0E0E13] border border-[#D4C5B9]/15 hover:border-[#C5A880]/50 transition-all flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#16161C] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F] group-hover:bg-[#DFC08F] group-hover:text-[#050505] transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#75716B] font-semibold">
                        Direct Email
                      </div>
                      <div className="text-base font-bold text-[#F5F2ED] group-hover:text-[#DFC08F] transition-colors">
                        sharmaavinay0@gmail.com
                      </div>
                    </div>
                  </a>
                </ThreeDCard>

                {/* Location */}
                <div className="p-4 rounded-xl bg-[#0E0E13] border border-[#D4C5B9]/15 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#16161C] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC08F]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#75716B] font-semibold">
                      Base Location
                    </div>
                    <div className="text-sm font-bold text-[#F5F2ED]">
                      Assam, India • Serving Clients Worldwide
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <a
                href={waLink("Hi Avinay, I'd like to discuss a project with AvinayStudio.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(223,192,143,0.35)] transform hover:-translate-y-1"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp ({SITE_CONFIG.phoneDisplay})
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-[#75716B]">
              <Clock className="w-3.5 h-3.5 text-[#DFC08F]" />
              <span>Direct founder response in 15–30 minutes during business hours.</span>
            </div>
          </div>

          {/* Right Column: 3D Form Card Linked to Supabase */}
          <div className="lg:col-span-7">
            <ThreeDCard depth={8}>
              <div className="p-8 sm:p-10 rounded-2xl bg-[#0E0E13] border border-[#D4C5B9]/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-[#F5F2ED] font-['Outfit']">
                    Send a Direct Project Inquiry
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-[#16161C] text-[#DFC08F] border border-[#C5A880]/30">
                    Direct to Avinay
                  </span>
                </div>
                <p className="text-xs text-[#B8B3AB] mb-8">
                  Your inquiry goes straight to Avinay for personal review.
                </p>

                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#181820] border-2 border-[#DFC08F] flex items-center justify-center mx-auto text-[#DFC08F] shadow-[0_0_30px_rgba(223,192,143,0.25)]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-[#F5F2ED] font-['Outfit']">
                      Inquiry Received!
                    </h4>
                    <p className="text-sm text-[#B8B3AB] max-w-md mx-auto">
                      Thank you! Avinay has received your inquiry and will reach out to <span className="text-[#DFC08F] font-bold">{formData.phone}</span> shortly.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={waLink(`Hi Avinay, I just submitted an inquiry for ${formData.package}. My name is ${formData.name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] flex items-center gap-2"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Also Ping on WhatsApp
                      </a>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', phone: '', business: '', package: 'Business Website', message: '' });
                          setSubmitError(false);
                          setWebsite('');
                        }}
                        className="text-xs text-[#B8B3AB] hover:text-[#DFC08F] underline"
                      >
                        Send another inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="sr-only"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8B3AB] mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rajesh Sharma"
                          className="w-full px-4 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] placeholder-[#75716B] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8B3AB] mb-2">
                          WhatsApp / Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          inputMode="numeric"
                          autoComplete="tel-national"
                          pattern="[6-9][0-9]{9}"
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: sanitizePhone(e.target.value) });
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            setFormData({
                              ...formData,
                              phone: sanitizePhone(e.clipboardData.getData('text')),
                            });
                          }}
                          placeholder="98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] placeholder-[#75716B] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors"
                        />
                        {formData.phone && !isPhoneValid && (
                          <p className="mt-2 text-xs text-[#E8DFD8]">Enter a valid 10-digit mobile number</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8B3AB] mb-2">
                          Business or Brand Name
                        </label>
                        <input
                          type="text"
                          maxLength={150}
                          value={formData.business}
                          onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                          placeholder="e.g. Maa Radio / Sharma Medicos"
                          className="w-full px-4 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] placeholder-[#75716B] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8B3AB] mb-2">
                          Desired Package
                        </label>
                        <select
                          value={formData.package}
                          onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors"
                        >
                          <option value="Basic Website (₹7,999)">Basic Website (₹7,999)</option>
                          <option value="Business Website (₹14,999 – ₹19,999)">Business Website (₹14,999 – ₹19,999)</option>
                          <option value="Advanced Online Store (₹39,999 – ₹49,999)">Advanced Online Store (₹39,999 – ₹49,999)</option>
                          <option value="Custom Web Platform Scope">Custom Web Platform Scope</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#B8B3AB] mb-2">
                        Tell us about your goals & requirements
                      </label>
                      <textarea
                        rows={4}
                        maxLength={1000}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe what your business sells, your current setup, or any reference websites you like..."
                        className="w-full px-4 py-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] placeholder-[#75716B] text-sm focus:outline-none focus:border-[#DFC08F] transition-colors"
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs text-[#E8DFD8]">
                        Couldn&apos;t send your inquiry. Please message us on{' '}
                        <a
                          href={waLink("Hi Avinay, I couldn't submit an inquiry through the website.")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          WhatsApp
                        </a>{' '}
                        instead.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || !isPhoneValid}
                      className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(223,192,143,0.3)] disabled:opacity-50"
                    >
                      {submitting ? 'Submitting to Supabase...' : 'Submit Project Inquiry'}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </ThreeDCard>
          </div>

        </div>
      </div>
    </section>
  );
}
