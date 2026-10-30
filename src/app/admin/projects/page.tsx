'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  Check,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { fetchProjects, saveProject, deleteProject, uploadProjectImage } from '@/lib/agencyData';
import { Project } from '@/types';
import { AdminError, AdminLoading, getAdminErrorMessage } from '@/components/admin/AdminState';
import { isAllowedImageUrl, safeImageSrc } from '@/lib/imageUrl';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    category: 'E-Commerce & Retail',
    description: '',
    image_url: '/images/hero-laptop.jpg',
    live_url: '',
    tags: 'Next.js, Tailwind, SEO',
    results_metric: '',
    featured: true,
  });

  const loadProjects = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err: unknown) {
      setLoadError(getAdminErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setActionError(null);
    setFormData({
      title: '',
      client_name: '',
      category: 'E-Commerce & Retail',
      description: '',
      image_url: '/images/hero-laptop.jpg',
      live_url: '',
      tags: 'Next.js, Custom Web',
      results_metric: '',
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject(proj);
    setActionError(null);
    setFormData({
      title: proj.title,
      client_name: proj.client_name,
      category: proj.category,
      description: proj.description,
      image_url: proj.image_url,
      live_url: proj.live_url || '',
      tags: proj.tags ? proj.tags.join(', ') : '',
      results_metric: proj.results_metric || '',
      featured: proj.featured,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    setActionError(null);
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err: unknown) {
      setActionError(getAdminErrorMessage(err));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionError(null);
    setUploadingImage(true);
    try {
      const uploadedUrl = await uploadProjectImage(file);
      setFormData((prev) => ({ ...prev, image_url: uploadedUrl }));
    } catch (err: unknown) {
      setActionError(getAdminErrorMessage(err));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!isAllowedImageUrl(formData.image_url)) {
      return;
    }

    try {
      const tagArray = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

      await saveProject({
        id: editingProject ? editingProject.id : undefined,
        title: formData.title,
        client_name: formData.client_name,
        category: formData.category,
        description: formData.description,
        image_url: formData.image_url,
        live_url: formData.live_url,
        tags: tagArray,
        results_metric: formData.results_metric,
        featured: formData.featured,
      });

      setIsModalOpen(false);
      await loadProjects();
    } catch (err: unknown) {
      setActionError(getAdminErrorMessage(err));
    }
  };

  if (loading) return <AdminLoading />;
  if (loadError) return <AdminError message={loadError} onRetry={loadProjects} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141C] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC08F] mb-2">
            <FolderGit2 className="w-3.5 h-3.5" />
            Supabase Portfolio CMS
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            Manage Portfolio Projects
          </h1>
          <p className="text-xs text-[#B8B3AB] mt-1">
            Changes you save here are stored in your Supabase database and shown on the public website.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add New Project
        </button>
      </div>

      {actionError && !isModalOpen && (
        <div className="p-4 rounded-xl bg-[#221212] border border-[#552222] text-xs text-[#E8DFD8] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#DFC08F] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[#DFC08F]">Database Notice:</div>
            <div>{actionError}</div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15 overflow-hidden flex flex-col justify-between group hover:border-[#C5A880]/40 transition-all shadow-xl"
          >
            <div>
              {/* Image Preview */}
              <div className="relative aspect-[16/10] w-full bg-[#050507]">
                <Image
                  src={safeImageSrc(proj.image_url)}
                  alt={proj.title}
                  fill
                  className="object-cover object-top"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#16161C]/90 text-[#DFC08F] border border-[#C5A880]/20">
                  {proj.category}
                </span>
                {proj.results_metric && (
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold text-[#DFC08F] bg-[#050505]/90 px-2.5 py-1 rounded-md border border-[#C5A880]/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {proj.results_metric}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="text-[11px] uppercase tracking-wider text-[#75716B] font-semibold mb-1">
                  {proj.client_name}
                </div>
                <h3 className="text-xl font-bold text-[#F5F2ED] mb-2 font-['Outfit']">
                  {proj.title}
                </h3>
                <p className="text-xs text-[#B8B3AB] leading-relaxed line-clamp-3 mb-4">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#16161C] text-[#D4C5B9] border border-[#D4C5B9]/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-6 pt-3 border-t border-[#D4C5B9]/10 flex items-center justify-between">
              {proj.live_url ? (
                <a
                  href={proj.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#DFC08F] hover:text-[#E8DFD8] flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Live
                </a>
              ) : (
                <span className="text-[11px] text-[#75716B]">No live link</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(proj)}
                  className="p-2 rounded-lg bg-[#14141C] text-[#B8B3AB] hover:text-[#DFC08F] hover:bg-[#1C1C24] transition-colors"
                  title="Edit Project"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="p-2 rounded-lg bg-[#14141C] text-[#75716B] hover:text-[#E8DFD8] hover:bg-[#201515] transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0F0F14] border border-[#D4C5B9]/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#75716B] hover:text-[#F5F2ED]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#F5F2ED] mb-1 font-['Outfit']">
              {editingProject ? 'Edit Project Details' : 'Add New Portfolio Project'}
            </h2>
            <p className="text-xs text-[#B8B3AB] mb-6">
              Enter case study details. Changes will save directly to Supabase and show immediately on your website.
            </p>

            {actionError && (
              <div role="alert" className="mb-5 rounded-xl border border-[#552222] bg-[#221212] p-4 text-xs text-[#E8DFD8]">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Photo Upload Zone */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#DFC08F] font-bold mb-2">
                  Project Photo / Cover Image *
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#D4C5B9]/20 bg-[#050508]">
                    <Image
                      src={safeImageSrc(formData.image_url)}
                      alt="Project preview"
                      fill
                      className="object-cover"
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2 text-xs text-[#DFC08F]">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Uploading photo...</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#C5A880]/40 hover:border-[#DFC08F] bg-[#14141C] hover:bg-[#1A1A24] text-xs font-bold text-[#DFC08F] flex items-center justify-center gap-2 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Photo from Device (JPG/PNG)'}</span>
                    </button>

                    <div>
                      <div className="text-[11px] text-[#75716B] mb-1">Image URL / Path:</div>
                      <input
                        type="text"
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData({ ...formData, image_url: e.target.value });
                          setActionError(null);
                        }}
                        placeholder="https://... or /images/..."
                        className="w-full px-3 py-2 rounded-lg bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                      />
                      {!isAllowedImageUrl(formData.image_url) && (
                        <p className="mt-1 text-[11px] text-[#E8DFD8]">
                          Use an uploaded image or a /images/ path
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Maa Radio Mart"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g. Maa Radio Electronics"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              {/* Category & Results Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  >
                    <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                    <option value="Local Business">Local Business</option>
                    <option value="Healthcare & Pharmacy">Healthcare & Pharmacy</option>
                    <option value="Salon & Lifestyle">Salon & Lifestyle</option>
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Custom Web App">Custom Web App</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Results Metric (e.g. 300+ Inquiries / Mo)
                  </label>
                  <input
                    type="text"
                    value={formData.results_metric}
                    onChange={(e) => setFormData({ ...formData, results_metric: e.target.value })}
                    placeholder="e.g. 3.5x Customer Call Increase"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                  Project Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the solution built, target audience, and business impact..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                />
              </div>

              {/* Live URL & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Live Website Link
                  </label>
                  <input
                    type="text"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Tech Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Next.js, Supabase, Tailwind, Assam"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-[#14141A] border-[#D4C5B9]/20 text-[#DFC08F] focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs text-[#E8DFD8]">
                  Feature on website homepage
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-[#D4C5B9]/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#B8B3AB] hover:text-[#F5F2ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] shadow-md disabled:opacity-50"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
