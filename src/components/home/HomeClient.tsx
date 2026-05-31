'use client';

import React, { useState, useEffect } from 'react';
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
import { checkAuthCookieAction } from '@/actions/auth';

interface HomeClientProps {
  projects: ProjectType[];
  isAdmin?: boolean;
}

export default function HomeClient({ projects, isAdmin: initialIsAdmin = false }: HomeClientProps) {
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);

  useEffect(() => {
    checkAuthCookieAction().then(setIsAdmin);
  }, []);
  return (
    <div className="w-full flex flex-col overflow-hidden">
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
