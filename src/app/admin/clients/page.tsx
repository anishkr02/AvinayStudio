'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Edit,
  X,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';
import { fetchClients, saveClient } from '@/lib/agencyData';
import { Client } from '@/types';
import { AdminError, AdminLoading, getAdminErrorMessage } from '@/components/admin/AdminState';

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    business_name: '',
    contact_name: '',
    phone: '',
    email: '',
    location: 'Assam, India',
    package_selected: 'Business Website',
    status: 'Active' as Client['status'],
    total_billed: 14999,
    notes: '',
  });

  const loadClients = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error: unknown) {
      setLoadError(getAdminErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleOpenAdd = () => {
    setActionError(null);
    setEditingClient(null);
    setFormData({
      business_name: '',
      contact_name: '',
      phone: '',
      email: '',
      location: 'Assam, India',
      package_selected: 'Business Website',
      status: 'Active',
      total_billed: 14999,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Client) => {
    setActionError(null);
    setEditingClient(c);
    setFormData({
      business_name: c.business_name,
      contact_name: c.contact_name,
      phone: c.phone,
      email: c.email || '',
      location: c.location,
      package_selected: c.package_selected,
      status: c.status,
      total_billed: c.total_billed,
      notes: c.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await saveClient({
        id: editingClient ? editingClient.id : undefined,
        business_name: formData.business_name,
        contact_name: formData.contact_name,
        phone: formData.phone,
        email: formData.email,
        location: formData.location,
        package_selected: formData.package_selected,
        status: formData.status,
        total_billed: Number(formData.total_billed),
        notes: formData.notes,
      });
      setIsModalOpen(false);
      await loadClients();
    } catch (error: unknown) {
      setActionError(getAdminErrorMessage(error));
    }
  };

  if (loading) return <AdminLoading />;
  if (loadError) return <AdminError message={loadError} onRetry={loadClients} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141C] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC08F] mb-2">
            <Users className="w-3.5 h-3.5" />
            Client CRM
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            Client Directory & CRM
          </h1>
          <p className="text-xs text-[#B8B3AB] mt-1">
            Track business contacts, project contracts, and communications across Assam.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Client Record
        </button>
      </div>

      {actionError && !isModalOpen && (
        <div role="alert" className="rounded-xl border border-[#552222] bg-[#221212] p-4 text-sm text-[#E8DFD8]">
          {actionError}
        </div>
      )}

      {/* Clients Table */}
      <div className="rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121217] border-b border-[#D4C5B9]/10 text-[#75716B] uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Business & Contact</th>
                <th className="py-4 px-6 font-semibold">Phone & WhatsApp</th>
                <th className="py-4 px-6 font-semibold">Location</th>
                <th className="py-4 px-6 font-semibold">Package Selected</th>
                <th className="py-4 px-6 font-semibold">Contract Value</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C5B9]/5">
              {clients.map((c) => {
                const cleanPhone = c.phone.replace(/[^0-9]/g, '');
                return (
                  <tr key={c.id} className="hover:bg-[#121218] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-[#F5F2ED] font-['Outfit']">
                        {c.business_name}
                      </div>
                      <div className="text-[11px] text-[#DFC08F] mt-0.5">
                        {c.contact_name}
                      </div>
                      {c.notes && (
                        <div className="text-[10px] text-[#75716B] mt-1 max-w-xs truncate">
                          {c.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 font-mono text-[#E8DFD8]">
                        <Phone className="w-3.5 h-3.5 text-[#DFC08F]" />
                        <span>{c.phone}</span>
                      </div>
                      <div className="mt-1">
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#DFC08F] hover:text-[#E8DFD8]"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Open WhatsApp
                        </a>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-[#B8B3AB]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#75716B]" />
                        <span>{c.location}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded bg-[#16161C] border border-[#D4C5B9]/10 text-[#E8DFD8] text-[11px] font-medium">
                        {c.package_selected}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-bold text-sm text-[#DFC08F] font-mono">
                      ₹{Number(c.total_billed).toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'Active'
                            ? 'bg-[#181C14] text-[#DFC08F] border border-[#C5A880]/30'
                            : c.status === 'Completed'
                            ? 'bg-[#141820] text-[#B8B3AB] border border-[#D4C5B9]/15'
                            : 'bg-[#201814] text-[#E8DFD8] border border-[#D4C5B9]/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-2 rounded-lg bg-[#14141C] text-[#B8B3AB] hover:text-[#DFC08F] hover:bg-[#1C1C24] transition-colors"
                        title="Edit Client"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-[#0F0F14] border border-[#D4C5B9]/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#75716B] hover:text-[#F5F2ED]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#F5F2ED] mb-1 font-['Outfit']">
              {editingClient ? 'Edit Client Record' : 'Add New Client to CRM'}
            </h2>
            <p className="text-xs text-[#B8B3AB] mb-6">
              Enter business and contract details for this client.
            </p>

            {actionError && (
              <div role="alert" className="mb-4 rounded-xl border border-[#552222] bg-[#221212] p-4 text-xs text-[#E8DFD8]">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Business / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    placeholder="e.g. Maa Radio Mart"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Gogamukh, Assam"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Package
                  </label>
                  <select
                    value={formData.package_selected}
                    onChange={(e) => setFormData({ ...formData, package_selected: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  >
                    <option value="Basic Website">Basic Website (₹7,999)</option>
                    <option value="Business Website">Business Website (₹14,999 - ₹19,999)</option>
                    <option value="Advanced Online Store">Advanced Online Store (₹39,999 - ₹49,999)</option>
                    <option value="Custom Scope">Custom Scope</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  >
                    <option value="Lead">Lead</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                  Contract Billed Amount (INR)
                </label>
                <input
                  type="number"
                  value={formData.total_billed}
                  onChange={(e) => setFormData({ ...formData, total_billed: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                  Internal Notes & Scope
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Domain status, hosting details, specific feature requests..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                />
              </div>

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
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] shadow-md"
                >
                  {editingClient ? 'Update Client' : 'Save Client Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
