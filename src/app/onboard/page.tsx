"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserAction } from "@/actions/auth";
import { submitOnboardingAction } from "@/actions/client";

const SERVICES_LIST = [
  "Web Development & Design",
  "Graphic Design & Logo Branding",
  "UGC & Social Video Editing",
  "SEO & Performance Marketing",
  "AI Generated Art & Automation",
  "Full Content Strategy Consultancy",
];

const BUDGET_RANGES = [
  "Below $1,000",
  "$1,000 - $3,000",
  "$3,000 - $7,000",
  "$7,000 - $15,000",
  "$15,000+",
];

export default function OnboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ name: string | null; email: string } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    companyName: "",
    whatsapp: "",
    website: "",
    services: [] as string[],
    budget: "",
    deadline: "",
    referenceLinks: "",
    brandDetails: "",
    socialLinks: "",
    paymentOption: "Bank Transfer",
  });

  // Mock File Uploads state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; url: string; type: string; size: number }>>([]);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const user = await getCurrentUserAction();
      if (!user) {
        // Redirect to login if not authenticated
        router.push("/login?redirect=/onboard");
      } else {
        setCurrentUser(user);
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
        }));
      }
      setLoadingUser(false);
    }
    fetchUser();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleService = (service: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.services.includes(service);
      if (alreadySelected) {
        return { ...prev, services: prev.services.filter((s) => s !== service) };
      } else {
        return { ...prev, services: [...prev.services, service] };
      }
    });
  };

  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingFile(true);
    const file = e.target.files[0];

    // Simulate Cloudinary upload delay
    setTimeout(() => {
      const mockCloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/v123456789/${encodeURIComponent(file.name)}`;
      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          url: mockCloudinaryUrl,
          type: file.type || "application/octet-stream",
          size: file.size,
        },
      ]);
      setUploadingFile(false);
    }, 1500);
  };

  const removeUploadedFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const nextStep = () => {
    // Basic validation per step
    if (step === 1 && !formData.name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }
    if (step === 2 && !formData.companyName.trim()) {
      setErrorMsg("Please enter your business/company name");
      return;
    }
    if (step === 3 && formData.services.length === 0) {
      setErrorMsg("Please select at least one service interested");
      return;
    }
    if (step === 4 && !formData.budget) {
      setErrorMsg("Please select your budget range");
      return;
    }
    if (step === 5 && !formData.deadline) {
      setErrorMsg("Please specify a target project deadline");
      return;
    }
    
    setErrorMsg("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const response = await submitOnboardingAction({
      companyName: formData.companyName,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      website: formData.website,
      servicesInterested: formData.services.join(", "),
      estimatedBudget: formData.budget,
      deadline: formData.deadline,
      referenceLinks: formData.referenceLinks,
      brandDetails: formData.brandDetails,
      socialLinks: formData.socialLinks,
      uploadedDocuments: uploadedFiles,
    });

    if (response.success) {
      setSuccessMsg("Onboarding submitted successfully! Redirecting to client portal...");
      setTimeout(() => {
        router.push("/client");
      }, 2000);
    } else {
      setErrorMsg(response.error || "Failed to submit onboarding form");
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a0f] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm animate-pulse">Loading onboarding session...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((step / 10) * 100);

  return (
    <div className="min-h-screen bg-radial from-[#12131e] via-[#090a0f] to-[#050608] flex items-center justify-center p-6 text-white">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "2s" }}></div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Step {step} of 10
          </span>
          <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded">
            {progressPercentage}% Complete
          </span>
        </div>

        {errorMsg && (
          <div className="p-4 mb-6 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 mb-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Let's start with your personal details
              </h2>
              <p className="text-zinc-400 text-sm">How should we contact you?</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Business Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Tell us about your Business
              </h2>
              <p className="text-zinc-400 text-sm">Help us understand the brand scope.</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                    Website URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="e.g. https://acme.com"
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="e.g. +15550192834"
                    className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Services Interested */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                What creative services do you need?
              </h2>
              <p className="text-zinc-400 text-sm">Select all that apply to your current campaigns.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {SERVICES_LIST.map((service) => {
                  const isSelected = formData.services.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`p-4 rounded-xl border text-left text-sm transition duration-200 ${
                        isSelected
                          ? "bg-blue-500/10 border-blue-500 text-blue-400"
                          : "bg-zinc-900/40 border-white/10 text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Budget */}
          {step === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                What is your estimated budget?
              </h2>
              <p className="text-zinc-400 text-sm">Helps us scope requirements and deliver high quality solutions.</p>
              <div className="grid grid-cols-1 gap-3 mt-4">
                {BUDGET_RANGES.map((bRange) => {
                  const isSelected = formData.budget === bRange;
                  return (
                    <button
                      key={bRange}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, budget: bRange }))}
                      className={`p-4 rounded-xl border text-left text-sm transition duration-200 ${
                        isSelected
                          ? "bg-blue-500/10 border-blue-500 text-blue-400 font-semibold"
                          : "bg-zinc-900/40 border-white/10 text-zinc-300 hover:border-white/20"
                      }`}
                    >
                      {bRange}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Deadlines */}
          {step === 5 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                What is your target deadline?
              </h2>
              <p className="text-zinc-400 text-sm">When do you expect the launch of these creatives?</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 6: Reference Links */}
          {step === 6 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Share reference files & links
              </h2>
              <p className="text-zinc-400 text-sm">Competitor websites, design references, inspirations, etc.</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  URLs / Links (one per line)
                </label>
                <textarea
                  name="referenceLinks"
                  value={formData.referenceLinks}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="e.g. https://behance.net/reference-profile&#10;https://competitor.com"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Brand Details */}
          {step === 7 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Core Brand Guidelines
              </h2>
              <p className="text-zinc-400 text-sm">What values, brand colors, taglines represent your vision?</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Brand Summary
                </label>
                <textarea
                  name="brandDetails"
                  value={formData.brandDetails}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your brand colors, voice tone, core values..."
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* STEP 8: Social Links */}
          {step === 8 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Social Media Channels
              </h2>
              <p className="text-zinc-400 text-sm">Where is your brand active?</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Social Channels Info
                </label>
                <textarea
                  name="socialLinks"
                  value={formData.socialLinks}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Instagram: @acme&#10;TikTok: @acmebrand&#10;YouTube: Acme Corp"
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>
          )}

          {/* STEP 9: Document Uploads */}
          {step === 9 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Upload Asset Files
              </h2>
              <p className="text-zinc-400 text-sm">Upload logos, brand files, style sheets, PDFs or ZIPs (Stored in Cloudinary).</p>
              
              <div className="border-2 border-dashed border-white/15 hover:border-white/30 rounded-xl p-8 text-center bg-zinc-950/20 transition relative">
                <input
                  type="file"
                  onChange={simulateFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadingFile}
                />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📁</span>
                  <span className="text-sm text-zinc-300 font-medium">
                    {uploadingFile ? "Uploading to Cloudinary..." : "Click or drag files to upload"}
                  </span>
                  <span className="text-xs text-zinc-500">Supports PDF, PNG, JPG, ZIP, DOC (Max 25MB)</span>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Uploaded Files:</h4>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg text-xs">
                      <div className="flex items-center gap-2">
                        <span>📄</span>
                        <span className="font-medium text-zinc-200 truncate max-w-[250px]">{f.name}</span>
                        <span className="text-zinc-500">({Math.round(f.size / 1024)} KB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUploadedFile(i)}
                        className="text-red-400 hover:text-red-300 text-xs px-2 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 10: Payment Details */}
          {step === 10 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Preferred Payment Details
              </h2>
              <p className="text-zinc-400 text-sm">Select payment preference for invoicing schedules.</p>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wide">
                  Preferred billing model
                </label>
                <select
                  name="paymentOption"
                  value={formData.paymentOption}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                >
                  <option value="Bank Transfer">Direct Corporate Bank Transfer</option>
                  <option value="Stripe / Card">Credit Card (via Stripe Payment Link)</option>
                  <option value="Crypto">USDT / USDC stablecoins</option>
                  <option value="PayPal">PayPal Payments</option>
                </select>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/25 rounded-lg text-xs text-blue-400 leading-relaxed mt-4">
                <strong>Almost Finished!</strong> Clicking submit logs your details directly into our CRM. An assigned project representative will evaluate your files and reach out immediately with a formal contract proposal.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-white/15 text-zinc-300 hover:text-white rounded-lg transition text-sm bg-zinc-900/30"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {step < 10 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 rounded-lg text-white font-medium transition text-sm shadow-md"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 rounded-lg text-white font-bold transition text-sm shadow-lg disabled:opacity-50"
              >
                {submitting ? "Submitting Portfolio Profile..." : "Submit Onboarding Info"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
