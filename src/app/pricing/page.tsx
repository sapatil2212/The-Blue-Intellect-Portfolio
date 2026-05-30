"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Check, HelpCircle, ArrowRight } from "lucide-react";
import GradientCard from "@/components/ui/GradientCard";
import AnimatedButton from "@/components/ui/AnimatedButton";
import GlowButton from "@/components/ui/GlowButton";
import { MOCK_PRICING } from "@/lib/mockData";

const faqs = [
  {
    q: "How does the creative asset turnaround work?",
    a: "Standard assets like individual logo systems, social packs, or single UGC video clips are delivered within 5–7 business days. Complex Next.js full-stack websites generally take 2–3 weeks depending on feature specifications."
  },
  {
    q: "Can I pause or cancel a monthly subscription?",
    a: "Yes! The Studio Retainer billing functions on a month-to-month cycle. You can pause your service if you have no active design queue, or cancel at any point prior to your next monthly renewal."
  },
  {
    q: "Do you provide raw Figma and source files?",
    a: "Absolutely. All deliverables include complete design file transfers (Figma, After Effects sources) and code repository ownership (GitHub invites) upon project finalization."
  },
  {
    q: "What database and server systems do you support?",
    a: "For web builds, we utilize Next.js Server Actions with Prisma ORM connecting to MySQL or PostgreSQL databases. Hosting is optimized primarily for Vercel."
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"projects" | "retainers">("projects");

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/15 dark:border-blue-400/15">
          <Sparkles className="h-3.5 w-3.5 fill-blue-500/20" />
          <span>Flexible Plans</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Clear, Flat-Rate Pricing.
        </h1>
        <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          No hidden fees or complex estimates. Choose a pricing tier that aligns with your timeline, or subscribe to a flexible monthly retainer.
        </p>

        {/* Toggle Switch */}
        <div className="pt-8 flex justify-center">
          <div className="relative p-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/80 flex items-center">
            <button
              onClick={() => setBillingCycle("projects")}
              className={`relative z-10 px-5 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                billingCycle === "projects" ? "text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              {billingCycle === "projects" && (
                <motion.span
                  layoutId="pricing-billing-pill"
                  className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              One-Time Projects
            </button>
            <button
              onClick={() => setBillingCycle("retainers")}
              className={`relative z-10 px-5 py-2 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                billingCycle === "retainers" ? "text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              {billingCycle === "retainers" && (
                <motion.span
                  layoutId="pricing-billing-pill"
                  className="absolute inset-0 bg-linear-to-r from-sky-400 to-blue-600 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Monthly Retainers
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {MOCK_PRICING.map((plan, index) => {
          // Adjust display pricing mock logic
          const isPopular = plan.popular;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-full flex"
            >
              <GradientCard
                glowColor={isPopular ? "rgba(59, 130, 246, 0.18)" : "rgba(59, 130, 246, 0.08)"}
                className={`flex flex-col justify-between p-8 rounded-3xl w-full h-full relative ${
                  isPopular
                    ? "border-2 border-blue-500/80 bg-blue-50/5 dark:bg-blue-950/10 shadow-lg shadow-blue-500/5"
                    : "border border-neutral-200/50 dark:border-neutral-800/50"
                }`}
              >
                {/* Popular Ribbon Tag */}
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6">
                  {/* Plan Meta */}
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">{plan.name}</h3>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-normal min-h-[40px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Rate */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                      {plan.price}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
                      / {plan.period}
                    </span>
                  </div>

                  {/* Divider */}
                  <hr className="border-neutral-100 dark:border-neutral-800" />

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                        <div className="h-4.5 w-4.5 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to action */}
                <div className="pt-8">
                  {isPopular ? (
                    <Link href="/contact" className="w-full">
                      <GlowButton className="w-full justify-center py-3 font-semibold text-xs rounded-full">
                        <span>{plan.cta}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </GlowButton>
                    </Link>
                  ) : (
                    <Link href="/contact" className="w-full">
                      <AnimatedButton className="w-full bg-transparent hover:bg-sky-50/50 text-neutral-800 dark:text-neutral-200 hover:text-sky-700 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-800 hover:border-sky-300/60 dark:hover:border-sky-500/50 text-xs font-semibold py-3 rounded-full transition-all">
                        <span>{plan.cta}</span>
                      </AnimatedButton>
                    </Link>
                  )}
                </div>
              </GradientCard>
            </motion.div>
          );
        })}
      </div>

      {/* FAQs Section */}
      <section className="mt-28 border-t border-neutral-100 dark:border-neutral-800 pt-20 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="h-9 w-9 rounded-full bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center mx-auto text-neutral-400 dark:text-neutral-500 border border-neutral-100 dark:border-neutral-800">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Everything you need to know about our collaboration structures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-2.5">
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50">{faq.q}</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
