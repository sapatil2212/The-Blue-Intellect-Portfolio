import { create } from "zustand";

interface ProjectMedia {
  id: string;
  url: string;
  type: string;
}

interface ProjectTag {
  id: string;
  name: string;
}

interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectType {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  category: ProjectCategory;
  thumbnail: string;
  media: ProjectMedia[];
  projectType: string;
  websiteLink: string | null;
  sourceCodeLink: string | null;
  pricing: string | null;
  featured: boolean;
  published: boolean;
  tags: ProjectTag[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface PortfolioState {
  selectedProjectId: string | null;
  selectedProject: ProjectType | null;
  setSelectedProject: (project: ProjectType | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  selectedProjectId: null,
  selectedProject: null,
  setSelectedProject: (project) =>
    set({
      selectedProject: project,
      selectedProjectId: project ? project.id : null,
    }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: "all",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  isMobileMenuOpen: false,
  setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
}));
