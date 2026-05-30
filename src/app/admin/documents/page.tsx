"use client";

import React, { useEffect, useState } from "react";
import { 
  getDocumentsAction, 
  uploadDocumentAction, 
  deleteDocumentAction 
} from "@/actions/document";
import { 
  FileText, 
  Folder, 
  Plus, 
  Search, 
  Download, 
  Trash2, 
  Loader2,
  FolderOpen,
  Filter,
  FileArchive,
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState("All");

  // Upload simulation states
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    folder: "General",
    tag: "",
    accessLevel: "PUBLIC",
  });
  const [simulatedFile, setSimulatedFile] = useState<File | null>(null);

  const loadData = async () => {
    setLoading(true);
    const res = await getDocumentsAction();
    if (res.success && res.documents) {
      setDocuments(res.documents);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSimulatedFile(file);
      if (!uploadForm.name) {
        setUploadForm((prev) => ({ ...prev, name: file.name }));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.name) return;
    setUploading(true);

    // Simulate Cloudinary upload delay
    setTimeout(async () => {
      const mockCloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/v123456789/${encodeURIComponent(uploadForm.name)}`;
      
      const fileType = uploadForm.name.split(".").pop()?.toUpperCase() || "PDF";
      const sizeBytes = simulatedFile?.size || Math.floor(Math.random() * 5000000) + 100000;

      const res = await uploadDocumentAction({
        name: uploadForm.name,
        fileUrl: mockCloudinaryUrl,
        fileType: fileType,
        folder: uploadForm.folder,
        tag: uploadForm.tag || undefined,
        accessLevel: uploadForm.accessLevel,
        sizeBytes: sizeBytes,
      });

      setUploading(false);
      if (res.success) {
        alert("File simulated upload to Cloudinary successfully!");
        setShowUploadModal(false);
        setUploadForm({
          name: "",
          folder: "General",
          tag: "",
          accessLevel: "PUBLIC",
        });
        setSimulatedFile(null);
        loadData();
      } else {
        alert(res.error || "Failed to log document");
      }
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this document entry?")) return;
    const res = await deleteDocumentAction(id);
    if (res.success) {
      alert("Document deleted successfully!");
      loadData();
    } else {
      alert(res.error || "Failed to delete document");
    }
  };

  // Extract unique folders
  const folders = ["All", ...Array.from(new Set(documents.map((d) => d.folder)))];

  // Filters
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.tag && doc.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = activeFolder === "All" ? true : doc.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const getFileIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t === "PNG" || t === "JPG" || t === "JPEG" || t === "IMAGE") {
      return <ImageIcon className="h-5 w-5 text-emerald-400" />;
    }
    if (t === "MP4" || t === "MOV" || t === "VIDEO") {
      return <VideoIcon className="h-5 w-5 text-purple-400" />;
    }
    if (t === "ZIP" || t === "RAR" || t === "TAR") {
      return <FileArchive className="h-5 w-5 text-amber-400" />;
    }
    return <FileText className="h-5 w-5 text-blue-400" />;
  };

  if (loading) {
    return (
      <div className="min-h-[500px] w-full flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold mt-4">Cataloging asset vault indexes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Cloudinary Document Explorer</h1>
          <p className="text-xs text-zinc-400">Review assets, download references, and audit private client folders.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="h-10 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition"
          >
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Folder tree */}
        <aside className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-xxs font-bold text-zinc-400 uppercase tracking-wide mb-3">Folders</h3>
            <div className="flex flex-col gap-1.5">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setActiveFolder(folder)}
                  className={`w-full flex items-center justify-between text-left text-xs px-3 py-2 rounded-xl transition ${
                    activeFolder === folder 
                      ? "bg-blue-500/15 text-blue-400 font-bold border-l-4 border-blue-500" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {activeFolder === folder ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                    {folder}
                  </span>
                  <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded font-mono font-bold text-zinc-500">
                    {folder === "All" ? documents.length : documents.filter(d => d.folder === folder).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side: Search and File catalog grid */}
        <section className="lg:col-span-3 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by name, keyword tag..."
              className="w-full h-10 pl-10 pr-4 bg-zinc-900/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Catalog grid */}
          {filteredDocs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center text-zinc-500">
              📁 No assets registered in folder: <strong className="text-zinc-400">{activeFolder}</strong>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 truncate">
                    <div className="h-10 w-10 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-xs truncate max-w-[200px] text-zinc-200" title={doc.name}>
                        {doc.name}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider mt-0.5">
                        {doc.folder} | {doc.accessLevel}
                      </p>
                      <p className="text-[9px] text-zinc-500 font-mono">
                        {doc.fileType.toUpperCase()} | {Math.round(doc.sizeBytes / 1024)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-1.5 bg-white/5 rounded-lg border border-white/5 text-zinc-400 hover:text-white"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 bg-white/5 rounded-lg border border-white/5 text-zinc-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* UPLOAD SIMULATION MODAL */}
      {showUploadModal && (
        <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <h3 className="font-bold text-sm">Upload File - Cloudinary Linkage</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Browse File</label>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="File name display..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Folder</label>
                  <select
                    value={uploadForm.folder}
                    onChange={(e) => setUploadForm({ ...uploadForm, folder: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Onboarding Docs">Onboarding Docs</option>
                    <option value="Project Assets">Project Assets</option>
                    <option value="Finance receipts">Finance receipts</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-2">Access Level</label>
                  <select
                    value={uploadForm.accessLevel}
                    onChange={(e) => setUploadForm({ ...uploadForm, accessLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="INTERNAL">Internal (Team Only)</option>
                    <option value="PRIVATE">Private (Onboard Only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-2">Tag Label (Optional)</label>
                <input 
                  type="text" 
                  value={uploadForm.tag}
                  onChange={(e) => setUploadForm({ ...uploadForm, tag: e.target.value })}
                  placeholder="e.g. Agreement, Revision, Client"
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg disabled:opacity-50 transition"
              >
                {uploading ? "Uploading to Cloudinary..." : "Execute Simulation Upload"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
