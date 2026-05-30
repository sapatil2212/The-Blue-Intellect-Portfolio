"use client";

import React, { useEffect, useState } from "react";
import { 
  getPendingOnboardingsAction, 
  approveOnboardingAction 
} from "@/actions/client";
import { getDocumentsAction } from "@/actions/document";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  Layers, 
  Calendar, 
  DollarSign, 
  Globe, 
  RefreshCw, 
  Briefcase, 
  Clock, 
  User, 
  Mail, 
  Folder, 
  Search, 
  ChevronRight, 
  Check, 
  X, 
  AlertTriangle 
} from "lucide-react";

export default function OnboardingIntakePage() {
  const [pendingClients, setPendingClients] = useState<any[]>([]);
  const [allDocuments, setAllDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setActionError(null);
    try {
      const clientRes = await getPendingOnboardingsAction();
      const docRes = await getDocumentsAction();
      
      if (clientRes.success && clientRes.clients) {
        setPendingClients(clientRes.clients);
      } else {
        setActionError(clientRes.error || "Failed to load pending client onboardings.");
      }
      
      if (docRes.success && docRes.documents) {
        setAllDocuments(docRes.documents);
      }
    } catch (err: any) {
      setActionError(err.message || "An unexpected error occurred during synchronisation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDecision = async (clientId: string, approve: boolean) => {
    setProcessingId(clientId);
    setActionSuccess(null);
    setActionError(null);
    try {
      const res = await approveOnboardingAction(clientId, approve);
      if (res.success) {
        setActionSuccess(
          approve 
            ? "Client approved! Logins active & operational project workspace spawned successfully." 
            : "Client onboarding rejected successfully."
        );
        // Refresh the list
        await fetchData();
        if (selectedClient && selectedClient.id === clientId) {
          setSelectedClient(null);
        }
      } else {
        setActionError(res.error || "Failed to process decision.");
      }
    } catch (err: any) {
      setActionError(err.message || "Network execution error.");
    } finally {
      setProcessingId(null);
      // Auto clear feedback notices
      setTimeout(() => {
        setActionSuccess(null);
      }, 5000);
    }
  };

  // Filter based on search query
  const filteredClients = pendingClients.filter((c) => {
    const term = searchQuery.toLowerCase();
    return (
      c.companyName?.toLowerCase().includes(term) ||
      c.user?.name?.toLowerCase().includes(term) ||
      c.user?.email?.toLowerCase().includes(term) ||
      c.servicesInterested?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 text-white animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest font-mono">
            OPERATIONAL VERIFICATION
          </span>
          <h1 className="text-2xl font-black text-white font-display tracking-tight mt-1">
            Client Onboarding Intake
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Review submitted brand profiles, service scopes, estimated budgets, and verify reference docs. Approvals activate user credentials and trigger the automated project workspace generator.
          </p>
        </div>

        <button 
          onClick={fetchData} 
          disabled={loading}
          className="self-start md:self-auto h-10 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 hover:text-white transition flex items-center gap-2 text-xs font-bold active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
          Sync Intake Queues
        </button>
      </div>

      {/* Notification banners */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-xs font-semibold flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-400 text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Layout Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Queue List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search filter bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pending intakes..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/5 bg-[#0b0c14]/40 backdrop-blur-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {loading ? (
            <div className="py-20 flex flex-col justify-center items-center border border-white/5 rounded-2xl bg-[#0b0c14]/20 backdrop-blur-md">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-xxs font-bold text-zinc-500 uppercase tracking-widest mt-4">Syncing Intakes...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-20 text-center border border-white/5 rounded-2xl bg-[#0b0c14]/20 backdrop-blur-md">
              <Briefcase className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-xs font-bold text-zinc-350">Intake queues empty</p>
              <p className="text-[10px] text-zinc-500 mt-1">No client registrations are currently awaiting validation.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {filteredClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                const clientDocsCount = allDocuments.filter(d => d.ownerId === client.userId).length;
                return (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center group ${
                      isSelected 
                        ? "bg-blue-600/10 border-blue-500/40 text-white" 
                        : "bg-[#0b0c14]/30 border-white/5 hover:border-white/10 hover:bg-[#0b0c14]/50"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs truncate">
                          {client.companyName || "Unknown Agency Client"}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                          Pending
                        </span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-[10px] text-zinc-400">
                        <span className="truncate flex items-center gap-1.5"><User className="h-3 w-3" /> {client.user?.name || "No User Name"}</span>
                        <span className="truncate flex items-center gap-1.5"><Mail className="h-3 w-3 text-zinc-500" /> {client.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-3 pt-1 text-[9px] text-zinc-500">
                        <span className="flex items-center gap-1"><Folder className="h-3 w-3 text-blue-500/70" /> {clientDocsCount} Assets</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-emerald-500/70" /> {new Date(client.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <ChevronRight className={`h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition shrink-0 ${
                      isSelected ? "text-blue-400 translate-x-1" : ""
                    }`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Hand: Detailed Review Details */}
        <div className="lg:col-span-7">
          {selectedClient ? (
            <div className="border border-white/5 rounded-3xl bg-[#0b0c14]/40 backdrop-blur-xl overflow-hidden p-6 space-y-6">
              
              {/* Header inside Panel */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-base font-extrabold text-white">{selectedClient.companyName}</h2>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">INTAKE-ID: {selectedClient.id}</p>
                </div>
                
                {/* Status indicator */}
                <div className="text-right">
                  <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-xl text-zinc-300 border border-white/10 font-bold uppercase tracking-wider">
                    PENDING REVIEW
                  </span>
                </div>
              </div>

              {/* Grid Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xxs">
                <div className="space-y-1.5 bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-zinc-500 font-bold uppercase block tracking-wider">Services Interested</span>
                  <div className="flex items-center gap-1.5 text-zinc-200">
                    <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                    <span>{selectedClient.servicesInterested || "Creative Agency Services"}</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-zinc-500 font-bold uppercase block tracking-wider">Estimated Budget</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>{selectedClient.estimatedBudget ? `$${selectedClient.estimatedBudget}` : "Unspecified"}</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-zinc-500 font-bold uppercase block tracking-wider">Projected Deadline</span>
                  <div className="flex items-center gap-1.5 text-zinc-200">
                    <Calendar className="h-3.5 w-3.5 text-violet-400" />
                    <span>{selectedClient.deadline || "Flexible"}</span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-white/2 border border-white/5 p-3 rounded-xl">
                  <span className="text-zinc-500 font-bold uppercase block tracking-wider">Website Address</span>
                  <div className="flex items-center gap-1.5 text-zinc-200">
                    <Globe className="h-3.5 w-3.5 text-indigo-400" />
                    {selectedClient.website ? (
                      <a href={selectedClient.website.startsWith("http") ? selectedClient.website : `https://${selectedClient.website}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                        {selectedClient.website} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-zinc-500">None Provided</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Narrative Blocks */}
              <div className="space-y-4">
                {selectedClient.brandDetails && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Brand & Creative Details</span>
                    <div className="p-3 bg-[#07080d]/80 border border-white/5 rounded-xl text-xxs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selectedClient.brandDetails}
                    </div>
                  </div>
                )}

                {selectedClient.referenceLinks && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Inspirational Reference Links</span>
                    <div className="p-3 bg-[#07080d]/80 border border-white/5 rounded-xl text-xxs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selectedClient.referenceLinks}
                    </div>
                  </div>
                )}

                {selectedClient.socialLinks && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Social Media Handles</span>
                    <div className="p-3 bg-[#07080d]/80 border border-white/5 rounded-xl text-xxs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {selectedClient.socialLinks}
                    </div>
                  </div>
                )}
              </div>

              {/* Uploaded Attachments Folder Section */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Uploaded Design Assets & Reference Documents</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {allDocuments.filter((doc) => doc.ownerId === selectedClient.userId).length === 0 ? (
                    <p className="text-zinc-500 text-[10px] italic">No document uploads logged for this submission.</p>
                  ) : (
                    allDocuments
                      .filter((doc) => doc.ownerId === selectedClient.userId)
                      .map((doc) => (
                        <div key={doc.id} className="p-2.5 rounded-lg border border-white/5 bg-[#07080d]/40 flex items-center justify-between gap-3 text-xxs">
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                            <div className="truncate">
                              <p className="text-zinc-200 truncate font-semibold">{doc.name}</p>
                              <p className="text-[8px] text-zinc-500 font-mono">{(doc.sizeBytes / 1024).toFixed(1)} KB | {doc.fileType.toUpperCase()}</p>
                            </div>
                          </div>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="h-7 w-7 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition"
                            title="View Document"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Contact info & actions */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-[10px] text-zinc-400 space-y-0.5">
                  <p>Client Liaison Contact: <span className="text-white font-semibold">{selectedClient.phone || selectedClient.whatsapp || "None"}</span></p>
                  <p>Account Registration Email: <span className="text-white font-semibold">{selectedClient.user?.email}</span></p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDecision(selectedClient.id, false)}
                    disabled={processingId === selectedClient.id}
                    className="h-10 px-4 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 hover:text-rose-350 transition flex items-center gap-1.5 text-xxs font-bold cursor-pointer disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject Intake
                  </button>
                  <button
                    onClick={() => handleDecision(selectedClient.id, true)}
                    disabled={processingId === selectedClient.id}
                    className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 text-xxs font-bold active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    {processingId === selectedClient.id ? "Activating..." : "Approve & Activate"}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col justify-center items-center text-center border border-dashed border-white/10 rounded-3xl bg-[#0b0c14]/10">
              <Layers className="h-12 w-12 text-zinc-700 mb-3 animate-pulse" />
              <p className="text-xs font-bold text-zinc-400">Select an intake form from the queue</p>
              <p className="text-[10px] text-zinc-550 mt-1 max-w-xxs leading-relaxed">Choose any pending application to review services interested, custom requirements, and perform operational credential upgrades.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
