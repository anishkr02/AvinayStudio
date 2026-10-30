'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Users,
  CreditCard,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { fetchProjects, fetchClients, fetchPayments } from '@/lib/agencyData';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Project, Client, Payment } from '@/types';
import { AdminError, AdminLoading, getAdminErrorMessage } from '@/components/admin/AdminState';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [p, c, pay] = await Promise.all([
        fetchProjects(),
        fetchClients(),
        fetchPayments(),
      ]);
      setProjects(p);
      setClients(c);
      setPayments(pay);
    } catch (error: unknown) {
      setLoadError(getAdminErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const totalBilled = payments.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const pendingAmount = totalBilled - totalPaid;

  if (loading) return <AdminLoading />;
  if (loadError) return <AdminError message={loadError} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141C] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC08F] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Founder Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            Operations & Revenue Overview
          </h1>
          <p className="text-xs text-[#B8B3AB] mt-1">
            Real-time management for AvinayStudio portfolio, client pipeline, payments & invoices.
          </p>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0F0F14] border border-[#D4C5B9]/15 text-xs">
          <Database className="w-4 h-4 text-[#DFC08F]" />
          <div>
            <div className="text-[10px] text-[#75716B] uppercase font-semibold">Database Engine</div>
            <div className="font-bold text-[#E8DFD8]">
              {isSupabaseConfigured ? 'Supabase Cloud Connected' : 'Local Storage Mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Financial & Pipeline Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Billed */}
        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="flex items-center justify-between mb-3 text-xs text-[#B8B3AB]">
            <span>Total Value Billed</span>
            <TrendingUp className="w-4 h-4 text-[#DFC08F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#DFC08F] mt-2">
            Across {payments.length} active client contracts
          </div>
        </div>

        {/* Total Collected */}
        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="flex items-center justify-between mb-3 text-xs text-[#B8B3AB]">
            <span>Total Collected</span>
            <CheckCircle2 className="w-4 h-4 text-[#DFC08F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC08F] font-['Outfit']">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#B8B3AB] mt-2">
            Received via UPI & Bank Transfer
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="flex items-center justify-between mb-3 text-xs text-[#B8B3AB]">
            <span>Pending Receivables</span>
            <Clock className="w-4 h-4 text-[#E8DFD8]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#E8DFD8] font-['Outfit']">
            ₹{pendingAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#75716B] mt-2">
            Milestone balances awaiting signoff
          </div>
        </div>

        {/* Clients & Projects */}
        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="flex items-center justify-between mb-3 text-xs text-[#B8B3AB]">
            <span>Active Pipeline</span>
            <Users className="w-4 h-4 text-[#DFC08F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            {clients.length} <span className="text-base font-normal text-[#B8B3AB]">Clients</span>
          </div>
          <div className="text-[11px] text-[#DFC08F] mt-2">
            {projects.length} Showcase projects published
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <a
          href="/admin/projects"
          className="p-6 rounded-2xl bg-[#101016] border border-[#D4C5B9]/15 hover:border-[#C5A880]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#181822] flex items-center justify-center text-[#DFC08F] mb-4 group-hover:bg-[#DFC08F] group-hover:text-[#050505] transition-colors">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F2ED] mb-1 font-['Outfit'] flex items-center justify-between">
            <span>Portfolio CMS</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-[#B8B3AB]">
            Add, update, or delete live case studies showcased on the public website.
          </p>
        </a>

        <a
          href="/admin/clients"
          className="p-6 rounded-2xl bg-[#101016] border border-[#D4C5B9]/15 hover:border-[#C5A880]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#181822] flex items-center justify-center text-[#DFC08F] mb-4 group-hover:bg-[#DFC08F] group-hover:text-[#050505] transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F2ED] mb-1 font-['Outfit'] flex items-center justify-between">
            <span>Client CRM</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-[#B8B3AB]">
            Manage client records, phone numbers, lead statuses, and packages.
          </p>
        </a>

        <a
          href="/admin/payments"
          className="p-6 rounded-2xl bg-[#101016] border border-[#D4C5B9]/15 hover:border-[#C5A880]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#181822] flex items-center justify-center text-[#DFC08F] mb-4 group-hover:bg-[#DFC08F] group-hover:text-[#050505] transition-colors">
            <CreditCard className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F2ED] mb-1 font-['Outfit'] flex items-center justify-between">
            <span>Payments Tracker</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-[#B8B3AB]">
            Track received milestones, pending amounts, and payment methods.
          </p>
        </a>

        <a
          href="/admin/invoices"
          className="p-6 rounded-2xl bg-[#101016] border border-[#D4C5B9]/15 hover:border-[#C5A880]/50 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#181822] flex items-center justify-center text-[#DFC08F] mb-4 group-hover:bg-[#DFC08F] group-hover:text-[#050505] transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#F5F2ED] mb-1 font-['Outfit'] flex items-center justify-between">
            <span>Invoice & PDF Engine</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-xs text-[#B8B3AB]">
            Create itemized invoices and instantly download branded PDFs for clients.
          </p>
        </a>
      </div>

      {/* Recent Payments Table */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#F5F2ED] font-['Outfit']">
              Recent Client Payments
            </h3>
            <p className="text-xs text-[#B8B3AB]">
              Overview of recent project billing transactions in Assam.
            </p>
          </div>
          <a
            href="/admin/payments"
            className="text-xs font-semibold text-[#DFC08F] hover:text-[#E8DFD8]"
          >
            View All Payments →
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D4C5B9]/10 text-[#75716B] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Client & Project</th>
                <th className="pb-3 font-semibold">Invoice No</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold">Paid Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C5B9]/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#121218] transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-[#F5F2ED]">{p.client_name}</div>
                    <div className="text-[11px] text-[#75716B]">{p.project_title}</div>
                  </td>
                  <td className="py-3.5 font-mono text-[#B8B3AB]">{p.invoice_number}</td>
                  <td className="py-3.5 font-semibold text-[#F5F2ED]">
                    ₹{Number(p.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 font-semibold text-[#DFC08F]">
                    ₹{Number(p.paid_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'Paid'
                          ? 'bg-[#1C2018] text-[#DFC08F] border border-[#C5A880]/30'
                          : 'bg-[#1C1814] text-[#E8DFD8] border border-[#D4C5B9]/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-[#B8B3AB]">{p.payment_method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
