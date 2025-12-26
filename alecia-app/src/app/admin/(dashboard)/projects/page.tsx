import { ProjectKanban } from "./ProjectKanban";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Operations Kanban" />
      <ProjectKanban />
    </div>
  );
}
