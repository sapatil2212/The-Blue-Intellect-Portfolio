'use client';

import React from 'react';
import { ProjectType } from '@/store/usePortfolioStore';
import HeroSection from './HeroSection';
import TrustedBySection from './TrustedBySection';
import AboutSection from './AboutSection';
import FeaturesGrid from './FeaturesGrid';
import StatsSection from './StatsSection';
import ServicesStackSection from './ServicesStackSection';
import RecentProjectsSection from './RecentProjectsSection';
import ManageSection from './ManageSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

interface HomeClientProps {
  projects: ProjectType[];
  isAdmin?: boolean;
}

export default function HomeClient({ projects, isAdmin = false }: HomeClientProps) {
  return (
    <div className="w-full flex flex-col pt-16 overflow-hidden">
      <HeroSection />
      <TrustedBySection />
      <AboutSection />
      <div className="section-divider" />
      <FeaturesGrid />
      <div className="section-divider" />
      <StatsSection />
      <div className="section-divider" />
      <ServicesStackSection />
      <div className="section-divider" />
      <RecentProjectsSection projects={projects} isAdmin={isAdmin} />
      <div className="section-divider" />
      <ManageSection />
      <div className="section-divider" />
      <TestimonialsSection />
      <div className="section-divider" />
      <CTASection />
    </div>
  );
}
