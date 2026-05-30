"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getClientPortalDataAction, submitTaskFeedbackAction, submitProjectSatisfactionAction } from "@/actions/client";
import { recordPaymentAction } from "@/actions/finance";
import { logoutAction } from "@/actions/auth";

export default function ClientPortal() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Dialog / Modal states
  const [revisionTaskId, setRevisionTaskId] = useState<string | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Payment upload states
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [refNumber, setRefNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [recordingPayment, setRecordingPayment] = useState(false);

  // Satisfaction feedback states
  const [projectRating, setProjectRating] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingProjectName, setRatingProjectName] = useState("");
  const [ratingProjectId, setRatingProjectId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await getClientPortalDataAction();
    if (res.success) {
      setData(res);
    } else {
      router.push("/login?redirect=/client");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const handleApproveTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to approve this task content?")) return;
    const res = await submitTaskFeedbackAction({ taskId, isApproved: true });
    if (res.success) {
      alert("Task approved successfully!");
      loadData();
    } else {
      alert(res.error || "Failed to approve task");
    }
  };

  const handleSubmitRevision = async () => {
    if (!revisionTaskId) return;
    if (!revisionFeedback.trim()) {
      alert("Please provide revision feedback comment");
      return;
    }
    setSubmittingFeedback(true);
    const res = await submitTaskFeedbackAction({
      taskId: revisionTaskId,
      isApproved: false,
      revisionComment: revisionFeedback,
    });
    setSubmittingFeedback(false);
    if (res.success) {
      alert("Revision feedback sent to team!");
      setRevisionTaskId(null);
      setRevisionFeedback("");
      loadData();
    } else {
      alert(res.error || "Failed to submit feedback");
    }
  };

  const handleSimulateReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingReceipt(true);
    setTimeout(() => {
      setScreenshotUrl(`https://res.cloudinary.com/demo/image/upload/receipt_simulation_${Date.now()}.png`);
      setUploadingReceipt(false);
    }, 1500);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceId || !paymentAmount) {
      alert("Missing invoice selection or payment amount");
      return;
    }
    setRecordingPayment(true);
    const res = await recordPaymentAction({
      invoiceId: selectedInvoiceId,
      amountPaid: parseFloat(paymentAmount),
      paymentMethod,
      referenceNumber: refNumber,
      screenshotUrl: screenshotUrl || undefined,
    });
    setRecordingPayment(false);
    if (res.success) {
      alert("Payment receipt registered! Awaiting accounting verification.");
      setSelectedInvoiceId(null);
      setPaymentAmount("");
      setRefNumber("");
      setScreenshotUrl("");
      loadData();
    } else {
      alert(res.error || "Failed to register payment");
    }
  };

  const handleSubmitSatisfaction = async () => {
    if (!ratingProjectId) return;
    setSubmittingRating(true);
    const res = await submitProjectSatisfactionAction(ratingProjectId, projectRating, ratingComment);
    setSubmittingRating(false);
    if (res.success) {
      alert("Thank you for your rating!");
      setRatingProjectId(null);
      setRatingComment("");
      setProjectRating(5);
    } else {
      alert(res.error || "Failed to submit rating");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a0f] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm animate-pulse">Loading Client Portal Workspace...</p>
        </div>
      </div>
    );
  }

  const { client, documents, user } = data || {};
  const activeProjects = client?.projects || [];
  const invoices = client?.invoices || [];

  return (
    <div className="min-h-screen bg-[#090a0f] text-white font-sans">
      {/* Top Banner Header */}
      <header className="sticky top-0 bg-[#090a0f]/80 backdrop-blur-md border-b border-white/5 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-black">Æ</div>
          <span className="font-bold tracking-tight text-lg">AetherOS <span className="text-blue-500 text-xs font-mono px-1 bg-blue-500/10 border border-blue-500/20 rounded">Client Portal</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs text-zinc-400">Signed in as</p>
            <p className="text-sm font-semibold text-zinc-100">{user?.name || user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs border border-white/10 hover:border-red-500/40 hover:text-red-400 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-blue-500 mx-auto flex items-center justify-center text-xl font-bold mb-4">
              {(user?.name || user?.email).substring(0, 2).toUpperCase()}
            </div>
            <h3 className="font-bold truncate text-base">{user?.name || "Client Guest"}</h3>
            <p className="text-xs text-zinc-400 truncate mb-3">{user?.email}</p>
            
            {/* Status tags */}
            <div className="flex justify-center gap-2">
              <span className="text-xxs px-2 py-0.5 bg-indigo-500/15 text-indigo-400 rounded-full font-mono uppercase border border-indigo-500/25">
                Client Profile
              </span>
              <span className={`text-xxs px-2 py-0.5 rounded-full font-mono uppercase border ${
                client?.verificationStatus === "APPROVED" 
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25" 
                  : "bg-amber-500/15 text-amber-400 border-amber-500/25"
              }`}>
                {client?.verificationStatus}
              </span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "overview" ? "bg-blue-500/15 text-blue-400 border-l-4 border-blue-500" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              📊 Account Overview
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "projects" ? "bg-blue-500/15 text-blue-400 border-l-4 border-blue-500" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              📂 Projects & Approvals
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "billing" ? "bg-blue-500/15 text-blue-400 border-l-4 border-blue-500" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              💳 Invoices & Payments
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === "documents" ? "bg-blue-500/15 text-blue-400 border-l-4 border-blue-500" : "text-zinc-400 hover:bg-white/5"
              }`}
            >
              📁 Document Vault
            </button>
          </nav>
        </aside>

        {/* Workspace Display Area */}
        <section className="lg:col-span-3 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-2">Welcome to AetherOS Command Center</h2>
                <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                  Here you can review design assets, request sprint revisions directly to project managers, upload bank payment transaction logs, download PDF invoices, and monitor build timelines.
                </p>
                {client?.verificationStatus === "PENDING" && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg">
                    ⚠️ Your client onboarding documentation is currently pending review by Aether administration. Live project pipelines will initiate immediately upon approval.
                  </div>
                )}
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <span className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Active Projects</span>
                  <div className="text-3xl font-extrabold text-blue-400 mt-2">{activeProjects.length}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <span className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Total Documents</span>
                  <div className="text-3xl font-extrabold text-purple-400 mt-2">{documents?.length || 0}</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <span className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Pending Dues</span>
                  <div className="text-3xl font-extrabold text-amber-400 mt-2">
                    ${invoices
                      .filter((i: any) => i.status !== "PAID")
                      .reduce((acc: number, cur: any) => acc + cur.amount + cur.taxAmount - cur.discount, 0)
                      .toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Task Approvals Summary Widget */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Pending Design & Dev Approvals</h3>
                
                {/* Find tasks that are in REVIEW state */}
                {(() => {
                  const tasksInReview = activeProjects.flatMap((p: any) => 
                    p.tasks.filter((t: any) => t.status === "REVIEW").map((t: any) => ({ ...t, projectTitle: p.title }))
                  );

                  if (tasksInReview.length === 0) {
                    return (
                      <p className="text-sm text-zinc-500 py-4 text-center">No assets or review sprints currently pending approval.</p>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {tasksInReview.map((task: any) => (
                        <div key={task.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-zinc-950/40 border border-white/5 rounded-xl gap-4">
                          <div>
                            <span className="text-xxs uppercase bg-blue-500/10 border border-blue-500/25 text-blue-400 px-2 py-0.5 rounded font-mono">
                              {task.projectTitle}
                            </span>
                            <h4 className="font-bold text-sm text-zinc-200 mt-1">{task.title}</h4>
                            <p className="text-xs text-zinc-400 mt-1">{task.description || "Design revision review pending."}</p>
                          </div>
                          
                          <div className="flex gap-2 w-full md:w-auto">
                            <button
                              onClick={() => {
                                setRevisionTaskId(task.id);
                                setRevisionFeedback("");
                              }}
                              className="flex-1 md:flex-none text-xs border border-amber-500/30 hover:border-amber-500 text-amber-400 px-4 py-2 rounded-lg transition"
                            >
                              Request Revisions
                            </button>
                            <button
                              onClick={() => handleApproveTask(task.id)}
                              className="flex-1 md:flex-none text-xs bg-emerald-500 hover:opacity-95 text-white px-4 py-2 rounded-lg transition font-medium"
                            >
                              Approve Design
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS & APPROVALS */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold tracking-tight">Active Sprints & Projects</h2>

              {activeProjects.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-zinc-500">
                  📂 No projects registered. Fill out the onboarding document to initiate dynamic sprints.
                </div>
              ) : (
                activeProjects.map((project: any) => (
                  <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                    {/* Project Header */}
                    <div className="p-6 bg-white/5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold">{project.title}</h3>
                          <span className="text-xxs px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded-full font-mono uppercase">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">Project Type: {project.projectType} | Health score: {project.healthScore}%</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRatingProjectId(project.id);
                            setRatingProjectName(project.title);
                          }}
                          className="text-xs border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded-lg transition text-zinc-300"
                        >
                          ⭐ Rate Project
                        </button>
                      </div>
                    </div>

                    {/* Task boards */}
                    <div className="p-6 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Milestone Tasks & Statuses:</h4>
                      
                      {project.tasks.length === 0 ? (
                        <p className="text-xs text-zinc-500">No milestone tasks defined yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {project.tasks.map((task: any) => (
                            <div key={task.id} className="p-4 bg-zinc-950/40 border border-white/5 rounded-xl flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                  <h5 className="font-bold text-sm text-zinc-200 truncate">{task.title}</h5>
                                  <span className={`text-xxs px-2 py-0.5 rounded font-mono uppercase ${
                                    task.status === "COMPLETED" 
                                      ? "bg-emerald-500/15 text-emerald-400" 
                                      : task.status === "REVIEW" 
                                      ? "bg-amber-500/15 text-amber-400"
                                      : "bg-blue-500/15 text-blue-400"
                                  }`}>
                                    {task.status}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{task.description || "No description provided."}</p>
                              </div>

                              {task.status === "REVIEW" && (
                                <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                                  <button
                                    onClick={() => {
                                      setRevisionTaskId(task.id);
                                      setRevisionFeedback("");
                                    }}
                                    className="flex-1 text-xxs border border-amber-500/30 text-amber-400 py-1.5 rounded hover:bg-amber-500/10 transition"
                                  >
                                    Revisions
                                  </button>
                                  <button
                                    onClick={() => handleApproveTask(task.id)}
                                    className="flex-1 text-xxs bg-emerald-500 hover:opacity-95 text-white py-1.5 rounded transition font-medium"
                                  >
                                    Approve
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: BILLING & INVOICES */}
          {activeTab === "billing" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight">Invoice History & Payments</h2>
                {invoices.some((i: any) => i.status !== "PAID") && (
                  <button
                    onClick={() => {
                      const firstPending = invoices.find((i: any) => i.status !== "PAID");
                      if (firstPending) setSelectedInvoiceId(firstPending.id);
                    }}
                    className="text-xs bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 rounded-lg transition font-medium"
                  >
                    💸 Upload Payment Receipt
                  </button>
                )}
              </div>

              {invoices.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-zinc-500">
                  💳 No invoices generated yet.
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/5 text-zinc-400 border-b border-white/10">
                        <th className="p-4 font-semibold uppercase">Invoice #</th>
                        <th className="p-4 font-semibold uppercase">Date</th>
                        <th className="p-4 font-semibold uppercase">Due Date</th>
                        <th className="p-4 font-semibold uppercase">Total Amount</th>
                        <th className="p-4 font-semibold uppercase">Status</th>
                        <th className="p-4 font-semibold uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv: any) => {
                        const total = inv.amount + inv.taxAmount - inv.discount;
                        return (
                          <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="p-4 font-bold text-zinc-200">{inv.invoiceNumber}</td>
                            <td className="p-4 text-zinc-300">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                            <td className="p-4 text-zinc-300">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "Immediate"}</td>
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
                            <td className="p-4 flex gap-2">
                              {inv.status !== "PAID" && (
                                <button
                                  onClick={() => setSelectedInvoiceId(inv.id)}
                                  className="text-xxs text-blue-400 hover:underline"
                                >
                                  Pay / Notify
                                </button>
                              )}
                              <span className="text-zinc-600">|</span>
                              <a
                                href={inv.fileUrl || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xxs text-zinc-400 hover:text-white hover:underline"
                              >
                                View PDF
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Payment Upload Form (when invoice selected) */}
              {selectedInvoiceId && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6 animate-fadeIn">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base">Record Direct Payment Receipt</h3>
                    <button 
                      onClick={() => setSelectedInvoiceId(null)}
                      className="text-zinc-500 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleRecordPayment} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xxs font-semibold text-zinc-400 uppercase mb-2">Amount Paid ($)</label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="e.g. 1500"
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-semibold text-zinc-400 uppercase mb-2">Payment Method</label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none"
                        >
                          <option value="Bank Transfer">Bank Transfer / wire</option>
                          <option value="Stripe / Card">Card (via Stripe link)</option>
                          <option value="Crypto">USDT Stablecoin</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xxs font-semibold text-zinc-400 uppercase mb-2">Reference / Transaction Number</label>
                        <input
                          type="text"
                          value={refNumber}
                          onChange={(e) => setRefNumber(e.target.value)}
                          placeholder="e.g. TXN-90283048293"
                          className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-semibold text-zinc-400 uppercase mb-2">Upload Bank Receipt / Screenshot</label>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            onChange={handleSimulateReceiptUpload}
                            className="text-xs bg-zinc-900 file:bg-zinc-800 file:text-zinc-300 file:border-none file:px-3 file:py-1.5 file:rounded-lg file:mr-2 border border-white/10 rounded-lg w-full py-1.5"
                          />
                        </div>
                        {screenshotUrl && <p className="text-[10px] text-emerald-400 mt-1">✓ Receipt image processed successfully</p>}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={recordingPayment || uploadingReceipt}
                      className="w-full bg-emerald-500 hover:opacity-95 text-white py-2 rounded-lg font-bold text-xs mt-2 disabled:opacity-50"
                    >
                      {recordingPayment ? "Registering Transaction..." : "Register Receipt & Notify Accountant"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold tracking-tight">Your Document Vault</h2>
              
              {documents.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-zinc-500">
                  📁 No assets logged in document vault. Upload reference assets in Onboarding section.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc: any) => (
                    <div key={doc.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div>
                          <h4 className="font-bold text-sm truncate max-w-[200px] text-zinc-200">{doc.name}</h4>
                          <p className="text-xxs text-zinc-400 mt-0.5">{doc.folder} | {doc.tag || "No tag"}</p>
                          <p className="text-[10px] text-zinc-500">{doc.fileType.toUpperCase()} | {Math.round(doc.sizeBytes / 1024)} KB</p>
                        </div>
                      </div>

                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-white/5 transition"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Modal dialog for Revision Comment */}
      {revisionTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold">Submit Design Revision Request</h3>
            <p className="text-xs text-zinc-400">Describe exactly what needs to be changed in this creative block. Your comments will notify designers.</p>
            
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              rows={4}
              placeholder="e.g. Please change the header background to HSL(220, 10%, 10%) and center align the social media icons."
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg text-xs focus:outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRevisionTaskId(null)}
                className="text-xs border border-white/10 text-zinc-400 px-4 py-2 rounded-lg hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRevision}
                disabled={submittingFeedback}
                className="text-xs bg-amber-500 hover:opacity-95 text-white px-4 py-2 rounded-lg font-medium"
              >
                {submittingFeedback ? "Submitting..." : "Send Revision Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal dialog for Satisfaction Rating */}
      {ratingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold">Feedback for project: {ratingProjectName}</h3>
            
            <div>
              <label className="block text-xxs font-semibold text-zinc-400 uppercase mb-2">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setProjectRating(star)}
                    className={`text-2xl ${star <= projectRating ? "text-amber-400" : "text-zinc-600"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xxs font-semibold text-zinc-400 uppercase mb-2">Comments</label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={3}
                placeholder="What did you like about this sprint? Any advice to improve team SLA?"
                className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg text-xs focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRatingProjectId(null)}
                className="text-xs border border-white/10 text-zinc-400 px-4 py-2 rounded-lg hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitSatisfaction}
                disabled={submittingRating}
                className="text-xs bg-blue-500 hover:opacity-95 text-white px-4 py-2 rounded-lg font-medium"
              >
                {submittingRating ? "Submitting..." : "Send Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
