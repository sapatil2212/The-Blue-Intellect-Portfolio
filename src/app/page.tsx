import { getProjectsAction } from "@/actions/projects";
import { checkAuthAction } from "@/actions/auth";
import HomeClient from "@/components/home/HomeClient";

// Force dynamic rendering to ensure fresh db listings
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjectsAction();
  const isAdmin = await checkAuthAction();
  
  // Filter for featured projects, take top 3
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
  
  // If no featured projects are marked, take any top 3
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 3);

  return <HomeClient projects={displayProjects} isAdmin={isAdmin} />;
}
