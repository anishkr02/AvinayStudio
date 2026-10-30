'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Edit,
  DollarSign
} from 'lucide-react';
import { fetchPayments, savePayment } from '@/lib/agencyData';
import { Payment } from '@/types';
import { AdminError, AdminLoading, getAdminErrorMessage } from '@/components/admin/AdminState';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [formData, setFormData] = useState({
    client_name: '',
    project_title: '',
    invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    total_amount: 19999,
    paid_amount: 10000,
    due_date: new Date().toISOString().split('T')[0],
    payment_method: 'UPI (PhonePe / Google Pay)',
    status: 'Partial' as Payment['status'],
  });

  const loadPayments = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchPayments();
      setPayments(data);
    } catch (error: unknown) {
      setLoadError(getAdminErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleOpenAdd = () => {
    setActionError(null);
    setEditingPayment(null);
    setFormData({
      client_name: '',
      project_title: '',
      invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      total_amount: 19999,
      paid_amount: 10000,
      due_date: new Date().toISOString().split('T')[0],
      payment_method: 'UPI (Google Pay)',
      status: 'Partial',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Payment) => {
    setActionError(null);
    setEditingPayment(p);
    setFormData({
      client_name: p.client_name,
      project_title: p.project_title,
      invoice_number: p.invoice_number,
      total_amount: p.total_amount,
      paid_amount: p.paid_amount,
      due_date: p.due_date,
      payment_method: p.payment_method,
      status: p.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    try {
      await savePayment({
        id: editingPayment ? editingPayment.id : undefined,
        client_name: formData.client_name,
        project_title: formData.project_title,
        invoice_number: formData.invoice_number,
        total_amount: Number(formData.total_amount),
        paid_amount: Number(formData.paid_amount),
        due_date: formData.due_date,
        payment_method: formData.payment_method,
        status: formData.status,
      });
      setIsModalOpen(false);
      await loadPayments();
    } catch (error: unknown) {
      setActionError(getAdminErrorMessage(error));
    }
  };

  const totalBilled = payments.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);
  const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const pendingAmount = totalBilled - totalPaid;

  if (loading) return <AdminLoading />;
  if (loadError) return <AdminError message={loadError} onRetry={loadPayments} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141C] border border-[#C5A880]/30 text-xs font-semibold text-[#DFC08F] mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            Financial Ops
          </div>
          <h1 className="text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            Payment & Milestone Tracker
          </h1>
          <p className="text-xs text-[#B8B3AB] mt-1">
            Track client deposits, balance settlements, and payment channels.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#050505] bg-[#DFC08F] hover:bg-[#E8DFD8] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {actionError && !isModalOpen && (
        <div role="alert" className="rounded-xl border border-[#552222] bg-[#221212] p-4 text-sm text-[#E8DFD8]">
          {actionError}
        </div>
      )}

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="text-xs text-[#B8B3AB] mb-1">Total Invoiced Value</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#F5F2ED] font-['Outfit']">
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="text-xs text-[#DFC08F] mb-1">Total Cleared in Bank / UPI</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#DFC08F] font-['Outfit']">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15">
          <div className="text-xs text-[#E8DFD8] mb-1">Pending Balance to Collect</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#E8DFD8] font-['Outfit']">
            ₹{pendingAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl bg-[#0D0D12] border border-[#D4C5B9]/15 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121217] border-b border-[#D4C5B9]/10 text-[#75716B] uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Client & Scope</th>
                <th className="py-4 px-6 font-semibold">Invoice Ref</th>
                <th className="py-4 px-6 font-semibold">Contract Total</th>
                <th className="py-4 px-6 font-semibold">Amount Paid</th>
                <th className="py-4 px-6 font-semibold">Due Balance</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Payment Channel</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C5B9]/5">
              {payments.map((p) => {
                const balance = Number(p.total_amount) - Number(p.paid_amount);
                return (
                  <tr key={p.id} className="hover:bg-[#121218] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-[#F5F2ED] font-['Outfit']">
                        {p.client_name}
                      </div>
                      <div className="text-[11px] text-[#B8B3AB] mt-0.5">
                        {p.project_title}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-mono text-[#DFC08F] font-semibold">
                      {p.invoice_number}
                    </td>

                    <td className="py-4 px-6 font-semibold text-[#F5F2ED] font-mono">
                      ₹{Number(p.total_amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-6 font-bold text-[#DFC08F] font-mono">
                      ₹{Number(p.paid_amount).toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-6 font-mono font-medium text-[#E8DFD8]">
                      ₹{balance > 0 ? balance.toLocaleString('en-IN') : '0 (Settled)'}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'Paid'
                            ? 'bg-[#181C14] text-[#DFC08F] border border-[#C5A880]/30'
                            : p.status === 'Partial'
                            ? 'bg-[#1C1814] text-[#DFC08F] border border-[#D4C5B9]/20'
                            : 'bg-[#221616] text-[#E8DFD8] border border-[#552222]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#B8B3AB]">
                      {p.payment_method}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 rounded-lg bg-[#14141C] text-[#B8B3AB] hover:text-[#DFC08F] hover:bg-[#1C1C24] transition-colors"
                        title="Edit Payment"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0F0F14] border border-[#D4C5B9]/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#75716B] hover:text-[#F5F2ED]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-[#F5F2ED] mb-1 font-['Outfit']">
              {editingPayment ? 'Edit Payment Record' : 'Record Client Payment'}
            </h2>
            <p className="text-xs text-[#B8B3AB] mb-6">
              Log project deposits, advances, or final completion payments.
            </p>

            {actionError && (
              <div role="alert" className="mb-4 rounded-xl border border-[#552222] bg-[#221212] p-4 text-xs text-[#E8DFD8]">
                {actionError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                  Client Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g. Sharma Medicos"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                  Project Title / Milestone *
                </label>
                <input
                  type="text"
                  required
                  value={formData.project_title}
                  onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                  placeholder="e.g. Business Website & SEO Package"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Total Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Paid Amount (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.paid_amount}
                    onChange={(e) => setFormData({ ...formData, paid_amount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Payment['status'] })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  >
                    <option value="Paid">Paid (Full Settlement)</option>
                    <option value="Partial">Partial (Advance Received)</option>
                    <option value="Pending">Pending (Awaiting Deposit)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#B8B3AB] font-semibold mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14141A] border border-[#D4C5B9]/15 text-[#F5F2ED] text-xs focus:outline-none focus:border-[#DFC08F]"
                  >
                    <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                    <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                    <option value="Bank Transfer (NEFT/IMPS)">Bank Transfer (NEFT/IMPS)</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                  </select>
                </div>
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
                  {editingPayment ? 'Update Payment' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
