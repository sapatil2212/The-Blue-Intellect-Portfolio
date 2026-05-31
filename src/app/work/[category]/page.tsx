import { notFound } from "next/navigation";
import { getProjectsAction } from "@/actions/projects";
import ShowcaseClient from "@/components/showcase/ShowcaseClient";

const VALID_CATEGORIES = [
  "websites",
  "logos",
  "social-media",
  "ai-art",
  "ugc-videos",
  "reels",
  "branding",
  "case-studies",
  "creative-assets",
];

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  
  if (!VALID_CATEGORIES.includes(category)) {
    return {
      title: "Category Not Found | The Blue Intellect",
    };
  }

  const title = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
  return {
    title: `${title} Showcase | The Blue Intellect Portfolio`,
    description: `Discover The Blue Intellect's award-winning ${title} projects, featuring interactive modules and premium custom designs.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = resolvedParams.category;

  if (!VALID_CATEGORIES.includes(category)) {
    notFound();
  }

  const projects = await getProjectsAction();

  return <ShowcaseClient projects={projects} initialCategory={category} />;
}
