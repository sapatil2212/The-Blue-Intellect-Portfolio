import { getProjectsAction } from "@/actions/projects";
import HomeClient from "@/components/home/HomeClient";

export default async function HomePage() {
  const projects = await getProjectsAction();

  return <HomeClient projects={projects} />;
}
