"use client";

import React, { useEffect, useState } from "react";
import { 
  getInvoicesAction, 
  createInvoiceAction, 
  approvePaymentAction, 
  getFinanceOverviewAction 
} from "@/actions/finance";
import { getClientsAction } from "@/actions/client";
import { getProjectsListAction } from "@/actions/projectManager";
import { 
  CreditCard, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  FileText,
  Percent,
  Download,
  Eye,
  AlertCircle
} from "lucide-react";

export default function FinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [creating, setCreating] = useState(false);
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null);

  // Form State
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: "",
    projectId: "",
    amount: "",
    taxAmount: "",
    commissionAmount: "",
    discount: "",
    dueDate: "",
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    const [invRes, clientRes, projRes, overviewRes] = await Promise.all([
      getInvoicesAction(),
      getClientsAction(),
      getProjectsListAction(),
      getFinanceOverviewAction()
    ]);

    if (invRes.success && invRes.invoices) setInvoices(invRes.invoices);
    if (clientRes.success && clientRes.clients) setClients(clientRes.clients);
    if (projRes.success && projRes.projects) setProjects(projRes.projects);
    if (overviewRes.success && overviewRes.metrics) setMetrics(overviewRes.metrics);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.clientId || !invoiceForm.amount || !invoiceForm.dueDate) return;
    setCreating(true);

    const res = await createInvoiceAction({
      clientId: invoiceForm.clientId,
      projectId: invoiceForm.projectId || undefined,
      amount: parseFloat(invoiceForm.amount) || 0,
      taxAmount: parseFloat(invoiceForm.taxAmount) || 0,
      commissionAmount: parseFloat(invoiceForm.commissionAmount) || 0,
      discount: parseFloat(invoiceForm.discount) || 0,
      dueDate: invoiceForm.dueDate,
      notes: invoiceForm.notes || undefined,
    });

    setCreating(false);
    if (res.success) {
      alert("Invoice generated successfully!");
      setShowCreateInvoice(false);
      setInvoiceForm({
        clientId: "",
        projectId: "",
        amount: "",
        taxAmount: "",
        commissionAmount: "",
        discount: "",
        dueDate: "",
        notes: "",
      });
      loadData();
    } else {
      alert(res.error || "Failed to create invoice");
    }
  };

  const handleApprovePayment = async (paymentId: string, status: "APPROVED" | "REJECTED") => {
    setApprovingPaymentId(paymentId);
    const res = await approvePaymentAction(paymentId, status);
    setApprovingPaymentId(null);
    if (res.success) {
      alert(`Payment status set to ${status}`);
      loadData();
    } else {
      alert(res.error || "Failed to update payment");
    }
  };

  // Find all pending payment verifications across all invoices
  const pendingPayments = invoices.flatMap((inv) => 
    (inv.payments || [])
      .filter((p: any) => p.status === "PENDING")
      .map((p: any) => ({
        ...p,
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.client?.user?.name || inv.client?.user?.email,
      }))
  );

  if (loading) {
    return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold mt-4">Compiling financial ledgers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Billing & Finance Dashboard</h1>
          <p className="text-xs text-zinc-400">Generate invoice quotes, approve client transactions, and audit commission allocations.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateInvoice(true)}
            className="h-10 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" /> Create Invoice
          </button>
        </div>
      </div>

      {/* Financial KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-white/10 rounded-2xl">
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Total Gross Revenue</span>
          <div className="text-2xl font-black mt-2 text-white">${metrics?.totalRevenue?.toLocaleString() || "0"}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Inclusive of commissions & taxes</div>
        </div>

        <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-white/10 rounded-2xl">
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Collected Payments</span>
          <div className="text-2xl font-black mt-2 text-emerald-400">${metrics?.collectedRevenue?.toLocaleString() || "0"}</div>
          <div className="text-[10px] text-emerald-500/60 mt-1">Verified direct receipts approved</div>
        </div>

        <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-white/10 rounded-2xl">
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Outstanding Dues</span>
          <div className="text-2xl font-black mt-2 text-amber-400">${metrics?.pendingDues?.toLocaleString() || "0"}</div>
          <div className="text-[10px] text-amber-500/60 mt-1">Overdue reminders automation ready</div>
        </div>

        <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl">
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Invoices Compiled</span>
          <div className="text-2xl font-black mt-2 text-purple-400">{metrics?.invoiceCount || "0"}</div>
          <div className="text-[10px] text-zinc-500 mt-1">Direct PDF link generated</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Invoice Catalog Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Invoice History Register</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-zinc-400 font-semibold uppercase">
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-zinc-500">No invoices logged. Click Create Invoice to compile.</td>
                    </tr>
                  ) : (
                    invoices.map((inv) => {
                      const total = inv.amount + inv.taxAmount - inv.discount;
                      return (
                        <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-4 font-bold text-zinc-200">{inv.invoiceNumber}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-bold text-zinc-300">{inv.client?.user?.name || inv.client?.user?.email}</p>
                              <p className="text-[10px] text-zinc-500 uppercase font-mono">{inv.project?.title || "Direct Account Charge"}</p>
                            </div>
                          </td>
                          <td className="p-4 text-zinc-400 font-mono">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "Immediate"}</td>
                          <td className="p-4 font-bold text-zinc-100">${total.toLocaleString()}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-mono uppercase text-xxs border ${
                              inv.status === "PAID" 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                : inv.status === "PARTIAL" 
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <a href={inv.fileUrl || "#"} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white" title="Download Document">
                              <Download className="h-4 w-4 mx-auto" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pending Receipts Verification */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-amber-400" /> Pending Receipts Approval
          </h3>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {pendingPayments.length === 0 ? (
              <p className="text-xxs text-zinc-500 text-center py-10">No pending transaction approvals.</p>
            ) : (
              pendingPayments.map((pay) => (
                <div key={pay.id} className="p-4 bg-zinc-950/40 border border-white/5 rounded-xl space-y-3 text-xxs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-zinc-200">{pay.clientName}</h4>
                      <p className="text-zinc-500 uppercase mt-0.5">Invoice: {pay.invoiceNumber}</p>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">${pay.amountPaid.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 font-mono">
                    <div>Method: <strong>{pay.paymentMethod}</strong></div>
                    <div>Ref: <strong>{pay.referenceNumber || "None"}</strong></div>
                  </div>

                  {pay.screenshotUrl && (
                    <a 
                      href={pay.screenshotUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="block p-2 bg-white/5 hover:bg-white/10 rounded text-center border border-white/10 text-zinc-300 transition"
                    >
                      👁 View Uploaded Receipt / Screenshot
                    </a>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprovePayment(pay.id, "APPROVED")}
                      disabled={approvingPaymentId === pay.id}
                      className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 rounded font-bold transition"
                    >
                      Approve Credit
                    </button>
                    <button
                      onClick={() => handleApprovePayment(pay.id, "REJECTED")}
                      disabled={approvingPaymentId === pay.id}
                      className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 rounded font-bold transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* CREATE INVOICE MODAL */}
      {showCreateInvoice && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm">Generate Invoice Quote</h3>
              <button 
                onClick={() => setShowCreateInvoice(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Target Client</label>
                <select
                  value={invoiceForm.clientId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, clientId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.user.name || c.user.email} ({c.companyName || "Direct Client"})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Linked Project (Optional)</label>
                <select
                  value={invoiceForm.projectId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                >
                  <option value="">Select Project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Base Amount ($)</label>
                  <input
                    type="number"
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Taxes / GST ($)</label>
                  <input
                    type="number"
                    value={invoiceForm.taxAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, taxAmount: e.target.value })}
                    placeholder="e.g. 900"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Commissions Allocation ($)</label>
                  <input
                    type="number"
                    value={invoiceForm.commissionAmount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, commissionAmount: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Flat Discount ($)</label>
                  <input
                    type="number"
                    value={invoiceForm.discount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: e.target.value })}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Invoice Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Direct Billing Notes</label>
                <textarea
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  rows={2}
                  placeholder="Terms, bank guidelines, commission terms..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg disabled:opacity-50 transition"
              >
                {creating ? "Generating Invoice..." : "Compile & Email PDF Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
