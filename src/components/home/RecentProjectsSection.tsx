'use client';

import React from 'react';
import Link from 'next/link';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { ProjectType } from '@/store/usePortfolioStore';
import ProjectCard from '@/components/ui/ProjectCard';

interface RecentProjectsSectionProps {
  projects: ProjectType[];
  isAdmin: boolean;
}

export default function RecentProjectsSection({ projects, isAdmin }: RecentProjectsSectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-[11px] font-bold tracking-widest uppercase"
              style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: 'var(--accent)',
              }}
            >
              Our Creative Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-display">
              Featured <span className="text-accent italic">Case Studies</span>
            </h2>
            <p className="text-muted max-w-2xl text-[15px] leading-relaxed">
              Explore our latest web applications, creative designs, and performance campaigns.
            </p>
          </div>
          <Link href="/work" className="mt-6 sm:mt-0 glow-button px-6 py-3 rounded-md text-[13px] font-bold text-white shadow-lg active:scale-95">
            View All Portfolio ({projects.length})
          </Link>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 rounded-3xl border border-dashed border-border bg-card p-8 max-w-2xl mx-auto shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-accent to-accent-light flex items-center justify-center text-white shadow-md animate-pulse">
              <FolderOpen className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Showcase Under Construction</h3>
              <p className="text-sm text-muted max-w-md leading-relaxed">
                {isAdmin ? (
                  "The showcase database is currently empty. Click below to add the very first project and build your live portfolio!"
                ) : (
                  "We are currently curating and deploying our premium showcase studies. Check back soon or login as administrator to populate the portfolio."
                )}
              </p>
            </div>
            {isAdmin ? (
              <Link href="/admin/portfolio" className="glow-button px-8 py-3 font-semibold text-xs text-white">
                <span>Add First Project</span>
                <ArrowRight className="h-4 w-4 ml-1.5 inline-block" />
              </Link>
            ) : (
              <Link href="/login" className="px-8 py-3 text-xs font-semibold rounded-md border border-border text-white hover:bg-surface-2 transition-colors">
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
