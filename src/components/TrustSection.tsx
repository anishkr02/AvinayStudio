'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Award, Users, TrendingUp } from 'lucide-react';
import { fetchProjects } from '@/lib/agencyData';
import { Project } from '@/types';
import { SEED_PROJECTS } from '@/data/seedProjects';
import ThreeDCard from './ThreeDCard';

export default function TrustSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProjects();
        setProjects(data.length > 0 ? data : SEED_PROJECTS);
      } catch {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section id="trust" className="py-24 bg-[#08080A] border-y border-[#D4C5B9]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#DFC08F] font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              Proven Regional Credibility
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
              Worked with local businesses in Assam
            </h2>
          </div>
          <p className="text-sm text-[#B8B3AB] max-w-md">
            Commercial track record delivering measurable sales inquiries and high-converting websites for trusted regional brands.
          </p>
        </div>

        {/* Dynamic Client Cards Grid from Supabase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            <p className="text-sm text-[#B8B3AB]">Loading projects...</p>
          ) : hasError ? (
            <p className="text-sm text-[#B8B3AB]">Projects could not be loaded right now.</p>
          ) : projects.slice(0, 4).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <ThreeDCard depth={8} glare={false} className="h-full">
                <div className="p-6 rounded-2xl bg-[#0F0F14] border border-[#D4C5B9]/15 hover:border-[#C5A880]/40 transition-all duration-300 h-full flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#16161C] text-[#DFC08F] border border-[#C5A880]/20">
                        {project.category}
                      </span>
                      <span className="text-xs text-[#75716B] font-mono">0{index + 1}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F5F2ED] mb-1 font-['Outfit']">
                      {project.title}
                    </h3>
                    
                    <div className="text-xs text-[#B8B3AB] mb-4">
                      {project.client_name}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#D4C5B9]/10 text-xs text-[#DFC08F] font-medium flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{project.results_metric || 'Active Web Solution'}</span>
                  </div>
                </div>
              </ThreeDCard>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-14 pt-8 border-t border-[#D4C5B9]/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC08F] font-['Outfit']">100%</div>
            <div className="text-xs text-[#B8B3AB] mt-1">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC08F] font-['Outfit']">&lt; 7 Days</div>
            <div className="text-xs text-[#B8B3AB] mt-1">Typical Launch Turnaround</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC08F] font-['Outfit']">3.5x</div>
            <div className="text-xs text-[#B8B3AB] mt-1">Average Inquiry Growth</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC08F] font-['Outfit']">24/7</div>
            <div className="text-xs text-[#B8B3AB] mt-1">Assam-Based Direct Support</div>
          </div>
        </div>

      </div>
    </section>
  );
}
