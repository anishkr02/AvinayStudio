'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, FolderGit2 } from 'lucide-react';
import { Project } from '@/types';
import { fetchProjects } from '@/lib/agencyData';
import { waLink } from '@/lib/siteConfig';
import ThreeDCard from './ThreeDCard';

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProjects();
      setProjects(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['All', 'E-Commerce', 'Local Business', 'Healthcare', 'Salon & Lifestyle'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (p.tags && p.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()))));

  return (
    <section id="portfolio" className="py-28 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121216] border border-[#C5A880]/30 text-xs uppercase tracking-widest text-[#DFC08F] font-semibold mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              Selected Client Work
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F5F2ED] font-['Outfit']">
              Featured <span className="gold-gradient-text">Case Studies</span>
            </h2>
          </div>
          <p className="text-sm text-[#B8B3AB] max-w-md">
            Every build is engineered for high client conversion, responsive mobile viewing, and commanding authority in the market.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-[#DFC08F] text-[#050505] shadow-lg shadow-[#DFC08F]/25 scale-105'
                  : 'bg-[#121216] text-[#B8B3AB] hover:text-[#F5F2ED] border border-[#D4C5B9]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3D Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <ThreeDCard depth={8} className="h-full">
                  <div className="group rounded-2xl bg-[#0D0D11] border border-[#D4C5B9]/15 hover:border-[#C5A880]/45 overflow-hidden transition-all duration-300 flex flex-col justify-between h-full shadow-2xl">
                    <div>
                      {/* Image Display Frame with 3D Depth */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050507] [transform:translateZ(20px)]">
                        <Image
                          src={project.image_url || '/images/hero-laptop.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 filter contrast-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-transparent to-transparent opacity-90" />

                        {/* Results Metric Badge */}
                        {project.results_metric && (
                          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#050505]/90 border border-[#C5A880]/40 backdrop-blur-md text-[11px] font-bold text-[#DFC08F] shadow-lg [transform:translateZ(40px)]">
                            <Sparkles className="w-3 h-3" />
                            {project.results_metric}
                          </div>
                        )}

                        {/* Category Tag */}
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-[#16161C]/90 text-[10px] uppercase font-bold tracking-wider text-[#E8DFD8] border border-[#D4C5B9]/15 [transform:translateZ(40px)]">
                          {project.category}
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-6 sm:p-8 [transform:translateZ(30px)]">
                        <div className="text-xs uppercase tracking-widest text-[#DFC08F] font-semibold mb-2">
                          {project.client_name}
                        </div>
                        <h3 className="text-2xl font-bold text-[#F5F2ED] group-hover:text-[#DFC08F] transition-colors mb-3 font-['Outfit']">
                          {project.title}
                        </h3>
                        <p className="text-sm text-[#B8B3AB] leading-relaxed mb-6">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {project.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium px-2.5 py-1 rounded bg-[#15151B] text-[#D4C5B9] border border-[#D4C5B9]/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="px-6 sm:px-8 pb-6 pt-3 border-t border-[#D4C5B9]/10 flex items-center justify-between [transform:translateZ(25px)]">
                      <span className="text-xs text-[#75716B]">Engineered by AvinayStudio</span>
                      {project.live_url && project.live_url !== '#' ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DFC08F] hover:text-[#E8DFD8] transition-colors"
                        >
                          Visit Live System
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <a
                          href={waLink("Hi Avinay, I'd like to see more details about your portfolio.")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DFC08F] hover:text-[#E8DFD8] transition-colors"
                        >
                          Request Walkthrough
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
