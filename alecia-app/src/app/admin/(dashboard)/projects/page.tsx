import { getProjects } from "@/lib/actions/projects";
import { ProjectKanban } from "./ProjectKanban";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";

export default async function ProjectsPage() {
  const result = await getProjects();
  const initialProjects = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Operations Kanban" />
      <ProjectKanban initialProjects={initialProjects} />
    </div>
  );
}