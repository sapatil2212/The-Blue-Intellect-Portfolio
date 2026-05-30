"use client";

import React, { useEffect, useState } from "react";
import { 
  getUsersAction, 
  updateUserStatusAction, 
  updateUserRoleAction 
} from "@/actions/auth";
import { 
  getWhatsAppQueueStatusAction, 
  addWhatsAppQueueItemAction, 
  processWhatsAppQueueItemAction 
} from "@/actions/notification";
import { 
  Settings, 
  Users, 
  ShieldAlert, 
  Smartphone, 
  Send, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Plus, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  Clock, 
  Sparkles, 
  Code, 
  Share2, 
  MessageSquareCode, 
  Database,
  Search
} from "lucide-react";

const AVAILABLE_ROLES = [
  "Super Admin",
  "Admin",
  "Sales Executive",
  "Telecaller",
  "Graphic Designer",
  "Video Editor",
  "Developer",
  "Project Manager",
  "HR",
  "Accountant",
  "Client"
];

const WHATSAPP_TEMPLATES = [
  { name: "client_welcome", desc: "Welcome message on successful onboarding confirmation.", vars: ["client_name", "company_name"] },
  { name: "lead_followup", desc: "Automated reminder for telecallers to follow up on sales pipeline.", vars: ["lead_name", "services", "followup_date"] },
  { name: "invoice_alert", desc: "Financial billing notice showing partial or unpaid balances.", vars: ["client_name", "invoice_no", "amount_due", "due_date"] },
  { name: "sprint_update", desc: "Project milestone status transition summary.", vars: ["project_name", "stage", "health_score"] }
];

