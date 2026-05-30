"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingUp, Zap, Users, Loader2, Award } from "lucide-react";
import GradientCard from "@/components/ui/GradientCard";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { getProjectsAction } from "@/actions/projects";

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCaseStudies() {
      try {
        const projects = await getProjectsAction();
        // Filter projects by category 'Case Studies' or projectType 'CASE_STUDY'
        const caseStudyProjects = projects.filter(
          (p: any) => p.projectType === "CASE_STUDY" || p.category?.slug === "case-studies"
        );

        // Map them to the case study structure
        const mapped = caseStudyProjects.map((p: any) => {
          let challenge = "Goal of the creative showcase project.";
          let solution = p.description;
          let client = "Creative Showcase";
          let badge = p.category?.name || "Case Study";
          let stats: any[] = [];

          // Check if description is serialized JSON
          if (p.description?.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(p.description);
              challenge = parsed.challenge || challenge;
              solution = parsed.solution || solution;
              client = parsed.client || client;
              badge = parsed.badge || badge;
              stats = parsed.stats || [];
            } catch (e) {
              // Not JSON
            }
          }

          // Map stats icons
          const mappedStats = stats.map((s: any) => {
            const labelLower = s.label.toLowerCase();
            let icon = <TrendingUp className="h-4 w-4 text-emerald-500" />;
            if (labelLower.includes("speed") || labelLower.includes("load") || labelLower.includes("perf")) {
              icon = <Zap className="h-4 w-4 text-amber-500" />;
            } else if (labelLower.includes("user") || labelLower.includes("visitor") || labelLower.includes("audience") || labelLower.includes("reach") || labelLower.includes("views")) {
              icon = <Users className="h-4 w-4 text-blue-500" />;
            }
            return {
              label: s.label,
              value: s.value,
              icon
            };
          });

          // If no stats, provide a default outcome stat
          if (mappedStats.length === 0) {
            mappedStats.push({
              label: "Status",
              value: "Completed",
              icon: <Award className="h-4 w-4 text-blue-500" />
            });
          }

          return {
            slug: p.slug,
            client,
            badge,
            title: p.title,
            stats: mappedStats,
            challenge,
            solution,
            image: p.thumbnail,
          };
        });

        setCaseStudies(mapped);
      } catch (err) {
        console.error("Failed to load case studies:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCaseStudies();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center pt-32 pb-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-xs text-zinc-400 font-semibold tracking-wider mt-4 animate-pulse uppercase">
          Compiling Client Case Studies...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15">
          <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
          <span>Proven Outcomes</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
          Client Case Studies.
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Deep-dives into how we merge user experience design with modern coding architectures to solve complex business goals.
        </p>
      </div>

      {/* Case studies list */}
      <div className="space-y-12">
        {caseStudies.length > 0 ? (
          caseStudies.map((cs, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={cs.slug || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <GradientCard
                  glowColor="rgba(59, 130, 246, 0.08)"
                  className="p-8 md:p-12 overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Visual column */}
                    <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-200/40 shadow-md bg-neutral-100">
                        <img
                          src={cs.image}
                          alt={cs.client}
                          className="object-cover w-full h-full hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Context column */}
                    <div className={`lg:col-span-6 space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">
                          {cs.badge}
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
                          {cs.title}
                        </h2>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 border-y border-neutral-100 dark:border-neutral-800 py-4">
                        {cs.stats.map((stat: any, sIdx: number) => (
                          <div key={sIdx} className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center border border-neutral-100 dark:border-neutral-800 shrink-0">
                              {stat.icon}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wide truncate">
                                {stat.label}
                              </p>
                              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                                {stat.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Challenge & Solution */}
                      <div className="space-y-4 text-xs md:text-sm">
                        <div>
                          <strong className="text-neutral-900 dark:text-neutral-100 block font-semibold">The Challenge:</strong>
                          <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">{cs.challenge}</p>
                        </div>
                        <div>
                          <strong className="text-neutral-900 dark:text-neutral-100 block font-semibold">The Strategy:</strong>
                          <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">{cs.solution}</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link href={`/work`}>
                          <AnimatedButton className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white text-xs font-semibold px-5 py-2.5 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                            <span>View Full Assets Gallery</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </AnimatedButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </GradientCard>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-neutral-250 dark:border-neutral-800 rounded-3xl bg-neutral-50/20 dark:bg-white/1">
            <Sparkles className="h-10 w-10 text-neutral-400 mx-auto mb-3 animate-pulse" />
            <h3 className="text-base font-bold text-foreground">No Case Studies Cataloged Yet</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto px-4">
              Add case studies via the Admin Dashboard under Portfolio Showcase page to highlight client success stories here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
