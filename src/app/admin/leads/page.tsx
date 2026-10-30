'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, MessageCircle, RefreshCw, Trash2, UserRoundPlus } from 'lucide-react';
import {
  convertLeadToClient,
  deleteLead,
  fetchLeads,
  updateLeadStatus,
} from '@/lib/agencyData';
import { AdminError, AdminLoading, getAdminErrorMessage } from '@/components/admin/AdminState';
import { Lead, LeadStatus } from '@/types';

type LeadFilter = 'All' | LeadStatus;

const LEAD_FILTERS: LeadFilter[] = ['All', 'New', 'Contacted', 'Converted', 'Dismissed'];

function getWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const internationalNumber = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${internationalNumber}`;
}

function formatLeadDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
}

function statusStyles(status: LeadStatus): string {
  switch (status) {
    case 'New':
      return 'bg-[#1C1814] text-[#DFC08F] border border-[#D4C5B9]/20';
    case 'Contacted':
      return 'bg-[#141820] text-[#B8B3AB] border border-[#D4C5B9]/15';
    case 'Converted':
      return 'bg-[#181C14] text-[#DFC08F] border border-[#C5A880]/30';
    case 'Dismissed':
      return 'bg-[#221616] text-[#E8DFD8] border border-[#552222]';
  }
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadFilter>('All');
  const [busyLeadId, setBusyLeadId] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (error: unknown) {
      setLoadError(getAdminErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const leadCounts = useMemo(
    () => ({
      All: leads.length,
      New: leads.filter((lead) => lead.status === 'New').length,
      Contacted: leads.filter((lead) => lead.status === 'Contacted').length,
      Converted: leads.filter((lead) => lead.status === 'Converted').length,
      Dismissed: leads.filter((lead) => lead.status === 'Dismissed').length,
    }),
    [leads]
  );

  const visibleLeads = useMemo(
    () => (filter === 'All' ? leads : leads.filter((lead) => lead.status === filter)),
    [filter, leads]
  );

  const runLeadAction = async (lead: Lead, action: () => Promise<void>) => {
    setActionError(null);
    setBusyLeadId(lead.id);
    try {
      await action();
      const refreshedLeads = await fetchLeads();
      setLeads(refreshedLeads);
    } catch (error: unknown) {
      setActionError(getAdminErrorMessage(error));
    } finally {
      setBusyLeadId(null);
    }
  };

  const handleStatusChange = (lead: Lead, status: LeadStatus) =>
    runLeadAction(lead, () => updateLeadStatus(lead.id, status));

  const handleConvert = (lead: Lead) =>
    runLeadAction(lead, async () => {
      await convertLeadToClient(lead);
    });

  const handleDelete = (lead: Lead) => {
    if (!window.confirm(`Permanently delete the inquiry from "${lead.name}"?`)) return;
    return runLeadAction(lead, () => deleteLead(lead.id));
  };

  if (loading) return <AdminLoading />;
  if (loadError) return <AdminError message={loadError} onRetry={loadLeads} />;

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#C5A880]/30 bg-[#14141C] px-3 py-1 text-xs font-semibold text-[#DFC08F]">
          <MessageCircle className="h-3.5 w-3.5" />
          Website Inquiries
        </div>
        <h1 className="font-['Outfit'] text-3xl font-extrabold text-[#F5F2ED]">
          Leads Inbox
        </h1>
        <p className="mt-1 text-xs text-[#B8B3AB]">
          Review and manage inquiries submitted through the website.
        </p>
      </div>

      {actionError && (
        <div
          role="alert"
          className="rounded-xl border border-[#552222] bg-[#221212] p-4 text-sm text-[#E8DFD8]"
        >
          {actionError}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {LEAD_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-xl border px-4 py-2 text-xs font-semibold transition-colors ${
              filter === status
                ? 'border-[#C5A880]/40 bg-[#181822] text-[#DFC08F]'
                : 'border-[#D4C5B9]/10 bg-[#0D0D12] text-[#B8B3AB] hover:bg-[#121216] hover:text-[#F5F2ED]'
            }`}
          >
            {status} <span className="ml-1 opacity-70">{leadCounts[status]}</span>
          </button>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-[#D4C5B9]/15 bg-[#0D0D12] p-10 text-center text-sm text-[#B8B3AB]">
          No leads yet
        </div>
      ) : visibleLeads.length === 0 ? (
        <div className="rounded-2xl border border-[#D4C5B9]/15 bg-[#0D0D12] p-10 text-center text-sm text-[#B8B3AB]">
          No leads in this status.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleLeads.map((lead) => {
            const isBusy = busyLeadId === lead.id;
            return (
              <article
                key={lead.id}
                className="rounded-2xl border border-[#D4C5B9]/15 bg-[#0D0D12] p-5 shadow-xl sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-['Outfit'] text-lg font-bold text-[#F5F2ED]">
                        {lead.name}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#B8B3AB]">
                      {formatLeadDate(lead.created_at)}
                    </p>
                  </div>

                  <a
                    href={getWhatsAppUrl(lead.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#C5A880]/30 bg-[#14141C] px-4 py-2.5 text-xs font-bold text-[#DFC08F] transition-colors hover:bg-[#1C1C24]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>

                <div className="mt-5 grid gap-4 text-xs sm:grid-cols-2">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#75716B]">
                      Phone
                    </div>
                    <div className="mt-1 text-[#E8DFD8]">{lead.phone}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#75716B]">
                      Business
                    </div>
                    <div className="mt-1 text-[#E8DFD8]">{lead.business || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#75716B]">
                      Package
                    </div>
                    <div className="mt-1 text-[#E8DFD8]">{lead.package || '—'}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#75716B]">
                      Message
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-[#B8B3AB]">
                      {lead.message || '—'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-[#D4C5B9]/10 pt-4">
                  {lead.status === 'New' && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleStatusChange(lead, 'Contacted')}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#181822] px-3 py-2 text-xs font-semibold text-[#DFC08F] transition-colors hover:bg-[#1C1C24] disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Mark contacted
                    </button>
                  )}
                  {lead.status !== 'Dismissed' && lead.status !== 'Converted' && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleStatusChange(lead, 'Dismissed')}
                      className="rounded-lg bg-[#181822] px-3 py-2 text-xs font-semibold text-[#B8B3AB] transition-colors hover:bg-[#1C1C24] disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                  )}
                  {lead.status !== 'Converted' && (
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => void handleConvert(lead)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#DFC08F] px-3 py-2 text-xs font-bold text-[#050505] transition-colors hover:bg-[#E8DFD8] disabled:opacity-50"
                    >
                      <UserRoundPlus className="h-3.5 w-3.5" />
                      Convert to client
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => void handleDelete(lead)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#201515] px-3 py-2 text-xs font-semibold text-[#E8DFD8] transition-colors hover:bg-[#2A1919] disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                  {isBusy && (
                    <span className="inline-flex items-center gap-1.5 px-2 text-xs text-[#75716B]">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