export default function AdminSettingsHub() {
  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [whatsAppQueue, setWhatsAppQueue] = useState<any[]>([]);
  
  // UI & Loading States
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [processingQueueId, setProcessingQueueId] = useState<string | null>(null);
  const [dispatchingAll, setDispatchingAll] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  
  // New Broadcast Form State
  const [phone, setPhone] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(WHATSAPP_TEMPLATES[0].name);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [delaySeconds, setDelaySeconds] = useState(0);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load all Settings Context
  const loadUsersData = async () => {
    setLoadingUsers(true);
    const res = await getUsersAction();
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoadingUsers(false);
  };

  const loadQueueData = async () => {
    setLoadingQueue(true);
    const res = await getWhatsAppQueueStatusAction();
    if (res.success && res.queue) {
      setWhatsAppQueue(res.queue);
    }
    setLoadingQueue(false);
  };

  useEffect(() => {
    loadUsersData();
    loadQueueData();
  }, []);

  // Update variables when selected template changes
  useEffect(() => {
    const template = WHATSAPP_TEMPLATES.find(t => t.name === selectedTemplate);
    if (template) {
      const initialVars: Record<string, string> = {};
      template.vars.forEach(v => {
        initialVars[v] = "";
      });
      setTemplateVariables(initialVars);
    }
  }, [selectedTemplate]);

  // Handle RBAC User Status Update
  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setActionUserId(userId);
    const nextStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = await updateUserStatusAction(userId, nextStatus);
    if (res.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    }
    setActionUserId(null);
  };

  // Handle RBAC User Role Change
  const handleRoleChange = async (userId: string, nextRole: string) => {
    setActionUserId(userId);
    const res = await updateUserRoleAction(userId, nextRole);
    if (res.success) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
      // Refresh list in case of profile creations triggered by role swap
      loadUsersData();
    }
    setActionUserId(null);
  };

  // Add WhatsApp Queue item
  const handleQueueMockBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage(null);

    if (!phone.trim()) {
      setFormMessage({ type: "error", text: "Please enter a valid phone number." });
      setFormLoading(false);
      return;
    }

    const res = await addWhatsAppQueueItemAction({
      recipientPhone: phone.trim(),
      templateName: selectedTemplate,
      variables: templateVariables,
      scheduledSecondsDelay: Number(delaySeconds)
    });

    if (res.success) {
      setFormMessage({ type: "success", text: "Broadcast appended to simulation queue." });
      setPhone("");
      // Refresh queue
      await loadQueueData();
    } else {
      setFormMessage({ type: "error", text: res.error || "Failed to enqueue broadcast." });
    }
    setFormLoading(false);
  };

  // Process single Queue Item
  const handleProcessQueueItem = async (queueId: string) => {
    setProcessingQueueId(queueId);
    const res = await processWhatsAppQueueItemAction(queueId);
    if (res.success && res.item) {
      setWhatsAppQueue(prev => prev.map(q => q.id === queueId ? { ...q, status: "SENT", processedAt: res.item.processedAt } : q));
    }
    setProcessingQueueId(null);
  };

  // Dispatch all pending items
  const handleDispatchAllPending = async () => {
    setDispatchingAll(true);
    const pending = whatsAppQueue.filter(q => q.status === "PENDING");
    
    for (const item of pending) {
      await processWhatsAppQueueItemAction(item.id);
    }
    
    await loadQueueData();
    setDispatchingAll(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Super Admin": return "bg-rose-500/10 border-rose-500/30 text-rose-400";
      case "Admin": return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      case "HR": return "bg-pink-500/10 border-pink-500/30 text-pink-400";
      case "Project Manager": return "bg-violet-500/10 border-violet-500/30 text-violet-400";
      case "Developer": return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "Graphic Designer": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
      case "Video Editor": return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
      case "Sales Executive": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
      case "Telecaller": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "Accountant": return "bg-teal-500/10 border-teal-500/30 text-teal-400";
      default: return "bg-zinc-500/10 border-zinc-500/30 text-zinc-400";
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 text-white animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">
            OS CONTROL BOARD
          </span>
          <h1 className="text-2xl font-black text-white font-display tracking-tight mt-1">
            System Settings & Security
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Configure permission matrices, evaluate registered user directories, audit system integrations, and simulate messaging services.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => { loadUsersData(); loadQueueData(); }} 
            disabled={loadingUsers || loadingQueue}
            className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Synchronize OS
          </button>
        </div>
      </div>

      {/* Grid Settings System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Users Directory & RBAC Status (lg: 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-white/5 rounded-3xl bg-[#0b0c14]/40 backdrop-blur-xl p-6 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <h2 className="font-extrabold text-sm text-white">Employee RBAC Permissions</h2>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-48 shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-550" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user email..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-white/10 bg-[#07080d] text-[10px] text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {loadingUsers ? (
              <div className="py-20 flex flex-col justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <p className="text-xxs font-bold text-zinc-550 tracking-wider uppercase mt-4">Retrieving User Accounts...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center">
                <ShieldAlert className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-xxs font-bold text-zinc-400 uppercase">No users matches found</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[60vh] overflow-y-auto pr-1">
                {filteredUsers.map((item) => (
                  <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xxs group">
                    
                    {/* User Metadata */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-zinc-200 truncate">{item.name || "Invite Pending"}</p>
                        <span className={`text-[8px] border px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                          item.status === "ACTIVE" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{item.email}</p>
                    </div>

                    {/* RBAC Adjusters */}
                    <div className="flex items-center gap-3 shrink-0">
                      
                      {/* Role selection dropdown */}
                      <select
                        value={item.role}
                        onChange={(e) => handleRoleChange(item.id, e.target.value)}
                        disabled={actionUserId === item.id}
                        className={`h-8 px-2.5 rounded-lg border text-[10px] bg-[#07080d] focus:outline-none focus:border-blue-500 font-semibold cursor-pointer ${getRoleBadgeColor(item.role)}`}
                      >
                        {AVAILABLE_ROLES.map(role => (
                          <option key={role} value={role} className="bg-zinc-950 text-zinc-300">
                            {role}
                          </option>
                        ))}
                      </select>

                      {/* Status Toggle Action Button */}
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        disabled={actionUserId === item.id}
                        className={`h-8 px-3 rounded-lg border flex items-center gap-1.5 transition text-[10px] font-bold active:scale-95 cursor-pointer disabled:opacity-50 ${
                          item.status === "ACTIVE"
                            ? "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400"
                            : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {item.status === "ACTIVE" ? (
                          <>
                            <UserX className="h-3 w-3" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3" />
                            Activate
                          </>
                        )}
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Right Side: WhatsApp Automation (lg: 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Template Broadcast Form */}
          <div className="border border-white/5 rounded-3xl bg-[#0b0c14]/40 backdrop-blur-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4">
              <Smartphone className="h-5 w-5 text-amber-500" />
              <h2 className="font-extrabold text-sm text-white">Queue WhatsApp Broadcast</h2>
            </div>

            <form onSubmit={handleQueueMockBroadcast} className="space-y-4 text-xxs">
              
              {formMessage && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 font-semibold ${
                  formMessage.type === "success" 
                    ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" 
                    : "bg-rose-500/10 border-rose-500/25 text-rose-400"
                }`}>
                  {formMessage.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
                  <span>{formMessage.text}</span>
                </div>
              )}

              {/* Phone Recipient */}
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                  Recipient WhatsApp / Phone
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#07080d] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Template selection */}
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                  Template Message
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {WHATSAPP_TEMPLATES.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
                <p className="text-[9px] text-zinc-550 mt-1 italic leading-relaxed">
                  {WHATSAPP_TEMPLATES.find(t => t.name === selectedTemplate)?.desc}
                </p>
              </div>

              {/* Dynamic Variables placeholder slots */}
              {Object.keys(templateVariables).length > 0 && (
                <div className="p-3.5 bg-[#07080d]/60 border border-white/5 rounded-xl space-y-3">
                  <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">
                    Template Variables Payload
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {Object.keys(templateVariables).map((v) => (
                      <div key={v} className="space-y-1">
                        <label className="text-[8px] text-zinc-400 font-mono block">
                          {`{{${v}}}`}
                        </label>
                        <input
                          type="text"
                          required
                          value={templateVariables[v]}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTemplateVariables(prev => ({ ...prev, [v]: val }));
                          }}
                          placeholder={`Enter ${v.replace("_", " ")}`}
                          className="w-full h-8 px-2.5 rounded-lg border border-white/5 bg-zinc-950 text-[10px] text-zinc-200 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scheduling Delay */}
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                  Queue Release Timer Delay
                </label>
                <select
                  value={delaySeconds}
                  onChange={(e) => setDelaySeconds(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-white/5 bg-[#07080d] text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={0}>Immediate Processing (0s)</option>
                  <option value={10}>Release in 10 seconds</option>
                  <option value={60}>Release in 1 minute</option>
                  <option value={300}>Release in 5 minutes</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 font-bold text-white transition flex items-center justify-center gap-2 text-xxs tracking-wider uppercase active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Add to Simulation Queue
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* Grid: Simulator status items queue list */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* Simulator Logs Feed */}
        <div className="border border-white/5 rounded-3xl bg-[#0b0c14]/40 backdrop-blur-xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquareCode className="h-5 w-5 text-purple-400" />
              <div>
                <h2 className="font-extrabold text-sm text-white">Campaign Scheduler Simulation Log</h2>
                <p className="text-[9px] text-zinc-500 font-medium">Audits mock messages sent to queued employees and clients.</p>
              </div>
            </div>

            {whatsAppQueue.filter(q => q.status === "PENDING").length > 0 && (
              <button
                onClick={handleDispatchAllPending}
                disabled={dispatchingAll}
                className="h-8 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 text-xxs transition active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {dispatchingAll ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                Dispatch All Pending
              </button>
            )}
          </div>

          {loadingQueue ? (
            <div className="py-16 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
            </div>
          ) : whatsAppQueue.length === 0 ? (
            <p className="text-zinc-500 text-xxs italic text-center py-10">No simulated broadcast triggers logged in queue.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xxs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-mono text-[9px]">Queue ID</th>
                    <th className="pb-3">Recipient Phone</th>
                    <th className="pb-3">Template</th>
                    <th className="pb-3">Variables JSON</th>
                    <th className="pb-3">Release Schedule</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Simulation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {whatsAppQueue.map((item) => (
                    <tr key={item.id} className="text-zinc-350 hover:bg-white/2 transition-colors">
                      <td className="py-3.5 font-mono text-[8px] text-zinc-500 truncate max-w-[60px]" title={item.id}>
                        {item.id}
                      </td>
                      <td className="py-3.5 font-semibold text-zinc-200">
                        {item.recipientPhone}
                      </td>
                      <td className="py-3.5">
                        <span className="font-mono text-zinc-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                          {item.templateName}
                        </span>
                      </td>
                      <td className="py-3.5 max-w-[180px] truncate" title={item.variables}>
                        <code className="text-[9px] text-zinc-400 font-mono">{item.variables}</code>
                      </td>
                      <td className="py-3.5 text-zinc-400 font-medium">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-zinc-500" /> {new Date(item.scheduledFor).toLocaleTimeString()}</span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                          item.status === "SENT" 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : item.status === "FAILED" 
                              ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {item.status === "PENDING" ? (
                          <button
                            onClick={() => handleProcessQueueItem(item.id)}
                            disabled={processingQueueId === item.id}
                            className="h-6 px-2.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 hover:border-white/10 font-bold transition text-[9px] cursor-pointer"
                          >
                            {processingQueueId === item.id ? "Sending..." : "Release Now"}
                          </button>
                        ) : (
                          <span className="text-[9px] text-zinc-550 font-mono">
                            {item.processedAt ? new Date(item.processedAt).toLocaleTimeString() : "N/A"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Future Integration Architecture Mapping Spec Card */}
        <div className="border border-white/5 rounded-3xl bg-gradient-to-br from-[#0b0c14]/60 to-[#121422]/60 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Code className="h-5 w-5 text-indigo-400" />
            <div>
              <h2 className="font-extrabold text-sm text-white">Future Production WhatsApp API Service Mapping</h2>
              <p className="text-[9px] text-zinc-500 font-medium">Scalable event-driven queue hooks layout preparing for the production Meta Cloud API credentials integration.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xxs leading-relaxed text-zinc-400">
            <div className="bg-[#07080d]/40 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span className="font-extrabold text-zinc-200">1. Queue Release Listener</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                A background CRON job processes `WhatsAppQueue` records with matching timestamps. Trigger functions mapping `variables` as template parameter payloads inside:
              </p>
              <code className="block text-[8px] bg-black/40 p-2 rounded text-blue-300 font-mono">
                {`@/actions/notification.ts -> processWhatsAppQueueItemAction()`}
              </code>
            </div>

            <div className="bg-[#07080d]/40 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                <span className="font-extrabold text-zinc-200">2. Meta API Endpoint Wrapper</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Hooks for webhook status tracking (DELIVERED, READ receipts). Ready to send HTTPS payloads to:
              </p>
              <code className="block text-[8px] bg-black/40 p-2 rounded text-emerald-300 font-mono">
                {`POST https://graph.facebook.com/v20.0/{{PHONE_NUMBER_ID}}/messages`}
              </code>
            </div>

            <div className="bg-[#07080d]/40 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="font-extrabold text-zinc-200">3. Operational Triggers</span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Automatic calls already wired within the CRM (`lead_followup`), Finance (`invoice_alert`), and Client portals (`client_welcome`) to dispatch notifications.
              </p>
              <code className="block text-[8px] bg-black/40 p-2 rounded text-purple-300 font-mono">
                {`dispatchNotificationAction(..., sendWhatsAppMock: true)`}
              </code>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
