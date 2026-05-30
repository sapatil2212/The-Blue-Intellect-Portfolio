"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getLeadsAction, createLeadAction, updateLeadStageAction,
  addInteractionLogAction, scheduleFollowUpAction, getLeadAnalyticsAction,
} from "@/actions/crm";
import { getEmployeesAction } from "@/actions/employee";
import {
  Plus, Search, Calendar, Phone, Mail, MessageCircle, TrendingUp,
  Filter, Loader2, LayoutGrid, List, X, ChevronDown, User,
  Clock, Tag, DollarSign, ArrowUpRight, CheckCircle2, XCircle,
  AlertTriangle, Zap, BarChart3, RefreshCw, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────
const STAGES = ["NEW", "CONTACTED", "FOLLOW_UP", "INTERESTED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST"] as const;
type Stage = typeof STAGES[number];

const STAGE_META: Record<Stage, { label: string; color: string; dot: string; bg: string }> = {
  NEW:           { label: "New",           color: "text-slate-500 dark:text-zinc-400",   dot: "bg-slate-400",   bg: "bg-slate-100 dark:bg-zinc-800/60" },
  CONTACTED:     { label: "Contacted",     color: "text-blue-600 dark:text-blue-400",    dot: "bg-blue-500",    bg: "bg-blue-50 dark:bg-blue-500/10" },
  FOLLOW_UP:     { label: "Follow-up",     color: "text-amber-600 dark:text-amber-400",  dot: "bg-amber-500",   bg: "bg-amber-50 dark:bg-amber-500/10" },
  INTERESTED:    { label: "Interested",    color: "text-violet-600 dark:text-violet-400",dot: "bg-violet-500",  bg: "bg-violet-50 dark:bg-violet-500/10" },
  PROPOSAL_SENT: { label: "Proposal Sent", color: "text-indigo-600 dark:text-indigo-400",dot: "bg-indigo-500",  bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  NEGOTIATION:   { label: "Negotiation",   color: "text-orange-600 dark:text-orange-400",dot: "bg-orange-500",  bg: "bg-orange-50 dark:bg-orange-500/10" },
  WON:           { label: "Won",           color: "text-emerald-600 dark:text-emerald-400",dot:"bg-emerald-500",bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  LOST:          { label: "Lost",          color: "text-rose-600 dark:text-rose-400",    dot: "bg-rose-500",    bg: "bg-rose-50 dark:bg-rose-500/10" },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  LOW:    { label: "Low",    color: "text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700" },
  MEDIUM: { label: "Medium", color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  HIGH:   { label: "High",   color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  URGENT: { label: "Urgent", color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
};

const INTERACTION_ICONS: Record<string, React.ElementType> = {
  CALL: Phone, EMAIL: Mail, WHATSAPP: MessageCircle, NOTE: Tag, MEETING: Calendar,
};

const SERVICES = [
  "Web Development & Design",
  "Graphic Design & Logo Branding",
  "UGC & Social Video Editing",
  "SEO & Performance Marketing",
  "Mobile App Development",
  "Brand Strategy & Consulting",
];

const SOURCES = ["Direct", "Website", "Referral", "Cold Email", "Cold Call", "Instagram", "LinkedIn", "WhatsApp", "Other"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function timeAgo(date: string | Date) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StageBadge({ stage }: { stage: string }) {
  const m = STAGE_META[stage as Stage] ?? { label: stage, color: "text-zinc-400", dot: "bg-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-800" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-transparent", m.bg, m.color)}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", m.dot)} />
      {m.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const m = PRIORITY_META[priority] ?? PRIORITY_META.MEDIUM;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold", m.color)}>
      {m.label}
    </span>
  );
}

// ─── Analytics Bar ────────────────────────────────────────────────────────────
function AnalyticsBar({ analytics }: { analytics: any }) {
  if (!analytics) return null;
  const { total, stages, conversionRate } = analytics;
  const active = (stages.CONTACTED || 0) + (stages.FOLLOW_UP || 0) + (stages.INTERESTED || 0) + (stages.PROPOSAL_SENT || 0) + (stages.NEGOTIATION || 0);

  const cards = [
    { label: "Total Leads",    value: total,                          icon: BarChart3,    color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Active",         value: active,                         icon: Zap,          color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10" },
    { label: "Won",            value: stages.WON || 0,                icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400",bg:"bg-emerald-50 dark:bg-emerald-500/10" },
    { label: "Lost",           value: stages.LOST || 0,               icon: XCircle,      color: "text-rose-600 dark:text-rose-400",     bg: "bg-rose-50 dark:bg-rose-500/10" },
    { label: "Conversion",     value: `${conversionRate.toFixed(1)}%`,icon: TrendingUp,   color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map(c => (
        <div key={c.label} className={cn("rounded-xl border border-neutral-200 dark:border-white/5 p-4 flex items-center gap-3", c.bg)}>
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-white/60 dark:bg-black/20")}>
            <c.icon className={cn("h-4 w-4", c.color)} />
          </div>
          <div>
            <p className="text-[10px] font-medium text-neutral-500 dark:text-zinc-400">{c.label}</p>
            <p className={cn("text-lg font-extrabold font-mono leading-tight", c.color)}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
function KanbanCard({ lead, onClick, onDragStart }: { lead: any; onClick: () => void; onDragStart: (e: React.DragEvent) => void }) {
  const lastInteraction = lead.interactions?.[0];
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="group p-3.5 bg-white dark:bg-[#0f1018] border border-neutral-200 dark:border-white/5 rounded-xl hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-md transition-all duration-150 cursor-pointer space-y-2.5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-neutral-900 dark:text-zinc-100 truncate">{lead.clientName}</p>
          {lead.companyName && (
            <p className="text-[10px] text-neutral-500 dark:text-zinc-500 truncate mt-0.5">{lead.companyName}</p>
          )}
        </div>
        <PriorityBadge priority={lead.priority} />
      </div>

      {/* Service tag */}
      {lead.servicesInterested && (
        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate">{lead.servicesInterested}</p>
      )}

      {/* Notes preview */}
      {lead.notes && (
        <p className="text-[10px] text-neutral-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">{lead.notes}</p>
      )}

      {/* Footer */}
      <div className="pt-2 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-semibold text-neutral-600 dark:text-zinc-400">
          ${lead.estimatedBudget.toLocaleString()}
        </span>
        <div className="flex items-center gap-2">
          {lead.assignedEmployee && (
            <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-[8px] font-bold text-blue-700 dark:text-blue-400" title={lead.assignedEmployee.user.name}>
              {initials(lead.assignedEmployee.user.name || lead.assignedEmployee.user.email)}
            </div>
          )}
          {lead.followUpDate && (
            <span className="flex items-center gap-0.5 text-[9px] text-amber-600 dark:text-amber-400 font-semibold">
              <Calendar className="h-3 w-3" />
              {new Date(lead.followUpDate).toLocaleDateString([], { month: "short", day: "numeric" })}
            </span>
          )}
          {lastInteraction && (
            <span className="text-[9px] text-neutral-400 dark:text-zinc-600">{timeAgo(lastInteraction.createdAt)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
function ListRow({ lead, onClick }: { lead: any; onClick: () => void }) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/2 transition-colors cursor-pointer"
    >
      <td className="px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-neutral-900 dark:text-zinc-100">{lead.clientName}</p>
          <p className="text-[10px] text-neutral-400 dark:text-zinc-500">{lead.companyName || "—"}</p>
        </div>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p className="text-[10px] text-neutral-500 dark:text-zinc-400 truncate max-w-[140px]">{lead.servicesInterested || "—"}</p>
      </td>
      <td className="px-4 py-3"><StageBadge stage={lead.status} /></td>
      <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs font-mono font-semibold text-neutral-700 dark:text-zinc-300">${lead.estimatedBudget.toLocaleString()}</span>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <p className="text-[10px] text-neutral-500 dark:text-zinc-400">{lead.source}</p>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        {lead.assignedEmployee ? (
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-700 dark:text-blue-400">
              {initials(lead.assignedEmployee.user.name || lead.assignedEmployee.user.email)}
            </div>
            <span className="text-[10px] text-neutral-600 dark:text-zinc-400 truncate max-w-[80px]">{lead.assignedEmployee.user.name || "—"}</span>
          </div>
        ) : <span className="text-[10px] text-neutral-400 dark:text-zinc-600">Unassigned</span>}
      </td>
      <td className="px-4 py-3 hidden xl:table-cell">
        {lead.followUpDate ? (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            {new Date(lead.followUpDate).toLocaleDateString([], { month: "short", day: "numeric" })}
          </span>
        ) : <span className="text-[10px] text-neutral-400 dark:text-zinc-600">—</span>}
      </td>
    </tr>
  );
}

// ─── Lead Detail Drawer ───────────────────────────────────────────────────────
function LeadDrawer({
  lead, employees, onClose, onStageChange, onInteractionAdded, onFollowUpSet,
}: {
  lead: any; employees: any[]; onClose: () => void;
  onStageChange: (id: string, stage: string) => void;
  onInteractionAdded: (log: any) => void;
  onFollowUpSet: (date: string) => void;
}) {
  const [noteType, setNoteType] = useState("CALL");
  const [noteContent, setNoteContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);
  const [changingStage, setChangingStage] = useState(false);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSubmitting(true);
    const res = await addInteractionLogAction(lead.id, noteType, noteContent);
    setSubmitting(false);
    if (res.success) { setNoteContent(""); onInteractionAdded(res.log); }
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpDate) return;
    setSchedulingFollowUp(true);
    const res = await scheduleFollowUpAction(lead.id, followUpDate);
    setSchedulingFollowUp(false);
    if (res.success) { setFollowUpDate(""); onFollowUpSet(followUpDate); }
  };

  const handleStage = async (stage: string) => {
    setChangingStage(true);
    await updateLeadStageAction(lead.id, stage);
    setChangingStage(false);
    onStageChange(lead.id, stage);
  };

  const IType = INTERACTION_ICONS[noteType] || Tag;

  return (
    <div data-lenis-prevent className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white dark:bg-[#0d0e18] border-l border-neutral-200 dark:border-white/10 z-50 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-neutral-100 dark:border-white/5 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{lead.clientName}</h3>
            <StageBadge stage={lead.status} />
          </div>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-0.5">{lead.companyName || "Direct Contact"} · {lead.source}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 dark:text-zinc-500 transition ml-2 shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Quick contact + key info */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-white/5 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-700 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-white/10 transition">
                <Phone className="h-3.5 w-3.5 text-blue-500" /> {lead.phone}
              </a>
            )}
            {lead.whatsapp && (
              <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs text-neutral-700 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-white/10 transition">
                <Mail className="h-3.5 w-3.5 text-blue-500" /> {lead.email}
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5">
              <p className="text-[10px] text-neutral-400 dark:text-zinc-500 mb-0.5">Budget</p>
              <p className="font-bold text-neutral-900 dark:text-white font-mono">${lead.estimatedBudget.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5">
              <p className="text-[10px] text-neutral-400 dark:text-zinc-500 mb-0.5">Priority</p>
              <PriorityBadge priority={lead.priority} />
            </div>
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5 col-span-2">
              <p className="text-[10px] text-neutral-400 dark:text-zinc-500 mb-0.5">Service Interest</p>
              <p className="font-semibold text-neutral-800 dark:text-zinc-200 text-[11px]">{lead.servicesInterested || "—"}</p>
            </div>
            {lead.assignedEmployee && (
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-white/3 border border-neutral-100 dark:border-white/5 col-span-2">
                <p className="text-[10px] text-neutral-400 dark:text-zinc-500 mb-0.5">Assigned To</p>
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-700 dark:text-blue-400">
                    {initials(lead.assignedEmployee.user.name || lead.assignedEmployee.user.email)}
                  </div>
                  <span className="font-semibold text-neutral-800 dark:text-zinc-200 text-[11px]">{lead.assignedEmployee.user.name || lead.assignedEmployee.user.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stage changer */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mb-2">Move Stage</p>
          <div className="flex flex-wrap gap-1.5">
            {STAGES.map(s => {
              const m = STAGE_META[s];
              const active = lead.status === s;
              return (
                <button
                  key={s}
                  onClick={() => !active && handleStage(s)}
                  disabled={changingStage || active}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition",
                    active
                      ? cn(m.bg, m.color, "border-current opacity-100 cursor-default")
                      : "bg-neutral-50 dark:bg-white/3 border-neutral-200 dark:border-white/10 text-neutral-500 dark:text-zinc-500 hover:border-neutral-300 dark:hover:border-white/20 hover:text-neutral-800 dark:hover:text-zinc-200 cursor-pointer"
                  )}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Follow-up scheduler */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mb-2">Schedule Follow-up</p>
          {lead.followUpDate && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <Calendar className="h-3.5 w-3.5" />
              Next: {new Date(lead.followUpDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
            </div>
          )}
          <form onSubmit={handleFollowUp} className="flex gap-2">
            <input
              type="datetime-local"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
              required
            />
            <button type="submit" disabled={schedulingFollowUp} className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition disabled:opacity-50">
              {schedulingFollowUp ? "..." : "Set"}
            </button>
          </form>
        </div>

        {/* Log interaction */}
        <div className="px-5 py-4 border-b border-neutral-100 dark:border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mb-2">Log Interaction</p>
          <form onSubmit={handleLog} className="space-y-2">
            <div className="flex gap-1.5 flex-wrap">
              {(["CALL", "EMAIL", "WHATSAPP", "NOTE", "MEETING"] as const).map(t => {
                const Icon = INTERACTION_ICONS[t];
                return (
                  <button key={t} type="button" onClick={() => setNoteType(t)}
                    className={cn("flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition",
                      noteType === t
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-neutral-50 dark:bg-white/3 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-zinc-400 hover:border-neutral-300 dark:hover:border-white/20"
                    )}>
                    <Icon className="h-3 w-3" /> {t}
                  </button>
                );
              })}
            </div>
            <textarea
              value={noteContent}
              onChange={e => setNoteContent(e.target.value)}
              rows={2}
              placeholder="Summarize the interaction..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition resize-none"
              required
            />
            <button type="submit" disabled={submitting}
              className="w-full h-8 rounded-lg bg-neutral-900 dark:bg-white/10 hover:bg-neutral-800 dark:hover:bg-white/15 text-white dark:text-zinc-200 text-xs font-semibold transition disabled:opacity-50">
              {submitting ? "Logging..." : "Log Note"}
            </button>
          </form>
        </div>

        {/* Timeline */}
        <div className="px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mb-3">Interaction Timeline</p>
          {(!lead.interactions || lead.interactions.length === 0) ? (
            <p className="text-xs text-neutral-400 dark:text-zinc-600 text-center py-4">No interactions logged yet.</p>
          ) : (
            <div className="relative border-l-2 border-neutral-100 dark:border-white/5 ml-2 space-y-4">
              {lead.interactions.map((log: any) => {
                const Icon = INTERACTION_ICONS[log.type] || Tag;
                return (
                  <div key={log.id} className="relative pl-5">
                    <div className="absolute -left-[11px] top-0.5 h-5 w-5 rounded-full bg-white dark:bg-[#0d0e18] border-2 border-neutral-200 dark:border-white/10 flex items-center justify-center">
                      <Icon className="h-2.5 w-2.5 text-blue-500" />
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">{log.type}</span>
                      <span className="text-[9px] text-neutral-400 dark:text-zinc-600 font-mono">{timeAgo(log.createdAt)}</span>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-zinc-300 leading-relaxed">{log.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CrmPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  // Filters
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");
  const [filterSource, setFilterSource] = useState("");

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Create form
  const EMPTY_LEAD = { clientName: "", companyName: "", email: "", phone: "", whatsapp: "", source: "Direct", assignedEmployeeId: "", estimatedBudget: "", servicesInterested: SERVICES[0], priority: "MEDIUM", notes: "" };
  const [newLead, setNewLead] = useState(EMPTY_LEAD);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const [leadRes, empRes, analRes] = await Promise.all([getLeadsAction(), getEmployeesAction(), getLeadAnalyticsAction()]);
    if (leadRes.success && leadRes.leads) setLeads(leadRes.leads);
    if (empRes.success && empRes.employees) setEmployees(empRes.employees);
    if (analRes.success && analRes.analytics) setAnalytics(analRes.analytics);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Drag & drop
  const handleDragStart = (e: React.DragEvent, id: string) => e.dataTransfer.setData("text/plain", id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: stage } : l));
    const res = await updateLeadStageAction(id, stage);
    if (!res.success) loadData();
    else {
      const analRes = await getLeadAnalyticsAction();
      if (analRes.success && analRes.analytics) setAnalytics(analRes.analytics);
    }
  };

  // Create lead
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!newLead.clientName.trim()) { setCreateError("Client name is required."); return; }
    setCreating(true);
    const res = await createLeadAction({
      ...newLead,
      estimatedBudget: parseFloat(newLead.estimatedBudget) || 0,
      assignedEmployeeId: newLead.assignedEmployeeId || undefined,
    });
    setCreating(false);
    if (res.success) {
      setShowCreate(false);
      setNewLead(EMPTY_LEAD);
      loadData();
    } else {
      setCreateError(res.error || "Failed to create lead.");
    }
  };

  // Drawer callbacks
  const handleStageChange = (id: string, stage: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: stage } : l));
    if (selectedLead?.id === id) setSelectedLead((p: any) => ({ ...p, status: stage }));
  };
  const handleInteractionAdded = (log: any) => {
    if (!selectedLead) return;
    setSelectedLead((p: any) => ({ ...p, interactions: [log, ...(p.interactions || [])] }));
  };
  const handleFollowUpSet = (date: string) => {
    if (!selectedLead) return;
    setSelectedLead((p: any) => ({ ...p, followUpDate: new Date(date), status: "FOLLOW_UP" }));
    setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, followUpDate: new Date(date), status: "FOLLOW_UP" } : l));
  };

  // Filtered leads
  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.clientName.toLowerCase().includes(q) || (l.companyName || "").toLowerCase().includes(q) || (l.email || "").toLowerCase().includes(q);
    const matchStage = !filterStage || l.status === filterStage;
    const matchPriority = !filterPriority || l.priority === filterPriority;
    const matchAssignee = !filterAssignee || l.assignedEmployee?.id === filterAssignee;
    const matchSource = !filterSource || l.source === filterSource;
    return matchSearch && matchStage && matchPriority && matchAssignee && matchSource;
  });

  const activeFilters = [filterStage, filterPriority, filterAssignee, filterSource].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        <p className="text-xs text-neutral-400 dark:text-zinc-500 font-medium">Loading CRM pipeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Leads & CRM</h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">Track inquiries, manage pipeline stages, and log every interaction.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadData} className="p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/10 transition cursor-pointer">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          {/* View toggle */}
          <div className="flex rounded-lg border border-neutral-200 dark:border-white/10 overflow-hidden">
            <button onClick={() => setView("kanban")} className={cn("px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition", view === "kanban" ? "bg-blue-600 text-white" : "bg-white dark:bg-white/5 text-neutral-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/10")}>
              <LayoutGrid className="h-3.5 w-3.5" /> Board
            </button>
            <button onClick={() => setView("list")} className={cn("px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition", view === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-white/5 text-neutral-500 dark:text-zinc-400 hover:bg-neutral-50 dark:hover:bg-white/10")}>
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
          <button onClick={() => setShowCreate(true)} className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer">
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Analytics */}
      <AnalyticsBar analytics={analytics} />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 dark:text-zinc-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        {[
          { value: filterStage, set: setFilterStage, placeholder: "All Stages", options: STAGES.map(s => ({ v: s, l: STAGE_META[s].label })) },
          { value: filterPriority, set: setFilterPriority, placeholder: "All Priorities", options: ["LOW","MEDIUM","HIGH","URGENT"].map(p => ({ v: p, l: p })) },
          { value: filterSource, set: setFilterSource, placeholder: "All Sources", options: SOURCES.map(s => ({ v: s, l: s })) },
          { value: filterAssignee, set: setFilterAssignee, placeholder: "All Assignees", options: employees.map(e => ({ v: e.id, l: e.user.name || e.user.email })) },
        ].map((f, i) => (
          <select key={i} value={f.value} onChange={e => f.set(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs text-neutral-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 transition cursor-pointer">
            <option value="">{f.placeholder}</option>
            {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
          </select>
        ))}
        {activeFilters > 0 && (
          <button onClick={() => { setFilterStage(""); setFilterPriority(""); setFilterAssignee(""); setFilterSource(""); }}
            className="h-8 px-3 rounded-lg border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1 transition hover:bg-rose-100 dark:hover:bg-rose-500/20 cursor-pointer">
            <X className="h-3 w-3" /> Clear ({activeFilters})
          </button>
        )}
        <span className="h-8 flex items-center px-2 text-[10px] text-neutral-400 dark:text-zinc-600 font-mono">{filtered.length} leads</span>
      </div>

      {/* ── Kanban View ── */}
      {view === "kanban" && (
        <div className="overflow-x-auto pb-4 -mx-1 px-1">
          <div className="flex gap-3" style={{ minWidth: `${STAGES.length * 272}px` }}>
            {STAGES.map(stage => {
              const stageLeads = filtered.filter(l => l.status === stage);
              const m = STAGE_META[stage];
              return (
                <div key={stage} onDragOver={handleDragOver} onDrop={e => handleDrop(e, stage)}
                  className="w-64 shrink-0 flex flex-col rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/2 overflow-hidden">
                  {/* Column header */}
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", m.dot)} />
                      <span className={cn("text-xs font-bold", m.color)}>{m.label}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-zinc-600 bg-neutral-100 dark:bg-white/5 px-1.5 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 p-2 space-y-2 min-h-[400px] overflow-y-auto">
                    {stageLeads.map(lead => (
                      <KanbanCard key={lead.id} lead={lead}
                        onClick={() => setSelectedLead(lead)}
                        onDragStart={e => handleDragStart(e, lead.id)}
                      />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-[10px] text-neutral-300 dark:text-zinc-700 border-2 border-dashed border-neutral-200 dark:border-white/5 rounded-lg">
                        Drop here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── List View ── */}
      {view === "list" && (
        <div className="rounded-xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0b0c14]/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-white/2">
                  {["Client", "Service", "Stage", "Priority", "Budget", "Source", "Assignee", "Follow-up"].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-xs text-neutral-400 dark:text-zinc-600">No leads match your filters.</td></tr>
                ) : (
                  filtered.map(lead => (
                    <ListRow key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create Lead Modal ── */}
      {showCreate && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0d0e18] border border-neutral-200 dark:border-white/10 rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-white/5 shrink-0">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">New Lead</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-400 dark:text-zinc-500 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {createError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {createError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Client Name *", key: "clientName", type: "text", placeholder: "Sarah Jenkins", required: true },
                  { label: "Company", key: "companyName", type: "text", placeholder: "Jenkins Digital" },
                  { label: "Email", key: "email", type: "email", placeholder: "sarah@example.com" },
                  { label: "Phone", key: "phone", type: "text", placeholder: "+1 555 0000" },
                  { label: "WhatsApp", key: "whatsapp", type: "text", placeholder: "+15550000" },
                  { label: "Budget ($)", key: "estimatedBudget", type: "number", placeholder: "5000" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mb-1">{f.label}</label>
                    <input type={f.type} required={f.required} placeholder={f.placeholder}
                      value={(newLead as any)[f.key]}
                      onChange={e => setNewLead(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Source", key: "source", options: SOURCES.map(s => ({ v: s, l: s })) },
                  { label: "Priority", key: "priority", options: ["LOW","MEDIUM","HIGH","URGENT"].map(p => ({ v: p, l: p })) },
                  { label: "Service", key: "servicesInterested", options: SERVICES.map(s => ({ v: s, l: s })), span: true },
                  { label: "Assign To", key: "assignedEmployeeId", options: [{ v: "", l: "Unassigned" }, ...employees.map(e => ({ v: e.id, l: `${e.user.name || e.user.email} (${e.department})` }))], span: true },
                ].map(f => (
                  <div key={f.key} className={f.span ? "col-span-2" : ""}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mb-1">{f.label}</label>
                    <select value={(newLead as any)[f.key]} onChange={e => setNewLead(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500 transition cursor-pointer">
                      {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 mb-1">Notes</label>
                <textarea value={newLead.notes} onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))}
                  rows={3} placeholder="Context, requirements, referral details..."
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition resize-none"
                />
              </div>
              <button type="submit" disabled={creating}
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {creating ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : "Create Lead"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Lead Detail Drawer ── */}
      {selectedLead && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelectedLead(null)} />
          <LeadDrawer
            lead={selectedLead}
            employees={employees}
            onClose={() => setSelectedLead(null)}
            onStageChange={handleStageChange}
            onInteractionAdded={handleInteractionAdded}
            onFollowUpSet={handleFollowUpSet}
          />
        </>
      )}
    </div>
  );
}
