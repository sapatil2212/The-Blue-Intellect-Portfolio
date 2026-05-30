"use client";

import React, { useEffect, useState } from "react";
import { 
  getProjectsAction, 
  getCategoriesAction, 
  toggleProjectPublishAction, 
  toggleProjectFeaturedAction, 
  deleteProjectAction,
  createProjectAction,
  updateProjectAction,
  createCategoryAction,
  deleteCategoryAction
} from "@/actions/projects";
import { ProjectType } from "@/store/usePortfolioStore";
import { 
  Folder, Star, Trash2, Pencil, Plus, X, Save,
  Search, Loader2, ArrowLeft, Layers, Link as LinkIcon, Film, AlertCircle, Sparkles
} from "lucide-react";
import Link from "next/link";
import UploadDropzone from "@/components/ui/UploadDropzone";

export default function AdminPortfolioPage() {
  // Portfolio Showcase state
  const [portfolioProjects, setPortfolioProjects] = useState<ProjectType[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formProjectType, setFormProjectType] = useState("WEBSITE");
  const [formThumbnail, setFormThumbnail] = useState("");
  const [formWebsiteLink, setFormWebsiteLink] = useState("");
  const [formSourceCodeLink, setFormSourceCodeLink] = useState("");
  const [formPricing, setFormPricing] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublished, setFormPublished] = useState(true);

  // Category management modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySuccess, setCategorySuccess] = useState("");
  const [categoryDeletingId, setCategoryDeletingId] = useState<string | null>(null);
  const [categoryAdding, setCategoryAdding] = useState(false);

  // Case Study extra fields
  const [formClient, setFormClient] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formChallenge, setFormChallenge] = useState("");
  const [formSolution, setFormSolution] = useState("");
  const [formStats, setFormStats] = useState<{ label: string; value: string }[]>([
    { label: "", value: "" },
    { label: "", value: "" }
  ]);

  // Tags & Media form helpers
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formTagInput, setFormTagInput] = useState("");
  const [formMedia, setFormMedia] = useState<{ url: string; type: string }[]>([]);
  const [formMediaUrlInput, setFormMediaUrlInput] = useState("");
  const [formMediaTypeInput, setFormMediaTypeInput] = useState("IMAGE");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Portfolio projects
      const projData = await getProjectsAction();
      setPortfolioProjects(projData);
      
      // 2. Fetch categories
      const catData = await getCategoriesAction();
      setCategories(catData);
    } catch (error) {
      console.error("Failed to load catalog data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Portfolio Page Handlers
  const handleTogglePublish = async (id: string) => {
    setActionLoading(`publish-${id}`);
    const res = await toggleProjectPublishAction(id);
    if (res.success) {
      setPortfolioProjects(portfolioProjects.map(p => p.id === id ? { ...p, published: res.published! } : p));
    }
    setActionLoading(null);
  };

  const handleToggleFeatured = async (id: string) => {
    setActionLoading(`featured-${id}`);
    const res = await toggleProjectFeaturedAction(id);
    if (res.success) {
      setPortfolioProjects(portfolioProjects.map(p => p.id === id ? { ...p, featured: res.featured! } : p));
    }
    setActionLoading(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this portfolio project showcase?")) return;
    
    setActionLoading(`delete-${id}`);
    const res = await deleteProjectAction(id);
    if (res.success) {
      setPortfolioProjects(portfolioProjects.filter(p => p.id !== id));
    }
    setActionLoading(null);
  };

  // Form Modal triggers
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setFormTitle("");
    setFormDescription("");
    setFormCategoryId(categories[0]?.id || "");
    setFormProjectType("WEBSITE");
    setFormThumbnail("");
    setFormWebsiteLink("");
    setFormSourceCodeLink("");
    setFormPricing("");
    setFormFeatured(false);
    setFormPublished(true);
    setFormTags([]);
    setFormTagInput("");
    setFormMedia([]);
    setFormMediaUrlInput("");
    setFormMediaTypeInput("IMAGE");
    setFormError("");
    setFormSuccess("");
    
    // Reset case study states
    setFormClient("");
    setFormBadge("");
    setFormChallenge("");
    setFormSolution("");
    setFormStats([
      { label: "", value: "" },
      { label: "", value: "" }
    ]);

    setIsFormOpen(true);
  };

  const handleOpenEditModal = (p: ProjectType) => {
    setEditingProject(p);
    setFormTitle(p.title);
    setFormCategoryId(p.categoryId);
    setFormProjectType(p.projectType);
    setFormThumbnail(p.thumbnail);
    setFormWebsiteLink(p.websiteLink || "");
    setFormSourceCodeLink(p.sourceCodeLink || "");
    setFormPricing(p.pricing || "");
    setFormFeatured(p.featured);
    setFormPublished(p.published);
    setFormTags(p.tags.map(t => t.name));
    setFormTagInput("");
    setFormMedia(p.media.map(m => ({ url: m.url, type: m.type })));
    setFormMediaUrlInput("");
    setFormMediaTypeInput("IMAGE");
    setFormError("");
    setFormSuccess("");

    // Check if project type is CASE_STUDY and description is valid JSON
    let isJson = false;
    let parsedDesc: any = null;
    if (p.projectType === "CASE_STUDY" && p.description.trim().startsWith("{")) {
      try {
        parsedDesc = JSON.parse(p.description);
        isJson = true;
      } catch (e) {
        // Not valid JSON
      }
    }

    if (isJson && parsedDesc) {
      setFormDescription(parsedDesc.rawDescription || "");
      setFormClient(parsedDesc.client || "");
      setFormBadge(parsedDesc.badge || "");
      setFormChallenge(parsedDesc.challenge || "");
      setFormSolution(parsedDesc.solution || "");
      setFormStats(parsedDesc.stats || [
        { label: "", value: "" },
        { label: "", value: "" }
      ]);
    } else {
      setFormDescription(p.description);
      setFormClient("");
      setFormBadge("");
      setFormChallenge("");
      setFormSolution("");
      setFormStats([
        { label: "", value: "" },
        { label: "", value: "" }
      ]);
    }

    setIsFormOpen(true);
  };

  // Category management functions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategoryAdding(true);
    setCategoryError("");
    setCategorySuccess("");
    try {
      const res = await createCategoryAction(newCategoryName.trim());
      if (res.success && res.category) {
        setCategories([...categories, res.category]);
        setNewCategoryName("");
        setCategorySuccess("Category created successfully!");
      } else {
        setCategoryError(res.error || "Failed to create category.");
      }
    } catch (err: any) {
      setCategoryError(err.message || "An error occurred.");
    } finally {
      setCategoryAdding(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Projects in this category might become orphaned.")) return;
    setCategoryDeletingId(id);
    setCategoryError("");
    setCategorySuccess("");
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories(categories.filter(c => c.id !== id));
        setCategorySuccess("Category deleted successfully!");
      } else {
        setCategoryError(res.error || "Failed to delete category. Ensure no projects are linked to it.");
      }
    } catch (err: any) {
      setCategoryError(err.message || "An error occurred.");
    } finally {
      setCategoryDeletingId(null);
    }
  };

  // Tag helper lists
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = formTagInput.trim().replace(/,/g, "");
      if (cleaned && !formTags.includes(cleaned)) {
        setFormTags([...formTags, cleaned]);
        setFormTagInput("");
      }
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormTags(formTags.filter((_, idx) => idx !== index));
  };

  // Media helper lists
  const handleAddMedia = () => {
    if (!formMediaUrlInput.trim()) return;
    try {
      new URL(formMediaUrlInput); // check URL structure
      setFormMedia([...formMedia, { url: formMediaUrlInput.trim(), type: formMediaTypeInput }]);
      setFormMediaUrlInput("");
    } catch {
      alert("Please specify a valid media link structure.");
    }
  };

  const handleRemoveMedia = (index: number) => {
    setFormMedia(formMedia.filter((_, idx) => idx !== index));
  };

  // Submit Handler (Creation & Editing)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Custom validations for Case Study
    if (formProjectType === "CASE_STUDY") {
      if (!formChallenge.trim() || !formSolution.trim()) {
        setFormError("For Case Studies, Challenge and Strategy/Solution are required.");
        return;
      }
    }

    if (!formTitle.trim() || !formDescription.trim() || !formCategoryId || !formThumbnail.trim()) {
      setFormError("Please fill out all required attributes (Title, Description, Category, and Thumbnail URL).");
      return;
    }

    setFormSubmitting(true);

    let finalDescription = formDescription.trim();
    if (formProjectType === "CASE_STUDY") {
      const caseStudyPayload = {
        rawDescription: formDescription.trim(),
        client: formClient.trim(),
        badge: formBadge.trim(),
        challenge: formChallenge.trim(),
        solution: formSolution.trim(),
        stats: formStats.filter(s => s.label.trim() && s.value.trim())
      };
      finalDescription = JSON.stringify(caseStudyPayload);
    }

    const payload = {
      title: formTitle.trim(),
      description: finalDescription,
      categoryId: formCategoryId,
      projectType: formProjectType,
      thumbnail: formThumbnail.trim(),
      websiteLink: formWebsiteLink.trim() || undefined,
      sourceCodeLink: formSourceCodeLink.trim() || undefined,
      pricing: formPricing.trim() || undefined,
      featured: formFeatured,
      published: formPublished,
      tags: formTags,
      media: formMedia
    };

    try {
      let res;
      if (editingProject) {
        res = await updateProjectAction(editingProject.id, payload);
      } else {
        res = await createProjectAction(payload);
      }

      if (res.success) {
        setFormSuccess(editingProject ? "Showcase catalog project successfully updated!" : "New showcase entry successfully added!");
        setTimeout(() => {
          setIsFormOpen(false);
          fetchData();
        }, 1200);
      } else {
        setFormError(res.error || "Operation failed. Verify database parameters.");
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred during database write.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const filteredPortfolioProjects = portfolioProjects.filter((proj) => {
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
    { value: "CREATIVE_ASSET", label: "Creative Assets" }
  ];

  if (loading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold tracking-wider mt-4 animate-pulse">Compiling Agency Showcase Archives...</p>
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
          <h1 className="text-3xl font-black tracking-tight font-display bg-gradient-to-r from-foreground via-zinc-650 to-zinc-450 bg-clip-text text-transparent">
            Portfolio Showcase Catalog
          </h1>
          <p className="text-xs text-zinc-450 mt-1">Manage public showcase visibility, featured spotlights, and catalog categories.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setCategoryError("");
              setCategorySuccess("");
              setIsCategoryModalOpen(true);
            }}
            className="h-10 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-foreground border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <Layers className="h-4 w-4 text-indigo-500" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Showcase Item</span>
          </button>
        </div>
      </div>

      {/* Search and Filters bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            placeholder="Search showcase by keyword..."
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
            <option value="" className="text-foreground bg-card">All Types</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value} className="text-foreground bg-card">
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="border border-neutral-200 dark:border-white/5 rounded-2xl bg-white/50 dark:bg-[#0b0c14]/40 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/5 flex items-center justify-between bg-neutral-50/50 dark:bg-white/2">
          <h2 className="text-xs font-extrabold text-zinc-550 uppercase tracking-widest flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" /> Showcase Catalog Listings
          </h2>
          <span className="text-[10px] font-bold font-mono text-zinc-500 bg-neutral-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-white/5">
            Refined Results: {filteredPortfolioProjects.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          {filteredPortfolioProjects.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100/50 dark:bg-white/2 border-b border-neutral-200 dark:border-white/5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  <th className="py-3 px-6">Showcase Item</th>
                  <th className="py-3 px-6">Category & Type</th>
                  <th className="py-3 px-6 text-center">Featured Spotlight</th>
                  <th className="py-3 px-6 text-center">Live Status</th>
                  <th className="py-3 px-6 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-white/5 text-xxs text-muted-foreground">
                {filteredPortfolioProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-neutral-100/30 dark:hover:bg-white/2 transition-colors">
                    {/* Meta preview */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={proj.thumbnail} 
                          alt="" 
                          className="h-8 w-14 object-cover rounded-lg border border-neutral-200 dark:border-white/10 shrink-0"
                        />
                        <div className="max-w-md overflow-hidden">
                          <span className="text-xs font-bold text-foreground block truncate">{proj.title}</span>
                          <span className="text-[10px] text-muted-foreground truncate mt-0.5 block">{proj.description}</span>
                        </div>
                      </div>
                    </td>

                    {/* category & layout */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-foreground">{proj.category?.name}</span>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-1">
                        {proj.projectType}
                      </p>
                    </td>

                    {/* Featured */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleFeatured(proj.id)}
                        disabled={actionLoading === `featured-${proj.id}`}
                        className="inline-flex items-center justify-center p-1 rounded-lg text-zinc-400 hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoading === `featured-${proj.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        ) : proj.featured ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-bold border border-amber-500/20">
                            SPOTLIGHT
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-zinc-500 text-[9px] font-bold border border-neutral-200 dark:border-white/5">
                            STANDARD
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Published */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleTogglePublish(proj.id)}
                        disabled={actionLoading === `published-${proj.id}`}
                        className="inline-flex items-center justify-center p-1 rounded-lg text-zinc-400 hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {actionLoading === `published-${proj.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        ) : proj.published ? (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                            LIVE PUBLIC
                          </span>
                        ) : (
                          <span className="inline-flex px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-white/5 text-zinc-500 text-[9px] font-bold border border-neutral-200 dark:border-white/5">
                            DRAFT
                          </span>
                        )}
                      </button>
                    </td>

                    {/* edit/delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(proj)}
                          className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-white/5 bg-neutral-100 dark:bg-white/5 hover:bg-indigo-500/15 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/25 transition-all flex items-center justify-center shadow-xs cursor-pointer"
                          title="Edit showcase item"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          disabled={actionLoading === `delete-${proj.id}`}
                          className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-white/5 bg-neutral-100 dark:bg-white/5 hover:bg-rose-500/15 text-zinc-400 hover:text-rose-450 dark:hover:text-rose-400 hover:border-rose-500/25 dark:hover:border-rose-500/25 transition-all flex items-center justify-center shadow-xs disabled:opacity-50 cursor-pointer"
                          title="Delete showcase item"
                        >
                          {actionLoading === `delete-${proj.id}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 px-6">
              <Folder className="h-8 w-8 text-zinc-450 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No showcase catalog listings found</p>
              <p className="text-xs text-zinc-500 mt-1">Add items via portfolio creators to catalog them here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Full CRUD Form Dialog Modal Overlay */}
      {isFormOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-scaleUp text-foreground my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/15 flex items-center justify-between bg-neutral-50 dark:bg-white/2">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-blue-500" />
                  {editingProject ? "Edit Showcase Item" : "Create Showcase Item"}
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Define metadata tags, project links, and preview media assets.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
              {formError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4 flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5" />
                  <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold">{formError}</p>
                </div>
              )}
              {formSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 flex items-start gap-2.5">
                  <Star className="h-4 w-4 text-emerald-500 mt-0.5" />
                  <p className="text-xs text-emerald-700 dark:text-emerald-450 font-semibold">{formSuccess}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">Project Title *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. AetherAI Platform Launch"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-8 px-3 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 cursor-pointer text-foreground bg-background"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="text-foreground bg-card">{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">Project Type *</label>
                  <select
                    value={formProjectType}
                    onChange={(e) => setFormProjectType(e.target.value)}
                    className="w-full h-8 px-3 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 cursor-pointer text-foreground bg-background"
                    required
                  >
                    {projectTypes.map((t) => (
                      <option key={t.value} value={t.value} className="text-foreground bg-card">{t.label}</option>
                    ))}
                  </select>
                </div>

                {/* Pricing info */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">Pricing Info (Optional)</label>
                  <input
                    type="text"
                    value={formPricing}
                    onChange={(e) => setFormPricing(e.target.value)}
                    placeholder="e.g. $4,500 / Project"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>

                {/* Thumbnail Image URL */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-foreground block">Thumbnail Image URL *</label>
                  <input
                    type="text"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                    required
                  />
                  <UploadDropzone 
                    onUploadSuccess={(url) => setFormThumbnail(url)} 
                    label="Drag & drop project thumbnail here, or click to upload local asset" 
                    accept="image/*"
                    className="mt-1.5"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-foreground block">Description *</label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Explain project details, features, outcomes..."
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                    required
                  />
                </div>

                {formProjectType === "CASE_STUDY" && (
                  <div className="space-y-4 md:col-span-2 border border-blue-100 dark:border-blue-900/35 rounded-xl p-4 bg-blue-50/20 dark:bg-blue-950/5 animate-slideDown">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 animate-pulse" /> Case Study Content Details
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Client Name */}
                      <div className="space-y-1">
                        <label className="text-xxs font-bold text-foreground block">Client Name (Optional)</label>
                        <input
                          type="text"
                          value={formClient}
                          onChange={(e) => setFormClient(e.target.value)}
                          placeholder="e.g. NovaMind AI"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none text-foreground bg-background"
                        />
                      </div>
                      
                      {/* Badge / Focus Service */}
                      <div className="space-y-1">
                        <label className="text-xxs font-bold text-foreground block">Badge / Focus Service (Optional)</label>
                        <input
                          type="text"
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="e.g. AI Web Design & Setup"
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none text-foreground bg-background"
                        />
                      </div>

                      {/* Challenge */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xxs font-bold text-foreground block">The Challenge *</label>
                        <textarea
                          rows={2}
                          value={formChallenge}
                          onChange={(e) => setFormChallenge(e.target.value)}
                          placeholder="Explain what problem the client was facing..."
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none text-foreground bg-background"
                        />
                      </div>

                      {/* Strategy / Solution */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xxs font-bold text-foreground block">The Strategy & Solution *</label>
                        <textarea
                          rows={2}
                          value={formSolution}
                          onChange={(e) => setFormSolution(e.target.value)}
                          placeholder="Detail how your agency solved the problem..."
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none text-foreground bg-background"
                        />
                      </div>

                      {/* Custom Stats list */}
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-neutral-200 dark:border-white/5">
                        <div className="flex items-center justify-between">
                          <label className="text-xxs font-bold text-foreground block">Key Outcomes / Stats (e.g. Speed, Conversions)</label>
                          <button
                            type="button"
                            onClick={() => setFormStats([...formStats, { label: "", value: "" }])}
                            className="text-[10px] text-blue-500 hover:text-blue-600 font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Outcome Stat
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {formStats.map((stat, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-lg border border-neutral-200 dark:border-white/10 bg-background relative group">
                              <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => {
                                  const updated = [...formStats];
                                  updated[idx].label = e.target.value;
                                  setFormStats(updated);
                                }}
                                placeholder="Label (e.g. Sales Increase)"
                                className="flex-1 px-2 py-1 border border-neutral-250 dark:border-white/5 rounded text-xxs text-foreground bg-transparent"
                              />
                              <input
                                type="text"
                                value={stat.value}
                                onChange={(e) => {
                                  const updated = [...formStats];
                                  updated[idx].value = e.target.value;
                                  setFormStats(updated);
                                }}
                                placeholder="Value (e.g. +148%)"
                                className="w-28 px-2 py-1 border border-neutral-250 dark:border-white/5 rounded text-xxs text-foreground bg-transparent font-bold"
                              />
                              {formStats.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setFormStats(formStats.filter((_, sIdx) => sIdx !== idx))}
                                  className="text-rose-500 hover:text-rose-600 transition shrink-0 cursor-pointer font-bold text-xxs px-1"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website Link */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block flex items-center gap-1"><LinkIcon className="h-3 w-3" /> Live Website URL</label>
                  <input
                    type="text"
                    value={formWebsiteLink}
                    onChange={(e) => setFormWebsiteLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>

                {/* Source Code Link */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block flex items-center gap-1"><LinkIcon className="h-3 w-3" /> Source Code URL</label>
                  <input
                    type="text"
                    value={formSourceCodeLink}
                    onChange={(e) => setFormSourceCodeLink(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>
              </div>

              {/* Tags Section */}
              <div className="space-y-2 border-t border-neutral-200 dark:border-white/5 pt-4">
                <label className="text-xs font-bold text-foreground block">Showcase Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formTagInput}
                    onChange={(e) => setFormTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type tag and press Enter or Comma"
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formTags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 text-xxs font-semibold"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(idx)} 
                        className="hover:text-red-500 shrink-0 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-3 border-t border-neutral-200 dark:border-white/5 pt-4">
                <label className="text-xs font-bold text-foreground block">Project Media Attachments (Images, Reels, Videos)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={formMediaUrlInput}
                    onChange={(e) => setFormMediaUrlInput(e.target.value)}
                    placeholder="Paste Media Link (e.g. Unsplash URL, Reels embed link)"
                    className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 text-foreground"
                  />
                  <select
                    value={formMediaTypeInput}
                    onChange={(e) => setFormMediaTypeInput(e.target.value)}
                    className="h-8 px-2 rounded-lg border border-neutral-200 dark:border-white/10 text-xs focus:outline-none cursor-pointer text-foreground bg-background sm:w-32"
                  >
                    <option value="IMAGE" className="text-foreground">IMAGE</option>
                    <option value="VIDEO" className="text-foreground">VIDEO</option>
                    <option value="YOUTUBE" className="text-foreground">YOUTUBE</option>
                    <option value="INSTAGRAM" className="text-foreground">INSTAGRAM</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddMedia}
                    className="px-4 h-8 bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shrink-0 text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                <div className="mt-1.5 text-zinc-550 border border-dashed border-neutral-200 dark:border-white/5 rounded-xl p-4 bg-neutral-50/30 dark:bg-white/1">
                  <p className="text-[10px] font-bold mb-1.5 uppercase tracking-wider text-zinc-400">Or drop a file directly to auto-upload as project media:</p>
                  <UploadDropzone
                    onUploadSuccess={(url) => {
                      const detectedType = url.match(/\.(mp4|webm|ogg|mov)$/i) ? "VIDEO" : "IMAGE";
                      setFormMedia([...formMedia, { url, type: detectedType }]);
                    }}
                    label="Drag & drop asset files here to upload directly to project media list"
                    accept="image/*,video/*"
                  />
                </div>

                {formMedia.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {formMedia.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-white/2 gap-2 text-xxs">
                        <div className="truncate flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[8px] font-bold font-mono">{m.type}</span>
                          <span className="truncate text-zinc-500">{m.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          className="text-rose-500 hover:text-rose-700 transition shrink-0 cursor-pointer font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status and Visibility Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-neutral-200 dark:border-white/5 pt-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-white/2">
                  <div>
                    <label className="text-xs font-bold block cursor-pointer">Spotlight Featured</label>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Showcase on the homepage hero grids.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4.5 w-4.5 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-white/2">
                  <div>
                    <label className="text-xs font-bold block cursor-pointer">Live Public</label>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Instantly viewable inside catalog pages.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="h-4.5 w-4.5 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="border-t border-neutral-200 dark:border-white/10 pt-4 flex items-center justify-end gap-3 bg-neutral-50 dark:bg-white/2 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-semibold text-zinc-550 hover:bg-neutral-100 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/70 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer disabled:cursor-not-allowed"
                >
                  {formSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Showcase Item</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Category Management CRUD Modal */}
      {isCategoryModalOpen && (
        <div data-lenis-prevent className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp text-foreground my-8">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-white/15 flex items-center justify-between bg-neutral-50 dark:bg-white/2">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-indigo-500" />
                  Manage Showcase Categories
                </h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Add or remove system categories for the showcase catalog.</p>
              </div>
              <button 
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/5 transition cursor-pointer text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {categoryError && (
                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xxs text-rose-700 dark:text-rose-450 font-semibold">{categoryError}</p>
                </div>
              )}
              {categorySuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 flex items-start gap-2">
                  <Star className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xxs text-emerald-700 dark:text-emerald-450 font-semibold">{categorySuccess}</p>
                </div>
              )}

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Mobile Apps"
                  className="flex-1 px-3 py-2 border border-neutral-200 dark:border-white/10 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-foreground bg-background"
                  required
                />
                <button
                  type="submit"
                  disabled={categoryAdding}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/70 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 disabled:cursor-not-allowed"
                >
                  {categoryAdding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>Add Category</span>
                </button>
              </form>

              {/* Categories list */}
              <div className="border border-neutral-200 dark:border-white/5 rounded-xl overflow-hidden max-h-60 overflow-y-auto bg-neutral-50/50 dark:bg-white/1">
                {categories.length > 0 ? (
                  <div className="divide-y divide-neutral-200 dark:divide-white/5 text-xxs">
                    {categories.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 hover:bg-neutral-100/50 dark:hover:bg-white/2 transition-colors">
                        <div>
                          <p className="font-bold text-foreground">{c.name}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">Slug: {c.slug}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(c.id)}
                          disabled={categoryDeletingId === c.id}
                          className="p-1.5 rounded-lg hover:bg-rose-500/15 text-zinc-400 hover:text-rose-500 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Delete category"
                        >
                          {categoryDeletingId === c.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-zinc-500">No categories found</div>
                )}
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-white/10 pt-4 flex items-center justify-end p-6 bg-neutral-50 dark:bg-white/2">
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-white/10 rounded-xl text-xs font-semibold text-zinc-550 hover:bg-neutral-100 dark:hover:bg-white/5 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
