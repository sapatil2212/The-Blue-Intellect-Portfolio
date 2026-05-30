import { getProjectsAction } from "@/actions/projects";
import { checkAuthAction } from "@/actions/auth";
import HomeClient from "@/components/home/HomeClient";

// Force dynamic rendering to ensure fresh db listings
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjectsAction();
  const isAdmin = await checkAuthAction();

  return <HomeClient projects={projects} isAdmin={isAdmin} />;
}
