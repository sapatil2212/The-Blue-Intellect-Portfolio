"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, MessageSquare, MapPin, ArrowRight, CheckCircle2, Loader2, Send, ChevronDown } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import GradientCard from "@/components/ui/GradientCard";
import { submitPublicContactFormAction } from "@/actions/crm";
import { servicesData } from "@/lib/servicesData";

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  companyName: z.string().optional(),
  phone: z.string().min(8, "Please enter a valid mobile number"),
  email: z.string().email("Please enter a valid email address"),
  servicesInterested: z.string().min(1, "Please select a service"),
  timeline: z.string().min(1, "Please select a project timeline"),
  contactMethod: z.string().min(1, "Please select a preferred contact method"),
  projectBrief: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // "service" | "timeline" | "budget" | "contact" | null

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      servicesInterested: "",
      timeline: "",
      contactMethod: "",
      projectBrief: "",
    }
  });

  // Watch fields to update triggers on custom dropdown selections
  const servicesInterestedValue = watch("servicesInterested");
  const timelineValue = watch("timeline");
  const contactMethodValue = watch("contactMethod");

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await submitPublicContactFormAction({
        clientName: data.name,
        companyName: data.companyName,
        phone: data.phone,
        email: data.email,
        servicesInterested: data.servicesInterested,
        timeline: data.timeline,
        contactMethod: data.contactMethod,
        projectBrief: data.projectBrief,
      });
      
      if (res.success) {
        setIsSuccess(true);
        reset();
      } else {
        console.error("Submission failed:", res.error);
        alert(res.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit contact form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Copy & Meta Info */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15 w-fit">
              <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
              <span>Let&apos;s Collaborate</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-none">
              Tell us about <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                your vision.
              </span>
            </h1>
            
            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-md">
              Whether you need an immersive WebGL website, custom generative AI marketing assets, or a full rebrand, we assemble tailored creative sprints to hit your targets.
            </p>
          </div>

          {/* Quick contact methods */}
          <div className="space-y-4 pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">General Inquiries</p>
                <a href="mailto:info@theblueintellect.com" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  info@theblueintellect.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
                <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Call or WhatsApp</p>
                <a href="tel:+919096896679" className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  +91 90968 96679
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center border border-violet-100 dark:border-violet-900/30 shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">Our Address</p>
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed max-w-[280px]">
                  B-92, Kohinoor Colony, Tulshibagwale Colony, Parvati Paytha, Pune, Maharashtra 411009
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-8 hidden lg:block">
            © {new Date().getFullYear()} The Blue Intellect. All rights reserved. Our team typically replies within 4-6 business hours.
          </p>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <GradientCard glowColor="rgba(59, 130, 246, 0.05)" className="p-6 md:p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Row 1: Name and Company Name grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="name" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...register("name")}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                          errors.name
                            ? "border-rose-300 focus:ring-rose-100/50"
                            : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[10px] text-rose-500 font-semibold">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="companyName" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                        Company Name <span className="text-neutral-400 dark:text-neutral-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        placeholder="Acme Corp"
                        {...register("companyName")}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700/80 bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Mobile No and Email grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                        Mobile Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="e.g. +91 90968 96679"
                        {...register("phone")}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                          errors.phone
                            ? "border-rose-300 focus:ring-rose-100/50"
                            : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[10px] text-rose-500 font-semibold">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all ${
                          errors.email
                            ? "border-rose-300 focus:ring-rose-100/50"
                            : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-[10px] text-rose-500 font-semibold">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Custom Services dropdown & Custom Timeline dropdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Custom Dropdown: Services Interested */}
                    <div className="relative space-y-1">
                      <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                        Service Interested
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === "service" ? null : "service")}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-left flex items-center justify-between text-neutral-850 dark:text-neutral-150 transition-all ${
                          errors.servicesInterested
                            ? "border-rose-300 focus:ring-2 focus:ring-rose-100/50"
                            : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                        }`}
                      >
                        <span className={servicesInterestedValue ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-400 dark:text-neutral-500"}>
                          {servicesInterestedValue || "Select a service..."}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-transform duration-300 ${activeDropdown === "service" ? "rotate-180 text-blue-500" : ""}`} />
                      </button>
                      <input type="hidden" {...register("servicesInterested")} />
                      
                      <AnimatePresence>
                        {activeDropdown === "service" && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 4, scale: 0.98 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              data-lenis-prevent
                              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                            >
                              {servicesData.map((service) => (
                                <button
                                  key={service.slug}
                                  type="button"
                                  onClick={() => {
                                    setValue("servicesInterested", service.title, { shouldValidate: true });
                                    setActiveDropdown(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                                    servicesInterestedValue === service.title
                                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/40 dark:text-blue-400"
                                      : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900/55"
                                  }`}
                                >
                                  <span>{service.title}</span>
                                  {servicesInterestedValue === service.title && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                      {errors.servicesInterested && (
                        <p className="text-[10px] text-rose-500 font-semibold">{errors.servicesInterested.message}</p>
                      )}
                    </div>

                    {/* Custom Dropdown: Timeline */}
                    <div className="relative space-y-1">
                      <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                        Project Timeline
                      </label>
                      <button
                        type="button"
                        onClick={() => setActiveDropdown(activeDropdown === "timeline" ? null : "timeline")}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-left flex items-center justify-between text-neutral-850 dark:text-neutral-150 transition-all ${
                          errors.timeline
                            ? "border-rose-300 focus:ring-2 focus:ring-rose-100/50"
                            : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                        }`}
                      >
                        <span className={timelineValue ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-400 dark:text-neutral-500"}>
                          {timelineValue || "Select timeline..."}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-transform duration-300 ${activeDropdown === "timeline" ? "rotate-180 text-blue-500" : ""}`} />
                      </button>
                      <input type="hidden" {...register("timeline")} />
                      
                      <AnimatePresence>
                        {activeDropdown === "timeline" && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 4, scale: 0.98 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              data-lenis-prevent
                              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50 overflow-y-auto"
                            >
                              {[
                                "Immediate (< 1 month)",
                                "Standard (1-3 months)",
                                "Planning Phase / Flexible"
                              ].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setValue("timeline", option, { shouldValidate: true });
                                    setActiveDropdown(null);
                                  }}
                                  className={`w-full px-4 py-2.5 text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                                    timelineValue === option
                                      ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/40 dark:text-blue-400"
                                      : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900/55"
                                  }`}
                                >
                                  <span>{option}</span>
                                  {timelineValue === option && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                      {errors.timeline && (
                        <p className="text-[10px] text-rose-500 font-semibold">{errors.timeline.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Custom ContactMethod dropdown */}
                  <div className="relative space-y-1">
                    <label className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                      Preferred Contact Method
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(activeDropdown === "contact" ? null : "contact")}
                      className={`w-full px-4 py-2.5 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-left flex items-center justify-between text-neutral-850 dark:text-neutral-150 transition-all ${
                        errors.contactMethod
                          ? "border-rose-300 focus:ring-2 focus:ring-rose-100/50"
                          : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                      }`}
                    >
                      <span className={contactMethodValue ? "text-neutral-900 dark:text-neutral-100 font-medium" : "text-neutral-400 dark:text-neutral-500"}>
                        {contactMethodValue || "Select communication method..."}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-transform duration-300 ${activeDropdown === "contact" ? "rotate-180 text-blue-500" : ""}`} />
                    </button>
                    <input type="hidden" {...register("contactMethod")} />
                    
                    <AnimatePresence>
                      {activeDropdown === "contact" && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            data-lenis-prevent
                            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50 overflow-y-auto"
                          >
                            {[
                              "WhatsApp",
                              "Email",
                              "Phone Call"
                            ].map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setValue("contactMethod", option, { shouldValidate: true });
                                  setActiveDropdown(null);
                                }}
                                className={`w-full px-4 py-2.5 text-xs text-left transition-colors flex items-center justify-between cursor-pointer ${
                                  contactMethodValue === option
                                    ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/40 dark:text-blue-400"
                                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900/55"
                                }`}
                              >
                                <span>{option}</span>
                                {contactMethodValue === option && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                    {errors.contactMethod && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.contactMethod.message}</p>
                    )}
                  </div>

                  {/* Row 5: Project Brief Textarea */}
                  <div className="space-y-1">
                    <label htmlFor="projectBrief" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                      Project Brief & Requirements <span className="text-neutral-400 dark:text-neutral-500 font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="projectBrief"
                      rows={4}
                      placeholder="Describe your digital objectives, expected key features, reference links, and deadlines..."
                      {...register("projectBrief")}
                      className={`w-full px-4 py-3 rounded-xl border bg-neutral-100/60 dark:bg-neutral-950/75 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:bg-white dark:focus:bg-neutral-900 transition-all resize-none ${
                        errors.projectBrief
                          ? "border-rose-300 focus:ring-rose-100/50"
                          : "border-neutral-300 dark:border-neutral-700/80 focus:border-blue-500 focus:ring-blue-100/50 dark:focus:ring-blue-900/30"
                      }`}
                    />
                    {errors.projectBrief && (
                      <p className="text-[10px] text-rose-500 font-semibold">{errors.projectBrief.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group h-12 bg-linear-to-r from-sky-400 via-sky-500 to-blue-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden disabled:opacity-75 disabled:pointer-events-none active:scale-95 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Submitting Specifications...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Project Blueprint</span>
                          <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="py-16 px-4 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center shadow-inner relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </motion.div>
                    
                    {/* Ring animation */}
                    <span className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-25 scale-75" />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Project Blueprint Dispatched!</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Thank you for reaching out. We have successfully cataloged your project specifications and dispatched an automated receipt blueprint to your inbox. A design director will coordinate consultation schedules shortly.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsSuccess(false)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors pt-4 group cursor-pointer"
                  >
                    <span>Submit another blueprint</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GradientCard>
        </div>
        
      </div>
    </div>
  );
}
