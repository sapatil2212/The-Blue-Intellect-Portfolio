"use client";

import React, { useEffect, useState } from "react";
import { getProjectsListAction } from "@/actions/projectManager";
import { getLeaderboardAction } from "@/actions/employee";
import { getFinanceOverviewAction } from "@/actions/finance";
import { getLeadsAction } from "@/actions/crm";
import {
  TrendingUp,
  Users,
  Target,
  Briefcase,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Loader2,
  DollarSign,
  Activity,
} from "lucide-react";
import Link from "next/link";

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  color: "blue" | "purple" | "amber" | "emerald";
}) {
  const colors = {
    blue:    { bg: "bg-blue-50 dark:bg-blue-500/10",    border: "border-blue-100 dark:border-blue-500/20",    icon: "text-blue-600 dark:text-blue-400",    iconBg: "bg-blue-100 dark:bg-blue-500/20" },
    purple:  { bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-100 dark:border-purple-500/20", icon: "text-purple-600 dark:text-purple-400", iconBg: "bg-purple-100 dark:bg-purple-500/20" },
    amber:   { bg: "bg-amber-50 dark:bg-amber-500/10",   border: "border-amber-100 dark:border-amber-500/20",   icon: "text-amber-600 dark:text-amber-400",   iconBg: "bg-amber-100 dark:bg-amber-500/20" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: "text-emerald-600 dark:text-emerald-400", iconBg: "bg-emerald-100 dark:bg-emerald-500/20" },
  };
  const c = colors[color];

  return (
    <div className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-zinc-400">{label}</p>
          <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2 font-mono tracking-tight">{value}</p>
          <p className="text-xs text-neutral-500 dark:text-zinc-500 mt-1">{sub}</p>
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
          <Icon className={`h-5 w-5 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, linkHref, linkLabel, children }: {
  title: string;
  linkHref: string;
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0b0c14]/60 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-white/5">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{title}</h3>
        <Link href={linkHref} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors">
          {linkLabel} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-white/5">
        {children}
      </div>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="px-5 py-8 text-center text-xs text-neutral-400 dark:text-zinc-500">{message}</div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  WON:        "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  LOST:       "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
  ACTIVE:     "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  COMPLETED:  "bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-zinc-400",
  DELIVERED:  "bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400",
  PLANNING:   "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
  IN_PROGRESS:"bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  DEFAULT:    "bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-zinc-400",
};

function statusClass(status: string) {
  return STATUS_COLORS[status] ?? STATUS_COLORS.DEFAULT;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalRevenue: 0,
    collectedRevenue: 0,
    pendingDues: 0,
    leadsCount: 0,
    conversionRate: 0,
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [projRes, lbRes, finRes, crmRes] = await Promise.all([
          getProjectsListAction(),
          getLeaderboardAction(),
          getFinanceOverviewAction(),
          getLeadsAction(),
        ]);

        let totalProj = 0, activeProj = 0, projsList: any[] = [];
        if (projRes.success && projRes.projects) {
          totalProj = projRes.projects.length;
          activeProj = projRes.projects.filter((p: any) => !["COMPLETED", "DELIVERED"].includes(p.status)).length;
          projsList = projRes.projects.slice(0, 6);
        }

        let leadersList: any[] = [];
        if (lbRes.success && lbRes.leaderboard) leadersList = lbRes.leaderboard.slice(0, 5);

        let financeData = { totalRevenue: 0, collectedRevenue: 0, pendingDues: 0 };
        if (finRes.success && finRes.metrics) financeData = finRes.metrics;

        let totalLeads = 0, convRate = 0, leadsList: any[] = [];
        if (crmRes.success && crmRes.leads) {
          totalLeads = crmRes.leads.length;
          const won = crmRes.leads.filter((l: any) => l.status === "WON").length;
          convRate = totalLeads > 0 ? Math.round((won / totalLeads) * 1000) / 10 : 0;
          leadsList = crmRes.leads.slice(0, 6);
        }

        setMetrics({ totalProjects: totalProj, activeProjects: activeProj, ...financeData, leadsCount: totalLeads, conversionRate: convRate });
        setLeaderboard(leadersList);
        setProjects(projsList);
        setLeads(leadsList);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        <p className="text-xs text-neutral-400 dark:text-zinc-500 font-medium">Loading dashboard metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            AetherOS Dashboard
          </h1>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">
            Unified operations — leads, sprints, finance, and team performance.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/crm">
            <button className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer">
              CRM Pipeline <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </Link>
          <a href="/work" target="_blank" rel="noopener noreferrer">
            <button className="h-9 px-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 text-neutral-700 dark:text-zinc-300 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer">
              View Portfolio
            </button>
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Collected Revenue"
          value={`$${metrics.collectedRevenue.toLocaleString()}`}
          sub={`Pending: $${metrics.pendingDues.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
        />
        <KpiCard
          label="Active Projects"
          value={String(metrics.activeProjects)}
          sub={`${metrics.totalProjects} total registered`}
          icon={Briefcase}
          color="purple"
        />
        <KpiCard
          label="Leads Pipeline"
          value={String(metrics.leadsCount)}
          sub="Across all sales reps"
          icon={Target}
          color="amber"
        />
        <KpiCard
          label="Lead Conversion"
          value={`${metrics.conversionRate}%`}
          sub="Target: 35% SLA"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Projects + Leads */}
        <div className="lg:col-span-2 space-y-5">

          {/* Projects */}
          <SectionCard title="Active Project Sprints" linkHref="/admin/projects" linkLabel="All Projects">
            {projects.length === 0 ? (
              <EmptyRow message="No active project sprints." />
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-white/2 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{proj.title}</p>
                    <p className="text-xs text-neutral-400 dark:text-zinc-500 truncate mt-0.5">
                      {proj.projectType} · {proj.client?.companyName || "Direct"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${statusClass(proj.status)}`}>
                      {proj.status}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono hidden sm:block">
                      {proj.healthScore}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </SectionCard>

          {/* Leads */}
          <SectionCard title="Recent Leads" linkHref="/admin/crm" linkLabel="CRM Pipeline">
            {leads.length === 0 ? (
              <EmptyRow message="No leads in the pipeline." />
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-neutral-50 dark:hover:bg-white/2 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">{lead.clientName}</p>
                    <p className="text-xs text-neutral-400 dark:text-zinc-500 truncate mt-0.5">
                      {lead.companyName || "Direct"} · {lead.source}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${statusClass(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono hidden sm:block">
                      ${lead.estimatedBudget.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </SectionCard>
        </div>

        {/* Right: Leaderboard + Attendance */}
        <div className="space-y-5">

          {/* Leaderboard */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0b0c14]/60 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-neutral-100 dark:border-white/5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Top Performers</h3>
            </div>
            <div className="divide-y divide-neutral-100 dark:divide-white/5">
              {leaderboard.length === 0 ? (
                <EmptyRow message="No performance data yet." />
              ) : (
                leaderboard.map((emp, i) => (
                  <div key={emp.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0 ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                      : i === 1 ? "bg-neutral-100 dark:bg-zinc-700/40 text-neutral-600 dark:text-zinc-300"
                      : "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">{emp.name}</p>
                      <p className="text-[10px] text-neutral-400 dark:text-zinc-500 truncate">{emp.department}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-neutral-700 dark:text-zinc-300">{emp.score} pts</p>
                      <p className="text-[10px] text-neutral-400 dark:text-zinc-500">{emp.completedTasks} tasks</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attendance widget */}
          <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Attendance & Standups</h4>
            </div>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed mb-4">
              Employees can log daily attendance, submit standup reports, and request leaves from the Chat console.
            </p>
            <Link href="/admin/chat">
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer">
                Open Chat & Standups <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {/* Revenue summary */}
          <div className="rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#0b0c14]/60 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Revenue Summary</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: "Total Invoiced", value: `$${metrics.totalRevenue.toLocaleString()}`, color: "text-neutral-900 dark:text-white" },
                { label: "Collected", value: `$${metrics.collectedRevenue.toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Pending Dues", value: `$${metrics.pendingDues.toLocaleString()}`, color: "text-amber-600 dark:text-amber-400" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500 dark:text-zinc-400">{row.label}</span>
                  <span className={`text-xs font-bold font-mono ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <Link href="/admin/finance" className="mt-4 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
              Finance Console <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
