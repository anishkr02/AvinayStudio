'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Download,
  Trash2,
  CheckCircle2,
  Calendar,
  X,
  Printer
} from 'lucide-react';
import { fetchInvoices, saveInvoice } from '@/lib/agencyData';
import { generateInvoicePDF } from '@/lib/pdfInvoice';
import { Invoice, InvoiceItem } from '@/types';
import { AdminError, AdminLoading, getAdminErrorMessage } from '@/components/admin/AdminState';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('Assam, India');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Thank you for partnering with AvinayStudio. 50% advance received, balance upon delivery.');
  const [discount, setDiscount] = useState<number>(0);

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: 'Business Website & Google SEO Architecture', quantity: 1, rate: 18999, amount: 18999 },
  ]);

  const loadInvoices = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchInvoices();
      setInvoices(data);
      return true;
    } catch (error: unknown) {
      setLoadError(getAdminErrorMessage(error));
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleOpenCreate = () => {
    setActionError(null);
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setInvoiceNumber(`INV-${year}-${randomSuffix}`);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setClientAddress('Assam, India');
    setItems([
      { description: 'Custom Web Design & High-Converting Mobile Storefront', quantity: 1, rate: 16999, amount: 16999 },
    ]);
    setDiscount(0);
    setIsModalOpen(true);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const item = { ...items[index] };
    if (field === 'description') {
      item.description = String(value);
    } else if (field === 'quantity') {
      item.quantity = Number(value);
    } else if (field === 'rate') {
      item.rate = Number(value);
    }
    item.amount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
    const updated = [...items];
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'WhatsApp Integration & Cloudinary Asset Engine', quantity: 1, rate: 3000, amount: 3000 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalAmount = Math.max(0, subtotal - Number(discount || 0));

  const handleSaveAndDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;
    setActionError(null);

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invoiceNumber,
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      client_address: clientAddress,
      issue_date: issueDate,
      due_date: dueDate,
      items,
      subtotal,
      discount: Number(discount),
      total_amount: totalAmount,
      status: 'Issued',
      notes,
    };

    try {
      await saveInvoice(newInvoice);
      setIsModalOpen(false);
      const loaded = await loadInvoices();
      if (!loaded) return;
      generateInvoicePDF(newInvoice);
    } catch (error: unknown) {
      setActionError(getAdminErrorMessage(error));
    }
  };

  if (loading) return <AdminLoading />;
  if (loadError) return <AdminError message={loadError} onRetry={loadInvoices} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141C] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC08F] mb-2">
            <FileText className="w-3.5 h-3.5" />
            Invoice & Billing Engine
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            Generate & Download Client Invoices
          </h1>
          <p className="text-xs text-[#B8B3AB] mt-1">
            Create branded tax invoices and download crisp, client-ready PDFs with one click.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Create New Invoice
        </button>
      </div>

      {actionError && !isModalOpen && (
        <div role="alert" className="rounded-xl border border-[#552222] bg-[#221212] p-4 text-sm text-[#E8DFD8]">
          {actionError}
        </div>
      )}

      {/* Invoices List */}
      <div className="rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121217] border-b border-[#D4C5B9]/10 text-[#75716B] uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Invoice Ref</th>
                <th className="py-4 px-6 font-semibold">Client Name</th>
                <th className="py-4 px-6 font-semibold">Issue Date</th>
                <th className="py-4 px-6 font-semibold">Due Date</th>
                <th className="py-4 px-6 font-semibold">Total Amount</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Download PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C5B9]/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#121218] transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#DFC08F]">
                    {inv.invoice_number}
                  </td>

                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-[#F5F2ED] font-['Outfit']">
                      {inv.client_name}
                    </div>
                    {inv.client_phone && (
                      <div className="text-[11px] text-[#75716B]">{inv.client_phone}</div>
                    )}
                  </td>

                  <td className="py-4 px-6 text-[#B8B3AB]">{inv.issue_date}</td>
                  <td className="py-4 px-6 text-[#B8B3AB]">{inv.due_date}</td>

                  <td className="py-4 px-6 font-bold text-sm text-[#DFC08F] font-mono">
                    ₹{Number(inv.total_amount).toLocaleString('en-IN')}
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === 'Paid'
                          ? 'bg-[#181C14] text-[#DFC08F] border border-[#C5A880]/30'
                          : 'bg-[#1C1814] text-[#E8DFD8] border border-[#D4C5B9]/20'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => generateInvoicePDF(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#DFC08F] text-[#DFC08F] hover:text-[#050505] border border-[#C5A880]/30 font-bold transition-all shadow-sm"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Generator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#0F0F14] border border-[#D4C5B9]/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#75716B] hover:text-[#F5F2ED]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#DFC08F]" />
              <h2 className="text-2xl font-bold text-[#F5F2ED] font-['Outfit']">
                AvinayStudio Invoice Generator
              </h2>
            </div>
            <p className="text-xs text-[#B8B3AB] mb-6">
              Fill in client deliverables. The PDF will be branded with your agency details, UPI QR instructions, and payment terms.
            </p>

            {actionError && (
              <div role="alert" className="mb-6 rounded-xl border border-[#552222] bg-[#221212] p-4 text-xs text-[#E8DFD8]">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSaveAndDownload} className="space-y-6">
              {/* Header Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#14141A] border border-[#D4C5B9]/10">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0F0F14] border border-[#D4C5B9]/15 text-[#DFC08F] font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0F0F14] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0F0F14] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs"
                  />
                </div>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Client / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Maa Radio Mart"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Client Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="billing@client.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Client Address / City
                  </label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Main Road, Gogamukh, Assam"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              {/* Dynamic Line Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-wider text-[#DFC08F] font-bold">
                    Itemized Deliverables
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-[#DFC08F] hover:text-[#E8DFD8] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Line Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2.5 items-center p-3 rounded-xl bg-[#14141A] border border-[#D4C5B9]/10"
                    >
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Deliverable description"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0F0F14] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0F0F14] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs text-center"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          required
                          value={item.rate}
                          onChange={(e) => handleItemChange(idx, 'rate', Number(e.target.value))}
                          placeholder="Rate"
                          className="w-full px-3 py-1.5 rounded-lg bg-[#0F0F14] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs text-right font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-[#75716B] hover:text-[#DFC08F]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="p-4 rounded-xl bg-[#14141C] border border-[#D4C5B9]/10 flex flex-col items-end space-y-2 text-xs">
                <div className="flex justify-between w-64 text-[#B8B3AB]">
                  <span>Subtotal:</span>
                  <span className="font-mono text-[#F5F2ED]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between w-64 items-center">
                  <span className="text-[#B8B3AB]">Discount (INR):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded bg-[#0F0F14] border border-[#D4C5B9]/15 text-right font-mono text-xs text-[#DFC08F]"
                  />
                </div>
                <div className="flex justify-between w-64 pt-2 border-t border-[#D4C5B9]/15 text-sm font-bold">
                  <span className="text-[#DFC08F]">Total Amount:</span>
                  <span className="font-mono text-[#DFC08F]">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                  Invoice Terms & Bank/UPI Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                />
              </div>

              {/* Actions */}
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
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Save & Download PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
