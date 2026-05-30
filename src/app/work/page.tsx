import { getProjectsAction } from "@/actions/projects";
import { checkAuthAction } from "@/actions/auth";
import ShowcaseClient from "@/components/showcase/ShowcaseClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Creative Showcase | The Blue Intellect Portfolio Hub",
  description: "Browse our premium portfolio grid showcasing websites, AI artwork, logo systems, UGC videos, Instagram reels, and comprehensive digital designs.",
};

export default async function WorkPage() {
  const projects = await getProjectsAction();
  const isAdmin = await checkAuthAction();

  return <ShowcaseClient projects={projects} initialCategory="all" isAdmin={isAdmin} />;
}
