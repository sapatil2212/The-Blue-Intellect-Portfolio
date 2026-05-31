import { getProjectsAction } from "@/actions/projects";
import ShowcaseClient from "@/components/showcase/ShowcaseClient";

export const metadata = {
  title: "Creative Showcase | The Blue Intellect Portfolio Hub",
  description: "Browse our premium portfolio grid showcasing websites, AI artwork, logo systems, UGC videos, Instagram reels, and comprehensive digital designs.",
};

export default async function WorkPage() {
  const projects = await getProjectsAction();

  return <ShowcaseClient projects={projects} initialCategory="all" />;
}
