"use client";

import React, { useEffect, useState } from "react";
import { 
  getProjectsListAction, 
  createProjectItemAction, 
  updateProjectStageAction 
} from "@/actions/projectManager";
import { getCategoriesAction } from "@/actions/projects";
import { getEmployeesAction } from "@/actions/employee";
import { getUsersAction } from "@/actions/auth";
import { 
  Plus, Search, Loader2, ArrowLeft,
  Activity, Calendar, AlertCircle, CheckCircle, FolderKanban
} from "lucide-react";
import Link from "next/link";

export default function AdminProjectsPage() {
  // Sprints state
  const [sprintProjects, setSprintProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  // Project creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjCatId, setNewProjCatId] = useState("");
  const [newProjType, setNewProjType] = useState("WEBSITE");
  const [newProjClientId, setNewProjClientId] = useState("");
  const [newProjStartDate, setNewProjStartDate] = useState("");
  const [newProjEndDate, setNewProjEndDate] = useState("");
  const [newProjTeamIds, setNewProjTeamIds] = useState<string[]>([]);
  const [creationError, setCreationError] = useState("");
  const [creationSuccess, setCreationSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Sprints (Operational Projects)
      const resSprints = await getProjectsListAction();
      if (resSprints.success && resSprints.projects) {
        setSprintProjects(resSprints.projects);
      }
      
      // 2. Fetch categories
      const catData = await getCategoriesAction();
      setCategories(catData);

      // 3. Fetch Employees
      const resEmp = await getEmployeesAction();
      if (resEmp.success && resEmp.employees) {
        setEmployees(resEmp.employees);
      }

      // 4. Fetch Clients (from Users directory)
      const resUsers = await getUsersAction();
      if (resUsers.success && resUsers.users) {
        const clientUsers = resUsers.users.filter((u: any) => u.role === "Client" && u.client);
        setClients(clientUsers.map((u: any) => ({
          id: u.client.id,
          name: u.name || u.email,
          companyName: u.client.companyName || "Direct Client",
          email: u.email
        })));
      }
    } catch (error) {
      console.error("Failed to load sprints data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal Handlers
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreationError("");
    setCreationSuccess("");

    if (!newProjTitle.trim() || !newProjDesc.trim() || !newProjCatId) {
      setCreationError("Please fill out all required fields.");
      return;
    }

    setActionLoading("create-sprint");
    try {
      const res = await createProjectItemAction({
        title: newProjTitle.trim(),
        description: newProjDesc.trim(),
        categoryId: newProjCatId,
        projectType: newProjType,
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
        clientId: newProjClientId || undefined,
        startDate: newProjStartDate || undefined,
        endDate: newProjEndDate || undefined,
        teamIds: newProjTeamIds.length > 0 ? newProjTeamIds : undefined
      });

      if (res.success) {
        setCreationSuccess("Operational sprint workspace successfully initialized!");
        // Reset fields
        setNewProjTitle("");
        setNewProjDesc("");
        setNewProjClientId("");
        setNewProjStartDate("");
        setNewProjEndDate("");
        setNewProjTeamIds([]);
        
        // Refresh sprint projects
        const resSprints = await getProjectsListAction();
        if (resSprints.success && resSprints.projects) {
          setSprintProjects(resSprints.projects);
        }
        
        setTimeout(() => {
          setIsModalOpen(false);
          setCreationSuccess("");
        }, 1500);
      } else {
        setCreationError(res.error || "Failed to create project sprint.");
      }
    } catch (err: any) {
      setCreationError(err.message || "An unexpected error occurred.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateStage = async (projectId: string, newStatus: string) => {
    setActionLoading(`stage-${projectId}`);
    const res = await updateProjectStageAction(projectId, newStatus);
    if (res.success) {
      setSprintProjects(sprintProjects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    }
    setActionLoading(null);
  };

  const handleTeamToggle = (empId: string) => {
    if (newProjTeamIds.includes(empId)) {
      setNewProjTeamIds(newProjTeamIds.filter(id => id !== empId));
    } else {
      setNewProjTeamIds([...newProjTeamIds, empId]);
    }
  };

  // Filters
  const filteredSprintProjects = sprintProjects.filter((proj) => {
    const matchesSearch = proj.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? proj.categoryId === selectedCategory : true;
    const matchesType = selectedType ? proj.projectType === selectedType : true;
    return matchesSearch && matchesCategory && matchesType;
  });

  const projectTypes = [
    { value: "WEBSITE", label: "Websites" },
    { value: "LOGO", label: "Logos" },
    { value: "SOCIAL", label: "Social Media Posts" },
    { value: "AI_ART", label: "AI Generated Art" },
    { value: "UGC", label: "UGC Videos" },
    { value: "REELS", label: "Instagram Reels" },
    { value: "BRANDING", label: "Branding Systems" },
    { value: "CASE_STUDY", label: "Case Studies" },
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold tracking-wider mt-4 animate-pulse">Compiling Agency Sprints Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Return button */}
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-450 hover:text-foreground transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Control Dashboard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-4 border-b border-neutral-200 dark:border-white/5">
        <div>
          <h1 className="text-3xl font-black tracking-tight font-display bg-gradient-to-r from-foreground via-zinc-650 to-zinc-455 bg-clip-text text-transparent">
            Active Sprints & Projects
          </h1>
          <p className="text-xs text-zinc-450 mt-1">Manage operational campaigns, timelines, checklist tasks, and team workspace assignments.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Initialize Sprint Workspace</span>
          </button>
        </div>
      </div>

      {/* Search and Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            placeholder="Search active sprints by client, company or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-[#0e1017]/80 backdrop-blur-md text-xs placeholder:text-zinc-550 focus:outline-none focus:border-blue-500 transition-all text-foreground"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-[#0e1017]/80 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-semibold text-foreground"
          >
            <option value="" className="text-foreground bg-card">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-foreground bg-card">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Layout Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-[#0e1017]/80 text-xs focus:outline-none focus:border-blue-500 cursor-pointer font-semibold text-foreground"
          >
            <option value="" className="text-foreground bg-card">All Layout Types</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value} className="text-foreground bg-card">
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="border border-neutral-200 dark:border-white/5 rounded-2xl bg-white/50 dark:bg-[#0b0c14]/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-white/2">
          <h2 className="text-xs font-extrabold text-zinc-550 uppercase tracking-widest flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" /> Sprint Workspace Matrix
          </h2>
          <span className="text-[10px] font-bold font-mono text-zinc-550 bg-neutral-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/5">
            Refined Results: {filteredSprintProjects.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          {filteredSprintProjects.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100/50 dark:bg-white/2 border-b border-neutral-200 dark:border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  <th className="py-3 px-6">Sprint Details</th>
                  <th className="py-3 px-6">Client Link</th>
                  <th className="py-3 px-6 text-center">Health</th>
                  <th className="py-3 px-6">Assigned Team</th>
                  <th className="py-3 px-6">Sprints Stage</th>
                  <th className="py-3 px-6 text-center">Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-white/5 text-xxs text-muted-foreground">
                {filteredSprintProjects.map((proj) => {
                  // Calculate checklist completion
                  const totalTasks = proj.tasks.length;
                  const completedTasks = proj.tasks.filter((t: any) => t.status === "COMPLETED").length;
                  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                  let healthColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-400/10 dark:border-emerald-400/20";
                  if (proj.healthScore < 50) healthColor = "text-rose-500 bg-rose-500/10 border-rose-500/20 dark:text-rose-400 dark:bg-rose-400/10 dark:border-rose-400/20";
                  else if (proj.healthScore < 80) healthColor = "text-amber-500 bg-amber-500/10 border-amber-500/20 dark:text-amber-400 dark:bg-amber-400/10 dark:border-amber-400/20";

                  return (
                    <tr key={proj.id} className="hover:bg-neutral-100/30 dark:hover:bg-white/2 transition-colors">
                      {/* Title & category */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="text-xs font-bold text-foreground hover:text-blue-500 dark:hover:text-blue-400 transition-colors block">
                            {proj.title}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block uppercase">
                            {proj.category.name} • {proj.projectType}
                          </span>
                        </div>
                      </td>

                      {/* Client details */}
                      <td className="py-4 px-6">
                        {proj.client ? (
                          <div>
                            <p className="font-bold text-foreground">{proj.client.companyName}</p>
                            <p className="text-[9px] text-zinc-500 font-mono">{proj.client.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-zinc-500 font-semibold italic">Unlinked Client</span>
                        )}
                      </td>

                      {/* Health Score */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold ${healthColor}`}>
                          {proj.healthScore}% HP
                        </span>
                      </td>

                      {/* Team members */}
                      <td className="py-4 px-6">
                        <div className="flex -space-x-2 overflow-hidden items-center">
                          {proj.team && proj.team.length > 0 ? (
                            proj.team.map((emp: any) => (
                              <div 
                                key={emp.id} 
                                className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-zinc-800 border border-white dark:border-zinc-950 flex items-center justify-center text-[8px] font-black text-blue-600 dark:text-blue-400"
                                title={`${emp.user.name} (${emp.department})`}
                              >
                                {emp.user.name ? emp.user.name.split(" ").map((n: any) => n[0]).join("").slice(0,2) : "EM"}
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-500 font-semibold italic">Unassigned</span>
                          )}
                        </div>
                      </td>

                      {/* Status dropdown controller */}
                      <td className="py-4 px-6">
                        <select
                          value={proj.status}
                          onChange={(e) => handleUpdateStage(proj.id, e.target.value)}
                          disabled={actionLoading === `stage-${proj.id}`}
                          className="bg-neutral-100 dark:bg-zinc-900 border border-neutral-200 dark:border-white/10 text-[9px] font-bold text-foreground px-2 py-1 rounded focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="PLANNING">PLANNING</option>
                          <option value="DESIGN">DESIGN</option>
                          <option value="DEVELOPMENT">DEVELOPMENT</option>
                          <option value="REVIEW">REVIEW</option>
                          <option value="REVISIONS">REVISIONS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>

                      {/* Dates & checklist progress */}
                      <td className="py-4 px-6 text-center">
                        <p className="text-[10px] font-bold text-foreground">
                          {proj.endDate ? new Date(proj.endDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "TBD"}
                        </p>
                        <span className="text-[9px] text-zinc-500 font-mono block mt-1">
                          Checklist: {pct}% ({completedTasks}/{totalTasks})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 px-6">
              <AlertCircle className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No active client sprints mapped</p>
              <p className="text-xs text-zinc-550 mt-1">Initialize a workspace workspace or update client details to map sidetracks.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Initialize Sprint Workspace */}
      {isModalOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-card border border-neutral-200 dark:border-white/10 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-scaleUp">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/5 flex justify-between items-center bg-neutral-50/50 dark:bg-white/2">
              <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-blue-500" /> Initialize Sprint Workspace
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-foreground text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {creationError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-center gap-2 text-rose-500 text-xxs font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  <span>{creationError}</span>
                </div>
              )}

              {creationSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center gap-2 text-emerald-500 text-xxs font-semibold">
                  <CheckCircle className="h-4 w-4" />
                  <span>{creationSuccess}</span>
                </div>
              )}

              {/* Title & Desc */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="e.g. Acme Website Overhaul"
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Layout Type *</label>
                  <select
                    value={newProjType}
                    onChange={(e) => setNewProjType(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  >
                    {projectTypes.map(t => (
                      <option key={t.value} value={t.value} className="text-foreground bg-card">{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Project Description *</label>
                <textarea
                  required
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Summarize the core client deliverables and metrics..."
                  rows={3}
                  className="w-full p-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 resize-none text-foreground"
                />
              </div>

              {/* Category & Client Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Category *</label>
                  <select
                    value={newProjCatId}
                    onChange={(e) => setNewProjCatId(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  >
                    <option value="" className="text-foreground bg-card">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id} className="text-foreground bg-card">{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Associate Client (Optional)</label>
                  <select
                    value={newProjClientId}
                    onChange={(e) => setNewProjClientId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  >
                    <option value="" className="text-foreground bg-card">Select Client Profile</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id} className="text-foreground bg-card">{c.companyName} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProjStartDate}
                    onChange={(e) => setNewProjStartDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newProjEndDate}
                    onChange={(e) => setNewProjEndDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-[#07080d] text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>
              </div>

              {/* Team Multi-select */}
              <div>
                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Assign Team Sprints Members</label>
                <div className="grid grid-cols-2 gap-2 border border-neutral-200 dark:border-white/5 p-3 rounded-lg bg-neutral-50/50 dark:bg-[#07080d] max-h-36 overflow-y-auto">
                  {employees.map(emp => (
                    <label key={emp.id} className="flex items-center gap-2 text-xxs text-foreground cursor-pointer hover:text-blue-500 transition">
                      <input
                        type="checkbox"
                        checked={newProjTeamIds.includes(emp.id)}
                        onChange={() => handleTeamToggle(emp.id)}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-0"
                      />
                      <span>{emp.user.name} ({emp.department})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-neutral-200 dark:border-white/10 text-zinc-550 hover:text-foreground text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "create-sprint"}
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading === "create-sprint" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Initialize Sprint</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
